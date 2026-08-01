const mongoose = require('mongoose');

const ResumeLayoutSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
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
