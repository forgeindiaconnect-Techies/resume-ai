const express = require("express");

const {
  getAdminTemplates,
  createTemplate,
  updateTemplate,
  toggleTemplateStatus,
  deleteTemplate,
} = require("../controllers/adminTemplateController.js");

const adminAuthMiddleware = require("../middleware/adminAuthMiddleware.js");

const router = express.Router();

router.get("/", adminAuthMiddleware, getAdminTemplates);
router.post("/", adminAuthMiddleware, createTemplate);
router.put("/:id", adminAuthMiddleware, updateTemplate);
router.patch("/:id/status", adminAuthMiddleware, toggleTemplateStatus);
router.delete("/:id", adminAuthMiddleware, deleteTemplate);

module.exports = router;
