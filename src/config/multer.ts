// // Create and export the multer instance
// export const upload = multer({ storage });
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

// Allowed file types
const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'agents',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      public_id: file.originalname.split('.')[0],
    };
  },
});

// File filter to restrict uploads
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'));
  }
};

// Export multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB max size
});
