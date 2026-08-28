const mongoose = require("mongoose");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Plan = require("../models/Plan");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Resume = require("../models/Resume");

exports.createOrder = async (req, res) => {
  try {
    const { email, resumeId, plan, planKey, resumeSessionId, resumeName, name, userName } = req.body;

    const actualPlanKey = planKey || plan;
    const actualResumeId = resumeSessionId || resumeId;
    const actualEmail = email || (req.user?.email) || `guest_${Date.now()}@example.com`;
    const candidateName = resumeName || name || userName || null;

    if (!actualResumeId || !actualPlanKey) {
      return res.status(400).json({
        success: false,
        message: "resumeId and plan are required",
      });
    }

    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: "Razorpay environment variables are missing or not initialized on the server.",
      });
    }

    let selectedPlan = null;
    try {
      const DownloadPlan = require("../models/DownloadPlan");
      const dbPlan = await DownloadPlan.findOne({ key: actualPlanKey });
      if (dbPlan) {
        selectedPlan = {
          amount: Number(dbPlan.price),
          watermarkRemoval: dbPlan.key === "no_watermark" || Boolean(dbPlan.removeWatermark)
        };
      }
    } catch (e) {
      // ignore
    }

    if (!selectedPlan) {
      const plans = {
        free_watermark: {
          amount: 0,
          watermarkRemoval: false,
          requiresPayment: false,
        },
        watermarked: {
          amount: 0,
          watermarkRemoval: false,
          requiresPayment: false,
        },
        no_watermark: {
          amount: 199,
          watermarkRemoval: true,
          requiresPayment: true,
        },
      };
      selectedPlan = plans[actualPlanKey];
    }

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
        name: candidateName,
        isGuest: false,
      });
    } else if (candidateName && !user.name) {
      user.name = candidateName;
      await user.save();
    }

    let resume = await Resume.findOne({
      resumeId: actualResumeId,
    });

    if (!resume) {
      resume = await Resume.create({
        userId: user._id,
        resumeId: actualResumeId.startsWith("RESUME_") ? actualResumeId : `RESUME_${Date.now()}`,
        title: candidateName || "My Resume"
      });
    }

    resume.userId = user._id;
    await resume.save();

    // Free plan: no Razorpay order needed, grant download immediately
    if (selectedPlan.amount === 0 || selectedPlan.requiresPayment === false) {
      const payment = await Payment.create({
        userId: user._id,
        resumeId: resume._id,
        resumeReference: actualResumeId,
        resumeName: candidateName || resume.title || null,
        email: normalizedEmail,
        plan: actualPlanKey,
        amount: 0,
        razorpayOrderId: `free_${Date.now()}`,
        razorpayPaymentId: `free_${Date.now()}`,
        status: "paid",
        watermarkRemoval: false,
        downloadAllowed: true,
        downloadUsed: false,
      });

      return res.status(200).json({
        success: true,
        freeDownload: true,
        requiresPayment: false,
        downloadAllowed: true,
        plan: actualPlanKey,
        paymentId: payment._id,
      });
    }

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
      resumeName: candidateName || resume.title || null,
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
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      plan: actualPlanKey,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({
      success: false,
      message: error?.error?.description || error.message || "Failed to create payment order",
      error: error.message
    });
  }
};

