// src/components/ProfileInfo.jsx
import React from "react";

export default function ProfileInfo({
  user,
  isOwnProfile = false,
  loading = false,
}) {
  if (loading)
    return <div className="bg-white p-4 rounded shadow">Loading profile…</div>;
  if (!user)
    return <div className="bg-white p-4 rounded shadow">No profile found.</div>;

  return (
    <div className="bg-white rounded shadow p-4 space-y-3">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt={user.fullName || user.username}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-lg font-semibold">
            {user.fullName || user.username}
          </h2>
          <div className="text-sm text-gray-500">@{user.username}</div>
          <div className="text-sm text-gray-500 mt-1">
            {user.subscribersCount
              ? `${user.subscribersCount} subscribers`
              : null}
          </div>
        </div>
      </div>

      {isOwnProfile && (
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded">
            Edit profile
          </button>
          <button className="px-3 py-1 bg-gray-100 rounded">Settings</button>
        </div>
      )}

      {user.coverImage && (
        <div>
          <img
            src={user.coverImage}
            alt="cover"
            className="w-full h-36 object-cover rounded"
          />
        </div>
      )}
      <div className="text-sm text-gray-700">
        {user.email ? <span>Email: {user.email}</span> : null}
      </div>
    </div>
  );
}
