//CommentSection.jsx
import React, { useEffect, useState, useContext } from "react";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function CommentSection({ videoId }) {
  const { api, user } = useContext(youtubeContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments 
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${videoId}`);
      setComments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  // Add comment 
  const addComment = async () => {
    if (!user) return alert("Please log in to comment");
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/comments/${videoId}`, {
        content: newComment,
      });
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to post comment");
    }
  };

  // Edit comment
  const editComment = async (id) => {
    const text = prompt("Edit comment:");
    if (!text) return;
    try {
      const res = await api.patch(`/comments/${id}`, { content: text });
      setComments(
        comments.map((c) =>
          c._id === id ? { ...c, content: res.data.content } : c,
        ),
      );
    } catch (err) {
      console.error("Failed to edit comment:", err);
    }
  };

  // Delete comment 
  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // Like comment 
  const likeComment = async (id) => {
    try {
      const res = await api.post(`/comments/like/${id}`);
      setComments(
        comments.map((c) =>
          c._id === id ? { ...c, likes: res.data.likes } : c,
        ),
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={addComment}
          className="px-4 bg-blue-500 text-white rounded"
        >
          Post
        </button>
      </div>

      {comments.map((c) => (
        <div key={c._id} className="p-2 bg-gray-100 rounded">
          <div className="flex justify-between items-center">
            <span className="font-semibold">
              {c.owner?.fullName || c.owner?.username || "Unknown"}
            </span>
            {c.owner?._id === user?._id && (
              <div className="flex gap-2">
                <button onClick={() => editComment(c._id)}>Edit</button>
                <button onClick={() => deleteComment(c._id)}>Delete</button>
              </div>
            )}
          </div>
          <p>{c.content}</p>
          <button onClick={() => likeComment(c._id)}>👍 {c.likes || 0}</button>
        </div>
      ))}
    </div>
  );
}
