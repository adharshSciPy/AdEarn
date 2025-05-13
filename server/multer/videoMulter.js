import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/mov'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // limit to 50MB
  },
});
