// subscription.controller.js
import mongoose from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/* Toggle subscription fas if if subscribed or not to the channel by user*/

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.userId; 
  const subscriberId = req.user._id;

  if (!channelId) throw new ApiError(400, "Channel ID required");
  if (!mongoose.Types.ObjectId.isValid(channelId))
    throw new ApiError(400, "Invalid channel ID");
  if (subscriberId.toString() === channelId.toString())
    throw new ApiError(400, "Cannot subscribe to yourself");

  const existing = await Subscription.findOne({
    subscriber: subscriberId,
    channel: channelId,
  });

  if (existing) {
    await existing.deleteOne();
    const subscriberCount = await Subscription.countDocuments({
      channel: channelId,
    });
    return res.json({ subscribed: false, subscribers: subscriberCount });
  } else {
    await Subscription.create({ subscriber: subscriberId, channel: channelId });
    const subscriberCount = await Subscription.countDocuments({
      channel: channelId,
    });
    return res.json({ subscribed: true, subscribers: subscriberCount });
  }
});

/* Get subscribers of a channel */

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const channelId = req.params.userId; 
  if (!channelId) throw new ApiError(400, "Channel ID required");
  if (!mongoose.Types.ObjectId.isValid(channelId))
    throw new ApiError(400, "Invalid channel ID");

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  // Check whether current user is subscribed 
  const currentSubscriberId = req.user?._id;
  let isSubscribed = false;
  if (currentSubscriberId) {
    isSubscribed = Boolean(
      await Subscription.exists({
        channel: channelId,
        subscriber: currentSubscriberId,
      })
    );
  }

  // If client asks for the list (with pagination)
  const wantList = ["true", "1", "yes"].includes(
    String(req.query.list ?? "").toLowerCase()
  );
  if (!wantList) {
    return res.json({ subscribers: subscriberCount, subscribed: isSubscribed });
  }

  // Pagination params
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const skip = (page - 1) * limit;

  // Return subscriber user objects (populate subscriber info)
  const subscriptions = await Subscription.find({ channel: channelId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("subscriber", "fullName username avatar")
    .lean();

  // Map to subscriber user objects
  const subscribersList = subscriptions
    .map((s) => s.subscriber)
    .filter(Boolean);

  return res.json({
    subscribers: subscriberCount,
    subscribersList,
    page,
    limit,
    subscribed: isSubscribed,
  });
});

/* Get channels current user subscribed to */

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriberId = req.user._id;
  if (!subscriberId) throw new ApiError(401, "Authentication required");

  const subs = await Subscription.find({ subscriber: subscriberId })
    .sort({ createdAt: -1 })
    .populate("channel", "fullName username avatar")
    .lean();

  const channels = subs.map((s) => s.channel).filter(Boolean);
  res.json({ channels });
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
