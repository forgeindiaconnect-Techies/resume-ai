const Subscription = require("../models/Subscription");

const premiumMiddleware = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user._id,
      status: "active",
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required",
      });
    }

    if (subscription.endDate <= new Date()) {
      subscription.status = "expired";
      subscription.watermarkEnabled = true;
      subscription.downloadAllowed = false;

      await subscription.save();

      return res.status(403).json({
        success: false,
        message: "Your subscription has expired",
      });
    }

    if (!subscription.downloadAllowed) {
      return res.status(403).json({
        success: false,
        message: "Download is not available",
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Subscription verification failed",
    });
  }
};

module.exports = premiumMiddleware;
