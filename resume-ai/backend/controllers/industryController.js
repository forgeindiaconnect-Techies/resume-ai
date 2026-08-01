const Industry = require('../models/Industry');
const ResumeExample = require('../models/ResumeExample');

// Initial seed data for 15 industries matching Enhancv sitemap
const initialIndustries = [
  { name: 'Information Technology', icon: 'Laptop', description: 'Software Engineering, DevOps, Cloud, Cybersecurity, QA, AI & Data Science examples.' },
  { name: 'Business', icon: 'Briefcase', description: 'Management, consulting, project management, and business operation layouts.' },
  { name: 'Engineering', icon: 'Settings', description: 'Civil, mechanical, electrical, chemical, and aerospace designs.' },
  { name: 'Healthcare', icon: 'Activity', description: 'Clinicians, nurses, pharmacologists, and healthcare advisors.' },
  { name: 'Finance', icon: 'DollarSign', description: 'Certified accountant, auditor, risk manager, and investor formats.' },
  { name: 'Education', icon: 'BookOpen', description: 'Teachers, professors, academic advisors, and librarians.' },
  { name: 'Design', icon: 'Palette', description: 'Graphic, fashion, UI/UX, product, and architectural layouts.' },
  { name: 'Marketing', icon: 'TrendingUp', description: 'SEO consultants, content writers, marketing managers, and social developers.' },
  { name: 'Sales', icon: 'Target', description: 'Account managers, business development associates, and retail reps.' },
  { name: 'Hospitality', icon: 'Coffee', description: 'Head chefs, catering directors, hotel management, and receptionists.' },
  { name: 'Government', icon: 'FileText', description: 'Public policy analysts, program coordinators, and public safety officers.' },
  { name: 'Legal', icon: 'Shield', description: 'Lawyer, paralegal, associate counselor, and corporate law resumes.' },
  { name: 'Aviation', icon: 'Plane', description: 'Commercial pilots, flight attendants, and aerospace safety inspectors.' },
  { name: 'Manufacturing', icon: 'Cpu', description: 'Plant managers, supply chain analysts, and production lines.' },
  { name: 'Others', icon: 'HelpCircle', description: 'Customer success reps, translators, and creative freelance layouts.' }
];

// Rich array of examples to seed
const initialResumeExamples = [
  // IT Examples
  { jobTitle: 'Frontend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 92, resumeScore: 95, description: 'Responsive web engineering, component design tokens, and performance benchmarks.' },
  { jobTitle: 'Backend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 94, resumeScore: 91, description: 'Microservices, database scaling, API gateway routing, and SQL/NoSQL performance tuning.' },
  { jobTitle: 'Full Stack Developer', experience: '5-10 Years', template: 'Modern', atsScore: 97, resumeScore: 96, description: 'End-to-end architecture handling robust state management, auth modules, and cloud deployment.' },
  { jobTitle: 'React Developer', experience: '2-5 Years', template: 'Modern', atsScore: 95, resumeScore: 94, description: 'React hooks optimization, custom state logic, Redux middleware, and client performance.' },
  { jobTitle: 'Angular Developer', experience: '2-5 Years', template: 'Professional', atsScore: 91, resumeScore: 90, description: 'TypeScript architectures, RxJS stream patterns, and component directives.' },
  { jobTitle: 'Vue Developer', experience: '2-5 Years', template: 'Minimal', atsScore: 93, resumeScore: 92, description: 'Vuex setups, composition APIs, and reactive interfaces.' },
  { jobTitle: 'Node.js Developer', experience: '2-5 Years', template: 'Modern', atsScore: 96, resumeScore: 93, description: 'Non-blocking I/O event loops, stream buffering, Express routers, and NestJS modules.' },
  { jobTitle: 'Java Developer', experience: '5-10 Years', template: 'Professional', atsScore: 98, resumeScore: 92, description: 'Spring Boot configuration, cloud routing, security filters, and OOP design patterns.' },
  { jobTitle: 'Python Developer', experience: '2-5 Years', template: 'Minimal', atsScore: 94, resumeScore: 90, description: 'FastAPI routing, data parsing pipelines, script automation, and ML integration.' },
  { jobTitle: 'DevOps Engineer', experience: '5-10 Years', template: 'Executive', atsScore: 97, resumeScore: 95, description: 'Kubernetes orchestration, Docker build configs, CI/CD runners, and infrastructure as code.' },
  { jobTitle: 'Cloud Engineer', experience: '2-5 Years', template: 'Modern', atsScore: 93, resumeScore: 91, description: 'AWS routing, cloudformation parameters, serverless lambda layers, and S3 structures.' },
  { jobTitle: 'Cyber Security Engineer', experience: '5-10 Years', template: 'Professional', atsScore: 96, resumeScore: 92, description: 'Firewall rules, pen testing, system vulnerability audits, and JWT secure tokens.' },
  { jobTitle: 'AI Engineer', experience: '2-5 Years', template: 'Creative', atsScore: 92, resumeScore: 95, description: 'Neural network modeling, natural language processors, PyTorch architectures, and API integrations.' },
  { jobTitle: 'Data Scientist', experience: '2-5 Years', template: 'Modern', atsScore: 94, resumeScore: 93, description: 'Statistical models, Pandas dataframes, predictive analytics, and dashboard charts.' },
  { jobTitle: 'QA Engineer', experience: '2-5 Years', template: 'Minimal', atsScore: 95, resumeScore: 91, description: 'Cypress testing suites, Selenium pipelines, unit integration, and QA checklists.' },
  
  // Non-IT Examples
  { jobTitle: 'Project Manager', experience: '5-10 Years', template: 'Executive', atsScore: 96, resumeScore: 94, description: 'Agile sprints, stakeholder interfaces, resource balancing, and deliverable pipelines.' },
  { jobTitle: 'Business Analyst', experience: '2-5 Years', template: 'Professional', atsScore: 94, resumeScore: 92, description: 'Requirements documentation, gap audits, data analysis, and technical mapping.' },
  { jobTitle: 'Sales Specialist', experience: '2-5 Years', template: 'Modern', atsScore: 91, resumeScore: 95, description: 'Outbound sales strategies, Salesforce pipelines, and customer acquisition.' },
  { jobTitle: 'UI/UX Designer', experience: '2-5 Years', template: 'Creative', atsScore: 90, resumeScore: 96, description: 'User personas, interactive Figma wireframes, brand guides, and asset delivery.' },
  { jobTitle: 'Doctor', experience: '5-10 Years', template: 'Professional', atsScore: 95, resumeScore: 98, description: 'General medical diagnosis, surgical records, patient advisory, and clinical management.' },
  { jobTitle: 'Nurse', experience: '2-5 Years', template: 'Minimal', atsScore: 97, resumeScore: 94, description: 'Emergency room administration, patient chart monitoring, and clinical support.' }
];

// Prefilled JSON mock generator helper
const generateMockJson = (jobTitle) => {
  return {
    name: 'Pooja Patel',
    role: jobTitle,
    contact: {
      email: 'pooja.patel@careerelite.app',
      phone: '+91 99887 66554',
      location: 'Hyderabad, India',
      linkedin: 'linkedin.com/in/pooja-career',
      github: 'github.com/pooja-dev'
    },
    objective: `Highly driven and performance-focused professional targeting specialized roles as a ${jobTitle}. Proven capabilities in client relationship building, technical optimization, and scalable execution within high-performance environments.`,
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
        desc: `Pioneered core modules for enterprise operations as ${jobTitle}.\nOptimized process latency and workflows by 40% through strict code refactoring and agile execution.\nManaged and mentored a junior engineer cohort, accelerating deliverable speed by 25%.`
      }
    ],
    projects: [
      {
        title: 'Enterprise Analytics Engine',
        technology: 'Node, React, PostgreSQL',
        desc: 'Developed a high-availability dashboard displaying real-time business performance metrics and automated user reports.'
      }
    ],
    training: [`Certified ${jobTitle} Specialist`, 'Professional Career Agile Certification'],
    languagesList: ['English', 'Hindi', 'Telugu'],
    references: 'Available upon request'
  };
};

