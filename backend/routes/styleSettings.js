import express from 'express';
import db from '../db.js';

const router = express.Router();

// GET style settings
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM style_settings WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    console.error('Failed to fetch style settings:', err);
    res.status(500).json({ error: 'Failed to fetch style settings' });
  }
});

// PUT to update settings
router.put('/', async (req, res) => {
  const { heroType, heroImage, heroVideoUrl } = req.body;

  try {
    await db.execute(
      'UPDATE style_settings SET hero_type = ?, hero_image = ?, hero_video_url = ? WHERE id = 1',
      [heroType, heroImage || '', heroVideoUrl || '']
    );
    res.json({ message: 'Style settings updated' });
  } catch (err) {
    console.error('Failed to update style settings:', err);
    res.status(500).json({ error: 'Failed to update style settings' });
  }
});

export default router;
