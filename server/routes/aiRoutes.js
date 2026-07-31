const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

// All AI endpoints require authentication
router.post('/improve-summary', protect, aiController.improveSummary);
router.post('/rewrite-project', protect, aiController.rewriteProject);
router.post('/suggest-skills', protect, aiController.suggestSkills);
router.post('/cover-letter', protect, aiController.generateCoverLetter);

module.exports = router;
