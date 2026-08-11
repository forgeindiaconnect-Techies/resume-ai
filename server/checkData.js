const mongoose = require('mongoose');
require('dotenv').config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const User = require('./models/User');
    const Resume = require('./models/Resume');
    const Payment = require('./models/Payment');
    
    const userCount = await User.countDocuments();
    const guestUserCount = await User.countDocuments({ name: 'Guest User' });
    const users = await User.find({}, 'name email role').lean();

    console.log(`Total Users: ${userCount}`);
    console.log(`Guest Users: ${guestUserCount}`);
    console.log('All Users:');
    console.table(users);
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkData();
