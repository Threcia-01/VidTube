// src/components/VideoScreen.jsx
import React from "react";

export default function VideoScreen({ video }) {
  if (!video) return null;

  return (
    <div className="w-full bg-black rounded-md overflow-hidden">
      <video
        src={video.videoFile || video.url || ""}
        controls
        autoPlay
        className="w-full h-[480px] md:h-[560px] lg:h-[600px] object-cover rounded"
      />
      <h2 className="mt-4 text-xl font-semibold">{video.title}</h2>
      <div className="mt-1 text-sm text-gray-600">{video.views || 0} views</div>
    </div>
  );
}
