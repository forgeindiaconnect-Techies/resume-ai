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

    let plan = await DownloadPlan.findOne({
      key: downloadType,
      isActive: true
    });

    if (!plan) {
      // Auto-create default plans if they don't exist for testing
      const defaultPlans = [
        { name: "With Watermark", key: "watermarked", price: 99, watermarkRemoval: false, isActive: true },
        { name: "Without Watermark", key: "no_watermark", price: 199, watermarkRemoval: true, isActive: true }
      ];
      
      for (const p of defaultPlans) {
        try {
          const exists = await DownloadPlan.findOne({ key: p.key });
          if (!exists) {
            await DownloadPlan.create(p);
          }
        } catch (e) {
          console.error("Error creating plan:", e);
        }
      }

      plan = await DownloadPlan.findOne({
        key: downloadType
      });

      if (!plan) {
        // Hard fallback to prevent 404s breaking the UI test
        plan = {
          key: downloadType,
          price: downloadType === "no_watermark" ? 199 : 99,
          watermarkRemoval: downloadType === "no_watermark"
        };
      }
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

    // Also update UserSession to keep admin users/activity in sync
    try {
      const UserSession = require("../models/UserSession");
      const sessionQuery = [];
      if (sessionId) sessionQuery.push({ sessionId });
      if (guestId) sessionQuery.push({ guestId });
      if (email) sessionQuery.push({ email: email.trim().toLowerCase() });

      if (sessionQuery.length > 0) {
        await UserSession.updateMany(
          { $or: sessionQuery },
          {
            $set: {
              ...(resumeName ? { resumeName } : {}),
              ...(email ? { email: email.trim().toLowerCase() } : {}),
              downloaded: true,
              downloadType: plan.key,
              downloadedAt: new Date(),
              resumeCreated: true,
              ...(resumeId ? { resumeId } : {})
            }
          }
        );
      }
    } catch (sessionErr) {
      console.warn("UserSession sync warning on download:", sessionErr.message);
    }

    // Also record in Payment collection for Admin Payments sync
    try {
      const Payment = require("../models/Payment");
      await Payment.create({
        resumeReference: resumeId || sessionId,
        resumeName: resumeName || guestId || "Resume User",
        email: email || `${guestId || "user"}@example.com`,
        plan: plan.key,
        amount: plan.price,
        status: "paid",
        downloadAllowed: true,
        downloadUsed: true,
        downloadedAt: new Date(),
        watermarkRemoval: plan.key === "no_watermark"
      });
    } catch (paymentErr) {
      console.warn("Payment sync warning on download:", paymentErr.message);
    }

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