// Seed database execution helper
const seedDatabase = async () => {
  try {
    const industryCount = await Industry.countDocuments();
    if (industryCount === 0) {
      console.log('🌱 Seeding 15 industry categories matching sitemap...');
      const created = await Industry.insertMany(initialIndustries);
      
      console.log('🌱 Seeding detailed resume examples...');
      const itIndustry = created.find(c => c.name === 'Information Technology');
      const bizIndustry = created.find(c => c.name === 'Business');
      const engIndustry = created.find(c => c.name === 'Engineering');
      const healthIndustry = created.find(c => c.name === 'Healthcare');
      const designIndustry = created.find(c => c.name === 'Design');
      const salesIndustry = created.find(c => c.name === 'Sales');

      const mappedExamples = initialResumeExamples.map(ex => {
        let indId = itIndustry._id; // default IT
        if (['Project Manager', 'Business Analyst'].includes(ex.jobTitle)) indId = bizIndustry._id;
        if (['UI/UX Designer'].includes(ex.jobTitle)) indId = designIndustry._id;
        if (['Doctor', 'Nurse'].includes(ex.jobTitle)) indId = healthIndustry._id;
        if (['Sales Specialist'].includes(ex.jobTitle)) indId = salesIndustry._id;

        return {
          ...ex,
          industryId: indId,
          resumeJson: generateMockJson(ex.jobTitle)
        };
      });

      await ResumeExample.insertMany(mappedExamples);
      console.log('🌱 Database successfully seeded with sitemap schemas!');
    }
  } catch (err) {
    console.error('❌ Database seeding failure:', err.message);
  }
};

// Start seeding
seedDatabase();

// ─── INDUSTRY CONTROLLER METHODS ───

exports.getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: industries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createIndustry = async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const newIndustry = await Industry.create({ name, icon, description });
    res.status(201).json({ success: true, data: newIndustry });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateIndustry = async (req, res) => {
  try {
    const updated = await Industry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Industry category not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteIndustry = async (req, res) => {
  try {
    const deleted = await Industry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Industry category not found' });
    await ResumeExample.deleteMany({ industryId: req.params.id });
    res.status(200).json({ success: true, message: 'Industry category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESUME EXAMPLE CONTROLLER METHODS ───

exports.getExamplesByIndustry = async (req, res) => {
  try {
    const examples = await ResumeExample.find({ industryId: req.params.industryId }).sort({ jobTitle: 1 });
    res.status(200).json({ success: true, data: examples });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllResumeExamples = async (req, res) => {
  try {
    const examples = await ResumeExample.find().populate('industryId', 'name').sort({ jobTitle: 1 });
    res.status(200).json({ success: true, data: examples });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExampleById = async (req, res) => {
  try {
    const example = await ResumeExample.findById(req.params.id).populate('industryId', 'name');
    if (!example) return res.status(404).json({ success: false, message: 'Resume example not found' });
    res.status(200).json({ success: true, data: example });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createResumeExample = async (req, res) => {
  try {
    const newExample = await ResumeExample.create(req.body);
    res.status(201).json({ success: true, data: newExample });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateResumeExample = async (req, res) => {
  try {
    const updated = await ResumeExample.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Resume example not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteResumeExample = async (req, res) => {
  try {
    const deleted = await ResumeExample.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Resume example not found' });
    res.status(200).json({ success: true, message: 'Resume example deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
