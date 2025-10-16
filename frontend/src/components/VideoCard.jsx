//VideoCard.jsx
import React, { memo } from "react";

const VideoCard = memo(function VideoCard({ video, onClick }) {
  return (
    <div
      className="bg-white rounded shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
      onClick={() => onClick(video)}
    >
      {/* Thumbnail */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <img
          src={video.thumbnail || video.videoFile}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Video info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
        <div className="text-xs text-gray-500 mt-1">
          {video.channelName} {video.views || 0} views
        </div>
      </div>
    </div>
  );
});

export default VideoCard;
