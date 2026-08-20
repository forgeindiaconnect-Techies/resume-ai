const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      default: null,
    },

    guestId: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      default: null,
    },

    resumeId: {
      type: String,
      default: null,
    },
    resumeName: {
      type: String,
      default: null,
    },

    downloadType: {
      type: String,
      enum: ["watermarked", "no_watermark"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    downloadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Download", downloadSchema);
