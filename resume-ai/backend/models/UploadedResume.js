const mongoose = require("mongoose");

const uploadedResumeSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, default: "" },
  parsedText: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("UploadedResume", uploadedResumeSchema);
