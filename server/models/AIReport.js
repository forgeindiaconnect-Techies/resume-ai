const mongoose = require("mongoose");

const aiReportSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  resumeScore: { type: Number, default: 0 },
  atsScore: { type: Number, default: 0 },
  grammar: { type: Number, default: 0 },
  keywords: { type: Number, default: 0 },
  formatting: { type: Number, default: 0 },
  suggestions: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("AIReport", aiReportSchema);
