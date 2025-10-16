// src/pages/NotFound.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const loc = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg text-center bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-semibold mb-2">No route matched</h1>
        <p className="text-sm text-gray-600 mb-4">
          Attempted path: <code>{loc.pathname}</code>
        </p>
        <div className="space-x-2">
          <Link to="/" className="text-red-500 font-medium">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
