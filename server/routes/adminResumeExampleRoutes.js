const express = require("express");

const {
  getAdminExamples,
  createResumeExample,
  updateResumeExample,
  toggleExampleStatus,
  deleteResumeExample,
} = require("../controllers/adminResumeExampleController.js");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware.js");

const router = express.Router();

router.get("/", adminAuthMiddleware, getAdminExamples);
router.post("/", adminAuthMiddleware, createResumeExample);
router.put("/:id", adminAuthMiddleware, updateResumeExample);
router.patch("/:id/status", adminAuthMiddleware, toggleExampleStatus);
router.delete("/:id", adminAuthMiddleware, deleteResumeExample);

module.exports = router;
