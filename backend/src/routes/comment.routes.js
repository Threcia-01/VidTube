//comment.routes.js
import express from "express";
import * as commentController from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/:videoId", commentController.getVideoComments);

// Protected routes
router.post("/:videoId", verifyJWT, commentController.addComment);
router.patch("/:commentId", verifyJWT, commentController.updateComment);
router.delete("/:commentId", verifyJWT, commentController.deleteComment);

// Like a comment
router.post("/like/:commentId", verifyJWT, commentController.likeComment);

export default router;
