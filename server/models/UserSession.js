const mongoose = require("mongoose");

const userSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    resumeName: {
      type: String,
      default: null,
    },
    entryTime: {
      type: Date,
      default: Date.now,
    },
    lastActiveTime: {
      type: Date,
      default: Date.now,
    },
    exitTime: {
      type: Date,
      default: null,
    },
    currentPage: {
      type: String,
      default: "/",
    },
    resumeCreated: {
      type: Boolean,
      default: false,
    },
    resumeId: {
      type: String,
      default: null,
    },
    downloadType: {
      type: String,
      default: "none",
    },
    downloaded: {
      type: Boolean,
      default: false,
    },
    downloadedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "exited"],
      default: "active",
    },
    events: [
      {
        action: String,
        page: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserSession", userSessionSchema);
