require('dotenv').config();
const mongoose = require('mongoose');
const Resume = require('./server/models/Resume');
const User = require('./server/models/User');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  try {
    const actualResumeId = 'session_1787208732868';
    let resume = await Resume.findOne({ resumeId: actualResumeId });
    console.log("Resume found?", !!resume);

    if (!resume) {
      resume = await Resume.create({
        userId: new mongoose.Types.ObjectId(),
        resumeId: actualResumeId.startsWith("RESUME_") ? actualResumeId : `RESUME_${Date.now()}`,
        title: "My Resume"
      });
      console.log("Created resume:", resume.resumeId);
    }
  } catch (err) {
    console.error("TEST FAILED:", err);
  } finally {
    process.exit(0);
  }
}

test();
