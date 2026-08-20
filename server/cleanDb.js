const mongoose = require("mongoose");
require("dotenv").config({ path: require('path').resolve(__dirname, '.env') });

const User = require("./models/User");
const UserSession = require("./models/UserSession");
const Payment = require("./models/Payment");
const Download = require("./models/Download");
const Resume = require("./models/Resume");
const Subscription = require("./models/Subscription");

const clearDummyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB. Clearing data...");

    // Delete all sessions, payments, downloads, resumes, and subscriptions
    await UserSession.deleteMany({});
    console.log("User sessions cleared.");
    
    await Payment.deleteMany({});
    console.log("Payments cleared.");
    
    await Download.deleteMany({});
    console.log("Downloads cleared.");
    
    await Resume.deleteMany({});
    console.log("Resumes cleared.");
    
    await Subscription.deleteMany({});
    console.log("Subscriptions cleared.");

    // Delete all users EXCEPT the admin account
    const result = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`Cleared ${result.deletedCount} non-admin users.`);

    console.log("All dummy data removed successfully! You can close this process.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
};

clearDummyData();
