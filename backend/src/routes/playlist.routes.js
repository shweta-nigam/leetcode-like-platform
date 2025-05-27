import express from "express"
import { createPlaylist, getAllListDetails, getPlayListDetails } from "../controllers/playlist.controllers.js";
import { authMiddleware } from "../middleware/auth.middlewares.js";

const playlistRoutes = express.Router()

playlistRoutes.get("/" , authMiddleware , getAllListDetails);

// playlistRoutes.get("/:playlistId" , authMiddleware , getPlayListDetails);

playlistRoutes.post("/create-playlist" , authMiddleware , createPlaylist);

// playlistRoutes.post("/:playlistId/add-problem" , authMiddleware , addProblemToPlaylist);

// playlistRoutes.delete("/:playlistId" , authMiddleware , deletePlaylist);


// playlistRoutes.delete("/:playlistId/remove-problem" , authMiddleware , removeProblemFromPlaylist)


export default playlistRoutes;