// src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, LogOut, Upload } from "lucide-react";
import SearchBar from "./SearchBar";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function Navbar({ onMenuClick = () => {} }) {
  const { user, logout } = useContext(youtubeContext);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Toggle menu"
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="text-xl font-bold text-red-600">
            VidTube
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center mx-6">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
              3
            </span>
          </button>

          {user ? (
            <>
              <Link
                to="/videos"
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Link>
              
              {user?.username && (
                <Link to="/profile">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-gray-300 transition"
                  />
                </Link>
              )}

              <button
                onClick={logout}
                className="p-2 rounded hover:bg-gray-100"
              >
                <LogOut className="w-6 h-6 text-gray-700" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
