import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Project root and upload base path
const projectRoot = path.resolve(__dirname, '..');
const uploadsBaseDir = path.join(projectRoot, 'frontend', 'public', 'uploads');

const uploadDirs = {
  team: path.join(uploadsBaseDir, 'team'),
  caseStudies: path.join(uploadsBaseDir, 'case-studies'),
  style: path.join(uploadsBaseDir, 'style'),
  popup: path.join(uploadsBaseDir, 'popup'),
  blog: path.join(uploadsBaseDir, 'blog'),
};

// ✅ Ensure directories exist
Object.values(uploadDirs).forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  } catch (err) {
    console.error(`❌ Failed to create directory ${dir}:`, err);
  }
});

// ✅ Accept only images
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'));
  }
};

// ✅ Create multer upload instance
const createUpload = (folderPath) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, folderPath),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
      }
    }),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  });

// ✅ Safe route handler wrapper
const handleUpload = (uploadMiddleware, folderName) =>
  (req, res) => {
    uploadMiddleware.single('image')(req, res, (err) => {
      if (err) {
        console.error(`❌ Upload failed for /${folderName}:`, err.message);
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      res.status(200).json({ url: `/uploads/${folderName}/${req.file.filename}` });
    });
  };

// ✅ Routes
router.post('/team-image', handleUpload(createUpload(uploadDirs.team), 'team'));
router.post('/case-study-image', handleUpload(createUpload(uploadDirs.caseStudies), 'case-studies'));
router.post('/style-hero-image', handleUpload(createUpload(uploadDirs.style), 'style'));
router.post('/popup-image', handleUpload(createUpload(uploadDirs.popup), 'popup'));
router.post('/blog-image', handleUpload(createUpload(uploadDirs.blog), 'blog'));

export default router;
