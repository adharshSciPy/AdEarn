import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define video upload directory
const uploadDir = path.join(__dirname, "../Uploads/videoAdUploads");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// Allowed video types
const allowedVideoTypes = [
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/webm",
];

// File filter for videos only
const fileFilter = (req, file, cb) => {
  if (allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only video files are allowed!"), false);
  }
};

// Multer configuration for video ads
const videoAdUpload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max size
    files: 1,
  },
  fileFilter: fileFilter,
}).single("videoAd"); // expects the field name to be "videoAd"

export default videoAdUpload;
