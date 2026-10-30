const mongoose = require('mongoose');
const Commission = require('../models/Commission');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUSES = ['pending', 'in-progress', 'completed', 'cancelled'];


exports.createCommission = async (req, res) => {
  try {
    const { name, email, artworkType, style, budget, deadline, message, referenceImage } = req.body;
    if (!name?.trim() || !email?.trim() || !artworkType?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Name, email, artwork type and message are required.' });
    }
    if (!EMAIL_RE.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    await Commission.create({ name, email, artworkType, style, budget, deadline, message, referenceImage });
    res.status(201).json({ message: 'Commission request received.' });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
    res.status(500).json({ message: 'Could not save your request. Please try again.' });
  }
};


exports.getCommissions = async (req, res) => {
  try {
    res.json(await Commission.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    res.status(500).json({ message: 'Could not load commissions.' });
  }
};

exports.updateCommission = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid id.' });
    if (!STATUSES.includes(req.body.status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUSES.join(', ')}.` });
    }
    const doc = await Commission.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Commission not found.' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Could not update commission.' });
  }
};
