const mongoose = require("mongoose");

const temporaryResumeSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  resumeData: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TemporaryResume", temporaryResumeSchema);
