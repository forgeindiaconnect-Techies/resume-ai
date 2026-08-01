import mongoose from 'mongoose';

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
  
  // Interview Integration
  interview: {
    token: String,
    date: String,
    time: String,
    meetLink: String
  },
  
  // Persistence
  timestamp: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Avoid OverwriteModelError in serverless environments
export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
