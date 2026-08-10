const Download = require("../models/Download");

exports.getAllDownloads = async (req, res) => {
  try {
    const downloads = await Download.find()
      .populate("userId", "name email")
      .populate("resumeId", "title")
      .populate("planId", "name")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      downloads,
    });
  } catch (error) {
    console.error("Get downloads error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch downloads",
    });
  }
};
