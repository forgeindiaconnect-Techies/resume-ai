const mongoose = require('mongoose');

const ResumeTemplateSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  template: {
    type: String,
    required: true,
    default: 'Modern'
  },
  previewImage: {
    type: String,
    default: ''
  },
  resumeJson: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {}
  },
  atsScore: {
    type: Number,
    required: true,
    default: 90
  },
  premium: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

// Ensure unique job titles within a category
ResumeTemplateSchema.index({ category: 1, jobTitle: 1 }, { unique: true });

module.exports = mongoose.model('ResumeTemplate', ResumeTemplateSchema);
