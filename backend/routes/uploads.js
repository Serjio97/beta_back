import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Helper function to safely create directories
function createDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created directory: ${dirPath}`);
    }
  } catch (err) {
    console.error(`❌ Failed to create directory: ${dirPath}`, err);
  }
}

// Define upload directories (with correct relative path resolution)
const teamDir = path.resolve(__dirname, '../../frontend/public/uploads/team');
const caseStudyDir = path.resolve(__dirname, '../../frontend/public/uploads/case-studies');
const styleDir = path.resolve(__dirname, '../../frontend/public/uploads/style');
const popupDir = path.resolve(__dirname, '../../frontend/public/uploads/popup');
const blogDir = path.resolve(__dirname, '../../frontend/public/uploads/blog');

// Ensure directories exist
[teamDir, caseStudyDir, styleDir, popupDir, blogDir].forEach(createDirectory);

// Generic storage creator
const createStorage = (destinationDir) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destinationDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });

// Set up upload handlers
const upload = multer({ storage: createStorage(teamDir) });
const caseStudyUpload = multer({ storage: createStorage(caseStudyDir) });
const styleUpload = multer({ storage: createStorage(styleDir) });
const popupUpload = multer({ storage: createStorage(popupDir) });
const blogUpload = multer({ storage: createStorage(blogDir) });

// Routes
router.post('/team-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/team/${req.file.filename}` });
});

router.post('/case-study-image', caseStudyUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/case-studies/${req.file.filename}` });
});

router.post('/style-hero-image', styleUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/style/${req.file.filename}` });
});

router.post('/popup-image', popupUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/popup/${req.file.filename}` });
});

router.post('/blog-image', blogUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/blog/${req.file.filename}` });
});

export default router;
