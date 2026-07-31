const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String, default: 'General' },
  status: { type: String, default: 'Applied' },
  fileName: { type: String },
  score: { type: Number, default: 0 },
  matchPercentage: { type: Number, default: 0 },
  
  // Analysis Results
  matchedSkills: [String],
  skills: [String],
  missingSkills: [String],
  strengths: [String],
  weaknesses: [String],
  reasons: [String],
  extractedText: { type: String },
  
  // Additional Personal Details
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  drivingLicense: { type: String },
  nationality: { type: String },
  placeOfBirth: { type: String },
  dateOfBirth: { type: String },
  
  // Interview Integration
  interview: {
    token: String,
    date: String,
    time: String,
    meetLink: String
  },
  
  notifications: [{
    id: { type: String },
    type: { type: String },
    message: { type: String },
    link: { type: String },
    date: { type: String }
  }],
  
  // Persistence
  timestamp: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
