// src/pages/SearchResults.jsx
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SearchResultGrid from "../components/SearchResultGrid";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function SearchResult() {
  const { searchVideos, videos } = useContext(youtubeContext);
  const [searchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) return;
    const fetch = async () => {
      setLoading(true);
      await searchVideos(query);
      setLoading(false);
    };
    fetch();
  }, [query, searchVideos]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9]">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex flex-1">
        <div className="flex-1 p-4 md:p-6">
          <h1 className="text-xl font-semibold mb-4">
            Search results for: <span className="text-red-600">{query}</span>
          </h1>

          {loading ? (
            <div className="text-gray-600 text-center mt-12">
              Loading results...
            </div>
          ) : videos.length > 0 ? (
            <SearchResultGrid videos={videos} />
          ) : (
            <div className="text-gray-600 text-center mt-12">
              No results found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
