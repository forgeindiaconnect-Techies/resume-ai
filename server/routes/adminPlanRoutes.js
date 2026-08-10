const express = require("express");
const adminPlanController = require("../controllers/adminPlanController");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/", adminAuthMiddleware, adminPlanController.getAllPlans);
router.post("/", adminAuthMiddleware, adminPlanController.createPlan);
router.put("/:id", adminAuthMiddleware, adminPlanController.updatePlan);
router.patch("/:id/status", adminAuthMiddleware, adminPlanController.togglePlanStatus);
router.delete("/:id", adminAuthMiddleware, adminPlanController.deletePlan);

module.exports = router;
