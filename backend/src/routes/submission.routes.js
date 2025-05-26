import express from "express"
import { getAllSubmission, getAllTheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controllers.js"
import {authMiddleware} from "../middleware/auth.middlewares.js"
const submissionRoutes = express.Router()

submissionRoutes.get("/get-all-submissions" ,authMiddleware, getAllSubmission)
submissionRoutes.get("/get-submission/:problemId" ,authMiddleware, getSubmissionsForProblem)
submissionRoutes.get("/get-submissions-count/:problemId" , authMiddleware, getAllTheSubmissionsForProblem)

export default submissionRoutes