const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['request', 'approval', 'admin', 'message'], required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  demande: { type: mongoose.Schema.Types.ObjectId, ref: 'Demande' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
