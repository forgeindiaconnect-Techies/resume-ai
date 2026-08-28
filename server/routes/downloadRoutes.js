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

    const isFree = downloadType === "free_watermark" || downloadType === "watermarked";

    let plan = await DownloadPlan.findOne({
      $or: [
        { key: downloadType },
        ...(downloadType === "free_watermark" ? [{ key: "watermarked" }] : []),
        ...(downloadType === "watermarked" ? [{ key: "free_watermark" }] : [])
      ],
      isActive: true
    });

    if (!plan) {
      plan = {
        key: downloadType,
        price: isFree ? 0 : (downloadType === "no_watermark" ? 199 : 0),
        watermarkRemoval: downloadType === "no_watermark"
      };
    }

    const download = await Download.create({
      sessionId: sessionId || null,
      guestId: guestId || null,
      email: email || null,
      resumeId: resumeId || null,
      resumeName: resumeName || null,
      downloadType: plan.key || downloadType,
      amount: isFree ? 0 : (plan.price || 0),
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
    const Download = require("../models/Download");
    const Payment = require("../models/Payment");

    const [downloads, payments] = await Promise.all([
      Download.find().sort({ downloadedAt: -1 }).lean().catch(() => []),
      Payment.find({ $or: [{ status: "paid" }, { status: "free" }, { downloadUsed: true }, { downloadAllowed: true }] }).sort({ createdAt: -1 }).lean().catch(() => [])
    ]);

    const merged = [...downloads];
    const existingKeys = new Set(
      downloads.map(d => `${(d.email || '').toLowerCase()}_${d.resumeName || ''}`)
    );

    payments.forEach(p => {
      const email = (p.email || '').toLowerCase();
      const key = `${email}_${p.resumeName || ''}`;
      if (!existingKeys.has(key)) {
        merged.push({
          _id: p._id,
          sessionId: p.resumeReference || null,
          guestId: null,
          email: p.email || "user@example.com",
          resumeId: p.resumeReference || "RESUME_EXPORT",
          resumeName: p.resumeName || "Resume Candidate",
          downloadType: p.plan || (p.watermarkRemoval ? "no_watermark" : "watermarked"),
          amount: p.amount || 0,
          downloadedAt: p.downloadedAt || p.createdAt || new Date()
        });
      }
    });

    merged.sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));

    return res.status(200).json({
      success: true,
      count: merged.length,
      downloads: merged
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
