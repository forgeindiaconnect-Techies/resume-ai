const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/start', sessionController.startSession);
router.post('/track', sessionController.trackEvent);
router.post('/end', sessionController.endSession);
router.get('/admin/all', sessionController.getAllSessions);
router.get("/admin/users-summary", async (req, res) => {
  try {
    const UserSession = require("../models/UserSession");
    const sessions = await UserSession.find().sort({ entryTime: 1 });

    const grouped = {};

    for (const session of sessions) {
      const key =
        session.userId?.toString() ||
        session.email ||
        session.guestId ||
        session.sessionId;

      if (!grouped[key]) {
        grouped[key] = {
          userId: session.userId || null,
          guestId: session.guestId || null,
          email: session.email || null,
          resumeName: session.resumeName || null,
          firstVisit: session.entryTime,
          lastVisit: session.lastActiveTime,
          totalSessions: 0,
          resumesCreated: 0,
          totalDownloads: 0,
          lastActivity: session.currentPage || "-"
        };
      }

      grouped[key].totalSessions += 1;

      if (session.resumeCreated) {
        grouped[key].resumesCreated += 1;
      }

      if (session.downloaded) {
        grouped[key].totalDownloads += 1;
      }

      if (session.resumeName) {
        grouped[key].resumeName = session.resumeName;
      }

      if (
        session.lastActiveTime &&
        new Date(session.lastActiveTime) > new Date(grouped[key].lastVisit)
      ) {
        grouped[key].lastVisit = session.lastActiveTime;
        grouped[key].lastActivity = session.currentPage || "-";
      }
    }

    return res.status(200).json({
      success: true,
      users: Object.values(grouped)
    });

  } catch (error) {
    console.error("Users summary error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load users summary"
    });
  }
});

router.post("/admin/cleanup-inactive", async (req, res) => {
  try {
    const UserSession = require("../models/UserSession");
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const result = await UserSession.updateMany(
      {
        status: "active",
        lastActiveTime: {
          $lt: fiveMinutesAgo
        }
      },
      {
        $set: {
          status: "exited",
          exitTime: new Date()
        }
      }
    );

    return res.status(200).json({
      success: true,
      updatedCount: result.modifiedCount || 0
    });

  } catch (error) {
    console.error("Inactive session cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clean inactive sessions"
    });
  }
});

router.delete("/clear-test-data", async (req, res) => {
  try {
    const UserSession = require("../models/UserSession");
    const Payment = require("../models/Payment");
    const Resume = require("../models/Resume");
    const Download = require("../models/Download");

    await UserSession.deleteMany({});
    await Payment.deleteMany({});
    await Resume.deleteMany({});
    await Download.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Admin dashboard test data cleared successfully"
    });

  } catch (error) {
    console.error("Clear test data error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear test data",
      error: error.message
    });
  }
});

module.exports = router;
