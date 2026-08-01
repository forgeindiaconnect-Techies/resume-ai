const Industry = require('../models/Industry');
const ResumeExample = require('../models/ResumeExample');

// Initial seed data for industries
const initialIndustries = [
  { name: 'Information Technology', icon: 'Laptop', description: 'Professional IT Resume Examples' },
  { name: 'Business', icon: 'Briefcase', description: 'Resume examples for administrative and management roles' },
  { name: 'Engineering', icon: 'Settings', description: 'Resume formats for electrical, mechanical, and civil engineering' },
  { name: 'Healthcare', icon: 'Activity', description: 'Clinical and medical professional resumes' },
  { name: 'Finance', icon: 'DollarSign', description: 'Resume layouts for accounting and financial services' },
  { name: 'Education', icon: 'BookOpen', description: 'Resumes for teachers, advisors, and academic staff' },
  { name: 'Design', icon: 'Palette', description: 'Portfolio and creative layouts for designers' },
  { name: 'Marketing', icon: 'TrendingUp', description: 'Marketing managers and content strategist resumes' },
  { name: 'Sales', icon: 'Target', description: 'Client facing, retail, and business development resumes' },
  { name: 'Hospitality', icon: 'Coffee', description: 'Resumes for chefs, hotel managers, and service crew' }
];

