const express = require("express");
const Setting = require("../models/Setting");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    // Only return non-sensitive settings to public users
    res.json({
      success: true,
      settings: {
        websiteName: settings.websiteName,
        watermarkEnabled: settings.watermarkEnabled,
        watermarkText: settings.watermarkText,
        maintenanceMode: settings.maintenanceMode,
        currency: settings.currency,
      },
    });
  } catch (error) {
    console.error("Public get settings error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch settings" });
  }
});

module.exports = router;
