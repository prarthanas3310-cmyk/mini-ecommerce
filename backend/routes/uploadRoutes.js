import express from "express";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: "mini-ecommerce" },
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      res.json({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

export default router;
