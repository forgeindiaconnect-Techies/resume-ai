const mongoose = require("mongoose");

const resumeExampleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
    resumeFile: {
      type: String,
      default: "",
    },
    resumeData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeExample", resumeExampleSchema);
