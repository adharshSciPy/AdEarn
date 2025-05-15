import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory (using absolute path)
const uploadDir = path.join(__dirname, "../Uploads/imageAdUploads");

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if folder exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed!"), false);
  }
};

// Multer configuration
const adImageUpload= multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Limit to single file
  },
  fileFilter: fileFilter,
}).single("profileImg"); // Explicitly set to handle single file

export default adImageUpload;