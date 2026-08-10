const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
const Download = require("../models/Download");
const Resume = require("../models/Resume");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const subscription = await Subscription.findOne({
          userId: user._id,
          status: "active",
          endDate: {
            $gt: new Date(),
          },
        })
          .populate("planId", "name price")
          .sort({
            createdAt: -1,
          });

        const paymentCount = await Payment.countDocuments({
          userId: user._id,
          status: "paid",
        });

        const downloadCount = await Download.countDocuments({
          userId: user._id,
        });

        return {
          ...user.toObject(),
          subscription: subscription || null,
          paymentCount,
          downloadCount,
        };
      })
    );

    res.json({
      success: true,
      users: usersWithDetails,
    });
  } catch (error) {
    console.error("Get admin users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: user.isActive ? "User activated" : "User deactivated",
      user: {
        id: user._id,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subscription = await Subscription.findOne({
      userId: user._id,
    })
      .populate("planId", "name price")
      .sort({
        createdAt: -1,
      });

    const payments = await Payment.find({
      userId: user._id,
    })
      .populate("planId", "name price")
      .sort({
        createdAt: -1,
      });

    const downloads = await Download.find({
      userId: user._id,
    })
      .populate("resumeId", "title")
      .sort({
        createdAt: -1,
      });

    const resumeCount = await Resume.countDocuments({
      userId: user._id,
    });

    res.json({
      success: true,
      user,
      subscription,
      payments,
      downloads,
      resumeCount,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
    });
  }
};
