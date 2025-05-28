import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

//routes
import userRoutes from "./routes/auth.routes.js"
import problemRoutes  from "./routes/problems.routes.js"
import executionRoutes from "./routes/executeCode.routes.js"
import submissionRoutes from "./routes/submission.routes.js"
import playlistRoutes from "./routes/playlist.routes.js"

const app = express()
dotenv.config()
app.use(cookieParser())
app.use(express.json())

app.use(
    cors({
        origin:process.env.BASE_URL,
        credentials:true
    })
)

app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/execute-code",executionRoutes)
app.use("/api/v1/submission",submissionRoutes)
app.use("/api/v1/playlist",playlistRoutes)


app.listen(process.env.PORT,()=>{
console.log("Server is running on port 8080!")
})

app.get("/", (req, res) => {
  res.send("lillyCode Backend is Running!");
});