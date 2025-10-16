// multer.middleware.js
import multer from "multer";
import fs from "fs";
import path from "path";

const TMP_DIR = path.join(process.cwd(), "tmp", "vidtube_uploads");
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, TMP_DIR);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    const base = Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    cb(null, base + ext);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 1GB
});
