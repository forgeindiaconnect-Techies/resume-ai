const express = require("express");
const router = express.Router();
const DownloadPlan = require("../models/DownloadPlan");
const Download = require("../models/Download");


// GET ALL PLANS
router.get("/", async (req, res) => {
  try {
    const plans = await DownloadPlan.find().sort({ price: 1 });

    const result = await Promise.all(
      plans.map(async (plan) => {
        const downloads = await Download.find({
          downloadType: plan.key
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
