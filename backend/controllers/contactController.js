const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES = ['unread', 'read', 'replied'];


exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }
    if (!EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent.' });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Could not send your message. Please try again.' });
  }
};


exports.getContacts = async (req, res) => {
  try {
    res.json(await Contact.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    res.status(500).json({ message: 'Could not load messages.' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid id.' });
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(', ')}.` });
    }
    const doc = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Message not found.' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Could not update message.' });
  }
};
