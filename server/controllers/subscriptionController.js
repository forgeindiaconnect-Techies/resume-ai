const Subscription = require("../models/Subscription");

exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
    }).populate("planId");

    if (!subscription) {
      return res.json({
        success: true,
        isPremium: false,
        subscription: null,
      });
    }

    const now = new Date();

    if (subscription.endDate <= now) {
      subscription.status = "expired";
      subscription.watermarkEnabled = true;
      subscription.downloadAllowed = false;
      await subscription.save();

      return res.json({
        success: true,
        isPremium: false,
        subscription: null,
      });
    }

    res.json({
      success: true,
      isPremium: true,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription",
    });
  }
};
