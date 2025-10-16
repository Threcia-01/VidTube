// src/components/SearchResultVideoCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function SearchResultVideoCard({ video }) {
  const uploader = video.uploader || video.owner || {};

  return (
    <Link
      to={`/watch/${video._id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition p-2"
    >
      <div className="relative w-full h-48 bg-gray-200 rounded overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>

      <div className="mt-3 flex gap-3">
        <img
          src={uploader.avatar || "/default-avatar.png"}
          alt={uploader.username}
          className="w-9 h-9 rounded-full object-cover"
        />

        <div>
          <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{uploader.username}</p>
          <p className="text-xs text-gray-400">{video.views || 0} views</p>
        </div>
      </div>
    </Link>
  );
}
