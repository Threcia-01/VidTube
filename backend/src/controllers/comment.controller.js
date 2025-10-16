import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

/* GET /comments/:videoId */

export const getVideoComments = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id" });
    }

    const comments = await Comment.find({ video: videoId })
      .sort({ createdAt: -1 })
      .populate("owner", "username fullName avatar")
      .lean()
      .exec();

    res.json(
      comments.map((c) => ({
        ...c,
        likes: c.likes || 0,
      }))
    );
  } catch (err) {
    console.error("getVideoComments error", err);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* POST /comments/:videoId */

export const addComment = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Invalid video id" });
    }

    const content = (req.body?.content || "").trim();
    if (!content)
      return res.status(400).json({ message: "Comment content required" });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = new Comment({
      video: videoId,
      owner: req.user._id,
      content,
      likes: 0,
      createdAt: new Date(),
    });

    await comment.save();
    await comment.populate("owner", "username fullName avatar");

    res.status(201).json(comment);
  } catch (err) {
    console.error("addComment error", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

/* PATCH /comments/:commentId */

export const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      !req.user ||
      (comment.owner.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const content = (req.body?.content || "").trim();
    if (!content) return res.status(400).json({ message: "Content required" });

    comment.content = content;
    comment.updatedAt = new Date();
    await comment.save();

    res.json({
      _id: comment._id,
      content: comment.content,
      updatedAt: comment.updatedAt,
    });
  } catch (err) {
    console.error("updateComment error", err);
    res.status(500).json({ message: "Failed to update comment" });
  }
};

/* DELETE /comments/:commentId */

export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (
      !req.user ||
      (comment.owner.toString() !== req.user._id.toString() &&
        req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteComment error", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

/* POST /comments/like/:commentId */

export const likeComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Invalid comment id" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.likes = (comment.likes || 0) + 1;
    await comment.save();

    res.json({ _id: comment._id, likes: comment.likes });
  } catch (err) {
    console.error("likeComment error", err);
    res.status(500).json({ message: "Failed to like comment" });
  }
};
