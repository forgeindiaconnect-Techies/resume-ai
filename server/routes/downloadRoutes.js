const express = require("express");
const downloadController = require("../controllers/downloadController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/admin", adminAuthMiddleware, downloadController.getAllDownloads);

module.exports = router;
