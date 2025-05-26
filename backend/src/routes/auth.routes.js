import express from "express"
import { check, login, logout, register } from "../controllers/auth.controllers.js"
import { authMiddleware } from "../middleware/auth.middlewares.js"

const userRouter = express.Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.post("/logout", authMiddleware ,logout)
userRouter.get("/check", authMiddleware, check)

export default userRouter