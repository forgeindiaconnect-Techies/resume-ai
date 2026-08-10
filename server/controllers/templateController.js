const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Template = require('../models/Template');
const ResumeLayout = require('../models/ResumeLayout');
const Resume = require('../models/Resume');

const DB_PATH = path.join(__dirname, '../database.json');
const isDBConnected = () => mongoose.connection.readyState === 1;

// Local JSON file helpers
const getLocalTemplates = () => {
  if (!fs.existsSync(DB_PATH)) return [];
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed.templates || [];
  } catch (e) {
    return [];
  }
};

const saveLocalTemplates = (templates) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    data.templates = templates;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Local templates write failed:', e.message);
  }
};

// Get All Templates
exports.getTemplates = async (req, res) => {
  try {
    if (isDBConnected()) {
      const templates = await Template.find({ isActive: true })
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: templates.length,
        templates,
      });
    } else {
      // Local fallback
      const templates = getLocalTemplates().filter(t => t.isActive !== false);
      res.status(200).json({
        success: true,
        count: templates.length,
        templates,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const templateId = req.params.id;

    if (isDBConnected()) {
      const template = await Template.findById(templateId).populate("layout");

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      res.status(200).json({
        success: true,
        data: template,
      });
    } else {
      // Local fallback
      const templates = getLocalTemplates();
      const template = templates.find(t => t._id === templateId);
      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }
      res.status(200).json({
        success: true,
        data: template,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Template
exports.createTemplate = async (req, res) => {
  try {
    if (isDBConnected()) {
      const template = await Template.create(req.body);
      res.status(201).json({
        success: true,
        data: template,
      });
    } else {
      // Local fallback
      const templates = getLocalTemplates();
      const newTemplate = {
        _id: 'template_mock_id_' + Date.now().toString(),
        ...req.body,
        isPremium: req.body.isPremium || false,
        isActive: req.body.isActive || true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      templates.push(newTemplate);
      saveLocalTemplates(templates);

      res.status(201).json({
        success: true,
        data: newTemplate,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Template
exports.updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    if (isDBConnected()) {
      const template = await Template.findByIdAndUpdate(
        templateId,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("layout");

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      res.status(200).json({
        success: true,
        data: template,
      });
    } else {
      // Local fallback
      const templates = getLocalTemplates();
      const idx = templates.findIndex(t => t._id === templateId);
      if (idx === -1) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }
      const updated = {
        ...templates[idx],
        ...req.body,
        _id: templates[idx]._id,
        updatedAt: new Date().toISOString()
      };
      templates[idx] = updated;
      saveLocalTemplates(templates);

      res.status(200).json({
        success: true,
        data: updated,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Template
exports.deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;

    if (isDBConnected()) {
      const template = await Template.findByIdAndDelete(templateId);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Template deleted successfully",
      });
    } else {
      // Local fallback
      const templates = getLocalTemplates();
      const filtered = templates.filter(t => t._id !== templateId);
      if (templates.length === filtered.length) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }
      saveLocalTemplates(filtered);

      res.status(200).json({
        success: true,
        message: "Template deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Resume from Template
exports.createResumeFromTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const { userId, guestId } = req.body;

    if (isDBConnected()) {
      const template = await Template.findById(templateId).populate("layout");

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
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
      res.status(201).json({
        success: true,
        data: populatedResume,
      });

    } else {
      // Local fallback
      const templates = getLocalTemplates();
      const template = templates.find(t => t._id === templateId);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }

      const mockResumeId = 'resume_mock_' + Date.now();
      const templateLayout = template.layout || {};

      const localResumes = [];
      if (fs.existsSync(DB_PATH)) {
        try {
          const fileData = JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}');
          localResumes.push(...(fileData.resumes || []));
        } catch (e) {}
      }

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

      res.status(201).json({
        success: true,
        data: newResume,
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
