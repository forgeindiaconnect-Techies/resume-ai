const express = require("express");
const adminDashboardController = require("../controllers/adminDashboardController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, adminDashboardController.getAdminDashboard);

module.exports = router;
