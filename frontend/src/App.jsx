import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Core Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Upload from "./pages/Upload";
import VideoPlayer from "./pages/VideoPlayer";
import Profile from "./pages/Profile";
import SearchResult from "./pages/SearchResult";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="users/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/videos">
          <Route index element={<Upload />} />
          <Route path=":id" element={<VideoPlayer />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/c/:username" element={<Profile />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
