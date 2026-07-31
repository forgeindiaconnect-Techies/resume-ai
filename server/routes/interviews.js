const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

// POST generate unique token for an interview
router.post('/generate', candidateController.generateInterviewToken);

// GET validate token and fetch interview data
router.get('/validate/:token', candidateController.validateToken);

module.exports = router;
