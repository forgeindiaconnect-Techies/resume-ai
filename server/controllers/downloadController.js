const Download = require("../models/Download");
const Payment = require("../models/Payment");
const Resume = require("../models/Resume");
const mongoose = require("mongoose");

exports.downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required",
      });
    }

    // 1. Find the resume
    const idFilter = [];
    if (mongoose.Types.ObjectId.isValid(resumeId)) {
      idFilter.push({ _id: resumeId });
    }
    idFilter.push({ resumeId });

    const resume = await Resume.findOne({ $or: idFilter });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // 2. Find successful payment for this resume
    const payment = await Payment.findOne({
      $or: [
        { resumeReference: resumeId },
        { resumeId: resume._id }
      ],
      status: "paid",
      downloadAllowed: true,
    });

    if (!payment) {
      return res.status(403).json({
        success: false,
        message: "Payment required before download",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Download allowed",
      resumeId,
      paymentId: payment.razorpayPaymentId || payment._id,
    });

  } catch (error) {
    console.error("Download error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process download",
      error: error.message
    });
  }
};

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
