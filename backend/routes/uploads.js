import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Safely resolve project root and upload base directory
const projectRoot = path.resolve(__dirname, '..'); // goes to /workspace
const uploadsBaseDir = path.join(projectRoot, 'frontend', 'public', 'uploads');

const teamDir = path.join(uploadsBaseDir, 'team');
const caseStudyDir = path.join(uploadsBaseDir, 'case-studies');
const styleDir = path.join(uploadsBaseDir, 'style');
const popupDir = path.join(uploadsBaseDir, 'popup');
const blogDir = path.join(uploadsBaseDir, 'blog');

// ✅ Create directories safely
[teamDir, caseStudyDir, styleDir, popupDir, blogDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  } catch (err) {
    console.error(`❌ Failed to create directory ${dir}:`, err);
  }
});

// ✅ Create reusable multer storage function
const createStorage = (destinationDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, destinationDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    }
  });

const upload = multer({ storage: createStorage(teamDir) });
const caseStudyUpload = multer({ storage: createStorage(caseStudyDir) });
const styleUpload = multer({ storage: createStorage(styleDir) });
const popupUpload = multer({ storage: createStorage(popupDir) });
const blogUpload = multer({ storage: createStorage(blogDir) });

// ✅ Upload endpoints
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
