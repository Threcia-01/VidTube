// src/components/SearchResultGrid.jsx
import React from "react";
import SearchResultVideoCard from "./SearchResultVideoCard";

export default function SearchResultGrid({ videos = [] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <SearchResultVideoCard key={video._id || video.id} video={video} />
      ))}
    </div>
  );
}
