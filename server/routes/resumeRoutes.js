const express = require("express");
const multer = require("multer");
const Resume = require("../models/Resume");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const router = express.Router();

// Robust local fallback path
const DB_PATH = path.join(__dirname, '../database.json');

const getLocalResumes = () => {
    if (!fs.existsSync(DB_PATH)) return [];
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const parsed = JSON.parse(data || '{}');
        return parsed.resumes || [];
    } catch (e) { return []; }
};

const saveLocalResume = (resume) => {
    try {
        const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
        if (!data.resumes) data.resumes = [];
        data.resumes.unshift(resume); // Add to beginning
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) { console.error('Local save failed:', e.message); }
};

const isDBConnected = () => mongoose.connection.readyState === 1;

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// @route POST /api/upload-resume
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    const { employeeName, email } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const resumeData = {
      employeeName,
      email,
      fileName: req.file.filename,
      filePath: req.file.path.replace(/\\/g, '/'), // Normalize path for web
      uploadDate: new Date(),
    };

    if (isDBConnected()) {
        const newResume = new Resume(resumeData);
        await newResume.save();
        return res.status(200).json({ success: true, message: "Resume saved to MongoDB", data: newResume });
    } else {
        const newResume = { _id: Date.now().toString(), ...resumeData };
        saveLocalResume(newResume);
        return res.status(200).json({ success: true, message: "Resume saved locally (DB offline)", data: newResume });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
});

// @route GET /api/resumes
router.get("/resumes", async (req, res) => {
  try {
    if (isDBConnected()) {
        const resumes = await Resume.find().sort({ uploadDate: -1 });
        return res.status(200).json(resumes);
    }
    const resumes = getLocalResumes();
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
});

const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');
const premiumMiddleware = require('../middleware/premiumMiddleware');
const Download = require('../models/Download');

// Dummy backend download endpoint just to secure the API conceptually as requested
router.post('/download', authMiddleware, premiumMiddleware, async (req, res) => {
  try {
    const subscription = req.subscription;
    
    await Download.create({
      userId: req.user._id,
      subscriptionId: subscription._id,
      planId: subscription.planId,
      downloadedAt: new Date(),
    });

    res.json({ success: true, message: "Download authorized via premium subscription and tracked" });
  } catch (error) {
    console.error("Download tracking error:", error);
    res.status(500).json({ success: false, message: "Failed to process download" });
  }
});

router.post('/resume-session/use-template/:id', authMiddleware, resumeController.createResumeFromTemplate);
router.post('/resume-session', authMiddleware, resumeController.createResume);
router.route('/resume-session/:id')
  .get(authMiddleware, resumeController.getResumeById)
  .put(authMiddleware, resumeController.updateResume);

module.exports = router;
