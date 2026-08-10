const mongoose = require('mongoose');

const ResumeLayoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Make it optional to avoid breaking existing documents, we can set true if needed later but for admin templates it's required
  },
  category: {
    type: String,
    default: "Professional",
  },
  description: {
    type: String,
    default: "",
  },
  previewImage: {
    type: String,
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: false
  },
  layout: {
    type: String,
    default: 'Modern'
  },
  columns: {
    type: Number,
    default: 2
  },
  header: {
    type: String,
    default: 'top'
  },
  sidebar: {
    type: String,
    default: 'left'
  },
  color: {
    type: String,
    default: '#7c3aed'
  },
  font: {
    type: String,
    default: "'Inter', sans-serif"
  },
  fontSize: {
    type: String,
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.ResumeLayout || mongoose.model('ResumeLayout', ResumeLayoutSchema);
