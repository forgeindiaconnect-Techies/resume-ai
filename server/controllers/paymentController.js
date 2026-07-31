const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');

const isDBConnected = () => mongoose.connection.readyState === 1;

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

// Create Payment Order
exports.createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user.id;

    if (!plan || !['Basic', 'Pro'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid subscription plan selected' });
    }

    const amount = plan === 'Pro' ? 19.99 : 9.99;
    const paymentId = 'pay_' + Math.random().toString(36).substr(2, 9);

    if (isDBConnected()) {
      const order = await Payment.create({
        userId,
        amount,
        plan,
        status: 'Pending',
        paymentId
      });
      return res.status(201).json({ success: true, order });
    } else {
      // Local fallback
      const localOrder = {
        _id: Date.now().toString(),
        userId,
        amount,
        plan,
        status: 'Pending',
        paymentId,
        createdAt: new Date().toISOString()
      };
      saveLocalPayment(localOrder);
      return res.status(201).json({ success: true, order: localOrder });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    const userId = req.user.id;

    if (!paymentId || !status) {
      return res.status(400).json({ success: false, message: 'Payment reference and status required' });
    }

    if (isDBConnected()) {
      const order = await Payment.findOne({ paymentId, userId });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Payment order reference not found' });
      }

      order.status = status;
      await order.save();

      if (status === 'Completed') {
        // Upgrade user subscription state
        await User.findByIdAndUpdate(userId, { subscription: 'Premium' });
      }

      return res.status(200).json({ success: true, message: 'Payment verified successfully', order });
    } else {
      // Local fallback
      const updatedOrder = updateLocalPayment(paymentId, status);
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: 'Payment order reference not found' });
      }

      if (status === 'Completed') {
        // Update user in local DB
        const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
        if (data.users) {
          const userIdx = data.users.findIndex(u => u._id === userId);
          if (userIdx !== -1) {
            data.users[userIdx].subscription = 'Premium';
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
          }
        }
      }

      return res.status(200).json({ success: true, message: 'Payment verified successfully (local)', order: updatedOrder });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// Get Payment History
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isDBConnected()) {
      const history = await Payment.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, history });
    } else {
      // Local fallback
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
