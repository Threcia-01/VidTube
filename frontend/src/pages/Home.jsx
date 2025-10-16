// src/pages/Home.jsx
import React, { useContext, useEffect, useState } from "react";
import { youtubeContext } from "../contexts/vidtubeContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoGrid from "../components/VideoGrid";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, videos, fetchVideos, currentVideo, setCurrentVideo } =
    useContext(youtubeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch videos on mount
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Sidebar toggle functions
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

  // Close sidebar on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeSidebar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // navigate to video player page
  const guideToVideoPlayerOnVideoClick = (video) => {
    if (!video || !video._id) return;
    setCurrentVideo?.(video);
    navigate(`/videos/${video._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} user={user} />

      {/* Overlay for sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity duration-200 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
        aria-hidden={!sidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <main className="flex-1 max-w-7xl  px-6 py-6">
        <VideoGrid
          videos={videos}
          onVideoClick={guideToVideoPlayerOnVideoClick}
        />
      </main>
    </div>
  );
}
