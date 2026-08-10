const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');
const JWT_SECRET = process.env.JWT_SECRET || 'forge_secret_key_123_abc';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Local JSON file helpers
const getLocalUsers = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed.users || [];
  } catch (e) {
    return [];
  }
};

const saveLocalUser = (user) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    if (!data.users) data.users = [];
    data.users.push(user);
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Local user save failed:', e.message);
  }
};

const generateToken = (userId, email, role) => {
  return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const assignedRole = role === 'HR' ? 'HR' : 'Employee';

    if (isDBConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: assignedRole
      });

      const token = generateToken(user._id, user.email, user.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || '',
          subscription: user.subscription
        }
      });
    } else {
      // Local fallback
      const localUsers = getLocalUsers();
      const userExists = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      // Hash password manually for local
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newLocalUser = {
        _id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: assignedRole,
        profileImage: '',
        subscription: 'Free',
        createdAt: new Date().toISOString()
      };

      saveLocalUser(newLocalUser);

      const token = generateToken(newLocalUser._id, newLocalUser.email, newLocalUser.role);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newLocalUser._id,
          name: newLocalUser.name,
          email: newLocalUser.email,
          role: newLocalUser.role,
          profileImage: newLocalUser.profileImage,
          subscription: newLocalUser.subscription
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (isDBConnected()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated by the administrator.",
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.email, user.role);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || '',
          subscription: user.subscription
        }
      });
    } else {
      // Local fallback
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      if (user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated by the administrator.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.email, user.role);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || '',
          subscription: user.subscription
        }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isDBConnected()) {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, user });
    } else {
      const localUsers = getLocalUsers();
      const user = localUsers.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json({ success: true, user: userWithoutPassword });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, profileImage, subscription } = req.body;

    if (isDBConnected()) {
      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (profileImage !== undefined) updatedFields.profileImage = profileImage;
      if (subscription) updatedFields.subscription = subscription;

      const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true }).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, user });
    } else {
      // Local fallback
      const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
      if (!data.users) data.users = [];

      const userIndex = data.users.findIndex(u => u._id === userId);
      if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) data.users[userIndex].name = name;
      if (profileImage !== undefined) data.users[userIndex].profileImage = profileImage;
      if (subscription) data.users[userIndex].subscription = subscription;

      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

      const { password, ...userWithoutPassword } = data.users[userIndex];
      return res.status(200).json({ success: true, user: userWithoutPassword });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};
