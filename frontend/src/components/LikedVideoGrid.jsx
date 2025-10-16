// src/components/LikedVideosGrid.jsx
import React, { useEffect, useState, useContext } from "react";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function LikedVideosGrid({
  api: apiProp,
  user,
  onVideoClick = () => {},
}) {
  const { api: apiCtx } = useContext(youtubeContext);
  const api = apiProp || apiCtx;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!user?._id) {
        setVideos([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.get(
          `/videos?likedBy=${encodeURIComponent(user._id)}`,
        );
        const payload = res?.data?.videos ?? [];
        if (mounted) setVideos(payload);
      } catch (err) {
        console.warn("LikedVideosGrid load failed:", err);
        if (mounted) setVideos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [api, user?._id]);

  if (loading)
    return (
      <div className="bg-white p-4 rounded shadow">Loading liked videos…</div>
    );
  if (!videos.length)
    return (
      <div className="bg-white p-4 rounded shadow">No liked videos yet.</div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {videos.map((v) => (
        <div
          key={v._id}
          className="bg-white rounded shadow overflow-hidden cursor-pointer"
          onClick={() => onVideoClick(v)}
        >
          <div style={{ paddingTop: "56.25%", position: "relative" }}>
            <img
              src={v.thumbnail || v.videoFile}
              alt={v.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <h4 className="text-sm font-semibold line-clamp-2">{v.title}</h4>
            <div className="text-xs text-gray-500 mt-1">
              {v.views ?? 0} views
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
