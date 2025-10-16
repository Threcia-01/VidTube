// backend/src/services/thumbnail.middleware.js
import fs from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

export async function generateThumbnail(
  inputPath,
  {
    outDir = path.resolve("tmp", "thumbnails"),
    baseName = `thumb_${Date.now()}`,
    atSec = 2,
    size = "640x360",
  } = {}
) {
  await fs.mkdir(outDir, { recursive: true });
  const thumbPath = path.join(outDir, `${baseName}.jpg`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .on("error", (err) => {
        reject(new Error(`FFmpeg screenshot failed: ${err.message || err}`));
      })
      .on("end", () => resolve(thumbPath))
      .screenshots({
        timestamps: [String(atSec)],
        filename: `${baseName}.jpg`,
        folder: outDir,
        size,
      });
  });
}
