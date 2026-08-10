const User = require("../models/User");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");
const Download = require("../models/Download");

exports.getAdminReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const paidPayments = await Payment.find({
      status: "paid",
    });

    const totalRevenue = paidPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );

    const paidUsers = await Payment.distinct("userId", {
      status: "paid",
    });

    const activeSubscriptions = await Subscription.countDocuments({
      status: "active",
      endDate: {
        $gt: new Date(),
      },
    });

    const totalPayments = await Payment.countDocuments();

    const successfulPayments = await Payment.countDocuments({
      status: "paid",
    });

    const failedPayments = await Payment.countDocuments({
      status: "failed",
    });

    const totalDownloads = await Download.countDocuments();

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const popularPlans = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: "$planId",
          purchases: {
            $sum: 1,
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          purchases: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      success: true,
      overview: {
        totalUsers,
        totalRevenue,
        paidUsers: paidUsers.length,
        activeSubscriptions,
        totalPayments,
        successfulPayments,
        failedPayments,
        totalDownloads,
      },
      monthlyRevenue,
      popularPlans,
    });
  } catch (error) {
    console.error("Admin reports error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate reports",
    });
  }
};
