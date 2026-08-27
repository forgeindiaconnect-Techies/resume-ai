const express = require("express");
const paymentController = require("../controllers/paymentController");
const { createRazorpayOrder } = paymentController;
const { authMiddleware, optionalAuth } = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/create-order", optionalAuth, createRazorpayOrder);
router.post("/verify", optionalAuth, paymentController.verifyPayment);
router.post("/verify-payment", optionalAuth, paymentController.verifyPayment);
router.post("/mock-payment", optionalAuth, paymentController.mockPayment);
router.post("/:paymentId/download", optionalAuth, paymentController.markDownloaded);
router.get("/admin", adminAuthMiddleware, paymentController.getAllPayments);
router.get("/", paymentController.getAllPayments);
router.delete("/clear", async (req, res) => {
  try {
    const Payment = require("../models/Payment");
    await Payment.deleteMany({});
    return res.json({ success: true, message: "All payment records cleared successfully" });
  } catch (error) {
    console.error("Clear payments error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/downloads", async (req, res) => {
  try {
    const Payment = require("../models/Payment");
    const payments = await Payment.find({
      downloadUsed: true
    })
      .populate("userId", "name email")
      .sort({ downloadedAt: -1 });

    return res.json({
      success: true,
      downloads: payments
    });
  } catch (error) {
    console.error("Get downloads error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch downloads"
    });
  }
});

module.exports = router;
