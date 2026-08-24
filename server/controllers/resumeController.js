const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const ResumeLayout = require('../models/ResumeLayout');
const Template = require('../models/Template');
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
    let userId = req.user?.id;
    let user = null;

    if (req.body.userId) {
      const User = require('../models/User');
      user = await User.findOne({ userId: req.body.userId });
      if (!user) {
        user = await User.create({
          userId: req.body.userId,
          isGuest: true,
          email: `${req.body.userId}@guest.local`
        });
      }
      userId = user._id;
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const newResumeId = `RESUME_${Date.now()}`;

    const resumeData = {
      ...req.body,
      resumeId: newResumeId,
      userId
    };

    if (isDBConnected()) {
      const resume = await Resume.create(resumeData);
      return res.status(201).json({ success: true, resume, data: resume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const newResume = {
        _id: Date.now().toString(),
        resumeId: newResumeId,
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

      return res.status(201).json({ success: true, data: newResume, resume: newResume });
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
    const userId = req.user?.id || req.user?._id;
    const resumeId = req.params.id;

    if (isDBConnected()) {
      const idFilter = [];
      if (mongoose.Types.ObjectId.isValid(resumeId)) {
        idFilter.push({ _id: resumeId });
      }
      idFilter.push({ resumeId: resumeId });

      let resume = await Resume.findOne({ $or: idFilter }).populate('layout');
      if (!resume) {
        return res.status(200).json({ 
          success: true, 
          data: { 
            _id: resumeId, 
            resumeId: resumeId, 
            personalInfo: {}, 
            title: 'My Professional Resume',
            templateId: 'modern' 
          } 
        });
      }
      
      // If layout is not linked, create a default one
      if (!resume.layout) {
        const layoutSearchKey = resume._id;
        let layout = await ResumeLayout.findOne({ resumeId: layoutSearchKey });
        if (!layout) {
          layout = await ResumeLayout.create({ resumeId: layoutSearchKey });
        }
        resume.layout = layout._id;
        await resume.save();
        resume = await Resume.findOne({ $or: idFilter }).populate('layout');
      }

      return res.status(200).json({ success: true, data: resume, resume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const resume = localResumes.find(r => r._id === resumeId || r.resumeId === resumeId);
      if (!resume) {
        return res.status(200).json({ 
          success: true, 
          data: { 
            _id: resumeId, 
            resumeId: resumeId, 
            personalInfo: {}, 
            title: 'My Professional Resume',
            templateId: 'modern' 
          } 
        });
      }
      return res.status(200).json({ success: true, data: resume, resume });
    }
  } catch (error) {
    console.error('Get resume by id error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve resume', error: error.message });
  }
};

// Update Resume by ID
exports.updateResume = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const resumeId = req.params.id;
    const { layout: layoutData, personal, ...updateData } = req.body;

    if (personal && !updateData.personalInfo) {
      updateData.personalInfo = personal;
    }
    if (req.body.languages && !updateData.languagesList) {
      updateData.languagesList = req.body.languages;
    }

    if (isDBConnected()) {
      const idFilter = [];
      if (mongoose.Types.ObjectId.isValid(resumeId)) {
        idFilter.push({ _id: resumeId });
      }
      idFilter.push({ resumeId: resumeId });

      let resume = await Resume.findOne({ $or: idFilter });
      if (!resume) {
        // Upsert/Create resume session seamlessly
        resume = await Resume.create({
          ...updateData,
          resumeId: resumeId,
          userId: userId || new mongoose.Types.ObjectId()
        });
        return res.status(200).json({ success: true, data: resume, resume: resume });
      }

      // Update layout if specified
      if (layoutData) {
        const layoutSearchKey = resume._id;
        await ResumeLayout.findOneAndUpdate(
          { resumeId: layoutSearchKey },
          { ...layoutData },
          { new: true, upsert: true }
        );
      }

      const updatedResume = await Resume.findOneAndUpdate(
        { _id: resume._id },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).populate('layout');

      return res.status(200).json({ success: true, data: updatedResume, resume: updatedResume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      let resumeIndex = localResumes.findIndex(r => r._id === resumeId || r.resumeId === resumeId);
      
      if (resumeIndex === -1) {
        const newResume = {
          _id: Date.now().toString(),
          resumeId: resumeId,
          userId: userId || 'guest',
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        localResumes.push(newResume);
        saveLocalResumes(localResumes);
        return res.status(200).json({ success: true, data: newResume });
      }

      const existingResume = localResumes[resumeIndex];
      const updatedResume = {
        ...existingResume,
        ...updateData,
        layout: layoutData ? { ...existingResume.layout, ...layoutData } : existingResume.layout,
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

// Create Resume from Template
exports.createResumeFromTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const { userId, guestId } = req.body;

    if (isDBConnected()) {
      const template = await Template.findById(templateId).populate('layout');
      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      // Create new Resume
      const newResume = await Resume.create({
        userId: userId || null,
        title: `My ${template.name} Resume`,
        templateId: template.name.toLowerCase().replace(/\s+/g, '-'),
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          profileImage: '',
          title: template.name
        },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        languages: [],
        certificates: []
      });

      // Copy template layout
      const templateLayout = template.layout || {};
      const newLayout = await ResumeLayout.create({
        resumeId: newResume._id,
        layout: templateLayout.layout || 'Modern',
        columns: templateLayout.columns || 2,
        header: templateLayout.header || 'top',
        sidebar: templateLayout.sidebar || 'left',
        color: templateLayout.color || '#2563EB',
        font: templateLayout.font || "'Inter', sans-serif",
        fontSize: templateLayout.fontSize || 'medium'
      });

      newResume.layout = newLayout._id;
      await newResume.save();

      const populatedResume = await Resume.findById(newResume._id).populate('layout');
      return res.status(201).json({ success: true, data: populatedResume });
    } else {
      // Local fallback
      const localResumes = getLocalResumes();
      const templatesData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
      const templatesList = templatesData.templates || [];
      const template = templatesList.find(t => t._id === templateId);
      
      if (!template) {
        return res.status(404).json({ success: false, message: 'Template not found' });
      }

      const mockResumeId = 'resume_mock_' + Date.now();
      const templateLayout = template.layout || {};
      
      const newResume = {
        _id: mockResumeId,
        userId: userId || guestId || 'guest_user',
        title: `My ${template.name} Resume`,
        templateId: template.name.toLowerCase().replace(/\s+/g, '-'),
        personalInfo: {
          name: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
          profileImage: '',
          title: template.name
        },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        languages: [],
        certificates: [],
        layout: {
          _id: 'layout_mock_' + Date.now(),
          resumeId: mockResumeId,
          layout: templateLayout.layout || 'Modern',
          columns: templateLayout.columns || 2,
          header: templateLayout.header || 'top',
          sidebar: templateLayout.sidebar || 'left',
          color: templateLayout.color || '#2563EB',
          font: templateLayout.font || "'Inter', sans-serif",
          fontSize: templateLayout.fontSize || 'medium'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localResumes.push(newResume);
      const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
      data.resumes = localResumes;
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

      return res.status(201).json({ success: true, data: newResume });
    }
  } catch (error) {
    console.error('Create from template error:', error);
    res.status(500).json({ success: false, message: 'Failed to create resume from template', error: error.message });
  }
};

// Attach User to Resume by Email (Step 27)
exports.attachUserToResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const User = require('../models/User');
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const idFilter = [];
    if (mongoose.Types.ObjectId.isValid(resumeId)) {
      idFilter.push({ _id: resumeId });
    }
    idFilter.push({ resumeId });

    const resume = await Resume.findOneAndUpdate(
      { $or: idFilter },
      { userId: user._id },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User attached to resume",
      resume,
    });
  } catch (error) {
    console.error("Attach user error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to attach user",
    });
  }
};
