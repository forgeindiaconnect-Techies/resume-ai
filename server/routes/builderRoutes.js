const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const protect = require('../middleware/authMiddleware');

// All resume builder routes are protected by JWT authentication
router.post('/', protect, resumeController.createResume);
router.get('/', protect, resumeController.getResumes);
router.get('/:id', protect, resumeController.getResumeById);
router.get('/public/:id', resumeController.getPublicResume);
router.put('/:id', protect, resumeController.updateResume);
router.delete('/:id', protect, resumeController.deleteResume);

module.exports = router;
