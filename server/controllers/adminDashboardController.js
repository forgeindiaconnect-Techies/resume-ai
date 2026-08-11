const User = require("../models/User");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Download = require("../models/Download");

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDownloads = await Download.countDocuments();

    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
      endDate: {
        $gt: new Date(),
      },
    });

    const paidPayments = await Payment.find({
      status: "paid",
    });

    const totalRevenue = paidPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    const recentPayments = await Payment.find()
      .populate("userId", "name email")
      .populate("planId", "name price")
      .populate("resumeId", "title templateId")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    const recentUsers = await User.find()
      .select("name email isGuest anonymousId createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.json({
      success: true,
      overview: {
        totalUsers,
        totalRevenue,
        activeSubscriptions,
        totalDownloads,
      },
      recentPayments,
      recentUsers,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard",
    });
  }
};
