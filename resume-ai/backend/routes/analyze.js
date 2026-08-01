const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyze, optimize } = require('../controllers/analyzeController');

// ... (multer setup)

router.post('/', upload.single('resume'), analyze);
router.post('/optimize', optimize);

module.exports = router;
