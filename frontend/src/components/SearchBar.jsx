// src/components/SearchBar.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const { searchVideos, setCurrentVideo } = useContext(youtubeContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;

    const results = await searchVideos(trimmed);

    if (results.length > 0) {
      const exactMatch = results.find(
        (v) => v.title.toLowerCase() === trimmed.toLowerCase(),
      );
      const targetVideo = exactMatch || results[0];

      setCurrentVideo(targetVideo);
      navigate(`/videos/${targetVideo._id}`);
    } else {
      alert("No videos found with that title.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full border rounded-full bg-gray-50 overflow-hidden shadow-sm"
    >
      <input
        type="text"
        placeholder="Search videos"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-grow px-4 py-2 text-sm text-gray-800 bg-transparent outline-none"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}
