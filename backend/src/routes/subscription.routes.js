//subscription.routes.js
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";

const router = express.Router();
router.use(verifyJWT);

// Toggle subscription if subscribed or not to user
router.post("/toggle/:userId", toggleSubscription);

// Get subscribers of a channel
router.get("/c/:userId", getUserChannelSubscribers);

// Get subscribed to means the channel user/current user has subscribed to 
router.get("/my-channels", getSubscribedChannels);

export default router;
