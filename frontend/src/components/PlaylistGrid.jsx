//playlistGrid.jsx

import React, { useEffect, useState, useContext } from "react";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function PlaylistsGrid({
  api: apiProp,
  user,
  onPlaylistClick = () => {},
}) {
  const { api: apiCtx } = useContext(youtubeContext);
  const api = apiProp || apiCtx;

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user?._id) {
        setPlaylists([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await api.get(
          `/playlists/user/${encodeURIComponent(user._id)}`,
        );
        const payload = Array.isArray(res?.data?.playlists)
          ? res.data.playlists
          : [];

        if (mounted) setPlaylists(payload);
      } catch (err) {
        console.error("PlaylistsGrid load failed:", err);
        if (mounted)
          setError(
            err?.response?.data?.message ||
              err.message ||
              "Failed to load playlists",
          );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [api, user?._id]);

  if (loading)
    return (
      <div className="bg-white p-4 rounded shadow">Loading playlists…</div>
    );
  if (error)
    return (
      <div className="bg-red-100 p-4 rounded shadow text-red-700">{error}</div>
    );
  if (!playlists.length)
    return <div className="bg-white p-4 rounded shadow">No playlists yet.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {playlists.map((p) => (
        <div
          key={p._id}
          className="bg-white rounded shadow overflow-hidden cursor-pointer hover:shadow-md transition"
          onClick={() => onPlaylistClick(p)}
        >
          <div className="p-3">
            <h4 className="text-sm font-semibold line-clamp-2">{p.name}</h4>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {p.description}
            </p>
            <div className="text-xs text-gray-400 mt-1">
              {p.videos?.length ?? 0} videos
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
