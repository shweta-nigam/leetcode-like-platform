import {db} from "../libs/db.js"
import {ApiError} from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"

export const getAllSubmission = async(req,res) => {
    try {
        const userId = req.user.id

        const submissions = db.submission.findMany({
            where:{
                userId
            }
        })

        if(!submissions){
            throw new ApiError(400, "No submission found")
        }

     return  res.status(200).json(new ApiResponse(200,submissions, "Submissions fetched successfully"))
    } catch (error) {
        console.error(error)
        throw new ApiError(500,"Error while fetching submissions")
    }
}

export const getSubmissionsForProblem = async(req,res)=>{
    try {
        const userId = req.user.id 
        const problemId = req.params.problemId       // from where ? 
         
        const submissions = db.submission.findMany({
            where:{
                userId,
                problemId
            }
        })

         if(!submissions){
            throw new ApiError(400, "No submission found")
        }

       return  res.status(200).json(new ApiResponse(200,submissions, "Submissions for problem fetched successfully"))
    } catch (error) {
        console.error(error)
        throw new ApiError(500,"Error while fetching submissions")
    }
}

export const getAllTheSubmissionsForProblem = async(req,res) => {
    try {
        const problemId = req.params.problemId 

        const submission =    db.submission.count({       // why submission and not submissions
              where:{
                problemId
              }
        })  
         
         if(!submission){
            throw new ApiError(400, "No submission found")
        } 
        res.status(200).json(new ApiResponse(200,submission, " All Submissions for problem fetched successfully"))
    } catch (error) {
        console.error(error)
        throw new ApiError(500,"Error while fetching submission")
    }
}