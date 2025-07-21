import express from 'express';
import db from '../db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.sarraj@betawaves.io',      // ✅ your default sender email
    pass: 'dkwc tcqj ijmo hydi',            // ⚠️ NOT your Gmail password — use App Password or real SMTP password
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
      from: 'aymen.sarraj@betawaves.io',            // sender
      to: 'aymen.sarraj@betawaves.io',                // 📩 recipient
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

const companyEmailPattern = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com$|yahoo\.com$|hotmail\.com$|outlook\.com$|icloud\.com$)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!companyEmailPattern.test(email)) {
  return res.status(400).json({ error: 'Please use your company email address (no Gmail, Yahoo, Outlook, etc.)' });
}

  try {
    const response = await fetch('https://betawaves-back.4bzwio.easypanel.host/api/contact-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.program || formData.company || 'General Inquiry',
        message: formData.message,
        timestamp: new Date(),
        status: 'unread'
      }),
    });

    if (!response.ok) throw new Error('Failed to send message');

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      company: '',
      program: '',
      message: ''
    });
  } catch (error) {
    console.error('Submission error:', error);
    toast({
      title: 'Submission failed',
      description: 'There was a problem sending your message.',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
  }
};


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
