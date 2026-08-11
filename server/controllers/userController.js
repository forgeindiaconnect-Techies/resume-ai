const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'forge_secret_key_123_abc';

const generateToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

const identifyUser = async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Derive a clean name from email if not explicitly provided
    let computedName = name && name.trim() ? name.trim() : "";
    if (!computedName && normalizedEmail) {
      const handle = normalizedEmail.split('@')[0];
      computedName = handle
        .split(/[._-]/)
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    }
    if (!computedName) {
      computedName = "User";
    }

    // Check whether this user already exists
    let user = await User.findOne({
      email: normalizedEmail,
    });

    // Existing user
    if (user) {
      let updated = false;
      if (!user.name || user.name.trim() === "" || user.name === "Unknown User") {
        user.name = computedName;
        updated = true;
      }
      if (!user.userId) {
        user.userId = `USR_${Date.now()}`;
        updated = true;
      }
      if (updated) {
        await user.save();
      }

      return res.status(200).json({
        success: true,
        isExistingUser: true,
        userId: user.userId || user._id,
        user: {
          id: user._id,
          userId: user.userId,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
        token: generateToken(user._id, user.email, user.role),
      });
    }

    // New user
    const userId = `USR_${Date.now()}`;

    user = await User.create({
      userId,
      email: normalizedEmail,
      name: computedName,
      phone: phone || "",
      isGuest: false,
    });

    return res.status(201).json({
      success: true,
      isExistingUser: false,
      userId: user.userId || user._id,
      user: {
        id: user._id,
        userId: user.userId,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
      token: generateToken(user._id, user.email, user.role),
    });
  } catch (error) {
    console.error("Identify user error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to identify user",
    });
  }
};

const updateUserEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findById(req.user.id || req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({ success: false, message: "Email is already in use by another account" });
    }

    user.email = email.toLowerCase().trim();
    user.isGuest = false;
    await user.save();

    return res.json({
      success: true,
      message: "Email updated successfully",
      token: generateToken(user._id, user.email, user.role),
    });
  } catch (error) {
    console.error("Update user email error:", error);
    res.status(500).json({ success: false, message: "Failed to update email" });
  }
};

const createGuestUser = async (req, res) => {
  try {
    const userId = `USR_${Date.now()}`;

    const user = await User.create({
      userId,
      isGuest: true,
      name: "Guest User",
      email: `${userId}@guest.local`
    });

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user._id, isGuest: true },
      process.env.JWT_SECRET || 'forge_secret_key_123_abc',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      user: {
        userId: user.userId,
        isGuest: user.isGuest,
      },
      token
    });
  } catch (error) {
    console.error("Create guest user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user: " + error.message,
      stack: error.stack
    });
  }
};

module.exports = { identifyUser, updateUserEmail, createGuestUser };
