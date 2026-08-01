const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ResumeExample = require('../models/ResumeExample');

const DB_PATH = path.join(__dirname, '../database.json');
const isDBConnected = () => mongoose.connection.readyState === 1;

// Initial 10 Professional Sample Resume Examples Data
const seedExamplesData = [
  {
    title: "Project Manager",
    category: "Business",
    industry: "Business Operations",
    experienceLevel: "3-6 Years",
    template: "executive",
    atsScore: 96,
    isFeatured: true,
    isPremium: false,
    description: "PMP certified Project Manager skilled in Agile methodologies, cross-functional team leadership, and budget allocation.",
    resumeData: {
      personalInfo: {
        fullName: "Alexander Wright",
        role: "Senior Project Manager",
        email: "a.wright@forgeindiaconnect.app",
        phone: "+1 (555) 389-2041",
        location: "Chicago, IL",
        linkedin: "linkedin.com/in/alexander-wright-pm"
      },
      summary: "PMP-certified Project Manager with 6+ years of experience leading cross-functional teams to deliver enterprise software solutions on time and under budget.",
      skills: ["Agile", "Scrum", "Kanban", "Jira", "Budgeting", "Risk Management"],
      experience: [
        {
          title: "Senior Project Manager",
          company: "Apex Global Enterprises",
          duration: "2021 - Present",
          desc: "Managed 12+ concurrent digital transformation projects with total budgets exceeding $4.5M."
        }
      ],
      education: [{ degree: "B.S. in Business Administration", institution: "Northwestern University", tenure: "2014 - 2018" }],
      projects: [{ title: "Enterprise Cloud Migration", technology: "AWS, Jira", desc: "Led a team of 18 engineers migrating legacy infrastructure to AWS cloud." }],
      certifications: ["PMP Certified", "Certified Scrum Master (CSM)"]
    }
  },
  {
    title: "Business Analyst",
    category: "Business",
    industry: "Business Analytics",
    experienceLevel: "2-5 Years",
    template: "professional",
    atsScore: 94,
    isFeatured: true,
    isPremium: false,
    description: "Data-driven Business Analyst proficient in requirements gathering, process mapping, and SQL data modeling.",
    resumeData: {
      personalInfo: {
        fullName: "Rachel Sterling",
        role: "Lead Business Analyst",
        email: "rachel.s@forgeindiaconnect.app",
        phone: "+1 (555) 742-9910",
        location: "New York, NY",
        linkedin: "linkedin.com/in/rachel-sterling-ba"
      },
      summary: "Detail-oriented Business Analyst with 4+ years of experience bridging business needs and technical solutions.",
      skills: ["SQL", "Python", "PowerBI", "Tableau", "Agile", "BPMN"],
      experience: [
        {
          title: "Lead Business Analyst",
          company: "Sterling Solutions Inc.",
          duration: "2020 - Present",
          desc: "Identified process bottlenecks resulting in $250K annual operational savings."
        }
      ],
      education: [{ degree: "B.S. in Information Systems", institution: "NYU Stern", tenure: "2016 - 2020" }],
      projects: [{ title: "Customer Churn Analytics Pipeline", technology: "Python, SQL, PowerBI", desc: "Built predictive analytics model forecasting customer retention with 88% accuracy." }],
      certifications: ["CBAP Certified", "Tableau Desktop Specialist"]
    }
  },
  {
    title: "Frontend Developer",
    category: "Engineering",
    industry: "Software Engineering",
    experienceLevel: "2-4 Years",
    template: "creative",
    atsScore: 95,
    isFeatured: true,
    isPremium: false,
    description: "Creative Frontend Developer passionate about UI/UX polish, React, TypeScript, and Tailwind CSS.",
    resumeData: {
      personalInfo: {
        fullName: "Elena Rostova",
        role: "Frontend Developer",
        email: "elena.r@forgeindiaconnect.app",
        phone: "+1 (555) 234-5678",
        location: "Austin, TX",
        linkedin: "linkedin.com/in/elena-rostova-fe",
        github: "github.com/elena-ui"
      },
      summary: "Frontend Developer with 3+ years of experience crafting accessible, responsive React interfaces.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript (ES6+)", "Redux Toolkit"],
      experience: [
        {
          title: "Frontend Developer",
          company: "PixelCraft Design Studios",
          duration: "2021 - Present",
          desc: "Built modular component library consumed across 5 SaaS web applications."
        }
      ],
      education: [{ degree: "B.S. in Web Development", institution: "UT Austin", tenure: "2017 - 2021" }],
      projects: [{ title: "Design System Library", technology: "React, Tailwind, Storybook", desc: "Created reusable component system reducing developer onboarding time by 35%." }],
      certifications: ["Meta Frontend Developer Professional Certificate"]
    }
  },
  {
    title: "Backend Developer",
    category: "Engineering",
    industry: "Software Engineering",
    experienceLevel: "3-6 Years",
    template: "executive",
    atsScore: 96,
    isFeatured: true,
    isPremium: false,
    description: "Robust Backend Engineer focused on microservices, PostgreSQL indexing, Express.js, and API security.",
    resumeData: {
      personalInfo: {
        fullName: "Marcus Brody",
        role: "Backend Engineer",
        email: "m.brody@forgeindiaconnect.app",
        phone: "+1 (555) 987-6543",
        location: "Denver, CO",
        linkedin: "linkedin.com/in/marcus-brody-be",
        github: "github.com/mbrody"
      },
      summary: "Backend Specialist with 5 years of experience engineering secure REST and GraphQL APIs.",
      skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS"],
      experience: [
        {
          title: "Backend Engineer",
          company: "DataStream Systems",
          duration: "2019 - Present",
          desc: "Designed event-driven streaming pipeline processing 500K messages per second."
        }
      ],
      education: [{ degree: "B.S. in Software Engineering", institution: "Colorado School of Mines", tenure: "2015 - 2019" }],
      projects: [{ title: "Secure Payment Gateway API", technology: "Node.js, PostgreSQL, Stripe", desc: "Built PCI-compliant payment orchestration service managing $10M+ in volume." }],
      certifications: ["AWS Certified Developer Associate"]
    }
  },
  {
    title: "Full Stack Developer",
    category: "Engineering",
    industry: "Software Engineering",
    experienceLevel: "4-8 Years",
    template: "modern",
    atsScore: 98,
    isFeatured: true,
    isPremium: false,
    description: "End-to-end Full Stack Engineer experienced in MERN stack, microservices, and DevOps deployment.",
    resumeData: {
      personalInfo: {
        fullName: "David Chen",
        role: "Full Stack Engineer",
        email: "david.chen@forgeindiaconnect.app",
        phone: "+1 (555) 456-7890",
        location: "Seattle, WA",
        linkedin: "linkedin.com/in/davidchen-dev",
        github: "github.com/davidchen-dev"
      },
      summary: "Performance-driven Software Engineer with 6 years of experience building high-throughput web applications.",
      skills: ["TypeScript", "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS"],
      experience: [
        {
          title: "Full Stack Engineer",
          company: "CloudScale Technologies",
          duration: "2019 - Present",
          desc: "Architected microservices handling 2M+ daily active requests with 99.99% uptime."
        }
      ],
      education: [{ degree: "B.S. in Computer Science", institution: "University of Washington", tenure: "2015 - 2019" }],
      projects: [{ title: "Real-Time Collaboration Engine", technology: "React, WebSockets, Node.js", desc: "Engineered real-time document editor supporting multi-user concurrent edits." }],
      certifications: ["AWS Certified Solutions Architect"]
    }
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    industry: "Digital Design",
    experienceLevel: "2-5 Years",
    template: "minimal",
    atsScore: 93,
    isFeatured: false,
    isPremium: false,
    description: "User-centered UI/UX Designer specialized in wireframing, user research, Figma prototyping, and design systems.",
    resumeData: {
      personalInfo: {
        fullName: "Sophia Martinez",
        role: "Senior UI/UX Designer",
        email: "sophia.m@forgeindiaconnect.app",
        phone: "+1 (555) 345-6789",
        location: "Los Angeles, CA",
        linkedin: "linkedin.com/in/sophia-uiux"
      },
      summary: "Empathetic UI/UX Designer with 5 years of experience creating intuitive digital experiences.",
      skills: ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing"],
      experience: [
        {
          title: "Senior UI/UX Designer",
          company: "Creative Edge Media",
          duration: "2020 - Present",
          desc: "Led product design for iOS/Android app with over 1M downloads."
        }
      ],
      education: [{ degree: "B.F.A. in Interaction Design", institution: "Rhode Island School of Design", tenure: "2015 - 2019" }],
      projects: [{ title: "Fintech Mobile Banking App Redesign", technology: "Figma, User Testing", desc: "Redesigned core onboarding flow reducing drop-off rate by 28%." }],
      certifications: ["Google UX Design Professional Certificate"]
    }
  },
  {
    title: "Graphic Designer",
    category: "Design",
    industry: "Brand & Graphic Design",
    experienceLevel: "2-4 Years",
    template: "creative",
    atsScore: 92,
    isFeatured: false,
    isPremium: false,
    description: "Creative Visual Designer experienced in brand identity, marketing assets, vector design, and Adobe Suite.",
    resumeData: {
      personalInfo: {
        fullName: "Lucas Vance",
        role: "Visual Graphic Designer",
        email: "lucas.vance@forgeindiaconnect.app",
        phone: "+1 (555) 890-4321",
        location: "Chicago, IL",
        linkedin: "linkedin.com/in/lucas-vance-design"
      },
      summary: "Visual Graphic Designer with 4 years of experience creating compelling brand collateral and digital ads.",
      skills: ["Adobe Illustrator", "Photoshop", "InDesign", "Branding", "Typography", "Vector Illustration"],
      experience: [
        {
          title: "Visual Graphic Designer",
          company: "Vanguard Studios",
          duration: "2021 - Present",
          desc: "Created 300+ digital ad assets generating 25% higher click-through rates."
        }
      ],
      education: [{ degree: "B.A. in Graphic Design", institution: "Columbia College Chicago", tenure: "2017 - 2021" }],
      projects: [{ title: "Global Brand Rebrand Campaign", technology: "Adobe Creative Cloud", desc: "Designed brand identity package including logo, typography scale, and brand guidelines." }],
      certifications: ["Adobe Certified Professional"]
    }
  },
  {
    title: "Digital Marketing Specialist",
    category: "Marketing",
    industry: "Digital Marketing",
    experienceLevel: "3-6 Years",
    template: "creative",
    atsScore: 94,
    isFeatured: false,
    isPremium: false,
    description: "Strategic Growth Marketing Manager skilled in SEO, paid campaigns, content strategy, and ROI optimization.",
    resumeData: {
      personalInfo: {
        fullName: "Claire Dupont",
        role: "Growth Marketing Manager",
        email: "claire.d@forgeindiaconnect.app",
        phone: "+1 (555) 876-5432",
        location: "Miami, FL",
        linkedin: "linkedin.com/in/claire-dupont-mktg"
      },
      summary: "Data-driven Growth Marketing Manager with 5+ years of experience scaling organic and paid customer acquisition channels.",
      skills: ["SEO", "SEM", "Google Analytics 4", "Meta Ads", "Hubspot", "Email Marketing"],
      experience: [
        {
          title: "Growth Marketing Manager",
          company: "SaaS Growth Agency",
          duration: "2020 - Present",
          desc: "Managed $800K annual performance marketing budget delivering a 4.2x ROAS."
        }
      ],
      education: [{ degree: "B.A. in Marketing", institution: "University of Florida", tenure: "2015 - 2019" }],
      projects: [{ title: "Product Hunt Launch Campaign", technology: "Hubspot, Social Media, Email", desc: "Orchestrated viral Product Hunt launch resulting in #1 Product of the Day." }],
      certifications: ["Google Ads Search Certification", "Hubspot Inbound Marketing"]
    }
  },
  {
    title: "SEO Specialist",
    category: "Marketing",
    industry: "Search Engine Optimization",
    experienceLevel: "2-5 Years",
    template: "professional",
    atsScore: 95,
    isFeatured: false,
    isPremium: false,
    description: "Technical SEO Lead experienced in keyword research, backlink acquisition, site audits, and organic traffic growth.",
    resumeData: {
      personalInfo: {
        fullName: "Nathan Cole",
        role: "Senior SEO Specialist",
        email: "n.cole@forgeindiaconnect.app",
        phone: "+1 (555) 543-2109",
        location: "Atlanta, GA",
        linkedin: "linkedin.com/in/nathan-cole-seo"
      },
      summary: "Technical SEO Specialist with 4 years of experience boosting organic search visibility and domain authority.",
      skills: ["Technical SEO", "Ahrefs", "SEMrush", "Screaming Frog", "Content Strategy", "Schema Markup"],
      experience: [
        {
          title: "Senior SEO Specialist",
          company: "Organic Reach Media",
          duration: "2021 - Present",
          desc: "Increased organic website sessions by 180% within 12 months."
        }
      ],
      education: [{ degree: "B.S. in Information Technology", institution: "Georgia State University", tenure: "2016 - 2020" }],
      projects: [{ title: "E-Commerce Core Web Vitals SEO Audit", technology: "Screaming Frog, Google Search Console", desc: "Fixed 400+ crawl errors resulting in 35% increase in top 3 Google rankings." }],
      certifications: ["Semrush SEO Toolkit Certification"]
    }
  },
  {
    title: "Teacher",
    category: "Education",
    industry: "Secondary Education",
    experienceLevel: "3-7 Years",
    template: "minimal",
    atsScore: 95,
    isFeatured: false,
    isPremium: false,
    description: "Dedicated STEM Educator specialized in curriculum development, classroom management, and student mentorship.",
    resumeData: {
      personalInfo: {
        fullName: "Hannah Abbott",
        role: "High School STEM Teacher",
        email: "hannah.a@forgeindiaconnect.app",
        phone: "+1 (555) 789-0123",
        location: "Dallas, TX",
        linkedin: "linkedin.com/in/hannah-abbott-edu"
      },
      summary: "Passionate STEM Educator with 6 years of experience developing interactive curricula and elevating standardized test scores.",
      skills: ["Curriculum Development", "Classroom Management", "STEM Education", "Differentiated Learning", "Student Assessment"],
      experience: [
        {
          title: "High School STEM Teacher",
          company: "Dallas Academy",
          duration: "2018 - Present",
          desc: "Developed AP Computer Science curriculum resulting in 92% exam pass rate."
        }
      ],
      education: [{ degree: "M.Ed. in Secondary Education", institution: "SMU", tenure: "2016 - 2018" }],
      projects: [{ title: "Interactive Robotics Club", technology: "Arduino, Python", desc: "Founded school robotics team winning 1st place in regional STEM competition." }],
      certifications: ["State Teaching License", "Google Certified Educator"]
    }
  }
];

