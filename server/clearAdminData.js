const mongoose = require("mongoose");
require("dotenv").config();


const UserSession = require("./models/UserSession");
const Payment = require("./models/Payment");
const Resume = require("./models/Resume");
const Download = require("./models/Download");


async function clearAdminData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);


    console.log("✅ MongoDB Connected");


    await UserSession.deleteMany({});
    await Payment.deleteMany({});
    await Resume.deleteMany({});
    await Download.deleteMany({});


    console.log("✅ User session data cleared");
    console.log("✅ Payment data cleared");
    console.log("✅ Resume data cleared");
    console.log("✅ Admin Dashboard test data cleared");


    await mongoose.disconnect();
    process.exit(0);


  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}


clearAdminData();
