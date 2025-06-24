import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload directory for survey ads
const uploadDir = path.join(__dirname, "../Uploads/surveyAdImages");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `surveyAd-${uniqueSuffix}${ext}`);
  },
});

// Allowed MIME types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, GIF, and WEBP images are allowed."), false);
  }
};

// Export multer middleware
const surveyAdUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1,
  },
  fileFilter,
}).single("image"); // field name: image

export default surveyAdUpload;
