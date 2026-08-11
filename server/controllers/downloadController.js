const Download = require("../models/Download");
const Payment = require("../models/Payment");
const Resume = require("../models/Resume");
const mongoose = require("mongoose");

exports.downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { email, paymentId, watermarkApplied, planId } = req.body;

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

    // 2. Find successful payment for this resume if paymentId is provided
    let payment = null;
    if (paymentId) {
      payment = await Payment.findOne({
        _id: paymentId,
        status: "paid"
      });
    } else {
      payment = await Payment.findOne({
        $or: [
          { resumeReference: resumeId },
          { resumeId: resume._id }
        ],
        status: "paid",
        downloadAllowed: true,
      }).sort({ createdAt: -1 });
    }

    if (!payment && req.body.requirePayment) {
      return res.status(403).json({
        success: false,
        message: "Payment required before download",
      });
    }

    // 3. Record the Download in Database
    const downloadRecord = await Download.create({
      userId: resume.userId || req.user?._id || null, 
      resumeId: resume._id,
      paymentId: payment ? payment._id : null,
      planId: planId || (payment ? payment.planId : null),
      email: email || "",
      watermarkApplied: watermarkApplied !== undefined ? watermarkApplied : (payment ? !payment.watermarkRemoval : true)
    });

    return res.status(200).json({
      success: true,
      message: "Download recorded",
      resumeId,
      downloadId: downloadRecord._id,
      paymentId: payment ? (payment.razorpayPaymentId || payment._id) : null,
      watermarkRemoval: payment ? payment.watermarkRemoval : false
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
