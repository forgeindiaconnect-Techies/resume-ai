const User = require("../models/User.js");

const identifyUser = async (req, res) => {
  try {
    const { email, anonymousId } = req.body;

    if (!anonymousId) {
      return res.status(400).json({
        success: false,
        message: "anonymousId is required",
      });
    }

    let user = await User.findOne({ anonymousId });

    // Existing browser user
    if (user) {
      if (email) {
        user.email = email.toLowerCase().trim();
      }

      user.lastSeenAt = new Date();
      await user.save();

      return res.json({
        success: true,
        isNewUser: false,
        userId: user._id,
      });
    }

    // Check whether this email already belongs to an existing user
    if (email) {
      user = await User.findOne({
        email: email.toLowerCase().trim(),
      });
    }

    // Existing user found through email
    if (user) {
      user.anonymousId = anonymousId;
      user.lastSeenAt = new Date();
      await user.save();

      return res.json({
        success: true,
        isNewUser: false,
        userId: user._id,
      });
    }

    // Completely new user
    user = await User.create({
      email: email ? email.toLowerCase().trim() : undefined,
      anonymousId,
      lastSeenAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      isNewUser: true,
      userId: user._id,
    });
  } catch (error) {
    console.error("Identify user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to identify user",
    });
  }
};

module.exports = { identifyUser };
