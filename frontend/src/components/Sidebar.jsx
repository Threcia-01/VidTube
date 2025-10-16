// src/components/Sidebar.jsx
import React from "react";
import { Home, Compass, Video, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ open = false, onClose = () => {} }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        w-56 bg-[#0b0b0b] text-white border-r border-black/40`}
      aria-hidden={!open}
    >
      <div className="h-full overflow-y-auto">
        <nav className="px-3 py-6 space-y-2">
          <div className="px-2 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7L8 5z" fill="white" />
              </svg>
            </div>
            <span className="font-semibold">VidTube</span>
          </div>

          {/* Links */}
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/6 transition"
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">Home</span>
              </Link>
            </li>

            <li>
              <Link
                to="/shorts"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/6 transition"
              >
                <Compass className="w-5 h-5" />
                <span className="text-sm">Shorts</span>
              </Link>
            </li>

            <li>
              <Link
                to="/subscriptions"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/6 transition"
              >
                <Video className="w-5 h-5" />
                <span className="text-sm">Subscriptions</span>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/6 transition"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">You</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
