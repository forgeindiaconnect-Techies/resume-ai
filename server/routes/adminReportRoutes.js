const express = require("express");
const adminReportController = require("../controllers/adminReportController");

const router = express.Router();

router.get("/", adminReportController.getAdminReports);

module.exports = router;
