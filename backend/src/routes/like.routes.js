// routes/like.routes.js
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleVideoLike,
  toggleCommentLike,
  getLikedVideos,
  isVideoLiked,
} from "../controllers/like.controller.js";

const router = express.Router();

router.use(verifyJWT); 

// Toggle likes
router.post("/toggle/v/:videoId", toggleVideoLike);
router.post("/toggle/c/:commentId", toggleCommentLike);

// Get liked videos
router.get("/videos", getLikedVideos);

// Check if video is liked by user  
router.get("/status/v/:videoId", isVideoLiked);

export default router;
