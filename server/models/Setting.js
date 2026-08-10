const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: "AI Resume Builder",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "INR",
    },
    watermarkEnabled: {
      type: Boolean,
      default: true,
    },
    watermarkText: {
      type: String,
      default: "Created with AI Resume Builder",
    },
    premiumDownloadOnly: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
