//videogrid.jsx
import React, { memo, useMemo } from "react";
import VideoCard from "./VideoCard";

// Helper to shuffle an array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const VideoGrid = memo(function VideoGrid({
  videos = [],
  onVideoClick = () => {},
}) {
  if (!videos.length) {
    return <div className="text-gray-500">No videos found.</div>;
  }

  // Shuffle videos on each render
  const shuffledVideos = useMemo(() => shuffleArray(videos), [videos]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {shuffledVideos.map((v) => (
        <VideoCard key={v._id || v.id} video={v} onClick={onVideoClick} />
      ))}
    </div>
  );
});

export default VideoGrid;
