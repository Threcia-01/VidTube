// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileInfo from "../components/ProfileInfo";
import YourVideosGrid from "../components/YourVideosGrid";
import HistoryGrid from "../components/HistoryGrid";
import LikedVideosGrid from "../components/LikedVideoGrid";
import PlaylistsGrid from "../components/PlaylistGrid";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { api, user: currentUser, fetchVideoById } = useContext(youtubeContext);

  const [profile, setProfile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("your-videos");
  const [loading, setLoading] = useState(true);

  const isOwnProfile =
    !username || (currentUser && username === currentUser.username);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      try {
        let payload = null;

        if (username) {
          const res = await api.get(`/users/c/${encodeURIComponent(username)}`);
          payload = res?.data?.data ?? res?.data ?? null;
        } else {
          
          try {
            const res = await api.get("/users/current-user");
            payload = res?.data?.data ?? res?.data ?? currentUser;
          } catch (err) {
            payload = currentUser ?? null;
          }
        }

        if (mounted) setProfile(payload);
      } catch (err) {
        console.warn("Failed to load profile:", err);
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [api, username, currentUser]);

  const onVideoClick = (video) => {
    if (!video || !video._id) return;
    if (typeof fetchVideoById === "function") fetchVideoById(video._id);
    navigate(`/videos/${video._id}`, { state: { video } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen((s) => !s)} />
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 max-w-7xl px-6 py-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <ProfileInfo
              user={profile}
              isOwnProfile={isOwnProfile}
              loading={loading}
            />
          </div>

          <div className="col-span-2">
            <div className="bg-white rounded shadow p-3 mb-4 flex gap-2 flex-wrap">
              <Tab
                name="your-videos"
                label="Your Videos"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <Tab
                name="history"
                label="History"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <Tab
                name="liked"
                label="Liked"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <Tab
                name="playlists"
                label="Playlists"
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>

            <div>
              {activeTab === "your-videos" && (
                <YourVideosGrid
                  api={api}
                  user={profile}
                  onVideoClick={onVideoClick}
                />
              )}
              {activeTab === "history" && (
                <HistoryGrid
                  api={api}
                  user={profile}
                  onVideoClick={onVideoClick}
                />
              )}
              {activeTab === "liked" && (
                <LikedVideosGrid
                  api={api}
                  user={profile}
                  onVideoClick={onVideoClick}
                />
              )}
              {activeTab === "playlists" && (
                <PlaylistsGrid
                  api={api}
                  user={profile}
                  onVideoClick={onVideoClick}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Tab({ name, label, activeTab, setActiveTab }) {
  const isActive = activeTab === name;
  return (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-4 py-2 rounded ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
    >
      {label}
    </button>
  );
}
