export const resumeCategories = [
  { id: 'business', name: 'Business', icon: 'Briefcase', count: 5 },
  { id: 'design', name: 'Design', icon: 'Palette', count: 5 },
  { id: 'education', name: 'Education', icon: 'BookOpen', count: 5 },
  { id: 'engineering', name: 'Engineering', icon: 'Settings', count: 5 },
  { id: 'finance', name: 'Finance', icon: 'DollarSign', count: 5 },
  { id: 'healthcare', name: 'Healthcare', icon: 'Activity', count: 5 },
  { id: 'it', name: 'Information Technology', icon: 'Laptop', count: 6 },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', count: 5 },
  { id: 'sales', name: 'Sales', icon: 'Target', count: 5 }
];

export const resumeExamples = {
  Business: [
    {
      id: 'biz-pm',
      title: 'Project Manager',
      category: 'Business',
      experience: '3-6 Years',
      atsScore: 96,
      templateId: 'executive',
      description: 'PMP certified Project Manager skilled in Agile methodologies, cross-functional team leadership, and budget allocation.',
      resumeData: {
        name: 'Alexander Wright',
        role: 'Senior Project Manager',
        contact: { email: 'a.wright@forgeindiaconnect.app', phone: '+1 (555) 389-2041', location: 'Chicago, IL', linkedin: 'linkedin.com/in/alexander-wright-pm' },
        objective: 'PMP-certified Project Manager with 6+ years of experience leading cross-functional teams to deliver enterprise software solutions on time and under budget. Reduced product launch timelines by 25%.',
        education: [{ degree: 'B.S. in Business Administration', institution: 'Northwestern University', tenure: '2014 - 2018', cgpa: '3.8 / 4.0' }],
        skills: { languages: 'Project Governance, Agile Execution, Leadership', frameworks: 'Scrum, Kanban, Prince2', tools: 'Jira, Asana, MS Project, Tableau' },
        experience: [
          { title: 'Senior Project Manager', company: 'Apex Global Enterprises', duration: '2021 - Present', desc: '• Managed 12+ concurrent digital transformation projects with total budgets exceeding $4.5M.\n• Engineered sprint workflows resulting in a 30% increase in team velocity.' },
          { title: 'Associate Project Manager', company: 'Vanguard Operations', duration: '2018 - 2021', desc: '• Coordinated project schedules, risk registers, and stakeholder deliverables across 4 engineering departments.' }
        ],
        projects: [{ title: 'Enterprise Cloud Migration', technology: 'AWS, Jira, Confluence', desc: 'Led a team of 18 engineers migrating legacy infrastructure to AWS cloud.' }]
      }
    },
    {
      id: 'biz-ba',
      title: 'Business Analyst',
      category: 'Business',
      experience: '2-5 Years',
      atsScore: 94,
      templateId: 'professional',
      description: 'Data-driven Business Analyst proficient in requirements gathering, process mapping, and SQL data modeling.',
      resumeData: {
        name: 'Rachel Sterling',
        role: 'Lead Business Analyst',
        contact: { email: 'rachel.s@forgeindiaconnect.app', phone: '+1 (555) 742-9910', location: 'New York, NY', linkedin: 'linkedin.com/in/rachel-sterling-ba' },
        objective: 'Detail-oriented Business Analyst with 4+ years of experience bridging business needs and technical solutions. Expert in SQL modeling and executive dashboarding.',
        education: [{ degree: 'B.S. in Information Systems', institution: 'NYU Stern', tenure: '2016 - 2020', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'SQL, Python, Business Requirements', frameworks: 'BPMN, Agile, SDLC', tools: 'PowerBI, Tableau, Excel, SQL Server' },
        experience: [
          { title: 'Lead Business Analyst', company: 'Sterling Solutions Inc.', duration: '2020 - Present', desc: '• Synthesized business requirements into clear user stories for 4 development teams.\n• Identified process bottlenecks resulting in $250K annual operational savings.' }
        ],
        projects: [{ title: 'Customer Churn Analytics Pipeline', technology: 'Python, SQL, PowerBI', desc: 'Built predictive analytics model forecasting customer retention with 88% accuracy.' }]
      }
    },
    {
      id: 'biz-ops',
      title: 'Operations Manager',
      category: 'Business',
      experience: '5-8 Years',
      atsScore: 95,
      templateId: 'modern',
      description: 'Results-focused Operations Manager specializing in supply chain logistics, Lean manufacturing, and cost reduction.',
      resumeData: {
        name: 'Marcus Vance',
        role: 'Director of Operations',
        contact: { email: 'm.vance@forgeindiaconnect.app', phone: '+1 (555) 832-1104', location: 'Atlanta, GA', linkedin: 'linkedin.com/in/marcus-vance-ops' },
        objective: 'Accomplished Operations Manager with 7+ years optimizing supply chain logistics and departmental workflows. Spearheaded Lean initiatives reducing annual overhead by 22%.',
        education: [{ degree: 'B.S. in Industrial Operations', institution: 'Georgia Tech', tenure: '2013 - 2017', cgpa: '3.7 / 4.0' }],
        skills: { languages: 'Supply Chain, Operations Management, Vendor Negotiation', frameworks: 'Six Sigma Black Belt, Lean Logistics', tools: 'SAP ERP, Oracle SCM, Tableau' },
        experience: [
          { title: 'Director of Operations', company: 'Apex Supply Chain Solutions', duration: '2020 - Present', desc: '• Directed daily fulfillment operations for a 150,000 sq ft logistics facility.\n• Reduced inventory holding costs by 18% while maintaining a 99.4% order accuracy rate.' }
        ],
        projects: [{ title: 'Automated Warehouse Inventory Integration', technology: 'RFID, SAP ERP', desc: 'Deployed real-time barcode tracking system reducing stock audit times from 3 days to 4 hours.' }]
      }
    },
    {
      id: 'biz-po',
      title: 'Product Owner',
      category: 'Business',
      experience: '3-6 Years',
      atsScore: 97,
      templateId: 'creative',
      description: 'Strategic Product Owner adept at backlog prioritization, roadmap creation, and stakeholder alignment for SaaS products.',
      resumeData: {
        name: 'Samantha Chen',
        role: 'Senior Product Owner',
        contact: { email: 's.chen@forgeindiaconnect.app', phone: '+1 (555) 609-4421', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/samantha-chen-po' },
        objective: 'CSPO-certified Product Owner driving customer-centric SaaS product development. Increased monthly active users (MAU) by 45% through iterative release cycles.',
        education: [{ degree: 'B.S. in Computer Science & Business', institution: 'UC Berkeley', tenure: '2015 - 2019', cgpa: '3.95 / 4.0' }],
        skills: { languages: 'Product Strategy, User Research, Roadmap Planning', frameworks: 'Scrum, SAFe, Design Thinking', tools: 'Jira, Productboard, Figma, Mixpanel' },
        experience: [
          { title: 'Senior Product Owner', company: 'CloudPulse SaaS', duration: '2021 - Present', desc: '• Managed product backlog for an enterprise fintech platform serving 250,000+ users.\n• Led cross-functional team of 14 software engineers and UX designers.' }
        ],
        projects: [{ title: 'Self-Service Customer Portal Redesign', technology: 'React, Node.js, Mixpanel', desc: 'Redesigned core onboarding flow, increasing 30-day user retention by 28%.' }]
      }
    },
    {
      id: 'biz-consultant',
      title: 'Management Consultant',
      category: 'Business',
      experience: '4-7 Years',
      atsScore: 96,
      templateId: 'minimal',
      description: 'High-impact Management Consultant driving corporate restructuring, M&A due diligence, and revenue growth strategies.',
      resumeData: {
        name: 'David K. Ross',
        role: 'Senior Business Consultant',
        contact: { email: 'd.ross@forgeindiaconnect.app', phone: '+1 (555) 901-3320', location: 'Boston, MA', linkedin: 'linkedin.com/in/david-ross-consulting' },
        objective: 'Strategic Management Consultant with 5+ years advising Fortune 500 executives on digital transformation, operational efficiency, and revenue expansion.',
        education: [{ degree: 'MBA in Finance & Strategy', institution: 'Harvard Business School', tenure: '2017 - 2019', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Corporate Strategy, M&A Due Diligence, Executive Advising', frameworks: 'McKinsey 7S, SWOT, Value Chain', tools: 'Excel Financial Modeling, PowerBI, Pitchbook' },
        experience: [
          { title: 'Senior Strategy Consultant', company: 'Beacon Strategic Advisory', duration: '2019 - Present', desc: '• Advised C-suite leadership on 8 major M&A transactions valued at over $1.2B combined.\n• Formulated cost optimization strategies delivering $45M in cumulative EBITDA improvements.' }
        ],
        projects: [{ title: 'Global Retail Supply Chain Overhaul', technology: 'Advanced Excel, Tableau', desc: 'Restructured distribution network across 14 countries, trimming logistics costs by 15%.' }]
      }
    }
  ],

  Design: [
    {
      id: 'des-uiux',
      title: 'Senior UI/UX Designer',
      category: 'Design',
      experience: '4-7 Years',
      atsScore: 98,
      templateId: 'creative',
      description: 'Creative UI/UX Designer specializing in user research, wireframing, design systems, and interactive prototyping.',
      resumeData: {
        name: 'Elena Rostova',
        role: 'Lead Product & UI/UX Designer',
        contact: { email: 'elena.r@forgeindiaconnect.app', phone: '+1 (555) 234-8891', location: 'Seattle, WA', linkedin: 'linkedin.com/in/elena-rostova-ux' },
        objective: 'Product-minded UI/UX Designer with 6+ years creating intuitive digital experiences for mobile and web applications. Built scalable design systems used across 20+ products.',
        education: [{ degree: 'B.F.A. in Interaction Design', institution: 'Rhode Island School of Design', tenure: '2014 - 2018', cgpa: '3.85 / 4.0' }],
        skills: { languages: 'User Research, Wireframing, Prototyping, Design Systems', frameworks: 'Atomic Design, Human-Centered Design', tools: 'Figma, Adobe XD, Principle, Storybook' },
        experience: [
          { title: 'Lead UI/UX Designer', company: 'PixelCraft Studios', duration: '2020 - Present', desc: '• Spearheaded end-to-end UX architecture for an iOS/Android healthcare app with 1M+ active downloads.\n• Conducted 50+ usability testing sessions improving task completion rate by 34%.' }
        ],
        projects: [{ title: 'Universal Component Design System', technology: 'Figma, Storybook, React', desc: 'Created 120+ accessible UI components reducing frontend development time by 40%.' }]
      }
    },
    {
      id: 'des-art',
      title: 'Creative Art Director',
      category: 'Design',
      experience: '5-9 Years',
      atsScore: 95,
      templateId: 'executive',
      description: 'Visionary Art Director leading brand campaigns, visual identity, and multimedia marketing creative teams.',
      resumeData: {
        name: 'Julian Thorne',
        role: 'Creative Art Director',
        contact: { email: 'j.thorne@forgeindiaconnect.app', phone: '+1 (555) 456-9900', location: 'Los Angeles, CA', linkedin: 'linkedin.com/in/julian-thorne-art' },
        objective: 'Award-winning Creative Art Director with 8+ years leading cross-disciplinary design teams for international brand campaigns and digital media.',
        education: [{ degree: 'B.A. in Graphic Design', institution: 'CalArts', tenure: '2012 - 2016', cgpa: '3.8 / 4.0' }],
        skills: { languages: 'Art Direction, Brand Identity, Visual Storytelling', frameworks: 'Campaign Strategy, Creative Direction', tools: 'Photoshop, Illustrator, After Effects, InDesign' },
        experience: [
          { title: 'Creative Art Director', company: 'Vanguard Media Group', duration: '2019 - Present', desc: '• Directed visual creative strategy for 15+ multi-channel advertising campaigns.\n• Won 3 regional ADDY awards for outstanding digital brand identity campaigns.' }
        ],
        projects: [{ title: 'Global Tech Brand Rebrand', technology: 'Adobe Creative Suite, Cinema4D', desc: 'Led complete brand refresh resulting in 65% increase in brand sentiment engagement.' }]
      }
    },
    {
      id: 'des-product',
      title: 'Product Designer',
      category: 'Design',
      experience: '3-6 Years',
      atsScore: 96,
      templateId: 'modern',
      description: 'End-to-end Product Designer proficient in user flows, design tokens, responsive web UI, and product validation.',
      resumeData: {
        name: 'Sophia Martinez',
        role: 'Senior Product Designer',
        contact: { email: 's.martinez@forgeindiaconnect.app', phone: '+1 (555) 678-2345', location: 'Austin, TX', linkedin: 'linkedin.com/in/sophia-martinez-pd' },
        objective: 'Customer-focused Product Designer with 5+ years of experience crafting seamless web and mobile application interfaces. Specialized in SaaS user workflows and micro-interactions.',
        education: [{ degree: 'B.S. in Human-Computer Interaction', institution: 'Carnegie Mellon University', tenure: '2015 - 2019', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'User Interface, Rapid Prototyping, Usability Testing', frameworks: 'Agile UX, Design Thinking', tools: 'Figma, Framer, Sketch, Zeroheight' },
        experience: [
          { title: 'Senior Product Designer', company: 'Apex Digital Design', duration: '2021 - Present', desc: '• Led product design initiatives for a B2B analytics platform used by 80,000+ businesses.\n• Implemented micro-interactions that boosted user engagement metrics by 27%.' }
        ],
        projects: [{ title: 'E-Commerce Checkout Flow Optimization', technology: 'Figma, Maze, Mixpanel', desc: 'Redesigned mobile checkout funnel, reducing cart abandonment by 19%.' }]
      }
    },
    {
      id: 'des-graphic',
      title: 'Senior Graphic Designer',
      category: 'Design',
      experience: '3-7 Years',
      atsScore: 94,
      templateId: 'professional',
      description: 'Versatile Graphic Designer skilled in print collateral, digital branding, typography, and marketing campaign creative.',
      resumeData: {
        name: 'Leo Sterling',
        role: 'Senior Graphic Designer',
        contact: { email: 'leo.s@forgeindiaconnect.app', phone: '+1 (555) 890-3456', location: 'Portland, OR', linkedin: 'linkedin.com/in/leo-sterling-graphics' },
        objective: 'Versatile Senior Graphic Designer with 6+ years creating compelling print and digital assets for high-visibility commercial clients.',
        education: [{ degree: 'B.F.A. in Graphic Design', institution: 'Pratt Institute', tenure: '2014 - 2018', cgpa: '3.8 / 4.0' }],
        skills: { languages: 'Typography, Brand Packaging, Print Production', frameworks: 'Visual Layout, Grid Systems', tools: 'InDesign, Illustrator, Photoshop, Lightroom' },
        experience: [
          { title: 'Senior Graphic Designer', company: 'Creative Studio 44', duration: '2020 - Present', desc: '• Designed 100+ promotional campaigns, catalog layouts, and billboard advertisements for enterprise retail brands.' }
        ],
        projects: [{ title: 'Eco-Friendly Product Packaging System', technology: 'Illustrator, 3D Rendering', desc: 'Created sustainable packaging design line awarded 2023 National Packaging Design Honor.' }]
      }
    },
    {
      id: 'des-motion',
      title: 'Motion Graphics Designer',
      category: 'Design',
      experience: '3-6 Years',
      atsScore: 95,
      templateId: 'minimal',
      description: 'Dynamic Motion Graphics Designer creating 2D/3D animations, video stingers, UI micro-animations, and brand reels.',
      resumeData: {
        name: 'Maya Lin',
        role: 'Lead Motion Designer',
        contact: { email: 'm.lin@forgeindiaconnect.app', phone: '+1 (555) 234-9012', location: 'Brooklyn, NY', linkedin: 'linkedin.com/in/maya-lin-motion' },
        objective: 'Innovative Motion Designer with 5+ years animating brand promotional videos, UI transitions, and 3D product visualizations.',
        education: [{ degree: 'B.A. in Digital Arts & Animation', institution: 'SCAD', tenure: '2015 - 2019', cgpa: '3.85 / 4.0' }],
        skills: { languages: '2D/3D Animation, Motion Storyboarding, Character Rigging', frameworks: 'VFX Production Pipeline', tools: 'After Effects, Premiere Pro, Cinema 4D, Lottie' },
        experience: [
          { title: 'Lead Motion Designer', company: 'Vanguard Animation Labs', duration: '2021 - Present', desc: '• Animated 40+ commercial broadcast spots and app splash screens viewed by 5M+ users.' }
        ],
        projects: [{ title: 'App Launch Lottie Animation Suite', technology: 'After Effects, Lottie, JSON', desc: 'Created lightweight vector micro-animations for mobile app onboarding.' }]
      }
    }
  ],

  Education: [
    {
      id: 'edu-teacher',
      title: 'STEM High School Educator',
      category: 'Education',
      experience: '4-8 Years',
      atsScore: 97,
      templateId: 'modern',
      description: 'Dedicated Educator skilled in STEM curriculum design, digital classroom technology, and student mentorship.',
      resumeData: {
        name: 'Dr. Evelyn Harper',
        role: 'Senior STEM Educator & Department Head',
        contact: { email: 'evelyn.harper@forgeindiaconnect.app', phone: '+1 (555) 432-8765', location: 'Boston, MA', linkedin: 'linkedin.com/in/evelyn-harper-edu' },
        objective: 'Passionate STEM Educator with 7+ years of experience integrating interactive technology into science curricula. Elevated AP Physics pass rates from 72% to 94%.',
        education: [{ degree: 'Ph.D. in Physics Education', institution: 'Harvard Graduate School of Education', tenure: '2014 - 2018', cgpa: '4.0 / 4.0' }],
        skills: { languages: 'Curriculum Development, Classroom Management, STEM Integration', frameworks: 'NGSS Standards, Project-Based Learning', tools: 'Canvas LMS, Google Classroom, Vernier Sensors' },
        experience: [
          { title: 'STEM Department Chair', company: 'Cambridge Academy', duration: '2019 - Present', desc: '• Supervised 14 STEM faculty members and managed $120K annual department budget.\n• Launched robotics mentorship program resulting in regional competition championship.' }
        ],
        projects: [{ title: 'Interactive VR Science Lab', technology: 'Unity VR, Canvas LMS', desc: 'Implemented virtual reality chemistry experiments improving lab safety comprehension by 45%.' }]
      }
    },
    {
      id: 'edu-prof',
      title: 'University Assistant Professor',
      category: 'Education',
      experience: '5-9 Years',
      atsScore: 96,
      templateId: 'executive',
      description: 'Acclaimed Higher Education Professor published in peer-reviewed journals, leading academic research and lectures.',
      resumeData: {
        name: 'Dr. Jonathan Vance',
        role: 'Assistant Professor of Computer Science',
        contact: { email: 'j.vance@forgeindiaconnect.app', phone: '+1 (555) 890-4567', location: 'Ann Arbor, MI', linkedin: 'linkedin.com/in/jonathan-vance-prof' },
        objective: 'Published University Professor with 8+ years instructing undergraduate and graduate courses in Data Structures, AI, and Software Engineering.',
        education: [{ degree: 'Ph.D. in Computer Science', institution: 'University of Michigan', tenure: '2012 - 2017', cgpa: '3.95 / 4.0' }],
        skills: { languages: 'Academic Research, University Lecturing, Grant Writing', frameworks: 'Peer-Review Publication, ABET Accreditation', tools: 'LaTeX, Canvas, Python, Jupyter Labs' },
        experience: [
          { title: 'Assistant Professor', company: 'University of Michigan', duration: '2018 - Present', desc: '• Taught 6 core computer science modules per academic year to 400+ students.\n• Secured $450K in federal research grants for machine learning research.' }
        ],
        projects: [{ title: 'AI Ethics & Algorithmic Bias Research Paper', technology: 'Python, Peer-Reviewed Journal', desc: 'Published landmark study cited 300+ times in academic literature.' }]
      }
    },
    {
      id: 'edu-coord',
      title: 'Academic Operations Coordinator',
      category: 'Education',
      experience: '3-6 Years',
      atsScore: 94,
      templateId: 'professional',
      description: 'Resourceful Academic Coordinator managing accreditation compliance, student advisory programs, and faculty scheduling.',
      resumeData: {
        name: 'Hannah Abbott',
        role: 'Academic Operations Coordinator',
        contact: { email: 'h.abbott@forgeindiaconnect.app', phone: '+1 (555) 234-5678', location: 'Chicago, IL', linkedin: 'linkedin.com/in/hannah-abbott-edu' },
        objective: 'Detail-oriented Academic Coordinator with 5+ years administering university registrar operations, course scheduling, and student advisory.',
        education: [{ degree: 'M.Ed. in Higher Education Administration', institution: 'Northwestern University', tenure: '2015 - 2017', cgpa: '3.88 / 4.0' }],
        skills: { languages: 'Academic Advising, FERPA Compliance, Course Scheduling', frameworks: 'Higher Ed Governance, Student Retention', tools: 'Ellucian Banner, Salesforce Education Cloud, Excel' },
        experience: [
          { title: 'Academic Coordinator', company: 'Northwestern University', duration: '2019 - Present', desc: '• Managed course registration and degree auditing for 2,500+ undergraduate students.' }
        ],
        projects: [{ title: 'Digital Degree Audit Automation', technology: 'Banner ERP, Salesforce', desc: 'Automated graduation evaluation process, reducing audit processing times by 60%.' }]
      }
    },
    {
      id: 'edu-curr',
      title: 'Educational Curriculum Specialist',
      category: 'Education',
      experience: '4-7 Years',
      atsScore: 95,
      templateId: 'creative',
      description: 'Expert Curriculum Specialist designing K-12 learning modules, state standards alignment, and teacher training programs.',
      resumeData: {
        name: 'Claire Montgomery',
        role: 'Instructional Designer & Curriculum Lead',
        contact: { email: 'c.montgomery@forgeindiaconnect.app', phone: '+1 (555) 678-1234', location: 'Austin, TX', linkedin: 'linkedin.com/in/claire-montgomery-curr' },
        objective: 'Instructional Specialist with 6+ years creating blended e-learning curricula and teacher professional development workshops.',
        education: [{ degree: 'M.S. in Instructional Design', institution: 'UT Austin', tenure: '2014 - 2016', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Instructional Design, E-Learning Development, ADDIE Model', frameworks: 'Bloom’s Taxonomy, Universal Design for Learning', tools: 'Articulate 360, Adobe Captivate, Canvas LMS' },
        experience: [
          { title: 'Curriculum Specialist', company: 'Apex EdTech Learning', duration: '2020 - Present', desc: '• Authored 50+ digital learning modules deployed across 120 school districts nationwide.' }
        ],
        projects: [{ title: 'Statewide Blended Math Learning Program', technology: 'Articulate 360, Canvas', desc: 'Developed online interactive algebra curriculum raising state math assessment scores by 14%.' }]
      }
    },
    {
      id: 'edu-advisor',
      title: 'Student Success & Guidance Director',
      category: 'Education',
      experience: '5-8 Years',
      atsScore: 96,
      templateId: 'minimal',
      description: 'Empathetic Student Advisor leading career counseling, university admissions placement, and student wellness initiatives.',
      resumeData: {
        name: 'Robert Hayes',
        role: 'Director of Student Success',
        contact: { email: 'r.hayes@forgeindiaconnect.app', phone: '+1 (555) 789-2345', location: 'Denver, CO', linkedin: 'linkedin.com/in/robert-hayes-edu' },
        objective: 'Student Success Director with 7+ years of experience building student retention and career placement programs in secondary and higher education.',
        education: [{ degree: 'M.A. in Counseling Psychology', institution: 'University of Denver', tenure: '2013 - 2015', cgpa: '3.92 / 4.0' }],
        skills: { languages: 'Career Guidance, Mental Wellness Advocacy, Student Retention', frameworks: 'Counseling Models, Crisis Intervention', tools: 'Handshake, Naviance, Salesforce' },
        experience: [
          { title: 'Director of Student Success', company: 'Denver Preparatory School', duration: '2019 - Present', desc: '• Oversaw career placement guidance for 800+ seniors, achieving a 98% college admission acceptance rate.' }
        ],
        projects: [{ title: 'First-Generation College Mentorship Network', technology: 'Naviance, Zoom', desc: 'Established peer mentorship initiative improving 1st-year college retention rates by 22%.' }]
      }
    }
  ],

  Engineering: [
    {
      id: 'eng-frontend',
      title: 'Senior Frontend Engineer',
      category: 'Engineering',
      experience: '4-7 Years',
      atsScore: 98,
      templateId: 'modern',
      description: 'Expert Frontend Engineer specialized in React, TypeScript, state management, and high-performance Web apps.',
      resumeData: {
        name: 'Alex Rivera',
        role: 'Senior Frontend Architect',
        contact: { email: 'alex.rivera@forgeindiaconnect.app', phone: '+1 (555) 321-9876', location: 'Austin, TX', linkedin: 'linkedin.com/in/alex-rivera-frontend', github: 'github.com/alexrivera-dev' },
        objective: 'Senior Frontend Engineer with 6+ years of experience architecting scalable React & TypeScript web applications. Optimized web performance metrics (Core Web Vitals) boosting Lighthouse scores to 99.',
        education: [{ degree: 'B.S. in Computer Science', institution: 'UT Austin', tenure: '2014 - 2018', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'JavaScript (ES6+), TypeScript, HTML5/CSS3', frameworks: 'React, Next.js, Redux Toolkit, TailwindCSS', tools: 'Webpack, Vite, Jest, Cypress, Git, Docker' },
        experience: [
          { title: 'Senior Frontend Engineer', company: 'TechFlow Systems', duration: '2021 - Present', desc: '• Led frontend development of a real-time analytics dashboard used by 50,000+ enterprise users.\n• Reduced bundle size by 42% through code splitting and tree shaking.' },
          { title: 'Frontend Developer', company: 'CodeNexus Labs', duration: '2018 - 2021', desc: '• Developed 25+ reusable UI components adhering to WCAG 2.1 AA accessibility standards.' }
        ],
        projects: [{ title: 'High-Frequency Financial Dashboard', technology: 'React, WebSockets, TypeScript', desc: 'Built real-time stock trading interface handling 10,000+ data updates per second with zero lag.' }]
      }
    },
    {
      id: 'eng-devops',
      title: 'DevOps & Cloud Architect',
      category: 'Engineering',
      experience: '5-9 Years',
      atsScore: 97,
      templateId: 'executive',
      description: 'Senior Cloud Architect skilled in AWS, Kubernetes, Terraform, CI/CD pipelines, and zero-downtime deployments.',
      resumeData: {
        name: 'Vikram Patel',
        role: 'Lead DevOps Architect',
        contact: { email: 'v.patel@forgeindiaconnect.app', phone: '+1 (555) 789-0123', location: 'San Jose, CA', linkedin: 'linkedin.com/in/vikram-patel-devops' },
        objective: 'AWS Certified Solutions Architect with 8+ years automating cloud infrastructure and CI/CD pipelines. Maintained 99.99% system uptime across 500+ microservices.',
        education: [{ degree: 'B.S. in Computer Engineering', institution: 'San Jose State University', tenure: '2012 - 2016', cgpa: '3.85 / 4.0' }],
        skills: { languages: 'Python, Bash, Go, YAML', frameworks: 'Kubernetes, Docker, Terraform, Helm', tools: 'AWS, Jenkins, GitHub Actions, Prometheus, Grafana' },
        experience: [
          { title: 'Lead DevOps Engineer', company: 'CloudScale Infrastructure', duration: '2019 - Present', desc: '• Designed multi-region Kubernetes clusters handling 50M+ daily API requests.\n• Automated infrastructure provisioning using Terraform, cutting deployment setup times from 2 days to 15 minutes.' }
        ],
        projects: [{ title: 'Zero-Downtime Multi-Cloud Migration', technology: 'Kubernetes, AWS, Terraform', desc: 'Migrated 120+ microservices from on-premise servers to AWS EKS with zero customer downtime.' }]
      }
    },
    {
      id: 'eng-fullstack',
      title: 'Full Stack Software Engineer',
      category: 'Engineering',
      experience: '3-6 Years',
      atsScore: 96,
      templateId: 'professional',
      description: 'Versatile Full Stack Engineer proficient in Node.js, React, PostgreSQL, GraphQL, and microservice APIs.',
      resumeData: {
        name: 'Ethan Hunt',
        role: 'Senior Full Stack Developer',
        contact: { email: 'e.hunt@forgeindiaconnect.app', phone: '+1 (555) 456-7890', location: 'Seattle, WA', linkedin: 'linkedin.com/in/ethan-hunt-fs', github: 'github.com/ethanhunt-dev' },
        objective: 'Full Stack Engineer with 5+ years of experience engineering end-to-end web applications, microservices, and relational database schemas.',
        education: [{ degree: 'B.S. in Software Engineering', institution: 'University of Washington', tenure: '2015 - 2019', cgpa: '3.8 / 4.0' }],
        skills: { languages: 'Node.js, TypeScript, SQL, Python', frameworks: 'React, Express, GraphQL, Prisma', tools: 'PostgreSQL, Redis, Docker, AWS S3' },
        experience: [
          { title: 'Senior Full Stack Engineer', company: 'Nexus Digital Labs', duration: '2021 - Present', desc: '• Built scalable RESTful and GraphQL APIs handling 2M+ daily requests.' }
        ],
        projects: [{ title: 'Real-Time Collaboration Platform', technology: 'React, Node.js, WebSockets, Redis', desc: 'Developed multi-user document editor with real-time sync capabilities.' }]
      }
    },
    {
      id: 'eng-mech',
      title: 'Mechanical Engineering Lead',
      category: 'Engineering',
      experience: '5-8 Years',
      atsScore: 95,
      templateId: 'creative',
      description: 'Innovative Mechanical Engineer specializing in CAD modeling, thermal analysis, robotics, and prototype fabrication.',
      resumeData: {
        name: 'Carlos Mendez, PE',
        role: 'Lead Mechanical Design Engineer',
        contact: { email: 'c.mendez@forgeindiaconnect.app', phone: '+1 (555) 890-5678', location: 'Detroit, MI', linkedin: 'linkedin.com/in/carlos-mendez-mech' },
        objective: 'Licensed Professional Engineer (PE) with 7+ years of experience leading automotive and aerospace mechanical design projects.',
        education: [{ degree: 'B.S. in Mechanical Engineering', institution: 'University of Michigan', tenure: '2013 - 2017', cgpa: '3.85 / 4.0' }],
        skills: { languages: 'CAD Modeling, FEA Simulation, Thermal Dynamics', frameworks: 'GD&T Standards, ISO 9001', tools: 'SolidWorks, ANSYS, AutoCAD, MATLAB' },
        experience: [
          { title: 'Lead Mechanical Engineer', company: 'Apex Automotive Systems', duration: '2020 - Present', desc: '• Designed lightweight aluminum chassis components reducing vehicle weight by 14% while exceeding crash safety standards.' }
        ],
        projects: [{ title: 'High-Torque Electric Drivetrain Gearbox', technology: 'SolidWorks, ANSYS FEA', desc: 'Engineered custom planetary gear assembly with 98% power transmission efficiency.' }]
      }
    },
    {
      id: 'eng-qa',
      title: 'QA Test Automation Lead',
      category: 'Engineering',
      experience: '4-7 Years',
      atsScore: 94,
      templateId: 'minimal',
      description: 'Detail-oriented QA Automation Engineer skilled in Selenium, Playwright, API testing, and CI/CD pipeline test integration.',
      resumeData: {
        name: 'Jessica Taylor',
        role: 'Lead QA Automation Engineer',
        contact: { email: 'j.taylor@forgeindiaconnect.app', phone: '+1 (555) 234-6789', location: 'Raleigh, NC', linkedin: 'linkedin.com/in/jessica-taylor-qa' },
        objective: 'QA Automation Specialist with 6+ years building automated end-to-end testing frameworks. Increased test suite coverage to 92%.',
        education: [{ degree: 'B.S. in Computer Information Systems', institution: 'NC State University', tenure: '2014 - 2018', cgpa: '3.75 / 4.0' }],
        skills: { languages: 'Python, Java, JavaScript, SQL', frameworks: 'Selenium, Playwright, PyTest, JUnit', tools: 'Postman, Jenkins, Git, Jira' },
        experience: [
          { title: 'Lead QA Engineer', company: 'Vanguard Software Quality', duration: '2020 - Present', desc: '• Built automated regression test pipeline cutting release testing cycles from 5 days to 3 hours.' }
        ],
        projects: [{ title: 'Enterprise API Load & Performance Framework', technology: 'JMeter, Playwright, Python', desc: 'Simulated 100,000 concurrent user sessions identifying server performance bottlenecks before production release.' }]
      }
    }
  ],

  Finance: [
    {
      id: 'fin-analyst',
      title: 'Senior Financial Analyst',
      category: 'Finance',
      experience: '4-7 Years',
      atsScore: 96,
      templateId: 'professional',
      description: 'CFA-track Financial Analyst skilled in financial modeling, variance analysis, forecasting, and corporate valuation.',
      resumeData: {
        name: 'Charlotte Dubois',
        role: 'Senior Financial Analyst',
        contact: { email: 'c.dubois@forgeindiaconnect.app', phone: '+1 (555) 567-4321', location: 'New York, NY', linkedin: 'linkedin.com/in/charlotte-dubois-finance' },
        objective: 'Detail-oriented Financial Analyst with 5+ years of corporate finance and valuation experience. Built financial forecasting models driving $30M corporate capital investments.',
        education: [{ degree: 'B.S. in Finance & Accounting', institution: 'Columbia University', tenure: '2015 - 2019', cgpa: '3.92 / 4.0' }],
        skills: { languages: 'Financial Modeling, DCF Valuation, Variance Analysis', frameworks: 'GAAP, IFRS, Corporate Forecasting', tools: 'Excel (VBA), Bloomberg Terminal, NetSuite, Hyperion' },
        experience: [
          { title: 'Senior Financial Analyst', company: 'WallStreet Capital Management', duration: '2021 - Present', desc: '• Conducted quarterly financial variance analysis for 5 business divisions managing $200M in annual revenue.\n• Streamlined monthly reporting process, reducing close cycle by 3 business days.' }
        ],
        projects: [{ title: 'M&A Valuation & Risk Assessment Model', technology: 'Excel VBA, Bloomberg', desc: 'Created 3-statement financial model evaluating $45M acquisition target with sensitivity analysis.' }]
      }
    },
    {
      id: 'fin-ib',
      title: 'Investment Banking Associate',
      category: 'Finance',
      experience: '3-6 Years',
      atsScore: 97,
      templateId: 'executive',
      description: 'High-performing Investment Banker experienced in M&A advisory, pitchbook preparation, and LBO financial modeling.',
      resumeData: {
        name: 'Andrew Sterling',
        role: 'Investment Banking Associate',
        contact: { email: 'a.sterling@forgeindiaconnect.app', phone: '+1 (555) 345-6789', location: 'New York, NY', linkedin: 'linkedin.com/in/andrew-sterling-ib' },
        objective: 'Investment Banking Associate with 4+ years advising technology clients on equity offerings, debt restructuring, and cross-border M&A deals.',
        education: [{ degree: 'B.S. in Economics & Finance', institution: 'Wharton School, UPenn', tenure: '2016 - 2020', cgpa: '3.95 / 4.0' }],
        skills: { languages: 'LBO Modeling, M&A Advisory, Equity Capital Markets', frameworks: 'Accretion/Dilution Analysis, Pitchbooks', tools: 'FactSet, CapitalIQ, Bloomberg, Excel' },
        experience: [
          { title: 'Investment Banking Associate', company: 'Goldman Advisory Group', duration: '2020 - Present', desc: '• Executed 6 closed M&A transactions worth a combined $850M in total transaction value.' }
        ],
        projects: [{ title: '$400M Tech IPO Underwriting Pitch', technology: 'CapitalIQ, Excel Financial Modeling', desc: 'Prepared confidential information memorandum (CIM) and financial prospectus for institutional investors.' }]
      }
    },
    {
      id: 'fin-cpa',
      title: 'Senior Staff Accountant / CPA',
      category: 'Finance',
      experience: '4-8 Years',
      atsScore: 95,
      templateId: 'modern',
      description: 'Licensed Certified Public Accountant (CPA) skilled in corporate audit, tax compliance, general ledger, and GAAP reporting.',
      resumeData: {
        name: 'Melissa Thorne, CPA',
        role: 'Senior Staff Accountant & Auditor',
        contact: { email: 'm.thorne@forgeindiaconnect.app', phone: '+1 (555) 678-9012', location: 'Chicago, IL', linkedin: 'linkedin.com/in/melissa-thorne-cpa' },
        objective: 'Licensed CPA with 6+ years managing full-cycle general ledger accounting, internal Sarbanes-Oxley (SOX) audits, and corporate tax compliance.',
        education: [{ degree: 'B.S. in Accounting & Taxation', institution: 'DePaul University', tenure: '2014 - 2018', cgpa: '3.88 / 4.0' }],
        skills: { languages: 'General Ledger, SOX Audit, Tax Preparation', frameworks: 'GAAP Accounting Standards, Tax Law', tools: 'QuickBooks, SAP ERP, NetSuite, RIA Checkpoint' },
        experience: [
          { title: 'Senior Staff Accountant', company: 'Apex Audit Services', duration: '2020 - Present', desc: '• Managed monthly financial close procedures for 18 corporate clients with zero audit exceptions.' }
        ],
        projects: [{ title: 'Enterprise Tax Audit Optimization', technology: 'SAP ERP, NetSuite', desc: 'Identified state tax credit deductions saving enterprise client $140K in annual liabilities.' }]
      }
    },
    {
      id: 'fin-risk',
      title: 'Portfolio Risk Manager',
      category: 'Finance',
      experience: '5-9 Years',
      atsScore: 96,
      templateId: 'creative',
      description: 'Quantitative Portfolio Risk Manager adept at VaR stress testing, liquidity analysis, and hedging market exposure.',
      resumeData: {
        name: 'Gabriel Vance',
        role: 'Lead Quantitative Risk Officer',
        contact: { email: 'g.vance@forgeindiaconnect.app', phone: '+1 (555) 901-2345', location: 'Charlotte, NC', linkedin: 'linkedin.com/in/gabriel-vance-risk' },
        objective: 'Quantitative Risk Manager with 7+ years evaluating portfolio market risk, credit risk models, and derivative hedging strategies.',
        education: [{ degree: 'M.S. in Financial Engineering', institution: 'Columbia University', tenure: '2014 - 2016', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Value at Risk (VaR), Stress Testing, Derivatives Hedging', frameworks: 'Basel III Regulations, Monte Carlo Simulation', tools: 'Python, R, MATLAB, RiskMetrics' },
        experience: [
          { title: 'Risk Management Officer', company: 'Vanguard Asset Management', duration: '2019 - Present', desc: '• Monitored risk metrics across $1.5B fixed-income and equity asset portfolios.' }
        ],
        projects: [{ title: 'Monte Carlo Portfolio Stress Test Model', technology: 'Python, R, RiskMetrics', desc: 'Engineered daily automated risk reporting system detecting tail-risk exposures.' }]
      }
    },
    {
      id: 'fin-treasury',
      title: 'Corporate Treasury Specialist',
      category: 'Finance',
      experience: '3-6 Years',
      atsScore: 94,
      templateId: 'minimal',
      description: 'Treasury Analyst managing cash flow forecasting, debt structure, FX currency risk, and bank relations.',
      resumeData: {
        name: 'Olivia Bennett',
        role: 'Senior Treasury Manager',
        contact: { email: 'o.bennett@forgeindiaconnect.app', phone: '+1 (555) 123-4567', location: 'Dallas, TX', linkedin: 'linkedin.com/in/olivia-bennett-treasury' },
        objective: 'Corporate Treasury Specialist with 5+ years of experience optimizing liquidity, short-term investments, and international foreign exchange (FX) risk.',
        education: [{ degree: 'B.S. in Finance', institution: 'SMU Cox', tenure: '2015 - 2019', cgpa: '3.82 / 4.0' }],
        skills: { languages: 'Cash Flow Forecasting, FX Hedging, Working Capital', frameworks: 'Treasury Operations, Credit Facility Structuring', tools: 'Kyriba, SAP Treasury, Bloomberg' },
        experience: [
          { title: 'Senior Treasury Analyst', company: 'Global Energy Corp', duration: '2020 - Present', desc: '• Managed $500M global daily liquidity positioning across 30 international bank accounts.' }
        ],
        projects: [{ title: 'Automated FX Currency Hedging Program', technology: 'Kyriba, SAP Treasury', desc: 'Implemented automated FX hedging protocol mitigating currency volatility exposure by 25%.' }]
      }
    }
  ],

  Healthcare: [
    {
      id: 'health-rn',
      title: 'RN Nurse Manager',
      category: 'Healthcare',
      experience: '5-9 Years',
      atsScore: 98,
      templateId: 'modern',
      description: 'Compassionate RN Nurse Manager with ICU critical care expertise, patient care protocols, and staff leadership.',
      resumeData: {
        name: 'Sarah Jenkins, RN',
        role: 'Clinical Nurse Manager (BSN, RN)',
        contact: { email: 's.jenkins@forgeindiaconnect.app', phone: '+1 (555) 890-1234', location: 'Philadelphia, PA', linkedin: 'linkedin.com/in/sarah-jenkins-rn' },
        objective: 'Dedicated RN Nurse Manager with 7+ years of critical care experience. Reduced ICU readmission rates by 18% through evidence-based post-discharge care protocols and staff mentorship.',
        education: [{ degree: 'B.S. in Nursing (BSN)', institution: 'University of Pennsylvania', tenure: '2013 - 2017', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Critical Care Nursing, Patient Advocacy, Clinical Operations', frameworks: 'Evidence-Based Practice, TJC Accreditation', tools: 'Epic EHR, Cerner, Pyxis Automated Medication Systems' },
        experience: [
          { title: 'Nurse Manager - Intensive Care Unit', company: 'Penn Medicine Hospital', duration: '2020 - Present', desc: '• Supervised 35+ registered nurses and medical technicians in a 24-bed ICU unit.\n• Improved unit patient satisfaction scores (HCAHPS) from 81% to 96% within 18 months.' }
        ],
        projects: [{ title: 'Post-Discharge Care Protocol Initiative', technology: 'Epic EHR, Clinical Pathways', desc: 'Spearheaded follow-up care program that reduced 30-day ICU readmissions by 18%.' }]
      }
    },
    {
      id: 'health-admin',
      title: 'Healthcare Operations Director',
      category: 'Healthcare',
      experience: '6-10 Years',
      atsScore: 97,
      templateId: 'executive',
      description: 'Executive Healthcare Administrator managing hospital operations, HIPAA compliance, and patient care workflows.',
      resumeData: {
        name: 'Dr. Michael Sterling, MHA',
        role: 'Director of Healthcare Operations',
        contact: { email: 'm.sterling@forgeindiaconnect.app', phone: '+1 (555) 345-8901', location: 'Baltimore, MD', linkedin: 'linkedin.com/in/michael-sterling-mha' },
        objective: 'Healthcare Administrator with 9+ years managing hospital operational budgets, HIPAA compliance, and clinical patient throughput.',
        education: [{ degree: 'Master of Health Administration (MHA)', institution: 'Johns Hopkins University', tenure: '2012 - 2014', cgpa: '3.95 / 4.0' }],
        skills: { languages: 'Hospital Administration, HIPAA Compliance, Revenue Cycle', frameworks: 'Joint Commission Standards, Lean Healthcare', tools: 'Epic EHR, MediTech, Oracle Health' },
        experience: [
          { title: 'Director of Healthcare Operations', company: 'Johns Hopkins Medical Center', duration: '2018 - Present', desc: '• Directed daily administrative operations for a 350-bed inpatient hospital facility.\n• Trimmed patient emergency room wait times by 35 minutes on average.' }
        ],
        projects: [{ title: 'Digital Patient Intake & Triage Portal', technology: 'Epic EHR, MyChart', desc: 'Deployed online patient check-in portal reducing front-desk processing bottlenecks by 50%.' }]
      }
    },
    {
      id: 'health-research',
      title: 'Clinical Research Coordinator',
      category: 'Healthcare',
      experience: '3-6 Years',
      atsScore: 95,
      templateId: 'professional',
      description: 'Detail-oriented Clinical Research Coordinator managing FDA trial compliance, patient recruitment, and IRB protocols.',
      resumeData: {
        name: 'Emily Watson',
        role: 'Lead Clinical Research Coordinator',
        contact: { email: 'e.watson@forgeindiaconnect.app', phone: '+1 (555) 678-3456', location: 'Boston, MA', linkedin: 'linkedin.com/in/emily-watson-research' },
        objective: 'CCRC-certified Research Coordinator with 5+ years administering Phase II and III pharmaceutical clinical trials under FDA guidelines.',
        education: [{ degree: 'B.S. in Biology & Clinical Sciences', institution: 'Tufts University', tenure: '2015 - 2019', cgpa: '3.85 / 4.0' }],
        skills: { languages: 'FDA Clinical Trials, Patient Protocol Compliance, GCP Standards', frameworks: 'IRB Documentation, Good Clinical Practice', tools: 'Medidata Rave, Veeva Vault, RedCap' },
        experience: [
          { title: 'Senior Clinical Research Coordinator', company: 'Boston BioResearch Institute', duration: '2020 - Present', desc: '• Coordinated 8 concurrent oncology drug trials involving 200+ study participants with zero audit discrepancies.' }
        ],
        projects: [{ title: 'Phase III Oncology Trial Protocol Execution', technology: 'RedCap, Medidata Rave', desc: 'Achieved 95% patient retention rate across a 24-month multi-center pharmaceutical trial.' }]
      }
    },
    {
      id: 'health-pa',
      title: 'Physician Assistant (PA-C)',
      category: 'Healthcare',
      experience: '4-7 Years',
      atsScore: 96,
      templateId: 'creative',
      description: 'Certified Physician Assistant providing diagnostic patient care, emergency triage, and surgical assistance.',
      resumeData: {
        name: 'Daniel Kim, PA-C',
        role: 'Emergency Medicine Physician Assistant',
        contact: { email: 'd.kim@forgeindiaconnect.app', phone: '+1 (555) 901-4567', location: 'Chicago, IL', linkedin: 'linkedin.com/in/daniel-kim-pac' },
        objective: 'Board-certified Physician Assistant (PA-C) with 6+ years of emergency medicine experience performing patient evaluations and minor surgical procedures.',
        education: [{ degree: 'M.S. in Physician Assistant Studies', institution: 'Northwestern University', tenure: '2015 - 2017', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Emergency Triage, Diagnostic Evaluation, Minor Surgery', frameworks: 'ACL/BLS Certification, Patient Care Pathways', tools: 'Epic Hyperspace, Cerner PowerChart' },
        experience: [
          { title: 'Emergency Department PA-C', company: 'Chicago General Hospital', duration: '2019 - Present', desc: '• Evaluated and treated 25+ high-acuity emergency patients per shift.' }
        ],
        projects: [{ title: 'Rapid Trauma Assessment Protocol', technology: 'Epic EHR Triage Module', desc: 'Co-authored emergency department rapid assessment protocol reducing door-to-doctor times by 20 minutes.' }]
      }
    },
    {
      id: 'health-pharmacy',
      title: 'Pharmacy Operations Specialist',
      category: 'Healthcare',
      experience: '4-8 Years',
      atsScore: 95,
      templateId: 'minimal',
      description: 'Licensed Pharmacist managing medication dispensing safety, clinical drug interactions, and inventory control.',
      resumeData: {
        name: 'Dr. Anita Roy, PharmD',
        role: 'Clinical Pharmacy Specialist',
        contact: { email: 'a.roy@forgeindiaconnect.app', phone: '+1 (555) 123-8901', location: 'Houston, TX', linkedin: 'linkedin.com/in/anita-roy-pharmd' },
        objective: 'Doctor of Pharmacy (PharmD) with 6+ years overseeing inpatient medication safety, sterile compounding, and antibiotic stewardship programs.',
        education: [{ degree: 'Doctor of Pharmacy (PharmD)', institution: 'University of Houston', tenure: '2013 - 2017', cgpa: '3.92 / 4.0' }],
        skills: { languages: 'Pharmacotherapy, Drug Interaction Analysis, Sterile Compounding', frameworks: 'USP 797/800 Guidelines, Medication Safety', tools: 'Pyxis ES, Omnicell, Epic Willow' },
        experience: [
          { title: 'Clinical Staff Pharmacist', company: 'Houston Memorial Health', duration: '2019 - Present', desc: '• Reviewed and verified 200+ complex inpatient pharmaceutical orders daily.' }
        ],
        projects: [{ title: 'Antibiotic Stewardship Program', technology: 'Epic Willow, Pyxis ES', desc: 'Implemented hospital-wide antibiotic review protocol reducing adverse drug events by 24%.' }]
      }
    }
  ],

  'Information Technology': [
    {
      id: 'it-cloud',
      title: 'Cloud Solutions Architect',
      category: 'Information Technology',
      experience: '6-10 Years',
      atsScore: 98,
      templateId: 'executive',
      description: 'Enterprise Cloud Architect specializing in AWS/Azure migration, microservices, and high-availability architecture.',
      resumeData: {
        name: 'Robert Sterling, CISSP',
        role: 'Principal Cloud Architect',
        contact: { email: 'r.sterling@forgeindiaconnect.app', phone: '+1 (555) 678-9012', location: 'Dallas, TX', linkedin: 'linkedin.com/in/robert-sterling-cloud' },
        objective: 'Principal Cloud Architect with 9+ years of enterprise IT experience. Architected hybrid cloud environments reducing infrastructure operating costs by $1.4M annually.',
        education: [{ degree: 'M.S. in Information Technology', institution: 'Carnegie Mellon University', tenure: '2013 - 2015', cgpa: '3.95 / 4.0' }],
        skills: { languages: 'Python, Terraform, Cloud Security', frameworks: 'AWS Well-Architected Framework, Zero Trust', tools: 'AWS, Azure, Docker, Kubernetes, Splunk' },
        experience: [
          { title: 'Principal Cloud Architect', company: 'Enterprise Cloud Systems', duration: '2018 - Present', desc: '• Led digital cloud transformation for Fortune 500 financial services client.\n• Enforced strict SOC2 and HIPAA compliance standards across 300+ cloud instances.' }
        ],
        projects: [{ title: 'Global Multi-Region Cloud Resilience Plan', technology: 'AWS Route53, DynamoDB Global Tables', desc: 'Architected active-active disaster recovery framework guaranteeing 99.999% uptime.' }]
      }
    },
    {
      id: 'it-cyber',
      title: 'Cybersecurity Operations Specialist',
      category: 'Information Technology',
      experience: '4-8 Years',
      atsScore: 97,
      templateId: 'modern',
      description: 'CISSP-certified Security Analyst specializing in SIEM threat monitoring, incident response, and penetration testing.',
      resumeData: {
        name: 'Kevin Zhao, CISSP',
        role: 'Lead Cybersecurity Operations Specialist',
        contact: { email: 'k.zhao@forgeindiaconnect.app', phone: '+1 (555) 456-1234', location: 'Washington, DC', linkedin: 'linkedin.com/in/kevin-zhao-cyber' },
        objective: 'Certified Information Systems Security Professional (CISSP) with 6+ years protecting enterprise networks from advanced persistent threats (APT).',
        education: [{ degree: 'B.S. in Cybersecurity & Information Assurance', institution: 'George Mason University', tenure: '2014 - 2018', cgpa: '3.88 / 4.0' }],
        skills: { languages: 'Penetration Testing, Incident Response, Vulnerability Assessment', frameworks: 'NIST Cybersecurity Framework, ISO 27001', tools: 'Splunk SIEM, Wireshark, CrowdStrike, Nessus' },
        experience: [
          { title: 'Lead Security Operations Analyst', company: 'Vanguard Cyber Defense', duration: '2020 - Present', desc: '• Monitored 24/7 SOC environment detecting and mitigating 150+ security incidents annually with zero data breach incidents.' }
        ],
        projects: [{ title: 'Enterprise Zero-Trust Identity Architecture', technology: 'Okta, CrowdStrike, Splunk', desc: 'Deployed multi-factor authentication and endpoint security across 10,000+ corporate endpoints.' }]
      }
    },
    {
      id: 'it-dev',
      title: 'Full-Stack Software Developer',
      category: 'Information Technology',
      experience: '3-6 Years',
      atsScore: 96,
      templateId: 'professional',
      description: 'Versatile IT Developer building modern React web apps, Node.js microservices, and SQL database pipelines.',
      resumeData: {
        name: 'Nathaniel Cross',
        role: 'Senior Software Developer',
        contact: { email: 'n.cross@forgeindiaconnect.app', phone: '+1 (555) 789-3456', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/nathaniel-cross-dev', github: 'github.com/ncross-dev' },
        objective: 'Full Stack Developer with 5+ years of software engineering experience building responsive React applications and robust Node.js backend services.',
        education: [{ degree: 'B.S. in Computer Science', institution: 'UC Santa Cruz', tenure: '2015 - 2019', cgpa: '3.82 / 4.0' }],
        skills: { languages: 'JavaScript, TypeScript, Python, SQL', frameworks: 'React, Express.js, Node.js, GraphQL', tools: 'PostgreSQL, Docker, AWS S3, Git' },
        experience: [
          { title: 'Senior Software Developer', company: 'CodePulse Labs', duration: '2021 - Present', desc: '• Engineered microservice architecture handling 1.5M daily active API calls with sub-50ms latency.' }
        ],
        projects: [{ title: 'Real-Time Enterprise Collaboration Tool', technology: 'React, Node.js, WebSockets', desc: 'Built real-time messaging and document editing application used by 30+ internal teams.' }]
      }
    },
    {
      id: 'it-dba',
      title: 'Database Administrator (DBA)',
      category: 'Information Technology',
      experience: '5-8 Years',
      atsScore: 95,
      templateId: 'creative',
      description: 'Expert Database Administrator skilled in PostgreSQL, Oracle, query tuning, backup recovery, and high availability.',
      resumeData: {
        name: 'Priya Sharma',
        role: 'Lead Database Administrator',
        contact: { email: 'p.sharma@forgeindiaconnect.app', phone: '+1 (555) 901-5678', location: 'Chicago, IL', linkedin: 'linkedin.com/in/priya-sharma-dba' },
        objective: 'Database Administrator with 7+ years optimizing relational database performance, automated backups, and zero-loss replication clusters.',
        education: [{ degree: 'B.S. in Database Systems & IT', institution: 'University of Illinois', tenure: '2013 - 2017', cgpa: '3.85 / 4.0' }],
        skills: { languages: 'PL/SQL, T-SQL, Python, Bash', frameworks: 'Database Indexing, High Availability Clustering', tools: 'PostgreSQL, Oracle 19c, MS SQL Server, MongoDB' },
        experience: [
          { title: 'Lead Database Administrator', company: 'Apex Data Services', duration: '2019 - Present', desc: '• Managed 80+ enterprise PostgreSQL and Oracle database instances totaling 45TB of critical data.' }
        ],
        projects: [{ title: 'Zero-Downtime Database Clustering Migration', technology: 'PostgreSQL, PgBouncer, Repmgr', desc: 'Migrated legacy database servers to active-passive replication cluster with zero transaction data loss.' }]
      }
    },
    {
      id: 'it-manager',
      title: 'IT Systems & Infrastructure Manager',
      category: 'Information Technology',
      experience: '6-10 Years',
      atsScore: 97,
      templateId: 'minimal',
      description: 'Strategic IT Manager leading helpdesk teams, network infrastructure, hardware procurement, and ITIL SLAs.',
      resumeData: {
        name: 'Thomas Wright',
        role: 'Director of IT Infrastructure',
        contact: { email: 't.wright@forgeindiaconnect.app', phone: '+1 (555) 234-7890', location: 'Atlanta, GA', linkedin: 'linkedin.com/in/thomas-wright-it' },
        objective: 'IT Manager with 8+ years leading enterprise helpdesk support, network hardware procurement, and vendor ITIL SLA management.',
        education: [{ degree: 'B.S. in Network Administration', institution: 'Georgia State University', tenure: '2012 - 2016', cgpa: '3.8 / 4.0' }],
        skills: { languages: 'Network Administration, Vendor Management, Helpdesk Operations', frameworks: 'ITIL v4 Framework, Active Directory', tools: 'ServiceNow, Cisco Meraki, Office 365 Admin, VMware' },
        experience: [
          { title: 'Director of IT Infrastructure', company: 'Global Logistics Corp', duration: '2018 - Present', desc: '• Managed IT operations and equipment deployment for 12 corporate offices supporting 2,000+ employees.' }
        ],
        projects: [{ title: 'Global Office Hardware & Network Refresh', technology: 'Cisco Meraki, ServiceNow', desc: 'Upgraded network switches and Wi-Fi 6 access points across 12 branch locations on schedule.' }]
      }
    },
    {
      id: 'it-aiml',
      title: 'AI / Machine Learning Specialist',
      category: 'Information Technology',
      experience: '3-7 Years',
      atsScore: 98,
      templateId: 'executive',
      description: 'Machine Learning Engineer building PyTorch models, NLP pipelines, vector databases, and LLM fine-tuning.',
      resumeData: {
        name: 'Dr. Aris Thorne',
        role: 'Lead AI & Machine Learning Scientist',
        contact: { email: 'a.thorne@forgeindiaconnect.app', phone: '+1 (555) 567-8901', location: 'Seattle, WA', linkedin: 'linkedin.com/in/aris-thorne-ai' },
        objective: 'AI Specialist with 5+ years developing deep learning models, natural language processing (NLP) pipelines, and generative AI microservices.',
        education: [{ degree: 'Ph.D. in Artificial Intelligence', institution: 'University of Washington', tenure: '2015 - 2019', cgpa: '3.96 / 4.0' }],
        skills: { languages: 'Python, C++, SQL, PyTorch', frameworks: 'TensorFlow, HuggingFace, LangChain, Scikit-Learn', tools: 'Pinecone Vector DB, Docker, MLflow, AWS SageMaker' },
        experience: [
          { title: 'Lead AI Scientist', company: 'Cognitive AI Labs', duration: '2020 - Present', desc: '• Built LLM RAG recommendation engine improving search relevancy metrics by 42% for 500,000 active users.' }
        ],
        projects: [{ title: 'Enterprise Generative AI Knowledge Assistant', technology: 'PyTorch, LangChain, Pinecone', desc: 'Deployed internal AI assistant trained on 100,000 corporate documents with sub-second retrieval times.' }]
      }
    }
  ],

  Marketing: [
    {
      id: 'mkt-manager',
      title: 'Digital Marketing Manager',
      category: 'Marketing',
      experience: '4-7 Years',
      atsScore: 97,
      templateId: 'creative',
      description: 'Data-driven Digital Marketing Manager proficient in PPC, SEO, email funnels, and ROI conversion optimization.',
      resumeData: {
        name: 'Chloe Bennett',
        role: 'Director of Growth & Digital Marketing',
        contact: { email: 'chloe.b@forgeindiaconnect.app', phone: '+1 (555) 432-1098', location: 'Miami, FL', linkedin: 'linkedin.com/in/chloe-bennett-mkt' },
        objective: 'Results-focused Digital Marketing Manager with 6+ years managing $2M+ annual ad spend. Increased organic search traffic by 180% and reduced Customer Acquisition Cost (CAC) by 35%.',
        education: [{ degree: 'B.S. in Marketing & Communications', institution: 'University of Florida', tenure: '2014 - 2018', cgpa: '3.8 / 4.0' }],
        skills: { languages: 'SEO, SEM, Paid Social, Email Marketing Funnels', frameworks: 'AIDA, Growth Funnels, A/B Testing', tools: 'Google Analytics 4, HubSpot, Meta Ads Manager, Ahrefs' },
        experience: [
          { title: 'Digital Marketing Lead', company: 'Apex Growth Agency', duration: '2020 - Present', desc: '• Managed multi-channel performance marketing campaigns generating $8.5M in trackable revenue.\n• Conducted 100+ A/B landing page tests improving conversion rates from 2.1% to 5.4%.' }
        ],
        projects: [{ title: 'SaaS Organic Traffic Expansion Campaign', technology: 'GA4, Ahrefs, HubSpot', desc: 'Grew organic blog traffic from 15,000 to 120,000 monthly visits in 12 months.' }]
      }
    },
    {
      id: 'mkt-seo',
      title: 'SEO & Growth Specialist',
      category: 'Marketing',
      experience: '3-6 Years',
      atsScore: 95,
      templateId: 'modern',
      description: 'Technical SEO Specialist skilled in keyword research, backlink acquisition, technical audits, and organic revenue.',
      resumeData: {
        name: 'Julian Ross',
        role: 'Senior SEO & Growth Strategist',
        contact: { email: 'j.ross@forgeindiaconnect.app', phone: '+1 (555) 789-0123', location: 'Austin, TX', linkedin: 'linkedin.com/in/julian-ross-seo' },
        objective: 'Technical SEO Strategist with 5+ years driving organic search engine rankings and technical website optimizations.',
        education: [{ degree: 'B.S. in Digital Media', institution: 'UT Austin', tenure: '2015 - 2019', cgpa: '3.78 / 4.0' }],
        skills: { languages: 'Technical SEO, On-Page Optimization, Link Building', frameworks: 'Schema Markup, Core Web Vitals', tools: 'Screaming Frog, SEMrush, Ahrefs, Google Search Console' },
        experience: [
          { title: 'Senior SEO Strategist', company: 'Vanguard Digital Marketing', duration: '2021 - Present', desc: '• Conducted technical SEO audits for 25+ e-commerce websites resulting in 120% YoY organic revenue gains.' }
        ],
        projects: [{ title: 'E-Commerce Site Architecture Overhaul', technology: 'Screaming Frog, Schema.org', desc: 'Fixed 500+ crawl errors and implemented structured schema data, raising top 3 keyword rankings by 85%.' }]
      }
    },
    {
      id: 'mkt-content',
      title: 'Content Marketing Manager',
      category: 'Marketing',
      experience: '3-6 Years',
      atsScore: 94,
      templateId: 'professional',
      description: 'Engaging Content Strategist crafting whitepapers, blog publications, video scripts, and brand storytelling.',
      resumeData: {
        name: 'Clara Oswald',
        role: 'Content Marketing Lead',
        contact: { email: 'c.oswald@forgeindiaconnect.app', phone: '+1 (555) 901-2345', location: 'Chicago, IL', linkedin: 'linkedin.com/in/clara-oswald-content' },
        objective: 'Creative Content Marketing Manager with 5+ years producing high-converting editorial content, whitepapers, and thought leadership articles.',
        education: [{ degree: 'B.A. in Journalism & English', institution: 'Northwestern University', tenure: '2015 - 2019', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Content Strategy, Copywriting, Editorial Direction', frameworks: 'Brand Voice Guidelines, Funnel Marketing', tools: 'WordPress, Grammarly, BuzzSumo, Asana' },
        experience: [
          { title: 'Content Manager', company: 'CloudPulse Media', duration: '2020 - Present', desc: '• Authored 150+ high-ranking articles generating 40,000+ organic lead downloads.' }
        ],
        projects: [{ title: 'Enterprise E-Book Lead Generation Campaign', technology: 'WordPress, HubSpot', desc: 'Published 40-page industry report that captured 3,500+ qualified B2B sales leads.' }]
      }
    },
    {
      id: 'mkt-social',
      title: 'Social Media Director',
      category: 'Marketing',
      experience: '4-7 Years',
      atsScore: 96,
      templateId: 'executive',
      description: 'Strategic Social Media Manager leading viral viral campaigns, influencer partnerships, and community engagement.',
      resumeData: {
        name: 'Zoe Kravitz',
        role: 'Head of Social Media & Community',
        contact: { email: 'z.kravitz@forgeindiaconnect.app', phone: '+1 (555) 234-8901', location: 'New York, NY', linkedin: 'linkedin.com/in/zoe-kravitz-social' },
        objective: 'Social Media Director with 6+ years expanding brand social presence across LinkedIn, Twitter, TikTok, and Instagram.',
        education: [{ degree: 'B.A. in Communications', institution: 'NYU', tenure: '2014 - 2018', cgpa: '3.82 / 4.0' }],
        skills: { languages: 'Social Strategy, Influencer Marketing, Viral Content', frameworks: 'Community Management, Campaign Analytics', tools: 'Sprout Social, Hootsuite, Canva, TikTok Ads' },
        experience: [
          { title: 'Head of Social Media', company: 'Pixel Brand Media', duration: '2020 - Present', desc: '• Grew total social media followers from 100K to 1.2M across 4 primary brand channels.' }
        ],
        projects: [{ title: 'Viral Product Launch Campaign', technology: 'TikTok Ads, Sprout Social', desc: 'Managed multi-creator influencer campaign generating 25M+ impressions in 7 days.' }]
      }
    },
    {
      id: 'mkt-brand',
      title: 'Performance Brand Manager',
      category: 'Marketing',
      experience: '5-8 Years',
      atsScore: 95,
      templateId: 'minimal',
      description: 'Brand Manager driving market positioning, product messaging, consumer research, and brand equity growth.',
      resumeData: {
        name: 'Arthur Pendelton',
        role: 'Senior Brand Manager',
        contact: { email: 'a.pendelton@forgeindiaconnect.app', phone: '+1 (555) 567-9012', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/arthur-pendelton-brand' },
        objective: 'Strategic Brand Manager with 7+ years managing product positioning, multi-million dollar television/digital brand budgets, and market research.',
        education: [{ degree: 'MBA in Marketing', institution: 'Stanford GSB', tenure: '2015 - 2017', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Brand Equity, Market Positioning, Consumer Insights', frameworks: 'Brand Architecture, Category Management', tools: 'Nielsen Data, Kantar, Qualtrics' },
        experience: [
          { title: 'Senior Brand Manager', company: 'Global Consumer Goods', duration: '2019 - Present', desc: '• Oversaw $12M brand budget delivering 22% YoY market share growth in consumer retail.' }
        ],
        projects: [{ title: 'National Product Line Rebrand', technology: 'Nielsen Data, Kantar', desc: 'Executed nationwide repositioning campaign elevating brand preference by 30%.' }]
      }
    }
  ],

  Sales: [
    {
      id: 'sales-ae',
      title: 'Enterprise Account Executive',
      category: 'Sales',
      experience: '4-8 Years',
      atsScore: 98,
      templateId: 'executive',
      description: 'Top-performing Enterprise Account Executive skilled in B2B SaaS sales, MEDDIC methodology, and closing $500K+ deals.',
      resumeData: {
        name: 'Brandon Cole',
        role: 'Senior Enterprise Account Executive',
        contact: { email: 'b.cole@forgeindiaconnect.app', phone: '+1 (555) 987-6543', location: 'Denver, CO', linkedin: 'linkedin.com/in/brandon-cole-sales' },
        objective: 'High-performing Enterprise Account Executive with 7+ years of SaaS sales experience. Consistently exceeded annual revenue quota by 140%+ for 4 consecutive years.',
        education: [{ degree: 'B.A. in Business Communication', institution: 'University of Colorado', tenure: '2013 - 2017', cgpa: '3.75 / 4.0' }],
        skills: { languages: 'B2B Sales, Enterprise Deal Closing, Contract Negotiation', frameworks: 'MEDDPICC, Challenger Sale, SPIN Selling', tools: 'Salesforce CRM, Gong.io, LinkedIn Sales Navigator, ZoomInfo' },
        experience: [
          { title: 'Senior Enterprise Account Executive', company: 'CloudScale SaaS', duration: '2020 - Present', desc: '• Closed $3.8M in Annual Contract Value (ACV) across Fortune 500 enterprise accounts in 2023.\n• Awarded President’s Club honors 3 consecutive years for top regional quota attainment.' }
        ],
        projects: [{ title: 'Fortune 100 Multi-Year Enterprise Deal', technology: 'Salesforce, MEDDPICC', desc: 'Negotiated and closed a $1.2M 3-year SaaS contract with a major national bank.' }]
      }
    },
    {
      id: 'sales-sdr',
      title: 'Sales Development Rep (SDR)',
      category: 'Sales',
      experience: '1-3 Years',
      atsScore: 94,
      templateId: 'modern',
      description: 'Energetic SDR proficient in outbound cold outreach, lead qualification, email sequencing, and pipeline generation.',
      resumeData: {
        name: 'Tyler Vance',
        role: 'Senior Sales Development Representative',
        contact: { email: 't.vance@forgeindiaconnect.app', phone: '+1 (555) 234-0123', location: 'Chicago, IL', linkedin: 'linkedin.com/in/tyler-vance-sdr' },
        objective: 'Goal-driven SDR with 2+ years of experience generating qualified sales opportunities for B2B enterprise software companies.',
        education: [{ degree: 'B.S. in Marketing', institution: 'DePaul University', tenure: '2018 - 2022', cgpa: '3.7 / 4.0' }],
        skills: { languages: 'Cold Outreach, Lead Qualification, Email Sequencing', frameworks: 'BANT Qualification, Outbound Prospecting', tools: 'Salesloft, Outreach.io, Salesforce, ZoomInfo' },
        experience: [
          { title: 'Senior SDR', company: 'Apex Software Labs', duration: '2022 - Present', desc: '• Generated 180+ qualified sales opportunities generating $1.4M in pipeline revenue in 2023.' }
        ],
        projects: [{ title: 'Outbound Cold Email Sequence Optimization', technology: 'Outreach.io, Salesloft', desc: 'Designed personalized 5-step email sequence raising open rates from 22% to 48%.' }]
      }
    },
    {
      id: 'sales-bdm',
      title: 'Business Development Manager',
      category: 'Sales',
      experience: '4-7 Years',
      atsScore: 96,
      templateId: 'professional',
      description: 'Strategic BDM skilled in strategic channel partnerships, market expansion, joint ventures, and revenue growth.',
      resumeData: {
        name: 'Victoria Sterling',
        role: 'Director of Business Development',
        contact: { email: 'v.sterling@forgeindiaconnect.app', phone: '+1 (555) 456-8901', location: 'Boston, MA', linkedin: 'linkedin.com/in/victoria-sterling-bdm' },
        objective: 'Strategic Business Development Manager with 6+ years expanding corporate channel partnerships and co-selling alliances.',
        education: [{ degree: 'B.S. in Business Management', institution: 'Boston College', tenure: '2014 - 2018', cgpa: '3.85 / 4.0' }],
        skills: { languages: 'Channel Partnerships, Strategic Alliances, Joint Ventures', frameworks: 'Partner Co-Selling, Contract Structuring', tools: 'Salesforce, Crossbeam, Hubspot' },
        experience: [
          { title: 'Director of Business Development', company: 'Vanguard Tech Alliances', duration: '2020 - Present', desc: '• Established 14 new technology partnership alliances driving $4.5M in referral revenue.' }
        ],
        projects: [{ title: 'Global Cloud Marketplace Partner Launch', technology: 'AWS Marketplace, Salesforce', desc: 'Launched co-selling partnership with AWS resulting in 35% pipeline growth.' }]
      }
    },
    {
      id: 'sales-director',
      title: 'Regional Sales Director',
      category: 'Sales',
      experience: '6-10 Years',
      atsScore: 97,
      templateId: 'creative',
      description: 'Executive Sales Director managing regional sales teams, territory planning, quota attainment, and revenue scaling.',
      resumeData: {
        name: 'Harrison Forde',
        role: 'Regional Vice President of Sales',
        contact: { email: 'h.forde@forgeindiaconnect.app', phone: '+1 (555) 678-0123', location: 'New York, NY', linkedin: 'linkedin.com/in/harrison-forde-sales' },
        objective: 'Executive Sales Director with 9+ years managing high-performance B2B sales teams. Scaled regional annual recurring revenue (ARR) from $10M to $28M.',
        education: [{ degree: 'MBA in General Management', institution: 'Columbia Business School', tenure: '2013 - 2015', cgpa: '3.9 / 4.0' }],
        skills: { languages: 'Sales Team Leadership, Territory Planning, Revenue Forecasting', frameworks: 'Sales Operations, Quota Structuring', tools: 'Salesforce CRM, Clari, InsightSquared' },
        experience: [
          { title: 'Regional VP of Sales', company: 'CloudPulse Enterprise', duration: '2018 - Present', desc: '• Led team of 16 Enterprise AEs achieving 125% of annual regional revenue quota.' }
        ],
        projects: [{ title: 'Commercial Sales Organization Restructuring', technology: 'Salesforce, Clari', desc: 'Restructured sales territories and commission plans, boosting average deal size by 28%.' }]
      }
    },
    {
      id: 'sales-csm',
      title: 'Customer Success Account Manager',
      category: 'Sales',
      experience: '3-6 Years',
      atsScore: 95,
      templateId: 'minimal',
      description: 'Customer Success Manager driving customer retention, net revenue retention (NRR), upsells, and account health.',
      resumeData: {
        name: 'Natalie Portman',
        role: 'Senior Customer Success Manager',
        contact: { email: 'n.portman@forgeindiaconnect.app', phone: '+1 (555) 890-2345', location: 'Seattle, WA', linkedin: 'linkedin.com/in/natalie-portman-csm' },
        objective: 'Customer Success Manager with 5+ years maintaining a 96%+ gross retention rate and expanding Net Revenue Retention (NRR) to 118%.',
        education: [{ degree: 'B.A. in Psychology & Business', institution: 'University of Washington', tenure: '2015 - 2019', cgpa: '3.82 / 4.0' }],
        skills: { languages: 'Customer Retention, Account Upselling, Renewal Management', frameworks: 'Customer Onboarding, Health Score Frameworks', tools: 'Gainsight, ChurnZero, Salesforce, Zendesk' },
        experience: [
          { title: 'Senior CSM', company: 'Apex SaaS Solutions', duration: '2021 - Present', desc: '• Managed $4.2M ARR portfolio of 45 enterprise accounts with 98% annual renewal rate.' }
        ],
        projects: [{ title: 'Enterprise Customer Onboarding Framework', technology: 'Gainsight, Salesforce', desc: 'Redesigned client onboarding process, cutting time-to-value (TTV) from 60 days to 21 days.' }]
      }
    }
  ]
};
