const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const UserSession = require("./models/UserSession");
const Payment = require("./models/Payment");
const Resume = require("./models/Resume");
const Download = require("./models/Download");
const Subscription = require("./models/Subscription");
const ResumeAnalysis = require("./models/ResumeAnalysis");
const AIReport = require("./models/AIReport");
const ActivityLog = require("./models/ActivityLog");
const Candidate = require("./models/Candidate");
const TemporaryResume = require("./models/TemporaryResume");
const UploadedResume = require("./models/UploadedResume");

async function clearAdminData() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");

    await UserSession.deleteMany({});
    console.log("✅ User sessions cleared");

    await Payment.deleteMany({});
    console.log("✅ Payments cleared");

    await Download.deleteMany({});
    console.log("✅ Downloads cleared");

    await Resume.deleteMany({});
    console.log("✅ Resumes cleared");

    await Subscription.deleteMany({});
    console.log("✅ Subscriptions cleared");

    await ResumeAnalysis.deleteMany({});
    console.log("✅ Resume Analyses cleared");

    if (AIReport) await AIReport.deleteMany({});
    if (ActivityLog) await ActivityLog.deleteMany({});
    if (Candidate) await Candidate.deleteMany({});
    if (TemporaryResume) await TemporaryResume.deleteMany({});
    if (UploadedResume) await UploadedResume.deleteMany({});

    // Delete non-admin users only
    const deletedUsers = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`✅ Non-admin users cleared (${deletedUsers.deletedCount} removed)`);

    console.log("\n🎉 Admin Dashboard data successfully cleared to 0!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing admin data:", error);
    process.exit(1);
  }
}

clearAdminData();

