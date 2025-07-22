import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ✅ Base path in safe writable directory
const safeUploadsBaseDir = '/tmp/uploads';
const publicBaseDir = path.resolve(__dirname, '../../frontend/public/uploads');

// ✅ Folder names
const folders = ['team', 'case-studies', 'style', 'popup', 'blog'];

// ✅ Create /tmp/uploads/{folder} and symlink to /frontend/public/uploads/{folder}
folders.forEach((folder) => {
  const target = path.join(safeUploadsBaseDir, folder);
  const symlink = path.join(publicBaseDir, folder);

  try {
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
      console.log(`✅ Created safe upload dir: ${target}`);
    }

    if (!fs.existsSync(symlink)) {
      // Ensure /frontend/public/uploads exists
      fs.mkdirSync(publicBaseDir, { recursive: true });

      // Create symbolic link
      fs.symlinkSync(target, symlink, 'dir');
      console.log(`🔗 Linked ${symlink} → ${target}`);
    }
  } catch (err) {
    console.error(`❌ Error setting up folder "${folder}":`, err);
  }
});

// ✅ Image filter
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'));
  }
};

// ✅ Create multer instance
const createUpload = (folder) =>
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(safeUploadsBaseDir, folder)),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
      },
    }),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  });

// ✅ Upload route handler
const handleUpload = (uploadMiddleware, folder) =>
  (req, res) => {
    uploadMiddleware.single('image')(req, res, (err) => {
      if (err) {
        console.error(`❌ Upload error in ${folder}:`, err.message);
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
