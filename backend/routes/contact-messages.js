import express from 'express';
import db from '../db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'khammaramin@gmail.com',      // ✅ your default sender email
    pass: 'bket hmtc sbjs ppbz',            // ⚠️ NOT your Gmail password — use App Password or real SMTP password
  }
});

// GET /api/contact-messages
router.get('/', async (req, res) => {
  try {
    const [messages] = await db.execute('SELECT * FROM contact_messages ORDER BY timestamp DESC');
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

// GET /api/contact-messages/:id
router.get('/:id', async (req, res) => {
  try {
    const [messages] = await db.execute('SELECT * FROM contact_messages WHERE id = ?', [req.params.id]);
    if (messages.length === 0) {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    res.json(messages[0]);
  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({ error: 'Failed to fetch contact message' });
  }
});

import { v4 as uuidv4 } from 'uuid'; // install with: npm i uuid

// Helper to convert to MySQL DATETIME format
function toMySQLDatetime(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// POST /api/contact-messages
router.post('/', async (req, res) => {
  try {
    console.log('[POST] Contact Message Payload:', req.body);

    const { name, email, subject, message, timestamp, status } = req.body;
    const id = uuidv4();

    const now = new Date();
    const mysqlTimestamp = toMySQLDatetime(timestamp || now);
    const mysqlCreatedAt = toMySQLDatetime(now);
    const mysqlUpdatedAt = toMySQLDatetime(now);

    await db.execute(
      'INSERT INTO contact_messages (id, name, email, subject, message, status, timestamp, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id,
        name,
        email,
        subject,
        message,
        status || 'unread',
        mysqlTimestamp,
        mysqlCreatedAt,
        mysqlUpdatedAt,
      ]
    );


// Send email to default recipient
    const mailOptions = {
      from: 'khammaramin@gmail.com',            // sender
      to: 'gamerwaymin@gmail.com',                // 📩 recipient
      subject: `New Contact Message: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    const [newMessage] = await db.execute('SELECT * FROM contact_messages WHERE id = ?', [id]);
    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('❌ Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});


// PUT /api/contact-messages/:id
router.put('/:id', async (req, res) => {
  try {
    const { name, email, subject, message, timestamp, status } = req.body;
    
    await db.execute(
      'UPDATE contact_messages SET name = ?, email = ?, subject = ?, message = ?, timestamp = ?, status = ? WHERE id = ?',
      [name, email, subject, message, timestamp, status, req.params.id]
    );
    
    const [updatedMessage] = await db.execute('SELECT * FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json(updatedMessage[0]);
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update contact message' });
  }
});

// DELETE /api/contact-messages/:id
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact message not found' });
    }
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

export default router;
