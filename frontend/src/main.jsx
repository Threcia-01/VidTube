// src/main.jsx
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { YouTubeProvider } from "./contexts/vidtubeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <YouTubeProvider>
      <App />
    </YouTubeProvider>
  </StrictMode>,
);
