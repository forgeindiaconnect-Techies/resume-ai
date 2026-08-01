const mongoose = require('mongoose');

const ResumeSectionSchema = new mongoose.Schema({
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeTemplate',
    required: true
  },
  section: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ResumeSection', ResumeSectionSchema);
