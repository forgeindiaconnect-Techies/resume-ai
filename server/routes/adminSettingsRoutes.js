const express = require("express");
const adminSettingsController = require("../controllers/adminSettingsController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, adminSettingsController.getSettings);
router.put("/", adminAuthMiddleware, adminSettingsController.updateSettings);

module.exports = router;
