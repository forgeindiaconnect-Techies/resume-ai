const mongoose = require('mongoose');

const ResumeTemplateSchema = new mongoose.Schema({
  jobRoleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRole',
    required: true
  },
  templateName: {
    type: String,
    required: true,
    trim: true
  },
  previewImage: {
    type: String,
    default: ''
  },
  layout: {
    type: String,
    required: true,
    default: 'modern-blue'
  },
  premium: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeTemplate', ResumeTemplateSchema);
