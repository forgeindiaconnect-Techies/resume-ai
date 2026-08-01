const mongoose = require('mongoose');

const resumeExampleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      default: 'Software Engineering',
      trim: true,
    },
    experienceLevel: {
      type: String,
      default: '2-5 Years',
    },
    template: {
      type: String,
      default: 'modern',
    },
    previewImage: {
      type: String,
      default: '',
    },
    atsScore: {
      type: Number,
      default: 95,
    },
    description: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    resumeData: {
      personalInfo: {
        fullName: { type: String, default: '' },
        role: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        summary: { type: String, default: '' },
      },
      summary: { type: String, default: '' },
      skills: {
        type: [String],
        default: [],
      },
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          desc: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          tenure: String,
          cgpa: String,
        },
      ],
      projects: [
        {
          title: String,
          technology: String,
          desc: String,
        },
      ],
      certifications: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ResumeExample', resumeExampleSchema);