// Helper to get local DB examples
const getLocalExamples = () => {
  if (!fs.existsSync(DB_PATH)) return seedExamplesData;
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data || '{}');
    return parsed.resumeExamples && parsed.resumeExamples.length > 0 ? parsed.resumeExamples : seedExamplesData;
  } catch (e) {
    return seedExamplesData;
  }
};

const saveLocalExamples = (examples) => {
  try {
    const data = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8') || '{}') : {};
    data.resumeExamples = examples;
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Local save failed:', e.message);
  }
};

// @route POST /api/examples (Create)
exports.createResumeExample = async (req, res) => {
  try {
    if (isDBConnected()) {
      const example = await ResumeExample.create(req.body);
      return res.status(201).json({ success: true, data: example });
    } else {
      const examples = getLocalExamples();
      const newExample = { _id: 'example_id_' + Date.now(), ...req.body, createdAt: new Date().toISOString() };
      examples.unshift(newExample);
      saveLocalExamples(examples);
      return res.status(201).json({ success: true, data: newExample });
    }
  } catch (error) {
    console.error('Create Resume Example error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route GET /api/examples (Get All)
exports.getAllResumeExamples = async (req, res) => {
  try {
    if (isDBConnected()) {
      let examples = await ResumeExample.find().sort({ createdAt: -1 });
      if (examples.length === 0) {
        examples = await ResumeExample.insertMany(seedExamplesData);
      }
      return res.status(200).json({ success: true, count: examples.length, data: examples });
    } else {
      const examples = getLocalExamples();
      return res.status(200).json({ success: true, count: examples.length, data: examples });
    }
  } catch (error) {
    console.error('Get All Resume Examples Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/examples/search
exports.searchResumeExamples = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return exports.getAllResumeExamples(req, res);
    }
    const regex = new RegExp(q, 'i');
    if (isDBConnected()) {
      const examples = await ResumeExample.find({
        $or: [{ title: regex }, { category: regex }, { industry: regex }, { description: regex }]
      });
      return res.status(200).json({ success: true, count: examples.length, data: examples });
    } else {
      const examples = getLocalExamples().filter(
        e => regex.test(e.title) || regex.test(e.category) || regex.test(e.industry || '') || regex.test(e.description || '')
      );
      return res.status(200).json({ success: true, count: examples.length, data: examples });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/examples/category/:category
exports.getResumeExamplesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (isDBConnected()) {
      const examples = await ResumeExample.find({
        category: { $regex: new RegExp(`^${category}$`, 'i') }
      });
      return res.status(200).json({ success: true, count: examples.length, data: examples });
    } else {
      const examples = getLocalExamples().filter(e => e.category.toLowerCase() === category.toLowerCase());
      return res.status(200).json({ success: true, count: examples.length, data: examples });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/examples/:id
exports.getResumeExampleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const example = await ResumeExample.findById(id);
      if (!example) {
        return res.status(404).json({ success: false, message: 'Example not found' });
      }
      return res.status(200).json({ success: true, data: example });
    } else {
      const examples = getLocalExamples();
      const example = examples.find(e => e._id === id || e.title.toLowerCase().replace(/\s+/g, '-') === id);
      if (!example) {
        return res.status(404).json({ success: false, message: 'Example not found' });
      }
      return res.status(200).json({ success: true, data: example });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/examples/:id (Update)
exports.updateResumeExample = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const example = await ResumeExample.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!example) {
        return res.status(404).json({ success: false, message: 'Example not found' });
      }
      return res.status(200).json({ success: true, data: example });
    } else {
      const examples = getLocalExamples();
      const idx = examples.findIndex(e => e._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Example not found' });
      }
      const updated = { ...examples[idx], ...req.body, updatedAt: new Date().toISOString() };
      examples[idx] = updated;
      saveLocalExamples(examples);
      return res.status(200).json({ success: true, data: updated });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/examples/:id (Delete)
exports.deleteResumeExample = async (req, res) => {
  try {
    const { id } = req.params;
    if (isDBConnected()) {
      const example = await ResumeExample.findByIdAndDelete(id);
      if (!example) {
        return res.status(404).json({ success: false, message: 'Example not found' });
      }
      return res.status(200).json({ success: true, message: 'Example deleted successfully' });
    } else {
      const examples = getLocalExamples();
      const filtered = examples.filter(e => e._id !== id);
      if (examples.length === filtered.length) {
        return res.status(404).json({ success: false, message: 'Example not found' });
      }
      saveLocalExamples(filtered);
      return res.status(200).json({ success: true, message: 'Example deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
