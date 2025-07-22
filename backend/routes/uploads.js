import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Create directory if not exists
const teamDir = path.join(__dirname, '../../frontend/public/uploads/team');
console.log('teamDir:', teamDir);
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

const caseStudyDir = path.join(__dirname, '../../frontend/public/uploads/case-studies');
console.log('caseStudyDir:', caseStudyDir);
if (!fs.existsSync(caseStudyDir)) {
  fs.mkdirSync(caseStudyDir, { recursive: true });
}

const styleDir = path.join(__dirname, '../../frontend/public/uploads/style');
console.log('styleDir:', styleDir);
if (!fs.existsSync(styleDir)) {
  fs.mkdirSync(styleDir, { recursive: true });
}

const popupDir = path.join(__dirname, '../../frontend/public/uploads/popup');
console.log('popupDir:', popupDir);
if (!fs.existsSync(popupDir)) {
  fs.mkdirSync(popupDir, { recursive: true });
}

const blogDir = path.join(__dirname, '../../frontend/public/uploads/blog');
console.log('blogDir:', blogDir);
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, teamDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const caseStudyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, caseStudyDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const styleHeroStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, styleDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const PopupoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, popupDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const blogImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
const caseStudyUpload = multer({ storage: caseStudyStorage });
const styleUpload = multer({ storage: styleHeroStorage });
const popupUpload = multer({ storage: PopupoStorage });
const blogUpload = multer({ storage: blogImageStorage });

// Endpoint: POST /api/uploads/team-image
router.post('/team-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/team/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

// Endpoint: POST /api/uploads/case-study-image
router.post('/case-study-image', caseStudyUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/case-studies/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});
// Route for style hero image upload
router.post('/style-hero-image', styleUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/style/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

// ✅ Popup
router.post('/popup-image', popupUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/popup/${req.file.filename}` });
});

router.post('/blog-image', blogUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.status(200).json({ url: `/uploads/blog/${req.file.filename}` });
});



export default router;
