const mongoose = require('mongoose');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Resume = require('../models/Resume');
const Candidate = require('../models/Candidate');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');

const isDBConnected = () => mongoose.connection.readyState === 1;

// Local JSON Helpers
const getLocalCollection = (key) => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed[key] || [];
  } catch (e) {
    return [];
  }
};

// Retrieve all users
exports.getUsers = async (req, res) => {
  try {
    if (isDBConnected()) {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, users });
    } else {
      const localUsers = getLocalCollection('users');
      const usersWithoutPassword = localUsers.map(({ password, ...u }) => u);
      return res.status(200).json({ success: true, users: usersWithoutPassword });
    }
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};

// Retrieve all payments
exports.getPayments = async (req, res) => {
  try {
    if (isDBConnected()) {
      const payments = await Payment.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, payments });
    } else {
      const localPayments = getLocalCollection('payments');
      const localUsers = getLocalCollection('users');
      
      // Mimic mongoose populate locally
      const populatedPayments = localPayments.map(p => {
        const user = localUsers.find(u => u._id === p.userId) || { name: 'Unknown User', email: '' };
        return {
          ...p,
          userId: { _id: p.userId, name: user.name, email: user.email }
        };
      });
      
      return res.status(200).json({ success: true, payments: populatedPayments });
    }
  } catch (error) {
    console.error('Admin getPayments error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve payments history' });
  }
};

// Retrieve platform metrics
exports.getAnalytics = async (req, res) => {
  try {
    let totalUsers = 0;
    let premiumUsers = 0;
    let totalResumes = 0;
    let totalRevenue = 0;

    if (isDBConnected()) {
      totalUsers = await User.countDocuments({});
      premiumUsers = await User.countDocuments({ subscription: 'Premium' });
      totalResumes = await Resume.countDocuments({});
      
      const completedPayments = await Payment.find({ status: 'Completed' });
      totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    } else {
      const localUsers = getLocalCollection('users');
      totalUsers = localUsers.length;
      premiumUsers = localUsers.filter(u => u.subscription === 'Premium').length;
      
      const localResumes = getLocalCollection('resumes');
      totalResumes = localResumes.length;

      const localPayments = getLocalCollection('payments');
      totalRevenue = localPayments
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0);
    }

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        premiumUsers,
        totalResumes,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        conversionRate: totalUsers > 0 ? parseFloat(((premiumUsers / totalUsers) * 100).toFixed(1)) : 0
      }
    });
  } catch (error) {
    console.error('Admin getAnalytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate metrics report' });
  }
};
