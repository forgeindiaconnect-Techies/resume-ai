const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Admin Login Route (Unprotected)
router.post('/auth/login', adminController.loginAdmin);

// Admin Token Verification Route (Protected)
router.get('/auth/verify', adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin is authenticated",
    admin: req.admin
  });
});

// ROUTE TO CLEAR ALL PLATFORM DATA
const handleClearAllData = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const fs = require('fs');
    const path = require('path');
    const bcrypt = require('bcryptjs');

    const User = require('../models/User');
    const UserSession = require('../models/UserSession');
    const Payment = require('../models/Payment');
    const Download = require('../models/Download');
    const Resume = require('../models/Resume');
    const Subscription = require('../models/Subscription');
    const ResumeAnalysis = require('../models/ResumeAnalysis');

    if (mongoose.connection.readyState === 1) {
      await UserSession.deleteMany({});
      await Payment.deleteMany({});
      await Download.deleteMany({});
      await Resume.deleteMany({});
      await Subscription.deleteMany({});
      await ResumeAnalysis.deleteMany({});
      
      // Delete all non-admin users
      await User.deleteMany({ role: { $ne: 'admin' } });

      // Ensure at least one admin exists
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("Admin@09", 10);
        await User.create({
          userId: "admin_123",
          name: "Administrator",
          email: "admin@forgeindia.com",
          password: hashedPassword,
          role: "admin"
        });
      }
    }

    // Also clear local JSON database if present
    const DB_PATH = path.join(__dirname, '../database.json');
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        const db = JSON.parse(raw || '{}');
        db.userSessions = [];
        db.payments = [];
        db.downloads = [];
        db.resumes = [];
        if (Array.isArray(db.users)) {
          db.users = db.users.filter(u => u.role === 'admin');
        }
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
      } catch (e) {
        console.warn("Local DB clear error:", e.message);
      }
    }

    if (req.method === 'GET' && !req.xhr && !req.headers.accept?.includes('application/json')) {
      return res.send("<div style='font-family:sans-serif;padding:40px;text-align:center;'><h2>✅ All platform data (users, activity, payments, downloads, resumes) has been successfully cleared!</h2><p>You can now close this tab or return to the dashboard.</p></div>");
    }

    return res.status(200).json({
      success: true,
      message: "All platform data (users, activity, payments, downloads, resumes) has been successfully cleared!"
    });
  } catch (error) {
    console.error("Clear data error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear data: " + error.message
    });
  }
};

router.get('/clear-dummy-data', handleClearAllData);
router.post('/clear-all-data', handleClearAllData);
router.delete('/clear-all-data', handleClearAllData);

// Protect all admin endpoints with both JWT auth and HR/Admin role check
router.get('/users', adminAuthMiddleware, adminController.getUsers);
router.get('/payments', adminAuthMiddleware, adminController.getPayments);
router.get('/analytics', adminAuthMiddleware, adminController.getAnalytics);
router.get('/templates', adminAuthMiddleware, adminController.getAllTemplates);
router.get('/templates/:id', adminAuthMiddleware, adminController.getTemplateById);
router.post('/templates', adminAuthMiddleware, upload.single('previewImage'), adminController.createTemplate);
router.put('/templates/:id', adminAuthMiddleware, adminController.updateTemplate);
router.patch('/templates/:id/status', adminAuthMiddleware, adminController.toggleTemplateStatus);
router.delete('/templates/:id', adminAuthMiddleware, adminController.deleteTemplate);

module.exports = router;
