import { UserRole } from "../generated/prisma/index.js"
import {db} from "../libs/db.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register = async(req,res)=>{

  const{name,email,password} = req.body
  if(!name || !email || !password){
    throw new ApiError(400, "All fields are mandatory")
  }

  try {
    const ExistingUser = await db.user.findUnique({
        where:{email}
    })
    if(ExistingUser){
       throw new ApiError(400, "User already exists.")
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await db.user.create({
         data:{
            email,
            password:hashedPassword,
            name,
            role:UserRole.USER
         }
    })

 
  
    const jwtToken = await jwt.sign({
      id:newUser.id
    },
       process.env.JWT_SECRET
    , { expiresIn : "7d"})     


   res.cookie("token", jwtToken,{
    httpOnly:true,
    sameSite:"strict",
    maxAge: 1000 * 60 * 60 * 24 * 7 ,
    secure: process.env.NODE_ENV !== "development" 
   })

   res.status(201)
   .json(new ApiResponse(200,newUser, "User successfully registered "))

  } catch (error) {
    console.error("Error while registering user-----",error)
   throw new ApiError(500,"Error registering user")
  }
}

export const login = async(req,res)=>{
const {email,password} = req.body
 if(!email || !password){
    throw new ApiError(400, "All fields are mandatory")
  }

  try {
    const user = await db.user.findUnique({
      where:{email}
    })
    if(!user){
       throw new ApiError(400, "Invalid credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
    throw new ApiError(400, "Invalid credentials")}

    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"})
    
    res.cookie("token",token, {
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development",
      maxAge:1000*60*60*24*7
    })

    //extracting password from response
    const{password: _, ...safeUser} = user

    res.status(200).json( new ApiResponse(200, safeUser, "user successfully logged in"))

  } catch (error) {
    console.error("User login failed");
    throw new ApiError(500, "User login failed")
    
  }
}

export const logout = async(req,res)=>{

  try {
    res.clearCookie("token",{
      httpOnly:true,
      sameSite:"strict",
      secure:process.env.NODE_ENV !== "development"
    })
  
    res.status(200).json( new ApiResponse(200, null, "user successfully logged out"))
  } catch (error) {
    console.error("Error while logging out",error);
    throw new ApiError(500, "User logout failed")
  }
}

export const check = async(req,res)=>{
try {
 res.status(200)
 .json( new ApiResponse (200, req.user, "User authenticated successfully"))
} catch (error) {
  console.error("User authentication failed", error);
  throw new ApiError(500, "user authentication failed")
}
}

