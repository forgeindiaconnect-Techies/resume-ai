const mongoose = require('mongoose');

const ResumeSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestId: {
    type: String,
    default: null
  },
  templateId: {
    type: String,
    required: true,
    default: 'modern-blue'
  },
  jobRole: {
    type: String,
    required: true,
    default: 'React Developer'
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeSession', ResumeSessionSchema);
