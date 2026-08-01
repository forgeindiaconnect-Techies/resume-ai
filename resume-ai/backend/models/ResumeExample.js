const mongoose = require('mongoose');

const ResumeExampleSchema = new mongoose.Schema({
  industryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Industry',
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    required: true,
    default: '2-5 Years'
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
  resumeScore: {
    type: Number,
    required: true,
    default: 90
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Ensure job titles are unique per industry category
ResumeExampleSchema.index({ industryId: 1, jobTitle: 1 }, { unique: true });

module.exports = mongoose.model('ResumeExample', ResumeExampleSchema);
