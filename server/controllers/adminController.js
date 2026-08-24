const mongoose = require('mongoose');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Resume = require('../models/Resume');
const Candidate = require('../models/Candidate');
const ResumeLayout = require('../models/ResumeLayout');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

const DB_PATH = path.join(__dirname, '../database.json');
const JWT_SECRET = process.env.JWT_SECRET || 'forge_secret_key_123_abc';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Local JSON Helpers
const getLocalCollection = (key) => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed[key] || [];
  } catch (e) {
    return [];
  }
};

// Retrieve all users
exports.getUsers = async (req, res) => {
  try {
    if (isDBConnected()) {
      const rawUsers = await User.find({}).select('-password').sort({ createdAt: -1 });
      const users = rawUsers.map(u => {
        const uObj = u.toObject();
        if (uObj.isGuest || (uObj.email && uObj.email.endsWith('@guest.local'))) {
          uObj.name = "Guest User";
        } else if (!uObj.name || uObj.name.trim() === "" || uObj.name === "Unknown User") {
          if (uObj.email) {
            const handle = uObj.email.split('@')[0];
            uObj.name = handle.split(/[._-]/).filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          } else {
            uObj.name = "User";
          }
        }
        return uObj;
      });
      return res.status(200).json({ success: true, users });
    } else {
      const localUsers = getLocalCollection('users');
      const usersWithoutPassword = localUsers.map(({ password, ...u }) => u);
      return res.status(200).json({ success: true, users: usersWithoutPassword });
    }
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};

// Retrieve all payments
exports.getPayments = async (req, res) => {
  try {
    if (isDBConnected()) {
      const rawPayments = await Payment.find({})
        .populate('userId', 'name email userId')
        .sort({ createdAt: -1 });

      const payments = rawPayments.map(p => {
        const pObj = p.toObject();
        if (pObj.userId && typeof pObj.userId === 'object') {
          if (pObj.userId.isGuest || (pObj.userId.email && pObj.userId.email.endsWith('@guest.local'))) {
            pObj.userId.name = "Guest User";
          } else if (!pObj.userId.name || pObj.userId.name.trim() === "" || pObj.userId.name === "Unknown User") {
            if (pObj.userId.email) {
              const handle = pObj.userId.email.split('@')[0];
              pObj.userId.name = handle.split(/[._-]/).filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
            } else {
              pObj.userId.name = "User";
            }
          }
        } else {
          pObj.userId = {
            name: "Guest User",
            email: pObj.resumeReference || "guest@local"
          };
        }
        return pObj;
      });

      return res.status(200).json({ success: true, payments });
    } else {
      const localPayments = getLocalCollection('payments');
      const localUsers = getLocalCollection('users');
      
      // Mimic mongoose populate locally
      const populatedPayments = localPayments.map(p => {
        const user = localUsers.find(u => u._id === p.userId) || { name: 'Unknown User', email: '' };
        return {
          ...p,
          userId: { _id: p.userId, name: user.name, email: user.email }
        };
      });
      
      return res.status(200).json({ success: true, payments: populatedPayments });
    }
  } catch (error) {
    console.error('Admin getPayments error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve payments history' });
  }
};

// Retrieve platform metrics
exports.getAnalytics = async (req, res) => {
  try {
    let totalUsers = 0;
    let premiumUsers = 0;
    let totalResumes = 0;
    let totalRevenue = 0;

    if (isDBConnected()) {
      totalUsers = await User.countDocuments({});
      premiumUsers = await User.countDocuments({ subscription: 'Premium' });
      totalResumes = await Resume.countDocuments({});
      
      const completedPayments = await Payment.find({ status: 'Completed' });
      totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    } else {
      const localUsers = getLocalCollection('users');
      totalUsers = localUsers.length;
      premiumUsers = localUsers.filter(u => u.subscription === 'Premium').length;
      
      const localResumes = getLocalCollection('resumes');
      totalResumes = localResumes.length;

      const localPayments = getLocalCollection('payments');
      totalRevenue = localPayments
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
    }

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        premiumUsers,
        totalResumes,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        conversionRate: totalUsers > 0 ? parseFloat(((premiumUsers / totalUsers) * 100).toFixed(1)) : 0
      }
    });
  } catch (error) {
    console.error('Admin getAnalytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate metrics report' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const cleanEmail = email.toLowerCase().trim();
    let user;
    if (isDBConnected()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      const localUsers = getLocalCollection('users');
      user = localUsers.find(u => u.email?.toLowerCase() === cleanEmail);
    }

    if (!user || user.role !== 'admin') {
      // Auto-provision default admin if logging in with official admin email and password
      if (cleanEmail === "admin@forgeindia.com" && (password === "Admin@123" || password === "Admin@09")) {
        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        user = await User.findOneAndUpdate(
          { email: "admin@forgeindia.com" },
          { name: "Super Admin", email: "admin@forgeindia.com", password: hashedPassword, role: "admin", status: "active" },
          { upsert: true, new: true }
        );
      } else {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }
    }

    let isMatch = false;
    if (user.password) {
      if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password);
      } else {
        isMatch = user.password === password;
      }
    }
    
    // Master fallback for official admin account
    if (!isMatch && cleanEmail === "admin@forgeindia.com" && (password === "Admin@123" || password === "Admin@09")) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Get All Templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templates = await ResumeLayout.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Get templates error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

// Create New Template
exports.createTemplate = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      isActive,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Template name is required",
      });
    }

    let previewImage = "";

    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "resume-builder/templates",
                resource_type: "image",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          stream.end(req.file.buffer);
        }
      );

      previewImage = uploadResult.secure_url;
    }

    const template = await ResumeLayout.create({
      name,
      category,
      description,
      isActive:
        isActive === "true" || isActive === true,
      previewImage,
    });

    res.status(201).json({
      success: true,
      message: "Template created successfully",
      template,
    });

  } catch (error) {
    console.error("Create template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create template",
      error: error.message,
    });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const template = await ResumeLayout.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch template",
    });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      description,
      isActive,
    } = req.body;

    const template = await ResumeLayout.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    if (name !== undefined) {
      template.name = name;
    }

    if (category !== undefined) {
      template.category = category;
    }

    if (description !== undefined) {
      template.description = description;
    }

    if (isActive !== undefined) {
      template.isActive =
        isActive === "true" || isActive === true;
    }

    await template.save();

    res.json({
      success: true,
      message: "Template updated successfully",
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update template",
    });
  }
};

exports.toggleTemplateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ResumeLayout.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    template.isActive = !template.isActive;

    await template.save();

    res.json({
      success: true,
      message: template.isActive
        ? "Template activated"
        : "Template deactivated",
      template,
    });
  } catch (error) {
    console.error("Toggle template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update template status",
    });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ResumeLayout.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    await ResumeLayout.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete template error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete template",
    });
  }
};
