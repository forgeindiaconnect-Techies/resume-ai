const Plan = require("../models/Plan");

exports.getActivePlans = async (req, res) => {
  try {
    const plans = await Plan.find({
      isActive: true,
    }).sort({
      price: 1,
    });

    res.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans",
    });
  }
};
