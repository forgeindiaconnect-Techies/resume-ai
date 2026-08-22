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

// TEMPORARY ROUTE TO CLEAR DUMMY DATA
router.get('/clear-dummy-data', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.send("MongoDB is not connected.");
    }
    const User = require('../models/User');
    const UserSession = require('../models/UserSession');
    const Payment = require('../models/Payment');
    const Download = require('../models/Download');
    const Resume = require('../models/Resume');
    const Subscription = require('../models/Subscription');
    const bcrypt = require('bcryptjs');

    await UserSession.deleteMany({});
    await Payment.deleteMany({});
    await Download.deleteMany({});
    await Resume.deleteMany({});
    await Subscription.deleteMany({});
    
    // Nuke all users
    await User.deleteMany({});

    // Recreate admin with requested credentials
    const hashedPassword = await bcrypt.hash("Admin@09", 10);
    await User.create({
      userId: "admin_123",
      name: "Administrator",
      email: "admin@forgeindia.com",
      password: hashedPassword,
      role: "admin"
    });

    res.send("<h1>All dummy data has been successfully cleared! You can now close this tab.</h1>");
  } catch (error) {
    res.send("<h1>Error clearing data: " + error.message + "</h1>");
  }
});

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
