export const resumeCategories = [
  { id: 'business', name: 'Business', icon: 'Briefcase', count: 5 },
  { id: 'design', name: 'Design', icon: 'Palette', count: 4 },
  { id: 'education', name: 'Education', icon: 'BookOpen', count: 4 },
  { id: 'engineering', name: 'Engineering', icon: 'Settings', count: 5 },
  { id: 'finance', name: 'Finance', icon: 'DollarSign', count: 4 },
  { id: 'healthcare', name: 'Healthcare', icon: 'Activity', count: 4 },
  { id: 'it', name: 'Information Technology', icon: 'Laptop', count: 6 },
  { id: 'marketing', name: 'Marketing', icon: 'TrendingUp', count: 4 },
  { id: 'sales', name: 'Sales', icon: 'Target', count: 4 }
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
        contact: {
          email: 'a.wright@forgeindiaconnect.app',
          phone: '+1 (555) 389-2041',
          location: 'Chicago, IL',
          linkedin: 'linkedin.com/in/alexander-wright-pm'
        },
        objective: 'PMP-certified Project Manager with 6+ years of experience leading cross-functional teams to deliver enterprise software solutions on time and under budget. Reduced product launch timelines by 25%.',
        education: [{ degree: 'B.S. in Business Administration', institution: 'Northwestern University', tenure: '2014 - 2018', cgpa: '3.8' }],
        skills: { languages: 'English, Spanish', frameworks: 'Agile/Scrum, Kanban, Lean', tools: 'Jira, Asana, MS Project, Tableau' },
        experience: [
          {
            title: 'Senior Project Manager',
            company: 'Apex Global Enterprises',
            duration: '2021 - Present',
            desc: 'Managed 12+ concurrent digital transformation projects with total budgets exceeding $4.5M.\nEngineered sprint workflows resulting in a 30% increase in team velocity.'
          },
          {
            title: 'Associate Project Manager',
            company: 'Vanguard Operations',
            duration: '2018 - 2021',
            desc: 'Coordinated project schedules, risk registers, and stakeholder deliverables across 4 engineering departments.'
          }
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
        contact: {
          email: 'rachel.s@forgeindiaconnect.app',
          phone: '+1 (555) 742-9910',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/rachel-sterling-ba'
        },
        objective: 'Detail-oriented Business Analyst with 4+ years of experience bridging business needs and technical solutions. Expert in SQL modeling and executive dashboarding.',
        education: [{ degree: 'B.S. in Information Systems', institution: 'NYU Stern', tenure: '2016 - 2020', cgpa: '3.9' }],
        skills: { languages: 'SQL, Python, R', frameworks: 'BPMN, Agile, SDLC', tools: 'PowerBI, Tableau, Excel, SQL Server' },
        experience: [
          {
            title: 'Lead Business Analyst',
            company: 'Sterling Solutions Inc.',
            duration: '2020 - Present',
            desc: 'Synthesized business requirements into clear user stories for 4 development teams.\nIdentified process bottlenecks resulting in $250K annual operational savings.'
          }
        ],
        projects: [{ title: 'Customer Churn Analytics Pipeline', technology: 'Python, SQL, PowerBI', desc: 'Built predictive analytics model forecasting customer retention with 88% accuracy.' }]
      }
    }
  ],

  Education: [
    {
      id: 'edu-teacher',
      title: 'Senior High School Educator',
      category: 'Education',
      experience: '4-8 Years',
      atsScore: 97,
      templateId: 'modern',
      description: 'Dedicated Educator skilled in STEM curriculum design, digital classroom technology, and student mentorship.',
      resumeData: {
        name: 'Dr. Evelyn Harper',
        role: 'Senior STEM Educator & Department Head',
        contact: {
          email: 'evelyn.harper@forgeindiaconnect.app',
          phone: '+1 (555) 432-8765',
          location: 'Boston, MA',
          linkedin: 'linkedin.com/in/evelyn-harper-edu'
        },
        objective: 'Passionate and innovative Educator with 7+ years of experience transforming STEM learning environments. Increased AP Physics pass rates by 35% through interactive blended learning models.',
        education: [
          { degree: 'Ph.D. in Science Education', institution: 'Harvard Graduate School of Education', tenure: '2016 - 2020', cgpa: '4.0' },
          { degree: 'B.S. in Physics', institution: 'MIT', tenure: '2012 - 2016' }
        ],
        skills: { languages: 'English, French', frameworks: 'Blended Learning, STEM Curriculum, Differentiated Instruction', tools: 'Canvas, Google Classroom, Kahoot, Labster' },
        experience: [
          {
            title: 'Department Head & Physics Educator',
            company: 'Cambridge Academy of Sciences',
            duration: '2020 - Present',
            desc: 'Architected school-wide STEM curriculum for 800+ students across physics and computer science tracks.\nSupervised 12 faculty members and managed $150K annual lab equipment budget.'
          },
          {
            title: 'Secondary Physics Teacher',
            company: 'Boston Public Schools',
            duration: '2017 - 2020',
            desc: 'Taught Honors and AP Physics to over 150 students annually with an average exam score of 4.4/5.0.'
          }
        ],
        projects: [
          { title: 'Interactive Virtual Science Lab', technology: 'VR Education Tech, Canvas LMS', desc: 'Designed remote VR physics lab modules adopted across 5 regional high schools.' }
        ]
      }
    },
    {
      id: 'edu-admin',
      title: 'Academic Administrator',
      category: 'Education',
      experience: '5-10 Years',
      atsScore: 95,
      templateId: 'executive',
      description: 'Educational Leader specializing in academic accreditation, faculty development, and institutional operations.',
      resumeData: {
        name: 'Marcus Thorne',
        role: 'Assistant Dean of Academic Affairs',
        contact: {
          email: 'marcus.t@forgeindiaconnect.app',
          phone: '+1 (555) 901-2345',
          location: 'Philadelphia, PA',
          linkedin: 'linkedin.com/in/marcus-thorne-admin'
        },
        objective: 'Visionary Academic Administrator with 8+ years of leadership in higher education. Championed accreditation initiatives and expanded online degree offerings by 40%.',
        education: [{ degree: 'M.Ed. in Educational Leadership', institution: 'University of Pennsylvania', tenure: '2014 - 2016' }],
        skills: { languages: 'English', frameworks: 'Higher Ed Accreditation, Curriculum Audit, Faculty Governance', tools: 'Banner, Workday Student, Salesforce Education' },
        experience: [
          {
            title: 'Assistant Dean of Academic Affairs',
            company: 'Keystone State University',
            duration: '2019 - Present',
            desc: 'Oversaw academic compliance for 14 undergraduate departments enrolling 6,000+ students.\nLed successful Middle States accreditation renewal with zero compliance findings.'
          }
        ],
        projects: [{ title: 'Hybrid Degree Program Launch', technology: 'Workday, Brightspace', desc: 'Launched 6 fully online undergraduate degree programs generating $3.2M in tuition revenue.' }]
      }
    }
  ],

  Engineering: [
    {
      id: 'eng-se',
      title: 'Software Engineer',
      category: 'Engineering',
      experience: '2-5 Years',
      atsScore: 97,
      templateId: 'modern',
      description: 'Fullstack Software Engineer specialized in React, Node.js, distributed systems, and CI/CD pipelines.',
      resumeData: {
        name: 'David Chen',
        role: 'Senior Software Engineer',
        contact: {
          email: 'david.chen@forgeindiaconnect.app',
          phone: '+1 (555) 456-7890',
          location: 'Seattle, WA',
          linkedin: 'linkedin.com/in/davidchen-dev',
          github: 'github.com/davidchen-dev'
        },
        objective: 'Performance-driven Software Engineer with 4 years of experience building high-throughput web applications and REST APIs. Reduced API latency by 45%.',
        education: [{ degree: 'B.S. in Computer Science', institution: 'University of Washington', tenure: '2016 - 2020', cgpa: '3.9' }],
        skills: { languages: 'TypeScript, JavaScript, Python, Go', frameworks: 'React, Node.js, Express, Next.js', tools: 'Docker, AWS, MongoDB, PostgreSQL, Git' },
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'CloudScale Technologies',
            duration: '2020 - Present',
            desc: 'Architected microservices handling 2M+ daily active requests with 99.99% uptime.\nImplemented Redis caching layer decreasing database load by 50%.'
          }
        ],
        projects: [{ title: 'Real-Time Collaboration Engine', technology: 'React, WebSockets, Node.js', desc: 'Engineered real-time document editor supporting multi-user concurrent edits.' }]
      }
    }
  ],

  Finance: [
    {
      id: 'fin-fa',
      title: 'Financial Analyst',
      category: 'Finance',
      experience: '3-6 Years',
      atsScore: 96,
      templateId: 'professional',
      description: 'CFA charterholder with expertise in financial modeling, valuation, portfolio risk, and M&A forecasting.',
      resumeData: {
        name: 'Jonathan Vance',
        role: 'Senior Financial Analyst',
        contact: {
          email: 'jonathan.v@forgeindiaconnect.app',
          phone: '+1 (555) 678-1234',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/jonathan-vance-cfa'
        },
        objective: 'CFA Charterholder with 5+ years of corporate finance and investment analysis experience. Developed valuation models for $200M+ M&A transactions.',
        education: [{ degree: 'B.S. in Finance & Economics', institution: 'Columbia University', tenure: '2015 - 2019', cgpa: '3.95' }],
        skills: { languages: 'English', frameworks: 'DCF Valuation, LBO Modeling, Risk Analytics', tools: 'Bloomberg Terminal, Excel VBA, Capital IQ, Python' },
        experience: [
          {
            title: 'Senior Financial Analyst',
            company: 'Goldman Financial Group',
            duration: '2021 - Present',
            desc: 'Built dynamic DCF and LBO financial models evaluating target acquisitions ranging from $20M to $150M.\nPresented quarterly earnings forecasts directly to C-suite executives.'
          }
        ],
        projects: [{ title: 'Automated Portfolio Risk Dashboard', technology: 'Python, Bloomberg API, Excel', desc: 'Automated daily Value-at-Risk calculations for $500M multi-asset fund.' }]
      }
    }
  ],

  Healthcare: [
    {
      id: 'hc-rn',
      title: 'Clinical Nurse Manager',
      category: 'Healthcare',
      experience: '4-8 Years',
      atsScore: 98,
      templateId: 'executive',
      description: 'BSN Certified Clinical Nurse Manager skilled in patient care optimization, ICU protocols, and hospital staffing.',
      resumeData: {
        name: 'Sarah Jenkins, RN',
        role: 'Nurse Manager - Intensive Care Unit',
        contact: {
          email: 'sarah.jenkins@forgeindiaconnect.app',
          phone: '+1 (555) 234-9876',
          location: 'Houston, TX',
          linkedin: 'linkedin.com/in/sarah-jenkins-rn'
        },
        objective: 'Compassionate RN Nurse Manager with 7+ years of critical care experience. Reduced ICU readmission rates by 18% through evidence-based post-discharge care protocols.',
        education: [{ degree: 'M.S. in Nursing Leadership', institution: 'Johns Hopkins University', tenure: '2017 - 2019' }],
        skills: { languages: 'English, Spanish', frameworks: 'Critical Care, Triage, Patient Safety Protocols', tools: 'Epic EMR, Cerner, Pyxis Automated Medication Systems' },
        experience: [
          {
            title: 'Nurse Manager - ICU',
            company: 'Methodist Memorial Hospital',
            duration: '2019 - Present',
            desc: 'Managed 45 ICU nursing staff members while overseeing 24-bed critical care unit.\nMaintained 99% Joint Commission compliance across all clinical quality metrics.'
          }
        ],
        projects: [{ title: 'Patient Fall Prevention Protocol', technology: 'Epic EMR, Clinical Data Analytics', desc: 'Designed bedside telemetry alert workflow reducing patient falls by 40% annually.' }]
      }
    }
  ],

  'Information Technology': [
    {
      id: 'it-devops',
      title: 'DevOps Engineer',
      category: 'Information Technology',
      experience: '3-7 Years',
      atsScore: 98,
      templateId: 'executive',
      description: 'Cloud Infrastructure & DevOps Engineer specialized in AWS, Terraform, Docker, Kubernetes, and CI/CD pipelines.',
      resumeData: {
        name: 'Jonathan Miller',
        role: 'Lead DevOps Engineer',
        contact: {
          email: 'j.miller@forgeindiaconnect.app',
          phone: '+1 (555) 678-9012',
          location: 'Boston, MA',
          linkedin: 'linkedin.com/in/jmiller-devops',
          github: 'github.com/jmiller-ops'
        },
        objective: 'AWS-Certified DevOps Engineer with 6+ years of experience automating infrastructure as code and zero-downtime CI/CD deployments.',
        education: [{ degree: 'B.S. in Network Engineering', institution: 'Northeastern University', tenure: '2014 - 2018' }],
        skills: { languages: 'Bash, Python, Go, HCL', frameworks: 'CI/CD, Infrastructure as Code, GitOps', tools: 'AWS, Terraform, Kubernetes, Docker, Jenkins, Prometheus' },
        experience: [
          {
            title: 'Lead DevOps Engineer',
            company: 'Infrastructure Tech',
            duration: '2020 - Present',
            desc: 'Built automated CI/CD pipeline reducing deployment cycle times from 2 hours to 8 minutes.\nManaged multi-region Kubernetes cluster running 200+ microservices.'
          }
        ],
        projects: [{ title: 'Terraform Cloud Automation', technology: 'Terraform, AWS, GitHub Actions', desc: 'Automated 100% of staging environment provisioning with zero manual intervention.' }]
      }
    }
  ],

  Design: [
    {
      id: 'des-uiux',
      title: 'UI/UX Designer',
      category: 'Design',
      experience: '2-5 Years',
      atsScore: 93,
      templateId: 'minimal',
      description: 'User-centered UI/UX Designer specialized in wireframing, user research, Figma prototyping, and design systems.',
      resumeData: {
        name: 'Sophia Martinez',
        role: 'Senior UI/UX Designer',
        contact: {
          email: 'sophia.m@forgeindiaconnect.app',
          phone: '+1 (555) 345-6789',
          location: 'Los Angeles, CA',
          linkedin: 'linkedin.com/in/sophia-uiux',
          portfolio: 'sophiadesign.dev'
        },
        objective: 'Empathetic UI/UX Designer with 5 years of experience creating intuitive digital experiences. Boosted user engagement metrics by 35% on flagship mobile app.',
        education: [{ degree: 'B.F.A. in Interaction Design', institution: 'Rhode Island School of Design', tenure: '2015 - 2019' }],
        skills: { languages: 'User Research, Wireframing, Prototyping', frameworks: 'Design Systems, Usability Testing', tools: 'Figma, Adobe XD, Principle, Framer' },
        experience: [
          {
            title: 'Senior UI/UX Designer',
            company: 'Creative Edge Media',
            duration: '2020 - Present',
            desc: 'Led product design for iOS/Android app with over 1M downloads.\nConducted 40+ user research sessions driving key product roadmap decisions.'
          }
        ],
        projects: [{ title: 'Fintech Mobile Banking App Redesign', technology: 'Figma, User Testing', desc: 'Redesigned core onboarding flow reducing drop-off rate by 28%.' }]
      }
    }
  ],

  Marketing: [
    {
      id: 'mktg-mgr',
      title: 'Marketing Manager',
      category: 'Marketing',
      experience: '3-6 Years',
      atsScore: 94,
      templateId: 'creative',
      description: 'Strategic Growth Marketing Manager skilled in SEO, paid campaigns, content strategy, and ROI optimization.',
      resumeData: {
        name: 'Claire Dupont',
        role: 'Growth Marketing Manager',
        contact: {
          email: 'claire.d@forgeindiaconnect.app',
          phone: '+1 (555) 876-5432',
          location: 'Miami, FL',
          linkedin: 'linkedin.com/in/claire-dupont-mktg'
        },
        objective: 'Data-driven Growth Marketing Manager with 5+ years of experience scaling organic and paid customer acquisition channels. Generated 150% YoY revenue growth.',
        education: [{ degree: 'B.A. in Marketing', institution: 'University of Florida', tenure: '2015 - 2019' }],
        skills: { languages: 'Copywriting, Content Strategy', frameworks: 'Growth Hacking, SEO, SEM, Email Marketing', tools: 'Google Analytics 4, Hubspot, Meta Ads, Ahrefs' },
        experience: [
          {
            title: 'Growth Marketing Manager',
            company: 'SaaS Growth Agency',
            duration: '2020 - Present',
            desc: 'Managed $800K annual performance marketing budget delivering a 4.2x ROAS.\nEngineered organic SEO campaign boosting monthly website traffic by 180%.'
          }
        ],
        projects: [{ title: 'Product Hunt Launch Campaign', technology: 'Hubspot, Social Media, Email', desc: 'Orchestrated viral Product Hunt launch resulting in #1 Product of the Day.' }]
      }
    }
  ],

  Sales: [
    {
      id: 'sales-ae',
      title: 'Account Executive',
      category: 'Sales',
      experience: '2-5 Years',
      atsScore: 95,
      templateId: 'professional',
      description: 'Top-performing B2B Sales Account Executive consistently exceeding sales quotas and closing enterprise deals.',
      resumeData: {
        name: 'Brandon Cole',
        role: 'Enterprise Account Executive',
        contact: {
          email: 'b.cole@forgeindiaconnect.app',
          phone: '+1 (555) 654-3210',
          location: 'Atlanta, GA',
          linkedin: 'linkedin.com/in/brandon-cole-sales'
        },
        objective: 'Results-obsessed Enterprise Account Executive with 5 years of experience closing B2B SaaS solutions. Consistently achieved 140%+ of annual quota.',
        education: [{ degree: 'B.B.A. in Marketing', institution: 'Georgia Tech', tenure: '2015 - 2019' }],
        skills: { languages: 'English', frameworks: 'MEDDPICC, Solution Selling, B2B Negotiation', tools: 'Salesforce, Outreach, Gong, LinkedIn Sales Navigator' },
        experience: [
          {
            title: 'Enterprise Account Executive',
            company: 'CloudForce Sales',
            duration: '2020 - Present',
            desc: 'Closed $2.8M in ARR across enterprise accounts in 2023 (145% of quota).\nBuilt outbound prospecting campaign generating $4M+ in pipeline opportunity.'
          }
        ],
        projects: [{ title: 'Fortune 500 Enterprise Deal Closure', technology: 'Salesforce, Solution Pitching', desc: 'Secured 3-year enterprise contract worth $1.2M with major global logistics firm.' }]
      }
    }
  ]
};
