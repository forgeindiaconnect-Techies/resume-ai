const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

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

const updateLocalPayment = (paymentId, status, extra = {}) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    if (!data.payments) data.payments = [];

    const index = data.payments.findIndex(p => p.paymentId === paymentId || p.razorpayOrderId === paymentId);
    if (index !== -1) {
      data.payments[index].status = status;
      Object.assign(data.payments[index], extra);
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
    const { amount, planKey, resumeSessionId } = req.body;
    const userId = req.user ? req.user.id : 'guest_user';

    const selectedAmount = amount || (PLANS[planKey]?.amount || 49);
    const planName = planKey || 'Resume Download';

    const options = {
      amount: selectedAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    const orderData = {
      _id: Date.now().toString(),
      userId,
      amount: selectedAmount,
      currency: 'INR',
      plan: planName,
      status: 'Pending',
      paymentId: order.id, // Keep for backward compatibility locally
      razorpayOrderId: order.id,
      resumeSessionId: resumeSessionId || null,
      downloadUsed: false,
      createdAt: new Date().toISOString()
    };

    if (isDBConnected() && req.user) {
      await Payment.create({
        userId,
        amount: selectedAmount,
        plan: planName,
        status: 'Pending',
        razorpayOrderId: order.id,
        resumeSessionId: resumeSessionId || null,
        downloadUsed: false
      });
    } else {
      saveLocalPayment(orderData);
    }

    return res.status(201).json({
      success: true,
      order: orderData,
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// Verify Payment & Activate Premium
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user ? req.user.id : 'guest_user';

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment reference required' });
    }

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    if (isDBConnected() && req.user) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id, userId },
        { status: 'Completed', razorpayPaymentId: razorpay_payment_id }
      );
    } else {
      updateLocalPayment(razorpay_order_id, 'Completed', { razorpayPaymentId: razorpay_payment_id });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully!'
    });

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// Check & Use one-time download
exports.useDownload = async (req, res) => {
  try {
    const { resumeSessionId } = req.body;
    const userId = req.user ? req.user.id : 'guest_user';

    if (!resumeSessionId) {
      return res.status(400).json({ success: false, message: 'Resume session ID required' });
    }

    if (isDBConnected() && req.user) {
      const payment = await Payment.findOne({ resumeSessionId, userId, status: 'Completed' }).sort({ createdAt: -1 });
      
      if (!payment) {
        return res.status(404).json({ success: false, message: 'No completed payment found for this resume' });
      }

      if (payment.downloadUsed) {
        return res.status(403).json({ success: false, message: 'Download already used. A new payment is required to download again.' });
      }

      payment.downloadUsed = true;
      await payment.save();

      return res.status(200).json({ success: true, message: 'Download authorized' });
    } else {
      // Local check
      const localPayments = getLocalPayments();
      const userPayments = localPayments.filter(p => p.userId === userId && p.resumeSessionId === resumeSessionId && p.status === 'Completed');
      
      if (userPayments.length === 0) {
        return res.status(404).json({ success: false, message: 'No completed payment found for this resume' });
      }

      // get latest
      userPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestPayment = userPayments[0];

      if (latestPayment.downloadUsed) {
        return res.status(403).json({ success: false, message: 'Download already used. A new payment is required to download again.' });
      }

      updateLocalPayment(latestPayment.razorpayOrderId || latestPayment.paymentId, 'Completed', { downloadUsed: true });

      return res.status(200).json({ success: true, message: 'Download authorized' });
    }

  } catch (error) {
    console.error('Use download error:', error);
    res.status(500).json({ success: false, message: 'Failed to process download authorization' });
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
