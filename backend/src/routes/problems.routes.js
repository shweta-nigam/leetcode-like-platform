import express from "express"
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problems.controllers.js"
import { authMiddleware, checkAdmin } from "../middleware/auth.middlewares.js"

const problemRoutes = express.Router()

problemRoutes.post("/create-problem",authMiddleware, checkAdmin, createProblem)
problemRoutes.post("/update-problem/:id",authMiddleware,checkAdmin, updateProblem)
problemRoutes.get("/get-problem/:id",authMiddleware, getProblemById)
problemRoutes.get("/get-all-problems",authMiddleware,checkAdmin, getAllProblems)
problemRoutes.delete("/delete-problem/:id",authMiddleware, deleteProblem)
problemRoutes.get("/get-solved-problems", getAllProblemsSolvedByUser)

export default problemRoutes