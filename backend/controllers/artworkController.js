const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');

const idFilter = (param) =>
  mongoose.Types.ObjectId.isValid(param) ? { _id: param } : { slug: String(param).toLowerCase() };


exports.getArtworks = async (req, res) => {
  try {
    res.json(await Artwork.find().sort({ createdAt: -1 }).lean());
  } catch (err) {
    res.status(500).json({ message: 'Could not load artworks.' });
  }
};

exports.getArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findOne(idFilter(req.params.id)).lean();
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: 'Could not load artwork.' });
  }
};

exports.likeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findOneAndUpdate(
      idFilter(req.params.id),
      { $inc: { likes: 1 } },
      { new: true, timestamps: false }
    ).lean();
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    res.json({ likes: artwork.likes });
  } catch (err) {
    res.status(500).json({ message: 'Could not like artwork.' });
  }
};

exports.unlikeArtwork = async (req, res) => {
  try {
    let artwork = await Artwork.findOneAndUpdate(
      { ...idFilter(req.params.id), likes: { $gt: 0 } },
      { $inc: { likes: -1 } },
      { new: true, timestamps: false }
    ).lean();
    if (!artwork) artwork = await Artwork.findOne(idFilter(req.params.id)).lean();
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    res.json({ likes: artwork.likes });
  } catch (err) {
    res.status(500).json({ message: 'Could not unlike artwork.' });
  }
};

exports.viewArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findOneAndUpdate(
      idFilter(req.params.id),
      { $inc: { views: 1 } },
      { new: true, timestamps: false }
    ).lean();
    if (!artwork) return res.status(404).json({ message: 'Artwork not found.' });
    res.json({ views: artwork.views });
  } catch (err) {
    res.status(500).json({ message: 'Could not register view.' });
  }
};
