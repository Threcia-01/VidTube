// src/components/Protected.jsx

import React, { useContext } from "react";
import { youtubeContext } from "../contexts/vidtubeContext";

export default function Hidden({ children }) {
  const { isAuthenticated } = useContext(youtubeContext);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}