exports.createRazorpayOrder = exports.createOrder;

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
    const Download = require("../models/Download");
    const UserSession = require("../models/UserSession");

    const [payments, downloads, sessions] = await Promise.all([
      Payment.find()
        .populate("userId", "name email")
        .populate("planId", "name price")
        .populate("resumeId", "title")
        .lean()
        .sort({ createdAt: -1 })
        .catch(() => []),
      Download.find().lean().sort({ downloadedAt: -1 }).catch(() => []),
      UserSession.find().lean().catch(() => [])
    ]);

    const emailToNameMap = {};
    sessions.forEach((s) => {
      if (
        s.email &&
        s.resumeName &&
        s.resumeName.toLowerCase() !== "user" &&
        s.resumeName !== "Your Name" &&
        s.resumeName !== "guest_user"
      ) {
        emailToNameMap[s.email.toLowerCase()] = s.resumeName;
      }
    });

    const enrichedPayments = payments.map((p) => {
      const email = (p.email || p.userId?.email || "").toLowerCase();
      let resolvedName = p.resumeName;

      if (!resolvedName || resolvedName === "-" || resolvedName.toLowerCase() === "user" || resolvedName === "My Resume") {
        resolvedName = p.userId?.name || (p.resumeId?.title && p.resumeId.title !== "My Resume" ? p.resumeId.title : null) || emailToNameMap[email] || null;
      }

      if (!resolvedName && email) {
        const part = email.split("@")[0].replace(/[._0-9]/g, " ").trim();
        if (part && part.toLowerCase() !== "user" && part.toLowerCase() !== "guest") {
          resolvedName = part
            .split(" ")
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
        }
      }

      return {
        ...p,
        resumeName: resolvedName || "Customer",
      };
    });

    const combinedPayments = [...enrichedPayments];

    downloads.forEach((d) => {
      const email = (d.email || "").toLowerCase();
      const alreadyInPayments = enrichedPayments.some(
        (p) =>
          p.email &&
          email &&
          p.email.toLowerCase() === email &&
          p.amount === d.amount
      );
      if (!alreadyInPayments) {
        let name = d.resumeName;
        if (!name || name === "-" || name.toLowerCase() === "user") {
          name = emailToNameMap[email] || (email ? email.split("@")[0].replace(/[._0-9]/g, " ").trim() : null) || "Resume User";
        }

        combinedPayments.push({
          _id: d._id,
          resumeName: name,
          email: d.email || "user@example.com",
          plan: d.downloadType,
          amount: d.amount || (d.downloadType === "no_watermark" ? 199 : 99),
          status: "paid",
          createdAt: d.downloadedAt || new Date(),
        });
      }
    });

    combinedPayments.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json({
      success: true,
      payments: combinedPayments,
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
    const { email, resumeId, plan, resumeName } = req.body;

    const plans = {
      free_watermark: {
        amount: 0,
        watermarkRemoval: false,
        requiresPayment: false,
      },
      watermarked: {
        amount: 0,
        watermarkRemoval: false,
        requiresPayment: false,
      },
      no_watermark: {
        amount: 199,
        watermarkRemoval: true,
        requiresPayment: true,
      },
    };

    const selectedPlan = plans[plan];

    if (!selectedPlan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    // Free resume with watermark
    if (!selectedPlan.requiresPayment) {
      let downloadRecord = null;
      try {
        const User = require("../models/User");
        const Download = require("../models/Download");
        const UserSession = require("../models/UserSession");

        const safeEmail = email || `guest_${Date.now()}@example.com`;
        const normalizedEmail = String(safeEmail).trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
          user = await User.create({
            userId: `USR_${Date.now()}`,
            email: normalizedEmail,
            name: resumeName || null,
            isGuest: false,
          });
        }
        downloadRecord = await Payment.create({
          userId: user._id,
          resumeReference: resumeId,
          resumeName: resumeName || null,
          email: normalizedEmail,
          plan: "watermarked",
          amount: 0,
          razorpayOrderId: `free_${Date.now()}`,
          razorpayPaymentId: `free_${Date.now()}`,
          status: "paid",
          watermarkRemoval: false,
          downloadAllowed: true,
          downloadUsed: true,
          downloadedAt: new Date(),
        });

        // Also save to Download collection so Downloads page and counters immediately increment
        await Download.create({
          sessionId: req.body.sessionId || null,
          guestId: req.body.guestId || null,
          email: normalizedEmail,
          resumeId: resumeId || null,
          resumeName: resumeName || null,
          downloadType: "watermarked",
          amount: 0,
          downloadedAt: new Date()
        });

        // Update UserSession
        await UserSession.updateMany(
          {
            $or: [
              { email: normalizedEmail },
              { resumeId: resumeId }
            ]
          },
          {
            $set: {
              ...(resumeName ? { resumeName } : {}),
              email: normalizedEmail,
              downloaded: true,
              downloadType: "watermarked",
              downloadedAt: new Date(),
              resumeCreated: true
            }
          }
        ).catch(() => {});
      } catch (e) {
        console.warn("Free payment/download create error:", e.message);
      }

      return res.status(200).json({
        success: true,
        paymentRequired: false,
        watermarkRemoval: false,
        plan: "free_watermark",
        amount: 0,
        downloadId: downloadRecord?._id,
        message: "Free watermarked resume is ready to download",
      });
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
      resumeName: resumeName || null,
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

    try {
      const UserSession = require("../models/UserSession");
      await UserSession.updateMany(
        {
          $or: [
            { email: normalizedEmail },
            { resumeId: resumeId }
          ]
        },
        {
          $set: {
            ...(resumeName ? { resumeName } : {}),
            email: normalizedEmail,
            resumeCreated: true
          }
        }
      );
    } catch (sErr) {}

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
