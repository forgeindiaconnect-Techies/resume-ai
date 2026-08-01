const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Protect all admin endpoints with both JWT auth and HR/Admin role check
router.get('/users', protect, adminOnly, adminController.getUsers);
router.get('/payments', protect, adminOnly, adminController.getPayments);
router.get('/analytics', protect, adminOnly, adminController.getAnalytics);

module.exports = router;
