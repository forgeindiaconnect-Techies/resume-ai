const Plan = require("../models/Plan");

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch plans" });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name, description, price, duration, features, popular, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Plan name is required" });
    }

    const plan = await Plan.create({
      name,
      description,
      price,
      duration: Number(duration) || 30,
      features: Array.isArray(features) ? features : [],
      popular: popular === true || popular === "true",
      isActive: isActive !== false && isActive !== "false",
    });

    res.status(201).json({ success: true, message: "Plan created successfully", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create plan" });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    Object.assign(plan, req.body);
    await plan.save();

    res.json({ success: true, message: "Plan updated successfully", plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update plan" });
  }
};

exports.togglePlanStatus = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    res.json({
      success: true,
      message: plan.isActive ? "Plan activated" : "Plan deactivated",
      plan,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update plan status" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan not found" });
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete plan" });
  }
};
