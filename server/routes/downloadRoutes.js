const express = require("express");
const router = express.Router();
const Download = require("../models/Download");
const DownloadPlan = require("../models/DownloadPlan");

// SAVE DOWNLOAD
router.post("/", async (req, res) => {
  try {
    const {
      sessionId,
      guestId,
      email,
      resumeId,
      resumeName,
      downloadType
    } = req.body;

    if (!downloadType) {
      return res.status(400).json({
        success: false,
        message: "downloadType is required"
      });
    }

    const plan = await DownloadPlan.findOne({
      key: downloadType,
      isActive: true
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Download plan not found"
      });
    }

    const download = await Download.create({
      sessionId: sessionId || null,
      guestId: guestId || null,
      email: email || null,
      resumeId: resumeId || null,
      resumeName: resumeName || null,

      downloadType: plan.key,

      amount: plan.price,

      downloadedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      download
    });

  } catch (error) {
    console.error("SAVE DOWNLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save download",
      error: error.message
    });
  }
});

// ADMIN GET DOWNLOADS
router.get("/", async (req, res) => {
  try {
    const downloads = await Download.find()
      .sort({ downloadedAt: -1 });

    return res.status(200).json({
      success: true,
      count: downloads.length,
      downloads
    });

  } catch (error) {
    console.error("GET DOWNLOADS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load downloads"
    });
  }
});

// TEMPORARY INJECT TEST DATA ROUTE
router.get("/inject-test", async (req, res) => {
  try {
    await Download.create({
      sessionId: "test-session",
      guestId: "Guest_101",
      email: "test_insert@gmail.com",
      resumeId: "test-resume",
      downloadType: "watermarked",
      amount: 99,
      downloadedAt: new Date()
    });
    return res.send("<h1>Test download injected! Go check your Admin Dashboard!</h1>");
  } catch (err) {
    return res.send("<h1>Error injecting: " + err.message + "</h1>");
  }
});

module.exports = router;
