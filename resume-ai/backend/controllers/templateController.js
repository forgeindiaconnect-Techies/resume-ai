const ResumeTemplate = require('../models/ResumeTemplate');

// Helper mock resume generator
const generateMockJson = (jobTitle) => ({
  name: 'Pooja Patel',
  role: jobTitle,
  contact: {
    email: 'pooja.patel@careerelite.app',
    phone: '+91 99887 66554',
    location: 'Hyderabad, India',
    linkedin: 'linkedin.com/in/pooja-career',
    github: 'github.com/pooja-dev'
  },
  objective: `Highly motivated and results-oriented professional targeting specialized positions as a ${jobTitle}. Proven expertise in optimizing operations, executing deliverables under tight schedules, and driving enterprise growth.`,
  education: [
    { degree: 'Master of Technology', institution: 'IIT Hyderabad', tenure: '2018 - 2020', cgpa: '9.2' }
  ],
  skills: {
    languages: 'Java, Python, Javascript, SQL',
    frameworks: 'React, Node, Spring Boot, FastAPI',
    tools: 'Docker, AWS, Git, Webpack, Figma'
  },
  experience: [
    {
      title: `Lead ${jobTitle}`,
      company: 'SaaSify Platforms',
      duration: '2021 - Present',
      desc: `Pioneered modular architectures as a senior ${jobTitle}.\nOptimized processing speed by 40% and improved code quality via code reviews and unit testing frameworks.\nCollaborated with UI/UX engineers to deliver highly polished interfaces.`
    }
  ],
  projects: [
    {
      title: 'Enterprise Analytics Engine',
      technology: 'Node, React, PostgreSQL',
      desc: 'Developed a high-availability analytics engine processing millions of events daily and displaying metrics on live dashboards.'
    }
  ],
  training: [`Certified ${jobTitle} Expert`, 'Agile Project Management Certificate']
});

// Seed default templates if empty
const seedDefaultTemplates = async () => {
  try {
    const count = await ResumeTemplate.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default resume templates into MongoDB...');
      const defaults = [
        {
          category: 'Information Technology',
          jobTitle: 'React Developer',
          template: 'Modern',
          previewImage: '/templates/react.png',
          resumeJson: generateMockJson('React Developer'),
          atsScore: 94,
          premium: false
        },
        {
          category: 'Information Technology',
          jobTitle: 'Java Developer',
          template: 'Professional',
          previewImage: '/templates/java.png',
          resumeJson: generateMockJson('Java Developer'),
          atsScore: 92,
          premium: false
        },
        {
          category: 'Information Technology',
          jobTitle: 'Python Developer',
          template: 'Minimal',
          previewImage: '/templates/python.png',
          resumeJson: generateMockJson('Python Developer'),
          atsScore: 95,
          premium: false
        },
        {
          category: 'Education',
          jobTitle: 'High School Teacher',
          template: 'Classic',
          previewImage: '/templates/teacher.png',
          resumeJson: generateMockJson('High School Teacher'),
          atsScore: 90,
          premium: false
        },
        {
          category: 'Finance',
          jobTitle: 'Senior Accountant',
          template: 'Corporate',
          previewImage: '/templates/accountant.png',
          resumeJson: generateMockJson('Senior Accountant'),
          atsScore: 96,
          premium: false
        },
        {
          category: 'Design',
          jobTitle: 'UI/UX Designer',
          template: 'Creative',
          previewImage: '/templates/designer.png',
          resumeJson: generateMockJson('UI/UX Designer'),
          atsScore: 91,
          premium: false
        }
      ];
      await ResumeTemplate.insertMany(defaults);
      console.log('🌱 Successfully seeded MongoDB resume templates!');
    }
  } catch (err) {
    console.error('❌ Error seeding resume templates:', err.message);
  }
};

// Execute check
seedDefaultTemplates();

// CRUD operations
exports.getTemplates = async (req, res) => {
  try {
    const templates = await ResumeTemplate.find().sort({ category: 1, jobTitle: 1 });
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const { category, jobTitle, template, previewImage, resumeJson, atsScore, premium } = req.body;
    
    // Auto-generate mock json if none provided
    const jsonToSave = resumeJson && Object.keys(resumeJson).length > 0 
      ? resumeJson 
      : generateMockJson(jobTitle);

    const newTpl = await ResumeTemplate.create({
      category,
      jobTitle,
      template: template || 'Modern',
      previewImage: previewImage || '',
      resumeJson: jsonToSave,
      atsScore: atsScore || 90,
      premium: !!premium
    });
    
    res.status(201).json({ success: true, data: newTpl });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const updated = await ResumeTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await ResumeTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
