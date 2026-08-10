const express = require("express");
const adminUserController = require("../controllers/adminUserController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, adminUserController.getAllUsers);
router.get("/:id", adminAuthMiddleware, adminUserController.getUserDetails);
router.patch("/:id/status", adminAuthMiddleware, adminUserController.updateUserStatus);

module.exports = router;
