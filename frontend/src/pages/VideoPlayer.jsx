// src/pages/VideoPlayer.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { youtubeContext } from "../contexts/vidtubeContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoScreen from "../components/VideoScreen";
import VideoRecommendation from "../components/VideoRecommendation";
import ChannelInfo from "../components/ChannelInfo";
import Description from "../components/Description";
import CommentSection from "../components/CommentSection";

export default function VideoPlayer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    currentVideo,
    fetchVideoById,
    fetchChannelProfile,
    fetchVideos,
    videos,
    setCurrentVideo,
    api,
  } = useContext(youtubeContext);

  const [channel, setChannel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasIncrementedRef = useRef(false); 

  // Load video by ID or route state
  useEffect(() => {
    const videoFromState = location?.state?.video;
    if (videoFromState?._id) {
      setCurrentVideo(videoFromState);
    } else if (id && id !== "undefined") {
      fetchVideoById(id);
    }
  }, [id, location.state, fetchVideoById, setCurrentVideo]);

  // Fetch all videos for recommendations if empty
  useEffect(() => { 
    if (!videos.length) { 
      fetchVideos(); 
    } 
  }, [videos.length, fetchVideos]); 

  // Sync route with current video ID
  useEffect(() => {
    if (currentVideo?._id && currentVideo._id !== id) {
      navigate(`/videos/${currentVideo._id}`, { replace: true });
    }
  }, [currentVideo, id, navigate]);

  // Fetch channel details for current video
  useEffect(() => {
    if (!currentVideo) {
      setChannel(null);
      return;
    }

    const owner = currentVideo.owner || {
      _id: null,
      username: "unknown",
      fullName: "Unknown User",
      avatar: "",
    };

    setChannel({
      _id: owner._id,
      name: owner.fullName || owner.username,
      username: owner.username,
      avatar: owner.avatar,
      subscribers: owner.subscribersCount || 0,
      likes: currentVideo.likes || 0,
    });

    (async () => {
      if (owner.username) {
        const enriched = await fetchChannelProfile(owner.username);
        if (enriched) setChannel(enriched);
      }
    })();
  }, [currentVideo, fetchChannelProfile]);

  // Reset + increment view count
  useEffect(() => {
    const vidId = currentVideo?._id;
    if (!vidId || !api) return;

    const viewedKey = `vidtube_viewed_${vidId}`; 

    if (sessionStorage.getItem(viewedKey)) {
      hasIncrementedRef.current = true;
      return;
    }
    if (hasIncrementedRef.current) return;
    hasIncrementedRef.current = true;

    api
      .post(`/videos/${vidId}/view`)
      .then(() => {
        try {
          sessionStorage.setItem(viewedKey, "1");
        } catch (e) {
        }
      })
      .catch((err) => {
        hasIncrementedRef.current = false;
        console.error("increment view failed:", err);
      });
  }, [currentVideo?._id, api]);

  // Handle next/recommended video click
  const handleNextVideo = (video) => {
    if (!video?._id) return;
    setCurrentVideo(video);
    navigate(`/videos/${video._id}`, { state: { video } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen((s) => !s)} />
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-7xl px-6 py-6 mx-auto flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          {currentVideo?._id ? (
            <>
              <VideoScreen video={currentVideo} />
              <ChannelInfo channel={channel} videoId={currentVideo?._id} /> 
              <Description description={currentVideo.description} />
              <CommentSection videoId={currentVideo._id} />
            </>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              Loading video...
            </div>
          )}
        </div>

        <aside className="w-full lg:w-96 flex-shrink-0">
          <VideoRecommendation
            videos={videos.filter((v) => v._id !== currentVideo?._id)}
            onVideoClick={handleNextVideo}
          />
        </aside>
      </main>
    </div>
  );
}
