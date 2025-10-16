//playlist.controller.js

import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/* Create a new playlist */

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const owner = req.user?._id; // user from JWT

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Name and description are required." });
  }

  const playlist = await Playlist.create({ name, description, owner });
  res.status(201).json({ playlist });
});

/* Get all playlists for a user */

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  const playlists = await Playlist.find({ owner: userId })
    .populate("videos")
    .lean();

  res.json({ playlists });
});

/* Get playlist by ID */

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Invalid playlistId" });
  }

  const playlist = await Playlist.findById(playlistId).populate("videos");
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  res.json({ playlist });
});

/* Add video to playlist */

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return res.status(400).json({ message: "Invalid ID(s)" });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  if (!playlist.videos.includes(videoId)) {
    playlist.videos.push(videoId);
    await playlist.save();
  }

  res.json({ playlist });
});

/* Remove video from playlist */

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (
    !mongoose.Types.ObjectId.isValid(playlistId) ||
    !mongoose.Types.ObjectId.isValid(videoId)
  ) {
    return res.status(400).json({ message: "Invalid ID(s)" });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
  await playlist.save();

  res.json({ playlist });
});

/* Delete playlist */

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Invalid playlistId" });
  }

  await Playlist.findByIdAndDelete(playlistId);
  res.json({ message: "Playlist deleted successfully" });
});

/* Update playlist */

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({ message: "Invalid playlistId" });
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) return res.status(404).json({ message: "Playlist not found" });

  if (name) playlist.name = name;
  if (description) playlist.description = description;

  await playlist.save();

  res.json({ playlist });
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
