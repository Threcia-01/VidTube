// src/pages/Upload.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { youtubeContext } from "../contexts/vidtubeContext";


export default function Upload() {
  const { api, accessToken } = useContext(youtubeContext);
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbFilePreview, setThumbFilePreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (thumbFilePreview) URL.revokeObjectURL(thumbFilePreview);
    };
  }, [videoPreview, thumbFilePreview]);

  const validateVideoFile = (f) => {
    if (!f) return "Video file is required";
    const allowed = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowed.includes(f.type))
      return "Unsupported video file type. Supported: mp4, webm, mov";
    const max = 100 * 1024 * 1024 * 1; // 100MB limit
    if (f.size > max) return "Video is too large. Please upload under 100MB";
    return null;
  };

  const validateThumbFile = (f) => {
    if (!f) return null;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type))
      return "Unsupported file type. Please upload a valid image file.";
    const max = 5 * 1024 * 1024 * 1; // 5MB limit
    if (f.size > max)
      return "File size exceeds 5MB. Please upload a smaller image.";
    return null;
  };

  // 🎬 Handle video selection
  const handleVideoChange = (e) => {
    setErrorMsg("");
    const f = e.target.files?.[0] || null;
    const err = validateVideoFile(f);

    if (err) {
      setVideoFile(null);
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
      }
      setErrorMsg(err);
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(f);
    setVideoPreview(URL.createObjectURL(f));
  };

  // Handle thumbnail selection
  const handleThumbChange = (e) => {
    setErrorMsg("");
    const f = e.target.files?.[0] || null;
    const err = validateThumbFile(f);

    if (err) {
      setThumbFile(null);
      if (thumbFilePreview) {
        URL.revokeObjectURL(thumbFilePreview);
        setThumbFilePreview(null);
      }
      setErrorMsg(err);
      return;
    }

    if (thumbFilePreview) URL.revokeObjectURL(thumbFilePreview);
    setThumbFile(f);
    setThumbFilePreview(f ? URL.createObjectURL(f) : null);
  };

  // 🚀 Submission Logic
  const submitUpload = async () => {
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Description is required");
      return;
    }

    const videoError = validateVideoFile(videoFile);
    if (videoError) {
      setErrorMsg(videoError);
      return;
    }

    const thumbError = validateThumbFile(thumbFile);
    if (thumbError) {
      setErrorMsg(thumbError);
      return;
    }

    // Guard against double submission
    if (submitting) return;
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("video", videoFile);
      if (thumbFile) formData.append("thumbnail", thumbFile);

      const res = await api.post("/videos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`, 
        },
      });

      if (res?.data?.isPublished) {
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
          setVideoPreview(null);
        }
        if (thumbFilePreview) {
          URL.revokeObjectURL(thumbFilePreview);
          setThumbFilePreview(null);
        }

        navigate("/");
      } else {
        setErrorMsg(res?.data?.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err?.response?.data?.message || "Network/server error");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔄 Reset Function
  const resetAll = () => {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    setThumbFile(null);
    if (thumbFilePreview) {
      URL.revokeObjectURL(thumbFilePreview);
      setThumbFilePreview(null);
    }
    setErrorMsg("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Upload Video (simple)</h1>

      {errorMsg && <div className="mb-3 text-sm text-red-600">{errorMsg}</div>}

      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title (required)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description (required)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Video file (required)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            disabled={submitting}
          />
        </div>

        {/* Video Preview */}
        {videoPreview && (
          <div className="mt-3">
            <video
              src={videoPreview}
              controls
              className="max-h-64 rounded w-full"
            />
            <div className="text-sm text-gray-600 mt-1">{videoFile?.name}</div>
          </div>
        )}

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Thumbnail (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbChange}
            disabled={submitting}
          />
        </div>

        {/* Thumbnail Preview */}
        {thumbFilePreview && (
          <div className="mt-2">
            <img
              src={thumbFilePreview}
              alt="thumbnail preview"
              className="max-h-40 rounded"
            />
            <div className="text-sm text-gray-600 mt-1">{thumbFile?.name}</div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={submitUpload}
            disabled={submitting}
            className={`px-4 py-2 rounded text-white ${
              submitting ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {submitting ? "Uploading..." : "Upload Video"}
          </button>

          <button
            type="button"
            onClick={resetAll}
            disabled={submitting}
            className="px-4 py-2 rounded border"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
