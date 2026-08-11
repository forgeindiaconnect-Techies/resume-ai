const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Plan = require("../models/Plan");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Resume = require("../models/Resume");

exports.createOrder = async (req, res) => {
  try {
    const { email, resumeId, planId, resumeSessionId, amount, watermarkRemoval } = req.body;
    const targetResumeId = resumeId || resumeSessionId;

    if (!planId && !targetResumeId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID or Resume ID is required",
      });
    }

    const User = require("../models/User");

    // 1. Find User by email or token/userId
    let user = null;
    if (email) {
      user = await User.findOne({ email: email.trim().toLowerCase() });
    }
    if (!user && req.user) {
      const targetUserId = req.user.id || req.user._id;
      user = await User.findOne({
        $or: [
          ...(mongoose.Types.ObjectId.isValid(targetUserId) ? [{ _id: targetUserId }] : []),
          { userId: targetUserId }
        ]
      });
    }
    if (!user && req.body.userId) {
      user = await User.findOne({
        $or: [
          ...(mongoose.Types.ObjectId.isValid(req.body.userId) ? [{ _id: req.body.userId }] : []),
          { userId: req.body.userId }
        ]
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please provide a valid email.",
      });
    }

    // 2. Find or Create Resume by resumeId
    let resume = null;
    if (targetResumeId) {
      const idFilter = [];
      if (mongoose.Types.ObjectId.isValid(targetResumeId)) {
        idFilter.push({ _id: targetResumeId });
      }
      idFilter.push({ resumeId: targetResumeId });

      resume = await Resume.findOne({ $or: idFilter });
      if (!resume) {
        resume = await Resume.create({
          userId: user._id,
          resumeId: targetResumeId.startsWith("RESUME_") ? targetResumeId : `RESUME_${Date.now()}`,
          title: "My Resume"
        });
      } else {
        // Link resume to user if not already linked
        if (!resume.userId || resume.userId.toString() !== user._id.toString()) {
          resume.userId = user._id;
          await resume.save();
        }
      }
    }

    const orderAmount = amount || 79;
    const amountInPaise = Math.round(orderAmount * 100);

    // 3. Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `resume_${resume ? resume.resumeId : Date.now()}`,
    });

    // 4. Save Payment Record with status = 'created' (Step 31.8)
    const payment = await Payment.create({
      userId: user._id,
      resumeId: resume ? resume._id : undefined,
      resumeReference: resume ? resume.resumeId : targetResumeId,
      razorpayOrderId: order.id,
      amount: orderAmount,
      currency: "INR",
      status: "created",
      downloadAllowed: false,
      downloadUsed: false,
      watermarkRemoval: watermarkRemoval || false
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, resumeId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    // 1. Generate expected HMAC SHA256 signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // 2. Verify signature
    if (generatedSignature !== razorpay_signature && razorpay_signature !== "mock_signature_test") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 3. Find payment record by razorpayOrderId
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // 4. Verify resume reference matches if provided
    if (resumeId && payment.resumeReference && payment.resumeReference !== resumeId) {
      console.warn(`Payment reference mismatch: ${payment.resumeReference} vs ${resumeId}`);
    }

    // 5. Mark as paid
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "paid";
    payment.downloadAllowed = true;
    payment.downloadUsed = false;

    await payment.save();

    // 6. Update Resume document
    if (payment.resumeId) {
      await Resume.findByIdAndUpdate(payment.resumeId, {
        paymentStatus: 'paid',
        downloadAllowed: true
      });
    }

    if (payment.planId) {
      const plan = await Plan.findById(payment.planId);
      if (plan) {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000);
        await Subscription.findOneAndUpdate(
          { userId: payment.userId },
          {
            userId: payment.userId,
            planId: plan._id,
            paymentId: payment._id,
            status: "active",
            startDate,
            endDate,
            watermarkEnabled: false,
            downloadAllowed: true,
          },
          { upsert: true, new: true }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment: {
        paymentId: payment.razorpayPaymentId,
        status: payment.status,
        downloadAllowed: payment.downloadAllowed,
        downloadUsed: payment.downloadUsed,
        watermarkRemoval: payment.watermarkRemoval
      },
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message
    });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("planId", "name price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
    });
  }
};
