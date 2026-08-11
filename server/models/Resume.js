const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    default: 'Untitled Resume'
  },
  templateId: {
    type: String,
    default: 'modern'
  },
  personalInfo: { type: mongoose.Schema.Types.Mixed, default: {} },
  experience: { type: mongoose.Schema.Types.Mixed, default: [] },
  education: { type: mongoose.Schema.Types.Mixed, default: [] },
  projects: { type: mongoose.Schema.Types.Mixed, default: [] },
  skills: { type: mongoose.Schema.Types.Mixed, default: [] },
  languages: { type: mongoose.Schema.Types.Mixed, default: [] },
  certificates: { type: mongoose.Schema.Types.Mixed, default: [] },
  customSections: { type: mongoose.Schema.Types.Mixed, default: [] },
  premium: { type: Boolean, default: false },
  layout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeLayout'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  downloadAllowed: {
    type: Boolean,
    default: false
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
