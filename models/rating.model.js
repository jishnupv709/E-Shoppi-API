const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  message: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
