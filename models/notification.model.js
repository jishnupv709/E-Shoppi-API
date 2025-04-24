const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },  // Add a 'read' field to track read status
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
