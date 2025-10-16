// controllers/like.controller.js
import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Toggle like for a video

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId) throw new ApiError(400, "Video ID required");
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid video ID");

  const existing = await Like.findOne({ video: videoId, likedBy: userId });

  if (existing) {
    await existing.deleteOne();
  } else {
    await Like.create({ video: videoId, likedBy: userId });
  }

  const likeCount = await Like.countDocuments({ video: videoId });
  await Video.findByIdAndUpdate(videoId, { likes: likeCount }).catch(() => {});

  const likedNow = Boolean(
    await Like.exists({ video: videoId, likedBy: userId })
  );
  res.json({ liked: likedNow, likes: likeCount });
});

// Check if current user liked a video and if yes then returns like count also 

const isVideoLiked = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId) throw new ApiError(400, "Video ID required");
  if (!mongoose.Types.ObjectId.isValid(videoId))
    throw new ApiError(400, "Invalid video ID");

  const existing = await Like.findOne({ video: videoId, likedBy: userId });
  const likesCount = await Like.countDocuments({ video: videoId });

  res.json({ liked: !!existing, likes: likesCount });
});

// Toggle like for a comment

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId) throw new ApiError(400, "Comment ID required");
  if (!mongoose.Types.ObjectId.isValid(commentId))
    throw new ApiError(400, "Invalid comment ID");

  const existing = await Like.findOne({ comment: commentId, likedBy: userId });

  if (existing) {
    await existing.deleteOne();
  } else {
    await Like.create({ comment: commentId, likedBy: userId });
  }

  const likeCount = await Like.countDocuments({ comment: commentId });
  await Comment.findByIdAndUpdate(commentId, { likes: likeCount }).catch(
    () => {}
  );

  const likedNow = Boolean(
    await Like.exists({ comment: commentId, likedBy: userId })
  );
  res.json({ liked: likedNow, likes: likeCount });
});

// Get all videos liked by current user

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const likes = await Like.find({ likedBy: userId, video: { $ne: null } })
    .select("video -_id")
    .lean();
  const videoIds = likes.map((l) => l.video.toString());
  res.json({ videos: videoIds });
});

export { toggleVideoLike, toggleCommentLike, getLikedVideos, isVideoLiked };
