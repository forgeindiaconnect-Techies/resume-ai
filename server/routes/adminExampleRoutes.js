const express = require("express");
const adminExampleController = require("../controllers/adminExampleController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, adminExampleController.getAllExamples);
router.get("/:id", adminAuthMiddleware, adminExampleController.getExampleById);
router.post("/", adminAuthMiddleware, upload.single("previewImage"), adminExampleController.createExample);
router.put("/:id", adminAuthMiddleware, adminExampleController.updateExample);
router.patch("/:id/status", adminAuthMiddleware, adminExampleController.toggleExampleStatus);
router.delete("/:id", adminAuthMiddleware, adminExampleController.deleteExample);

module.exports = router;
