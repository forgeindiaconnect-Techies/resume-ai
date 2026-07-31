const express = require('express');
const router = express.Router();
const { match } = require('../controllers/matchController');

router.post('/', match);

module.exports = router;
