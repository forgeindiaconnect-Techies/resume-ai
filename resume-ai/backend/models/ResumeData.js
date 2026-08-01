const mongoose = require('mongoose');

const ResumeDataSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeSession',
    required: true,
    unique: true
  },
  personal: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  education: [
    {
      school: String,
      degree: String,
      department: String,
      cgpa: String,
      year: String
    }
  ],
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      desc: String
    }
  ],
  projects: [
    {
      name: String,
      technology: String,
      desc: String,
      github: String,
      liveDemo: String
    }
  ],
  skills: {
    programming: [String],
    frameworks: [String],
    databases: [String]
  },
  certificates: [
    {
      name: String,
      organization: String,
      year: String
    }
  ],
  languages: [String],
  achievements: [String]
}, { timestamps: true });

module.exports = mongoose.model('ResumeData', ResumeDataSchema);
