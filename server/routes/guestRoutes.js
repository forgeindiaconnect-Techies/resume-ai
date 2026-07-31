const express = require("express");
const router = express.Router();
const GuestSession = require("../models/GuestSession");
const TemporaryResume = require("../models/TemporaryResume");

// POST /api/guest/session -> create temporary sessionId
router.post("/session", async (req, res) => {
  try {
    const sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await GuestSession.create({ sessionId });
    res.status(201).json({
      success: true,
      sessionId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to generate session" });
  }
});

// POST /api/resume/temp-save -> save draft guest resume data
router.post("/temp-save", async (req, res) => {
  try {
    const { sessionId, resumeData } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    let tempResume = await TemporaryResume.findOne({ sessionId });
    if (tempResume) {
      tempResume.resumeData = resumeData;
      tempResume.updatedAt = Date.now();
      await tempResume.save();
    } else {
      tempResume = await TemporaryResume.create({ sessionId, resumeData });
    }

    res.status(200).json({
      success: true,
      message: "Temporary resume draft saved",
      data: tempResume
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save draft" });
  }
});

// GET /api/resume/temp/:sessionId -> fetch draft guest resume data
router.get("/temp/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const tempResume = await TemporaryResume.findOne({ sessionId });
    if (!tempResume) {
      return res.status(444).json({ success: false, message: "No draft resume found for this session" });
    }
    res.status(200).json({
      success: true,
      data: tempResume.resumeData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error retrieving draft" });
  }
});

module.exports = router;
