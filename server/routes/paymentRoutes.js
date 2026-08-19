const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authMiddleware, optionalAuth } = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.post("/create-order", optionalAuth, paymentController.createOrder);
router.post("/verify", optionalAuth, paymentController.verifyPayment);
router.post("/mock-payment", optionalAuth, paymentController.mockPayment);
router.post("/:paymentId/download", optionalAuth, paymentController.markDownloaded);
router.get("/admin", adminAuthMiddleware, paymentController.getAllPayments);

module.exports = router;
