const mongoose = require('mongoose');

const DownloadHistorySchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.DownloadHistory || mongoose.model('DownloadHistory', DownloadHistorySchema);
