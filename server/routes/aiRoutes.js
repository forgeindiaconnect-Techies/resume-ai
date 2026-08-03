const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI Assistant & Generation Endpoints
router.post('/improve', aiController.improve);
router.post('/improve-summary', aiController.improveSummary);
router.post('/rewrite-project', aiController.rewriteProject);
router.post('/suggest-skills', aiController.suggestSkills);
router.post('/cover-letter', aiController.generateCoverLetter);
router.post('/generate', aiController.generateResume);

module.exports = router;
