// models/Bouquet.js
const mongoose = require('mongoose');

const bouquetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a bouquet name'],
    trim: true
  },
  description: String,
  basePrice: {
    type: Number,
    required: true
  },
  images: [String],
  flowers: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'premium'],
    default: 'medium'
  },
  occasion: [String],
  colors: [String],
  style: {
    type: String,
    enum: ['traditional', 'modern', 'rustic', 'luxury', 'minimalist']
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  careInstructions: String,
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bouquet', bouquetSchema);