import express from "express"
import { createPlaylist, getAllListDetails, getPlayListDetails } from "../controllers/playlist.controllers.js";
import { authMiddleware } from "../middleware/auth.middlewares.js";

const playlistRoutes = express.Router()

playlistRoutes.post("/create-playlist",authMiddleware, createPlaylist)
playlistRoutes.get("/get-all-playlists", authMiddleware, getAllListDetails)
playlistRoutes.get("/get-playlist/:playlistId", authMiddleware, getPlayListDetails)


export default playlistRoutes;