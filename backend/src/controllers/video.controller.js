import path from "path";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import * as cloudinary from "../utils/cloudinary.js";
import { generateThumbnail } from "../middlewares/thumbnail.middleware.js";
import { safeRemove } from "../utils/tempFileRemove.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

// Increment video views
export const incrementView = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const video = await Video.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.status(200).json({ message: "View incremented", views: video.views });
});

// Get all videos 
export const getAllVideos = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.query) {
    const q = req.query.query;
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }
  if (req.query.userId && mongoose.Types.ObjectId.isValid(req.query.userId))
    query.owner = req.query.userId;
  query.isPublished = true;

  const videos = await Video.find(query)
    .sort({ createdAt: -1 })
    .populate("owner", "username fullName avatar")
    .lean();

  const videosWithUploader = videos.map((v) => ({
    ...v,
    uploader: v.owner || null,
  }));
  res.json({ videos: videosWithUploader });
});

// Get a single video by ID
export const getVideoById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid ID");

  const video = await Video.findById(id)
    .populate("owner", "username fullName avatar")
    .lean();
  if (!video) throw new ApiError(404, "Video not found");

  video.uploader = video.owner || null;
  res.json(video);
});

// Publish a video
export const publishAVideo = asyncHandler(async (req, res) => {
  const videoFile = req.files.video?.[0];
  const thumbnailFile = req.files.thumbnail?.[0];

  if (!videoFile) throw new ApiError(400, "Video file required");

  const publicIdBase = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  let localThumbPath = null;

  try {
    if (!thumbnailFile)
      localThumbPath = await generateThumbnail(videoFile.path, {
        baseName: publicIdBase,
        outDir: path.resolve("tmp", "thumbnails"),
        atSec: 2,
        size: "640x360",
      });

    const videoCloud = await cloudinary.uploadOnCloudinary(
      videoFile.path,
      `vidtube_videos/${publicIdBase}`,
      "video"
    );
    const videoUrl = videoCloud.secure_url || videoCloud.url;

    let thumbnailUrl = null;
    if (thumbnailFile) {
      const thumbCloud = await cloudinary.uploadOnCloudinary(
        thumbnailFile.path,
        `vidtube_thumbs/${publicIdBase}`,
        "image"
      );
      thumbnailUrl = thumbCloud.secure_url || thumbCloud.url;
    } else if (localThumbPath) {
      const thumbCloud = await cloudinary.uploadOnCloudinary(
        localThumbPath,
        `vidtube_thumbs/${publicIdBase}`,
        "image"
      );
      thumbnailUrl = thumbCloud.secure_url || thumbCloud.url;
    }

    const newVideo = await Video.create({
      videoFile: videoUrl,
      thumbnail: thumbnailUrl,
      title: req.body.title || videoFile.originalname,
      description: req.body.description || "",
      owner: req.user._id,
    });

    // remove files from temp folder 
    await safeRemove(videoFile.path);
    if (localThumbPath) await safeRemove(localThumbPath);

    const saved = await Video.findById(newVideo._id)
      .populate("owner", "username fullName avatar")
      .lean();
    saved.uploader = saved.owner || null;

    res.status(201).json(saved);
  } catch (err) {
    await safeRemove(videoFile.path).catch(() => {});
    await safeRemove(localThumbPath).catch(() => {});
    throw err;
  }
});

// Update video
export const updateVideo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid ID");

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");
  if (
    video.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    throw new ApiError(403, "Not authorized");

  const { title, description, isPublished } = req.body;
  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (isPublished !== undefined) video.isPublished = Boolean(isPublished);

  await video.save();

  const updated = await Video.findById(video._id)
    .populate("owner", "username fullName avatar")
    .lean();
  updated.uploader = updated.owner || null;
  res.json(updated);
});

// Delete video
export const deleteVideo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid ID");

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");
  if (
    video.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    throw new ApiError(403, "Not authorized");

  await video.deleteOne();
  await Comment.deleteMany({ video: id });
  res.json({ message: "Deleted" });
});

// Toggle publish status
export const togglePublishStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new ApiError(400, "Invalid ID");

  const video = await Video.findById(id);
  if (!video) throw new ApiError(404, "Video not found");
  if (
    video.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    throw new ApiError(403, "Not authorized");

  video.isPublished = !video.isPublished;
  await video.save();
  res.json({ id: video._id, isPublished: video.isPublished });
});

export const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim() === "") throw new ApiError(400, "Search query required");

  const videos = await Video.find({
    title: { $regex: q, $options: "i" },
    isPublished: true,
  })
    .populate("owner", "username fullName avatar")
    .sort({ createdAt: -1 })
    .lean();

  if (!videos.length) {
    return res.status(404).json({ message: "No videos found" });
  }

  const formatted = videos.map((v) => ({ ...v, uploader: v.owner || null }));
  res.status(200).json({ videos: formatted });
});
