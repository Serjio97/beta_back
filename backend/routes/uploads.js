import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create directory if not exists
const teamDir = path.join(__dirname, '../../frontend/public/uploads/team');
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

const caseStudyDir = path.join(__dirname, '../../frontend/public/uploads/case-studies');
if (!fs.existsSync(caseStudyDir)) {
  fs.mkdirSync(caseStudyDir, { recursive: true });
}

const styleDir = path.join(__dirname, '../../frontend/public/uploads/style');
if (!fs.existsSync(styleDir)) {
  fs.mkdirSync(styleDir, { recursive: true });
}

const popupDir = path.join(__dirname, '../../frontend/public/uploads/popup');
if (!fs.existsSync(popupDir)) {
  fs.mkdirSync(popupDir, { recursive: true });
}

const blogDir = path.join(__dirname, '../../frontend/public/uploads/blog');
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

// Multer storage setups
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

const upload = multer({ storage: createStorage(teamDir) });
const caseStudyUpload = multer({ storage: createStorage(caseStudyDir) });
const styleUpload = multer({ storage: createStorage(styleDir) });
const popupUpload = multer({ storage: createStorage(popupDir) });
const blogUpload = multer({ storage: createStorage(blogDir) });

// Upload routes
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
