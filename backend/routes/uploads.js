import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Create directory if not exists
const teamDir = path.join(__dirname, '../../frontend/public/uploads/team');
if (!fs.existsSync(teamDir)) {
  fs.mkdirSync(teamDir, { recursive: true });
}

const caseStudyDir = 'public/uploads/case-studies';
if (!fs.existsSync(caseStudyDir)) {
  fs.mkdirSync(caseStudyDir, { recursive: true });
}

const styleDir = 'public/uploads/style';
if (!fs.existsSync(styleDir)) {
  fs.mkdirSync(styleDir, { recursive: true });
}

const popupDir = 'public/uploads/popup';
if (!fs.existsSync(popupDir)) {
  fs.mkdirSync(popupDir, { recursive: true });
}

const blogDir = 'public/uploads/blog';
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/uploads/team');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const caseStudyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/case-studies');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const styleHeroStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/style');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const PopupoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/popup');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});
const blogImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/blog');
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
