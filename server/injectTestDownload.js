const mongoose = require("mongoose");
require("dotenv").config();
const Download = require("./models/Download");

async function injectTest() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    await Download.create({
      sessionId: "test-session",
      guestId: "Guest_101",
      email: "test_insert@gmail.com",
      resumeId: "test-resume",
      downloadType: "watermarked",
      amount: 99,
      downloadedAt: new Date()
    });

    console.log("Test download injected successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

injectTest();
