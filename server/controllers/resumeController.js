const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../database.json');

const isDBConnected = () => mongoose.connection.readyState === 1;

// Local JSON file helpers
const getLocalResumes = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed.resumes || [];
  } catch (e) {
    return [];
  }
};

const saveLocalResumes = (resumes) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    data.resumes = resumes;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Local resumes write failed:', e.message);
  }
};

// Create Resume
exports.createResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeData = {
      ...req.body,
      userId
    };

    if (isDBConnected()) {
      const resume = await Resume.create(resumeData);
      return res.status(201).json({ success: true, data: resume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const newResume = {
        _id: Date.now().toString(),
        userId,
        title: req.body.title || 'Untitled Resume',
        templateId: req.body.templateId || 'modern',
        personalInfo: req.body.personalInfo || { name: '', email: '', phone: '', location: '', summary: '', profileImage: '', title: '' },
        experience: req.body.experience || [],
        education: req.body.education || [],
        projects: req.body.projects || [],
        skills: req.body.skills || [],
        languages: req.body.languages || [],
        certificates: req.body.certificates || [],
        premium: req.body.premium || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localResumes.push(newResume);
      saveLocalResumes(localResumes);

      return res.status(201).json({ success: true, data: newResume });
    }
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to create resume', error: error.message });
  }
};

// Get All Resumes for Authenticated User
exports.getResumes = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isDBConnected()) {
      const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
      return res.status(200).json({ success: true, data: resumes });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const userResumes = localResumes
        .filter(r => r.userId === userId)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      return res.status(200).json({ success: true, data: userResumes });
    }
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resumes' });
  }
};

// Get Single Resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    if (isDBConnected()) {
      const resume = await Resume.findOne({ _id: resumeId, userId });
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
      }
      return res.status(200).json({ success: true, data: resume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const resume = localResumes.find(r => r._id === resumeId && r.userId === userId);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
      }
      return res.status(200).json({ success: true, data: resume });
    }
  } catch (error) {
    console.error('Get resume by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume' });
  }
};

// Update Resume by ID
exports.updateResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;
    const updateData = req.body;

    if (isDBConnected()) {
      const resume = await Resume.findOneAndUpdate(
        { _id: resumeId, userId },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
      }
      return res.status(200).json({ success: true, data: resume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const resumeIndex = localResumes.findIndex(r => r._id === resumeId && r.userId === userId);
      
      if (resumeIndex === -1) {
        return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
      }

      const existingResume = localResumes[resumeIndex];
      const updatedResume = {
        ...existingResume,
        ...updateData,
        _id: existingResume._id, // Prevent ID overwrite
        userId: existingResume.userId, // Prevent ownership hijack
        updatedAt: new Date().toISOString()
      };

      localResumes[resumeIndex] = updatedResume;
      saveLocalResumes(localResumes);

      return res.status(200).json({ success: true, data: updatedResume });
    }
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to update resume', error: error.message });
  }
};

// Delete Resume by ID
exports.deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    if (isDBConnected()) {
      const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
      }
      return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const filteredResumes = localResumes.filter(r => !(r._id === resumeId && r.userId === userId));
      
      if (localResumes.length === filteredResumes.length) {
        return res.status(404).json({ success: false, message: 'Resume not found or unauthorized' });
      }

      saveLocalResumes(filteredResumes);
      return res.status(200).json({ success: true, message: 'Resume deleted successfully' });
    }
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume' });
  }
};

// Get Public Resume by ID (Unauthenticated)
exports.getPublicResume = async (req, res) => {
  try {
    const resumeId = req.params.id;

    if (isDBConnected()) {
      const resume = await Resume.findById(resumeId);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Public resume not found' });
      }
      return res.status(200).json({ success: true, data: resume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const resume = localResumes.find(r => r._id === resumeId);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Public resume not found' });
      }
      return res.status(200).json({ success: true, data: resume });
    }
  } catch (error) {
    console.error('Get public resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve public resume' });
  }
};
