const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');

const isDBConnected = () => mongoose.connection.readyState === 1;

// Supported Plans (India Pricing Model)
const PLANS = {
  'Single': { name: '1 Resume Download', amount: 49, currency: 'INR' },
  'Monthly': { name: '1 Month Premium', amount: 199, currency: 'INR' },
  'Quarterly': { name: '3 Months Premium', amount: 399, currency: 'INR' },
  'Yearly': { name: '1 Year Premium', amount: 999, currency: 'INR' }
};

// Local JSON Helpers
const getLocalPayments = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed.payments || [];
  } catch (e) {
    return [];
  }
};

const saveLocalPayment = (payment) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    if (!data.payments) data.payments = [];
    data.payments.push(payment);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Local payments write error:', e.message);
  }
};

const updateLocalPayment = (paymentId, status) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    if (!data.payments) data.payments = [];

    const index = data.payments.findIndex(p => p.paymentId === paymentId);
    if (index !== -1) {
      data.payments[index].status = status;
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
      return data.payments[index];
    }
    return null;
  } catch (e) {
    console.error('Local payments update error:', e.message);
    return null;
  }
};

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { planKey = 'Monthly' } = req.body;
    const userId = req.user ? req.user.id : 'guest_user';

    const selectedPlan = PLANS[planKey] || PLANS['Monthly'];
    const amount = selectedPlan.amount;
    const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9);
    const orderId = 'order_' + Math.random().toString(36).substr(2, 9);

    const orderData = {
      _id: Date.now().toString(),
      userId,
      amount,
      currency: 'INR',
      plan: selectedPlan.name,
      planKey,
      status: 'Pending',
      paymentId,
      orderId,
      createdAt: new Date().toISOString()
    };

    if (isDBConnected() && req.user) {
      await Payment.create({
        userId,
        amount,
        plan: selectedPlan.name,
        status: 'Pending',
        paymentId
      });
    } else {
      saveLocalPayment(orderData);
    }

    return res.status(201).json({
      success: true,
      order: orderData,
      razorpayKey: process.env.RAZORPAY_KEY_ID || 'rzp_test_forgeindiaconnect'
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// Verify Payment & Activate Premium
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, status = 'Completed', razorpay_payment_id } = req.body;
    const userId = req.user ? req.user.id : 'guest_user';

    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Payment reference required' });
    }

    if (isDBConnected() && req.user) {
      await Payment.findOneAndUpdate(
        { paymentId, userId },
        { status: 'Completed', razorpayPaymentId: razorpay_payment_id || paymentId }
      );
      await User.findByIdAndUpdate(userId, { subscription: 'Premium', isPremium: true });
    } else {
      updateLocalPayment(paymentId, 'Completed');
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified! Premium features unlocked 🎉',
      isPremium: true
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// Get Payment History
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'guest_user';

    if (isDBConnected() && req.user) {
      const history = await Payment.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, history });
    } else {
      const localPayments = getLocalPayments();
      const userHistory = localPayments
        .filter(p => p.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, history: userHistory });
    }
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve payment history' });
  }
};
