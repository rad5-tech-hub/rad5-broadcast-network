import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
//import { v2 as cloudinary } from "cloudinary";
import cloudinary from "./cloudinary";

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "agents",
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: file.originalname.split(".")[0],
    };
  },
});

// Create and export the multer instance
export const upload = multer({ storage });
