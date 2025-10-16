// tempFileRemove.js
import fs from "fs/promises";

export async function safeRemove(filePath) {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") console.error("File cleanup error:", err);
  }
}
