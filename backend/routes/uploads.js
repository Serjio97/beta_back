import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Use /tmp/uploads as safe writable base
const uploadsBaseDir = '/tmp/uploads';
const folders = ['team', 'case-studies', 'style', 'popup', 'blog'];

// ✅ Create /tmp/uploads/{folder}
folders.forEach((folder) => {
  const dir = path.join(uploadsBaseDir, folder);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created safe upload dir: ${dir}`);
    }
  } catch (err) {
    console.error(`❌ Error creating upload dir "${folder}":`, err);
  }
});

// ✅ Allow only image files
const imageFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files are allowed.'));
};

// ✅ Reusable multer uploader
const createUpload = (folder) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(uploadsBaseDir, folder)),
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
      }
    }),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
  });

// ✅ Wrapper for routes
const handleUpload = (upload, folder) => (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error(`❌ Upload failed for ${folder}:`, err.message);
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.status(200).json({ url: `/uploads/${folder}/${req.file.filename}` });
  });
};

// ✅ Routes
router.post('/team-image', handleUpload(createUpload('team'), 'team'));
router.post('/case-study-image', handleUpload(createUpload('case-studies'), 'case-studies'));
router.post('/style-hero-image', handleUpload(createUpload('style'), 'style'));
router.post('/popup-image', handleUpload(createUpload('popup'), 'popup'));
router.post('/blog-image', handleUpload(createUpload('blog'), 'blog'));

export default router;
