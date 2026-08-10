const ResumeExample = require("../models/ResumeExample");

exports.getActiveExamples = async (req, res) => {
  try {
    const examples = await ResumeExample.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .select("title category description previewImage views");

    res.json({
      success: true,
      examples,
    });
  } catch (error) {
    console.error("Get active examples error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume examples",
    });
  }
};
