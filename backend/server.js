import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import uploadsRoutes from './routes/uploads.js';
// (and the rest of your routes…)

const app = express();
const PORT = 3100;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve directly from /tmp/uploads
app.use('/uploads', express.static('/tmp/uploads'));

// ✅ Routes
app.use('/api/uploads', uploadsRoutes);
// (and all other routes…)

app.get('/', (req, res) => {
  res.send('CMS API is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
