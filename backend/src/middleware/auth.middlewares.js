import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      throw new ApiError(401, "Token not found"); 
    }

    let decoded; 
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        name: true,
        email: true,
        image: true,
      },

      
    });

    // console.log("Type of decoded.id:", typeof decoded.id);
// console.log(decoded,"decoded")

    if (!user) {
      throw new ApiError(400, "user not found");
    }

    req.user = user; 
    next(); 

  } catch (error) {
    console.error("Error while authentication");
    return next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id; 

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });


 

    if (!user || user.role !== "ADMIN") {
      throw new ApiError(403, "Access denied - admin only");
    }

    next();
  } catch (error) {
    console.error("error while checking admin ");
    throw new ApiError(500, "error while checking admin");
  }
};
