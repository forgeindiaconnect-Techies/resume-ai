const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Allow guest/freemium checkout without blocking on auth token
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const jwt = require('jsonwebtoken');
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySuperSecretKey123');
      req.user = decoded;
    }
  } catch (e) {}
  next();
};

router.post('/create-order', optionalAuth, paymentController.createOrder);
router.post('/verify', optionalAuth, paymentController.verifyPayment);
router.get('/history', optionalAuth, paymentController.getHistory);

module.exports = router;
