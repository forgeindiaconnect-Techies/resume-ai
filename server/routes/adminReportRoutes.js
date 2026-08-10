const express = require("express");
const adminReportController = require("../controllers/adminReportController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, adminReportController.getAdminReports);

module.exports = router;
