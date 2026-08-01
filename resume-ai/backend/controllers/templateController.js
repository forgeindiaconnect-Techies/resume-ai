const Category = require('../models/Category');
const JobRole = require('../models/JobRole');
const ResumeTemplate = require('../models/ResumeTemplate');
const ResumeSection = require('../models/ResumeSection');

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

// Seed default data on startup if empty
const seedDatabase = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('🌱 Seeding normalized database collections...');
      
      const cat1 = await Category.create({ name: 'Information Technology', icon: '💻' });
      const cat2 = await Category.create({ name: 'Business', icon: '💼' });
      const cat3 = await Category.create({ name: 'Finance', icon: '💵' });
      
      const role1 = await JobRole.create({ categoryId: cat1._id, title: 'React Developer', slug: 'react-developer' });
      const role2 = await JobRole.create({ categoryId: cat1._id, title: 'Java Developer', slug: 'java-developer' });
      const role3 = await JobRole.create({ categoryId: cat2._id, title: 'Project Manager', slug: 'project-manager' });

      const tpl1 = await ResumeTemplate.create({
        jobRoleId: role1._id,
        templateName: 'Modern Blue',
        previewImage: 'react-modern.png',
        layout: 'modern-blue',
        premium: false
      });

      const tpl2 = await ResumeTemplate.create({
        jobRoleId: role2._id,
        templateName: 'Professional Dark',
        previewImage: 'java-pro.png',
        layout: 'professional-dark',
        premium: false
      });

      // Default sections mapping
      await ResumeSection.create({ templateId: tpl1._id, section: 'Personal Details', order: 1 });
      await ResumeSection.create({ templateId: tpl1._id, section: 'Summary', order: 2 });
      await ResumeSection.create({ templateId: tpl1._id, section: 'Experience', order: 3 });
      await ResumeSection.create({ templateId: tpl1._id, section: 'Projects', order: 4 });
      await ResumeSection.create({ templateId: tpl1._id, section: 'Skills', order: 5 });

      await ResumeSection.create({ templateId: tpl2._id, section: 'Personal Details', order: 1 });
      await ResumeSection.create({ templateId: tpl2._id, section: 'Summary', order: 2 });
      await ResumeSection.create({ templateId: tpl2._id, section: 'Experience', order: 3 });

      console.log('🌱 Seed successful!');
    }
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
  }
};

seedDatabase();

// --- API Controllers ---

// 1. Categories CRUD
exports.getCategories = async (req, res) => {
  try {
    const list = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const item = await Category.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Category not found' });
    // Clean up linked Roles
    await JobRole.deleteMany({ categoryId: req.params.id });
    res.status(200).json({ success: true, message: 'Category and child roles deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 2. Job Roles CRUD
exports.getJobRoles = async (req, res) => {
  try {
    const list = await JobRole.find().populate('categoryId').sort({ title: 1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createJobRole = async (req, res) => {
  try {
    const { categoryId, title } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const item = await JobRole.create({ categoryId, title, slug });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateJobRole = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const updated = await JobRole.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Role not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteJobRole = async (req, res) => {
  try {
    const deleted = await JobRole.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Role not found' });
    res.status(200).json({ success: true, message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 3. Resume Templates CRUD
exports.getTemplates = async (req, res) => {
  try {
    const list = await ResumeTemplate.find().populate('jobRoleId').sort({ templateName: 1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const item = await ResumeTemplate.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    const updated = await ResumeTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTemplate = async (req, res) => {
  try {
    const deleted = await ResumeTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Template not found' });
    // Clean up sections
    await ResumeSection.deleteMany({ templateId: req.params.id });
    res.status(200).json({ success: true, message: 'Template deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Resume Sections CRUD
exports.getSections = async (req, res) => {
  try {
    const list = await ResumeSection.find({ templateId: req.query.templateId }).sort({ order: 1 });
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const item = await ResumeSection.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const deleted = await ResumeSection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Section not found' });
    res.status(200).json({ success: true, message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 5. Public Dynamic Load: GET /api/template/:slug
exports.getTemplateBySlug = async (req, res) => {
  try {
    const role = await JobRole.findOne({ slug: req.params.slug });
    if (!role) return res.status(404).json({ success: false, message: 'Job role not found for slug ' + req.params.slug });

    const template = await ResumeTemplate.findOne({ jobRoleId: role._id });
    if (!template) {
      // Return a basic fallback response
      return res.status(200).json({
        success: true,
        templateName: 'Modern Blue',
        layout: 'modern-blue',
        sections: ['Personal Details', 'Summary', 'Experience', 'Projects', 'Skills'],
        resumeJson: generateMockJson(role.title)
      });
    }

    // Load active sections ordered
    const sections = await ResumeSection.find({ templateId: template._id }).sort({ order: 1 });
    const sectionNames = sections.map(s => s.section);

    res.status(200).json({
      success: true,
      templateName: template.templateName,
      layout: template.layout,
      sections: sectionNames.length > 0 ? sectionNames : ['Personal Details', 'Summary', 'Experience', 'Projects', 'Skills'],
      resumeJson: generateMockJson(role.title)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
