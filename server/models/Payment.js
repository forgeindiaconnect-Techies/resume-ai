const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: false,
    },
    resumeReference: {
      type: String,
      default: "",
    },
    resumeName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      enum: ["watermarked", "no_watermark"],
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "paid",
    },
    downloadAllowed: {
      type: Boolean,
      default: false,
    },
    downloadUsed: {
      type: Boolean,
      default: false,
    },
    watermarkRemoval: {
      type: Boolean,
      default: false,
    },
    downloadedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
