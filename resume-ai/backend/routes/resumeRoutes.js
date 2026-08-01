const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/resume-session', resumeController.initializeSession);
router.route('/resume-session/:sessionId')
  .get(resumeController.getSessionData)
  .put(resumeController.saveSessionData);

module.exports = router;
