const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    sparse: true,
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  isGuest: {
    type: Boolean,
    default: false
  },
  anonymousId: {
    type: String,
    unique: true,
    sparse: true,
  },
  lastSeenAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Employee', 'HR', 'admin'],
    default: 'Employee'
  },
  profileImage: {
    type: String,
    default: ''
  },
  subscription: {
    type: String,
    enum: ['Free', 'Premium'],
    default: 'Free'
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }
}, {
  timestamps: true
});

// Pre-save hook to hash passwords
UserSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare candidate password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
