// src/routes/video.routes.js
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import * as videoController from "../controllers/video.controller.js";

const router = express.Router();

// Public endpoints
router.get("/", videoController.getAllVideos);
router.get("/search", videoController.searchVideos);
router.get("/:id", videoController.getVideoById);

// Protected endpoints
router.post(
  "/",
  verifyJWT,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  videoController.publishAVideo
);

router.patch(
  "/:id",
  verifyJWT,
  upload.single("thumbnail"),
  videoController.updateVideo
);
router.delete("/:id", verifyJWT, videoController.deleteVideo);
router.patch(
  "/toggle/publish/:id",
  verifyJWT,
  videoController.togglePublishStatus
);

// viws a video get/tracks how many views the video has
router.post("/:id/view", videoController.incrementView);

export default router;
