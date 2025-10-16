//cloudinary.js

import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function uploadOnCloudinary(
  filePath,
  folder = "vidtube",
  resourceType = "image"
) {
  if (!fs.existsSync(filePath)) throw new Error("File not found: " + filePath);

  const options = {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: false,
  };

  const result = await cloudinary.v2.uploader.upload(filePath, options);
  return {
    url: result.secure_url || result.url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    raw: result,
  };
}

export async function remove(publicId, resourceType = "image" || "video") {
  if (!publicId) return null;
  return await cloudinary.v2.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
