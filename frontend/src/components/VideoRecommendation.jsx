import React, { useMemo } from "react";
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

export default function VideoRecommendation({
  videos = [],
  onVideoClick = () => {},
}) {
  if (!videos.length) return <div>No recommendation available.</div>;

  // Shuffle videos when videos prop changes
  const shuffledVideos = useMemo(() => shuffleArray(videos), [videos]);

  return (
    <div className="space-y-4">
      {shuffledVideos.map((v) => (
        <VideoCard key={v._id || v.id} video={v} onClick={onVideoClick} />
      ))}
    </div>
  );
}
