const express = require("express");
const subscriptionController = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, subscriptionController.getMySubscription);

module.exports = router;
