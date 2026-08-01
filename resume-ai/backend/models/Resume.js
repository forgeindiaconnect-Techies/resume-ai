const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume'
  },
  templateId: {
    type: String,
    default: 'modern'
  },
  personalInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    summary: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    title: { type: String, default: '' }
  },
  experience: [{
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    duration: { type: String, default: '' },
    desc: { type: String, default: '' }
  }],
  education: [{
    degree: { type: String, default: '' },
    school: { type: String, default: '' },
    location: { type: String, default: '' },
    year: { type: String, default: '' },
    desc: { type: String, default: '' }
  }],
  projects: [{
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    duration: { type: String, default: '' },
    desc: { type: String, default: '' },
    link: { type: String, default: '' }
  }],
  skills: [{ type: String }],
  languages: [{ type: String }],
  certificates: [{ type: String }],
  premium: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
