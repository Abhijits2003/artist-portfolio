const mongoose = require('mongoose');

const processStepSchema = new mongoose.Schema(
  { title: { type: String, trim: true }, description: { type: String, trim: true } },
  { _id: false }
);

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    story: { type: String, default: '' },
    artistNote: { type: String, default: '' },
    aspectRatio: { type: Number, min: 0.1, max: 10 },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length >= 1 && v.length <= 10,
        message: 'An artwork needs between 1 and 10 images.',
      },
    },
    category: { type: String, default: 'Other' },
    medium: { type: String, default: '' },
    year: Number,
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    process: { type: [processStepSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artwork', artworkSchema);
