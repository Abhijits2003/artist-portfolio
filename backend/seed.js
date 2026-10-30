
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Artwork = require('./models/Artwork');
const imageSize = require('./utils/imageSize');
const artworks = require('./data/artworks');

const PUBLIC_DIR = path.join(__dirname, '..', 'frontend', 'public');

(async () => {
  await connectDB();
  let failed = 0;
  for (const raw of artworks) {
    try {
      const { likes, views, ...fields } = raw;
      fields.slug = String(fields.slug || '').toLowerCase().trim();
      if (!fields.slug) throw new Error('missing slug');
      if (!fields.aspectRatio && fields.images?.[0]) {
        const dims = imageSize(path.join(PUBLIC_DIR, fields.images[0]));
        if (dims) fields.aspectRatio = Number((dims.width / dims.height).toFixed(4));
        else console.warn(`  ! cover image not found or unreadable: frontend/public${fields.images[0]}`);
      }

      const res = await Artwork.updateOne(
        { slug: fields.slug },
        { $set: fields, $setOnInsert: { likes: likes || 0, views: views || 0 } },
        { upsert: true, runValidators: true }
      );
      console.log(`${res.upsertedCount ? 'Created' : 'Updated'}: ${fields.slug}`);
    } catch (err) {
      failed += 1;
      console.error(`Failed: ${raw.slug || raw.title} - ${err.message}`);
    }
  }
  await mongoose.disconnect();
  process.exit(failed ? 1 : 0);
})();
