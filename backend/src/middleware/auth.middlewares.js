import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-error.js";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token; // why destructure and if not then , why not ? // because token is a string and not an object
    if (!token) {
      throw new ApiError(401, "Token not found"); //401 => "not allowed in"
    }

    let decoded; // why declare it before ? // to use it outside the block later.
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApiError(401, "Unauthorized - Invalid token");
    }

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        // what does select do
        id: true,
        role: true,
        name: true,
        email: true,
        image: true,
      },
    });
    if (!user) {
      throw new ApiError(400, "user not found");
    }

    req.user = user; // why this line? // attaching the user info to req, so that all future middlewares or controllers can access the logged-in user
    next(); // what does this do ? // “Authentication succeeded, move on to the next middleware or route handler.”

    // why no success response here ?   ===== This is middleware, not a route handler. You’re not supposed to respond here — you only verify and then pass control to the next part of the route.
  } catch (error) {
    console.error("Error while authentication");
    // throw new ApiError(500,"Error while authentication")
    return next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id; // why this  ?

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
