import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import servicesRoutes from './routes/services.js';
import productsRoutes from './routes/products.js';
import fundsRoutes from './routes/funds.js';
import caseStudiesRoutes from './routes/case-studies.js';
import blogPostsRoutes from './routes/blog-posts.js';
import eventsRoutes from './routes/events.js';
import contactMessagesRoutes from './routes/contact-messages.js';
import teamRoutes from './routes/team-members.js';
import resourcesRoutes from './routes/resources.js';
import programApplicationsRoutes from './routes/program-applications.js';
import consultingRoutes from './routes/consulting.js';
import uploadsRoutes from './routes/uploads.js';
import adminRoutes from './routes/admins.js';
import popupRoutes from './routes/popup.js';
import collaboratorsRoutes from './routes/collaborators.js';
import runningTextRoutes from './routes/runningText.js';
import styleSettingsRoutes from './routes/styleSettings.js';

import db from './db.js';

const app = express();
const PORT = 3100;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve uploaded files statically
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '../frontend/public/uploads'))
);

// ✅ API routes
app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/funds', fundsRoutes);
app.use('/api/case-studies', caseStudiesRoutes);
app.use('/api/blog-posts', blogPostsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/contact-messages', contactMessagesRoutes);
app.use('/api/team-members', teamRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/program-applications', programApplicationsRoutes);
app.use('/api/consulting', consultingRoutes);
app.use('/api/popup', popupRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/collaborators', collaboratorsRoutes);
app.use('/api/running-text', runningTextRoutes);
app.use('/api/style-settings', styleSettingsRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('CMS API is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
