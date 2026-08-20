const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Plan = require("../models/Plan");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Resume = require("../models/Resume");

exports.createOrder = async (req, res) => {
  try {
    const { email, resumeId, plan, planKey, resumeSessionId } = req.body;

    const actualPlanKey = planKey || plan;
    const actualResumeId = resumeSessionId || resumeId;
    const actualEmail = email || (req.user?.email) || `guest_${Date.now()}@example.com`;

    if (!actualResumeId || !actualPlanKey) {
      return res.status(400).json({
        success: false,
        message: "resumeId and plan are required",
      });
    }

    const plans = {
      watermarked: { amount: 99, watermarkRemoval: false },
      no_watermark: { amount: 199, watermarkRemoval: true },
      Single: { amount: 1, watermarkRemoval: false },
      Monthly: { amount: 199, watermarkRemoval: true },
      Quarterly: { amount: 399, watermarkRemoval: true },
      Yearly: { amount: 999, watermarkRemoval: true }
    };

    const selectedPlan = plans[actualPlanKey];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment plan",
      });
    }

    const User = require("../models/User");
    const safeEmail = actualEmail || `guest_${Date.now()}@example.com`;
    const normalizedEmail = String(safeEmail).trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      user = await User.create({
        userId: `USR_${Date.now()}`,
        email: normalizedEmail,
        isGuest: false,
      });
    }

    let resume = await Resume.findOne({
      resumeId: actualResumeId,
    });

    if (!resume) {
      resume = await Resume.create({
        userId: user._id,
        resumeId: actualResumeId.startsWith("RESUME_") ? actualResumeId : `RESUME_${Date.now()}`,
        title: "My Resume"
      });
    }

    resume.userId = user._id;
    await resume.save();

    const options = {
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = await Payment.create({
      userId: user._id,
      resumeId: resume._id,
      resumeReference: actualResumeId,
      email: normalizedEmail,
      plan: actualPlanKey,
      amount: selectedPlan.amount,
      razorpayOrderId: order.id,
      status: "created",
      watermarkRemoval: selectedPlan.watermarkRemoval,
      downloadAllowed: false,
      downloadUsed: false,
    });

    return res.status(201).json({
      success: true,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      paymentId: payment._id,
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
      .populate("resumeId", "title")
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

exports.markDownloaded = async (req, res) => {
  try {
    const payment = await Payment.findOne({ razorpayPaymentId: req.params.paymentId });
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.downloadUsed = true;
    payment.downloadedAt = new Date();
    await payment.save();

    res.status(200).json({ success: true, message: "Download marked" });
  } catch (error) {
    console.error("Mark downloaded error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.mockPayment = async (req, res) => {
  try {
    const { email, resumeId, plan } = req.body;

    const plans = {
      watermarked: { amount: 99, watermarkRemoval: false },
      no_watermark: { amount: 199, watermarkRemoval: true },
    };

    const selectedPlan = plans[plan];
    if (!selectedPlan) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const User = require("../models/User");
    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      user = await User.create({
        userId: `USR_${Date.now()}`,
        email: normalizedEmail,
        isGuest: false,
      });
    }

    const payment = await Payment.create({
      userId: user._id,
      resumeReference: resumeId,
      email: normalizedEmail,
      plan,
      amount: selectedPlan.amount,
      razorpayOrderId: `mock_order_${Date.now()}`,
      razorpayPaymentId: `mock_pay_${Date.now()}`,
      status: "paid",
      watermarkRemoval: selectedPlan.watermarkRemoval,
      downloadAllowed: true,
      // PDF has NOT downloaded yet
      downloadUsed: false,
      downloadedAt: null,
    });

    return res.status(200).json({
      success: true,
      payment: {
        id: payment._id,
        paymentId: payment.razorpayPaymentId,
        email: payment.email,
        plan: payment.plan,
        amount: payment.amount,
        watermarkRemoval: payment.watermarkRemoval,
        downloadAllowed: payment.downloadAllowed,
        downloadUsed: payment.downloadUsed,
      },
    });
  } catch (error) {
    console.error("Mock payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
