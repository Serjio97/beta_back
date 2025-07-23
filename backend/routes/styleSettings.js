import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET style settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM style_settings WHERE id = 1');
    if (!rows[0]) {
      return res.status(404).json({ error: 'Style settings not found' });
    }
    const row = rows[0];
    res.json({
      hero_type: row.hero_type,
      hero_image: row.hero_image,
      hero_video_url: row.hero_video_url,
      running_text_companies: JSON.parse(row.running_text_companies || '[]'),
      collaborators: JSON.parse(row.collaborators || '[]'),
    });
  } catch (err) {
    console.error('Failed to fetch style settings:', err);
    res.status(500).json({ error: 'Failed to fetch style settings' });
  }
});

// PUT to update settings
router.put('/', async (req, res) => {
  const { heroType, heroImage, heroVideoUrl, runningTextCompanies, collaborators } = req.body;

  try {
    await db.execute(
      'UPDATE style_settings SET hero_type = ?, hero_image = ?, hero_video_url = ?, running_text_companies = ?, collaborators = ? WHERE id = 1',
      [
        heroType,
        heroImage || '',
        heroVideoUrl || '',
        JSON.stringify(runningTextCompanies || []),
        JSON.stringify(collaborators || []),
      ]
    );
    res.json({ message: 'Style settings updated' });
  } catch (err) {
    console.error('Failed to update style settings:', err);
    res.status(500).json({ error: 'Failed to update style settings' });
  }
});

export default router;
