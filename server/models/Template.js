const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      default: "General",
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    previewImage: {
      type: String,
      default: "",
    },
    atsScore: {
      type: Number,
      default: 95,
    },
    layout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeLayout",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Template || mongoose.model("Template", templateSchema);