// Initial seed data for resume examples
const initialResumeExamples = [
  {
    jobTitle: 'Frontend Developer',
    experience: '2-5 Years',
    template: 'Modern',
    atsScore: 92,
    resumeScore: 95,
    description: 'A professional frontend engineer specialized in responsive React web apps.',
    resumeJson: {
      name: 'Aakash Sharma',
      role: 'Frontend Developer',
      contact: {
        email: 'aakash.sharma@example.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka',
        linkedin: 'linkedin.com/in/aakash-frontend',
        github: 'github.com/aakash-dev'
      },
      objective: 'Passionate and detail-oriented Frontend Developer with 3+ years of experience building responsive, accessible, and high-performance web applications. Expert in React, modern JavaScript, and UI design systems.',
      education: [
        { degree: 'B.Tech in Computer Science', institution: 'Vellore Institute of Technology', tenure: '2017 - 2021', cgpa: '8.9' }
      ],
      skills: {
        languages: 'JavaScript (ES6+), TypeScript, HTML5, CSS3',
        frameworks: 'React.js, Next.js, Redux Toolkit, Tailwind CSS',
        tools: 'Git, Webpack, Vite, Figma'
      },
      experience: [
        {
          title: 'Software Engineer (Frontend)',
          company: 'TechSolutions Pvt. Ltd.',
          duration: '2021 - Present',
          desc: 'Developed and optimized 15+ user-facing features using React and Next.js, improving page load speeds by 35%.\nCollaborated closely with UI/UX designers to translate Figma design tokens into clean, modular CSS/Tailwind components.\nBuilt a reusable component library that reduced code duplication across 3 different company dashboards.'
        }
      ],
      projects: [
        {
          title: 'E-Commerce Dashboard',
          technology: 'React, Tailwind, Chart.js',
          desc: 'Created an analytical dashboard for managing products, tracking sales metrics, and viewing customer behavior reports.'
        }
      ],
      training: ['React Advanced Certification', 'Meta Frontend Developer Professional Certificate']
    }
  },
  {
    jobTitle: 'Backend Developer',
    experience: '2-5 Years',
    template: 'Modern',
    atsScore: 94,
    resumeScore: 91,
    description: 'Focused on backend microservices, SQL caching, and REST/GraphQL integrations.',
    resumeJson: {
      name: 'Rohan Gupta',
      role: 'Backend Developer',
      contact: {
        email: 'rohan.gupta@example.com',
        phone: '+91 91234 56789',
        location: 'Pune, Maharashtra',
        github: 'github.com/rohan-back'
      },
      objective: 'Skilled Backend Developer with a deep focus on building scalable server-side systems, API architectures, and robust database models. Experienced in Node.js, Express, and distributed cloud computing systems.',
      education: [
        { degree: 'B.E. in Information Technology', institution: 'Pune University', tenure: '2016 - 2020' }
      ],
      skills: {
        languages: 'Node.js, Python, SQL, NoSQL',
        frameworks: 'Express.js, Django, NestJS',
        tools: 'Docker, AWS, PostgreSQL, MongoDB, Redis'
      },
      experience: [
        {
          title: 'Backend Engineer',
          company: 'CloudMatrix Labs',
          duration: '2020 - Present',
          desc: 'Designed and maintained 30+ RESTful microservices processing over 500,000 monthly transactions.\nOptimized SQL database query latency by 45% through custom indexing, normalization, and Redis caching layers.\nSet up CI/CD pipelines using GitHub Actions to automate server testing and deployment on AWS ECS instances.'
        }
      ],
      projects: [
        {
          title: 'Real-time Analytics Pipeline',
          technology: 'Node.js, Kafka, PostgreSQL',
          desc: 'Engineered a highly available pipeline to consume stream data, process events in real-time, and store analytics.'
        }
      ],
      training: ['AWS Certified Solutions Architect', 'MongoDB Developer Associate']
    }
  },
  {
    jobTitle: 'Full Stack Developer',
    experience: '5-10 Years',
    template: 'Modern',
    atsScore: 97,
    resumeScore: 96,
    description: 'Expertise across full lifecycle engineering of high performance web systems.',
    resumeJson: {
      name: 'Priyanka Sen',
      role: 'Full Stack Developer',
      contact: {
        email: 'priyanka.sen@example.com',
        phone: '+91 99887 76655',
        location: 'Hyderabad, Telangana',
        linkedin: 'linkedin.com/in/priyanka-stack'
      },
      objective: 'Versatile Full Stack Developer with 4+ years of hands-on experience designing, developing, and deploying robust end-to-end web architectures. Comfortable navigating both frontend user interfaces and backend infrastructures.',
      education: [
        { degree: 'Master of Computer Applications', institution: 'Osmania University', tenure: '2018 - 2021' }
      ],
      skills: {
        languages: 'JavaScript, TypeScript, Python, SQL',
        frameworks: 'React, Node.js, Express, Next.js, Mui',
        tools: 'Docker, MongoDB, PostgreSQL, Git, AWS'
      },
      experience: [
        {
          title: 'Senior Full Stack Engineer',
          company: 'GlobalTech Systems',
          duration: '2021 - Present',
          desc: 'Led end-to-end development of a SaaS HR platform, managing a product scale from 0 to 10k active customers.\nRefactored legacy Monolith backend to Node/React micro-frontends, increasing engineering workflow speed by 50%.\nWorked with JWT-based security layers, OAuth, and custom session middleware to secure sensitive payroll systems.'
        }
      ],
      projects: [
        {
          title: 'Project Planner App',
          technology: 'React, Express, MongoDB, Socket.io',
          desc: 'Developed a real-time collaborative task board with progress tracking charts, drag-and-drop lists, and live comments.'
        }
      ],
      training: ['Full Stack Professional Bootcamp Certificate', 'Scrum Master Cert']
    }
  }
];

// Helper to seed database if empty
const seedDatabase = async () => {
  try {
    const industryCount = await Industry.countDocuments();
    if (industryCount === 0) {
      console.log('🌱 Seeding initial industry categories...');
      const createdIndustries = await Industry.insertMany(initialIndustries);
      
      const itIndustry = createdIndustries.find(ind => ind.name === 'Information Technology');
      if (itIndustry) {
        console.log('🌱 Seeding initial resume examples for IT...');
        const examplesWithIds = initialResumeExamples.map(ex => ({
          ...ex,
          industryId: itIndustry._id
        }));
        await ResumeExample.insertMany(examplesWithIds);
      }
    }
  } catch (error) {
    console.error('❌ Error seeding industry database:', error);
  }
};

// Auto run check
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
    // Also delete cascade resume examples associated
    await ResumeExample.deleteMany({ industryId: req.params.id });
    res.status(200).json({ success: true, message: 'Industry and its resume examples deleted successfully' });
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
