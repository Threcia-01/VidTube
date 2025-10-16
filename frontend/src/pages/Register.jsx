// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function Register() {
  const { api } = useContext(youtubeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName.trim());
      formData.append("email", data.email.trim().toLowerCase());
      formData.append("username", data.username.trim().toLowerCase());
      formData.append("password", data.password);

      if (data.avatar && data.avatar[0])
        formData.append("avatar", data.avatar[0]);
      if (data.coverImage && data.coverImage[0])
        formData.append("coverImage", data.coverImage[0]);

      const res = await api.post("/users/register", formData);

      if (res?.data?.success) {
        navigate("/users/login");
      } else {
        setErrorMsg(res?.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMsg(err?.response?.data?.message || "Server/network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarPreview(URL.createObjectURL(file));
    else setAvatarPreview(null);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
    else setCoverPreview(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Register for VidTube</h2>

        {errorMsg && (
          <div className="mb-3 text-sm text-red-600">{errorMsg}</div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              className="w-full p-2 border rounded"
              placeholder="Your full name"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email",
                },
              })}
              className="w-full p-2 border rounded"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
              className="w-full p-2 border rounded"
              placeholder="username"
            />
            {errors.username && (
              <p className="text-xs text-red-600 mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full p-2 border rounded"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Avatar</label>
            <input
              type="file"
              accept="image/*"
              {...register("avatar", { required: "Avatar is required" })}
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="mt-2 w-20 h-20 object-cover rounded-full"
              />
            )}
            {errors.avatar && (
              <p className="text-xs text-red-600 mt-1">
                {errors.avatar.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cover Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("coverImage")}
              onChange={handleCoverChange}
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="mt-2 w-full h-32 object-cover rounded"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/users/login"
            className="font-medium text-red-500 hover:text-red-600"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
