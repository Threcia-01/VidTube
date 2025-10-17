import React, { useState, useContext, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function ChannelInfo({ channel, videoId }) {
  const { api, user } = useContext(youtubeContext);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(null); 
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(channel?.subscribers ?? 0);
  const channelId = channel?._id;

  // Fetch subscription status 
  useEffect(() => {
    if (!channelId || !user) return;

    let mounted = true;

    const fetchSubscriptionStatus = async () => {
      try {
        const res = await api.get(`/subscriptions/c/${channelId}`);
        if (!mounted) return;

        const subscribers = res.data?.subscribers ?? res.data?.count ?? null;
        const subscribersList =
          res.data?.subscribersList ?? res.data?.list ?? null;

        if (typeof subscribers === "number") setSubscriberCount(subscribers);

        if (Array.isArray(subscribersList)) {
          const isSubscribed = subscribersList.some((s) => {
            if (!s) return false;
            if (typeof s === "string") return s === user._id;
            return s._id?.toString() === user._id?.toString();
          });
          setSubscribed(isSubscribed);
          return;
        }

        const fallback = await api.get("/subscriptions/my-channels");
        if (!mounted) return;
        const channels = fallback.data?.channels ?? fallback.data?.list ?? [];
        setSubscribed(channels.some((c) => c._id === channelId));
      } catch (err) {
        console.error("Failed to fetch subscription status:", err);
      }
    };

    fetchSubscriptionStatus();

    return () => { mounted = false };
  }, [channelId, user, api]);

  // Fetch like status 
  useEffect(() => {
    if (!videoId || !user) return;

    let mounted = true;

    const fetchLikeStatus = async () => {
      try {
        const likeRes = await api.get(`/likes/status/v/${videoId}`); 
        if (!mounted) return;
        setLiked(Boolean(likeRes.data?.liked));
        setLikeCount(typeof likeRes.data?.likes === "number" ? likeRes.data.likes : 0); 
      } catch (err) {
        console.error("Failed to fetch like status:", err);
        setLiked(false);
        setLikeCount(0); 
      }
    };

    fetchLikeStatus();

    return () => { mounted = false };
  }, [videoId, user, api]); 
  if (!channel) return null;

  // Subscribe/unsubscribe handler
  const handleSubscribe = async () => {
    if (!user) return alert("Please log in to subscribe");
    if (!channelId) return;

    const prevSubscribed = subscribed;
    const prevCount = subscriberCount;

    setSubscribed(!prevSubscribed);
    setSubscriberCount(prevSubscribed ? Math.max(0, prevCount - 1) : prevCount + 1);

    try {
      const res = await api.post(`/subscriptions/toggle/${channelId}`);
      const serverSubscribed = res.data?.subscribed;
      const serverCount = res.data?.subscribers ?? res.data?.count ?? null;

      if (typeof serverSubscribed === "boolean") setSubscribed(serverSubscribed);
      if (typeof serverCount === "number") setSubscriberCount(serverCount);
    } catch (error) {
      console.error("Subscription toggle failed:", error);
      setSubscribed(prevSubscribed);
      setSubscriberCount(prevCount);
    }
  };

  // Like/unlike handler 
  const handleLike = async () => {
    if (!user) return alert("Please log in to like videos");
    if (!videoId) return;

    const prevLiked = liked;
    const prevLikeCount = likeCount;
    const newLiked = !prevLiked;

    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await api.post(`/likes/toggle/v/${videoId}`, {
        action: newLiked ? "like" : "unlike",
      });
    } catch (error) {
      console.error("Like action failed:", error);
      setLiked(prevLiked);
      setLikeCount(prevLikeCount);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-4 p-3 bg-white rounded shadow-sm">
      <img
        src={channel.avatar || "/default-avatar.png"}
        alt={channel.fullName || channel.username || "Channel"}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-normal">{channel.fullName || channel.username}</h3>
        <div className="text-sm text-gray-500">{subscriberCount} subscribers</div>
      </div>

      <button
        className={`ml-auto px-4 py-1 rounded ${
          subscribed ? "bg-gray-400 text-white" : "bg-red-500 text-white hover:bg-red-600"
        }`}
        onClick={handleSubscribe}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </button>

      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded transition ${
            liked ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-blue-400"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likeCount}</span>
        </button>

        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 text-gray-600 opacity-70 cursor-not-allowed"
          disabled
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
