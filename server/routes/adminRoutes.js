const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Admin Login Route (Unprotected)
router.post('/auth/login', adminController.loginAdmin);

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
