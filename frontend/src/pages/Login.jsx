// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function Login() {
  const { loginUser, api } = useContext(youtubeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/users/login", data);

      if (res.data && res.data.success) {
        const { user, accessToken } = res.data.data;
        loginUser(user, accessToken);
        navigate("/");
      } else {
        setErrorMsg(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.response?.data?.message || "Server/network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-semibold mb-4">Sign in to VidTube</h2>

        {errorMsg && (
          <div className="mb-3 text-sm text-red-600">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
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
              {...register("password", { required: "Password is required" })}
              className="w-full p-2 border rounded"
              placeholder="password"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 ">
          New to VidTube?{" "}
          <Link
            to="/users/register"
            className=" font-medium text-red-500 hover:text-red-600"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
