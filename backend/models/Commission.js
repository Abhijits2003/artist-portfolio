const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    artworkType: { type: String, required: true, trim: true },
    style: { type: String, trim: true, default: '' },
    budget: { type: String, trim: true, default: '' },
    deadline: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    referenceImage: { type: String, trim: true, default: '' }, 
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Commission', commissionSchema);
