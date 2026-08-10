const Setting = require("../models/Setting");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const {
      websiteName,
      contactEmail,
      currency,
      watermarkEnabled,
      watermarkText,
      premiumDownloadOnly,
      maintenanceMode,
    } = req.body;

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting();
    }

    settings.websiteName = websiteName ?? settings.websiteName;
    settings.contactEmail = contactEmail ?? settings.contactEmail;
    settings.currency = currency ?? settings.currency;
    settings.watermarkEnabled = watermarkEnabled ?? settings.watermarkEnabled;
    settings.watermarkText = watermarkText ?? settings.watermarkText;
    settings.premiumDownloadOnly = premiumDownloadOnly ?? settings.premiumDownloadOnly;
    settings.maintenanceMode = maintenanceMode ?? settings.maintenanceMode;

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};
