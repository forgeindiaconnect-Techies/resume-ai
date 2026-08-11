const express = require("express");
const { identifyUser, updateUserEmail, createGuestUser } = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/identify", identifyUser);
router.put("/me/email", authMiddleware, updateUserEmail);
router.post("/guest", createGuestUser);

module.exports = router;
