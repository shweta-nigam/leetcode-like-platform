import { db } from "../libs/db.js";
import {ApiError} from "../utils/api-error.js";
import {ApiResponse} from "../utils/api-response.js";

export const createPlaylist = async(req,res)=>{
    try {
        const { name , description } = req.body

        const userId = req.user.id

        const playlist = await db.playlist.create({
            data:{
                name,
                description,
                userId
            }
        })
     return   res.status(200).json(new ApiResponse(200,playlist,"Playlist created successfully"))
    } catch (error) {
        console.error("Error while creating playlist",error);
        throw new ApiError(500,"Error while creating playlist")
        
    }
}

export const getAllListDetails = async(req,res)=>{
    try {
        const playlists = await db.playlist.findMany({
            where:{
                userId:req.user.id,
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

      return  res.status(200,playlists,"Fetched all lists successfully ")
    }
     catch (error) {
        console.error("Error fetching list details",error);
        throw new ApiError(500,"Error fetching list details")
    }
}

export const getPlayListDetails = async(req,res)=>{
    const {playlistId} = req.params;
    try {

         if (!playlistId) {
      throw new ApiError(400, "Playlist ID is required");
    }
        const playlist = await db.playlist.findUnique({
            where:{
                id: playlistId,
                userId: req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

        if(!playlist){
            throw ApiError(400, "Playlist not found")
        }

   return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));

    } catch (error) {
         console.error("Error fetching playlist",error);
        throw new ApiError(500,"Error fetching playlist")
    }
}