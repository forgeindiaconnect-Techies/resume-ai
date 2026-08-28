const express = require("express");
const router = express.Router();
const DownloadPlan = require("../models/DownloadPlan");
const Download = require("../models/Download");


// GET ALL PLANS
router.get("/", async (req, res) => {
  try {
    let plans = await DownloadPlan.find().sort({ price: 1 });

    if (plans.length === 0) {
      // Auto-create default plans if they don't exist for testing
      const defaultPlans = [
        { name: "With Watermark", key: "watermarked", price: 0, watermarkRemoval: false, isActive: true },
        { name: "Without Watermark", key: "no_watermark", price: 199, watermarkRemoval: true, isActive: true }
      ];
      for (const p of defaultPlans) {
        await DownloadPlan.create(p);
      }
      plans = await DownloadPlan.find().sort({ price: 1 });
    }

    const result = await Promise.all(
      plans.map(async (plan) => {
        const matchingKeys = [plan.key];
        if (plan.key === "watermarked") matchingKeys.push("free_watermark");
        if (plan.key === "free_watermark") matchingKeys.push("watermarked");
        if (!plan.watermarkRemoval) matchingKeys.push("free_watermark", "watermarked");

        const downloads = await Download.find({
          downloadType: { $in: matchingKeys }
        });

        const downloadCount = downloads.length;

        const revenue = downloads.reduce(
          (total, item) => total + Number(item.amount || 0),
          0
        );

        return {
          ...plan.toObject(),
          downloadCount,
          revenue
        };
      })
    );

    return res.status(200).json({
      success: true,
      plans: result
    });
  } catch (error) {
    console.error("Get plans error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
});

// SYNC / UPDATE TO OFFICIAL PRICING
router.post("/sync-official-plans", async (req, res) => {
  try {
    await DownloadPlan.findOneAndUpdate(
      { $or: [{ key: "watermarked" }, { key: "free_watermark" }, { name: /with watermark/i }] },
      { name: "With Watermark", key: "watermarked", price: 0, watermarkRemoval: false, isActive: true },
      { upsert: true, new: true }
    );

    await DownloadPlan.findOneAndUpdate(
      { $or: [{ key: "no_watermark" }, { name: /without watermark/i }] },
      { name: "Without Watermark", key: "no_watermark", price: 199, watermarkRemoval: true, isActive: true },
      { upsert: true, new: true }
    );

    const plans = await DownloadPlan.find().sort({ price: 1 });
    return res.status(200).json({
      success: true,
      message: "Plans synced successfully to With Watermark (FREE) and Without Watermark (₹199)",
      plans
    });
  } catch (error) {
    console.error("Sync plans error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


// CREATE PLAN
router.post("/", async (req, res) => {
  try {
    const {
      name,
      key,
      price,
      watermarkRemoval,
      isActive
    } = req.body;


    const plan = await DownloadPlan.create({
      name,
      key,
      price,
      watermarkRemoval,
      isActive
    });


    return res.status(201).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Create plan error:", error);


    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});


// UPDATE PLAN
router.put("/:id", async (req, res) => {
  try {
    const plan = await DownloadPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }


    return res.status(200).json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);


    return res.status(500).json({
      success: false,
      message: "Failed to update plan",
    });
  }
});


module.exports = router;
