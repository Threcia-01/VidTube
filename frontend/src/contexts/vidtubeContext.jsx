//vidtubeContext.jsx

import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import axios from "axios";

export const youtubeContext = createContext();

export const YouTubeProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("yt_user")) || null;
    } catch {
      return null;
    }
  });
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("yt_access_token") || "",
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("yt_access_token")),
  );

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE;
  const api = useMemo(
    () => axios.create({ baseURL: apiBase, withCredentials: true }),
    [apiBase],
  );

  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setIsAuthenticated(true);
    } else {
      delete api.defaults.headers.common["Authorization"];
      setIsAuthenticated(false);
    }
  }, [accessToken, api]);

  // logout: rthis redirect the user to home page
  const logout = useCallback(
    async (redirect = true) => {
      try {
        await api.post("/users/logout"); 
      } catch (e) {}

      setUser(null);
      setAccessToken("");
      setIsAuthenticated(false);
      localStorage.removeItem("yt_access_token");
      localStorage.removeItem("yt_user");

      if (redirect) {
        try {
          window.location.replace("/");
        } catch (err) {
          window.location.href = "/";
        }
      }
    },
    [api],
  );

  // refreshAccessToken
  const refreshAccessToken = useCallback(async () => {
    if (isRefreshingRef.current) return null;
    isRefreshingRef.current = true;
    try {
      const res = await api.post("/users/refresh-token");
      const newToken = res?.data?.data?.accessToken;
      if (!newToken) {
        await logout(true);
        return null;
      }
      setAccessToken(newToken);
      localStorage.setItem("yt_access_token", newToken);
      return newToken;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        await logout(true); 
      }
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [api, logout]);

  // Axios interceptor: retry once if 401, otherwise logout 
  useEffect(() => {
    if (!api) return;
    const interceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        const orig = err.config || {};
        const status = err?.response?.status;

        if (status !== 401 || orig._retry) return Promise.reject(err);

        const url = orig.url || "";
        if (
          url.includes("/users/refresh-token") ||
          url.includes("/users/logout")
        ) {
          return Promise.reject(err);
        }

        orig._retry = true;
        const newToken = await refreshAccessToken(); 
        if (newToken) {
          orig.headers = orig.headers || {};
          orig.headers["Authorization"] = `Bearer ${newToken}`;
          return api(orig);
        }

        return Promise.reject(err); 
      },
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [api, refreshAccessToken]);

  // Video operations
  const fetchVideos = useCallback(async () => {
    try {
      const res = await api.get("/videos/");
      setVideos(res.data.videos || res.data);
    } catch (err) {
      console.error("fetchVideos error:", err);
    }
  }, [api]);

  const fetchVideoById = useCallback(
    async (id) => {
      if (!id || id === "undefined") return;
      try {
        const res = await api.get(`/videos/${id}`);
        const videoData = res.data.video || res.data;
        setCurrentVideo(videoData);
      } catch (err) {
        console.error("fetchVideoById error:", err);
      }
    },
    [api],
  );

  const fetchChannelProfile = useCallback(
    async (username) => {
      if (!username) return null;
      try {
        const res = await api.get(`/users/c/${encodeURIComponent(username)}`);
        return res.data?.data ?? res.data;
      } catch (err) {
        return null;
      }
    },
    [api],
  );

  const searchVideos = useCallback(
    async (q) => {
      if (!q) return [];
      setLastQuery(q);
      try {
        const res = await api.get(`/videos/search?q=${encodeURIComponent(q)}`);
        const fetched = res.data.videos || res.data;
        setVideos(fetched);
        return fetched;
      } catch (err) {
        console.error("searchVideos error:", err);
        return [];
      }
    },
    [api],
  );

  const loginUser = useCallback((userObj, token) => {
    setUser(userObj);
    setAccessToken(token);
    setIsAuthenticated(true);
    localStorage.setItem("yt_access_token", token);
    localStorage.setItem("yt_user", JSON.stringify(userObj));
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      videos,
      currentVideo,
      lastQuery,
      setCurrentVideo,
      fetchVideos,
      fetchVideoById,
      fetchChannelProfile,
      searchVideos,
      loginUser,
      logout,
      refreshAccessToken,
      api,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      videos,
      currentVideo,
      lastQuery,
      setCurrentVideo,
      fetchVideos,
      fetchVideoById,
      fetchChannelProfile,
      searchVideos,
      loginUser,
      logout,
      refreshAccessToken,
      api,
    ],
  );

  return (
    <youtubeContext.Provider value={contextValue}>
      {children}
    </youtubeContext.Provider>
  );
};
