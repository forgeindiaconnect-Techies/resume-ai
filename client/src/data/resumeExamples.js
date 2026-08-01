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
          email: 'a.wright@careerelite.app',
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
          email: 'rachel.s@careerelite.app',
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
    },
    {
      id: 'biz-exec',
      title: 'Executive Assistant',
      category: 'Business',
      experience: '4-8 Years',
      atsScore: 95,
      templateId: 'executive',
      description: 'High-level Executive Assistant managing C-suite calendars, travel logistics, and corporate communications.',
      resumeData: {
        name: 'Victoria Vance',
        role: 'Executive Assistant to CEO',
        contact: {
          email: 'victoria.vance@careerelite.app',
          phone: '+1 (555) 890-1234',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/victoria-vance'
        },
        objective: 'Proactive Executive Assistant with 7+ years of experience supporting C-suite executives at Fortune 500 technology firms. Seamless calendar and operations manager.',
        education: [{ degree: 'B.A. in Communications', institution: 'UC Berkeley', tenure: '2013 - 2017' }],
        skills: { languages: 'English, French', frameworks: 'Event Management, Travel Logistics', tools: 'Google Workspace, Salesforce, Zoom, Slack' },
        experience: [
          {
            title: 'Executive Assistant to CEO',
            company: 'Vanguard Tech',
            duration: '2019 - Present',
            desc: 'Coordinated complex international itineraries and board meeting presentations for CEO and 4 Executive VPs.\nManaged $500K annual executive travel budget.'
          }
        ],
        projects: [{ title: 'Global Leadership Summit 2023', technology: 'Event Tech, Asana', desc: 'Orchestrated annual retreat for 200+ global executive partners across 3 regions.' }]
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
        role: 'Software Engineer',
        contact: {
          email: 'david.chen@careerelite.app',
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
            title: 'Software Engineer',
            company: 'CloudScale Technologies',
            duration: '2020 - Present',
            desc: 'Architected microservices handling 2M+ daily active requests with 99.99% uptime.\nImplemented Redis caching layer decreasing database load by 50%.'
          }
        ],
        projects: [{ title: 'Real-Time Collaboration Engine', technology: 'React, WebSockets, Node.js', desc: 'Engineered real-time document editor supporting multi-user concurrent edits.' }]
      }
    },
    {
      id: 'eng-fe',
      title: 'Frontend Developer',
      category: 'Engineering',
      experience: '2-4 Years',
      atsScore: 95,
      templateId: 'creative',
      description: 'Creative Frontend Developer passionate about UI/UX polish, React, TypeScript, and Tailwind CSS.',
      resumeData: {
        name: 'Elena Rostova',
        role: 'Frontend Developer',
        contact: {
          email: 'elena.r@careerelite.app',
          phone: '+1 (555) 234-5678',
          location: 'Austin, TX',
          linkedin: 'linkedin.com/in/elena-rostova-fe',
          github: 'github.com/elena-ui'
        },
        objective: 'Frontend Developer with 3+ years of experience crafting accessible, responsive React interfaces. Increased web conversion rates by 20%.',
        education: [{ degree: 'B.S. in Web Development', institution: 'UT Austin', tenure: '2017 - 2021' }],
        skills: { languages: 'JavaScript (ES6+), TypeScript, HTML5, CSS3', frameworks: 'React, Next.js, Redux Toolkit, Tailwind CSS', tools: 'Figma, Webpack, Jest, Cypress' },
        experience: [
          {
            title: 'Frontend Developer',
            company: 'PixelCraft Design Studios',
            duration: '2021 - Present',
            desc: 'Built modular component library consumed across 5 SaaS web applications.\nOptimized Core Web Vitals achieving 98+ Lighthouse scores across all client portals.'
          }
        ],
        projects: [{ title: 'Design System Library', technology: 'React, Tailwind, Storybook', desc: 'Created reusable component system reducing developer onboarding time by 35%.' }]
      }
    },
    {
      id: 'eng-be',
      title: 'Backend Developer',
      category: 'Engineering',
      experience: '3-6 Years',
      atsScore: 96,
      templateId: 'executive',
      description: 'Robust Backend Engineer focused on microservices, PostgreSQL indexing, Express.js, and API security.',
      resumeData: {
        name: 'Marcus Brody',
        role: 'Backend Engineer',
        contact: {
          email: 'm.brody@careerelite.app',
          phone: '+1 (555) 987-6543',
          location: 'Denver, CO',
          linkedin: 'linkedin.com/in/marcus-brody-be',
          github: 'github.com/mbrody'
        },
        objective: 'Backend Specialist with 5 years of experience engineering secure REST and GraphQL APIs. Expert in database query optimization and event-driven architecture.',
        education: [{ degree: 'B.S. in Software Engineering', institution: 'Colorado School of Mines', tenure: '2015 - 2019' }],
        skills: { languages: 'Node.js, Python, Java, SQL', frameworks: 'Express, NestJS, Spring Boot, Django', tools: 'PostgreSQL, Redis, RabbitMQ, Docker, Kubernetes' },
        experience: [
          {
            title: 'Backend Engineer',
            company: 'DataStream Systems',
            duration: '2019 - Present',
            desc: 'Designed event-driven streaming pipeline processing 500K messages per second.\nRefactored database schema resulting in 60% faster query execution times.'
          }
        ],
        projects: [{ title: 'Secure Payment Gateway API', technology: 'Node.js, PostgreSQL, Stripe', desc: 'Built PCI-compliant payment orchestration service managing $10M+ in volume.' }]
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
          email: 'sophia.m@careerelite.app',
          phone: '+1 (555) 345-6789',
          location: 'Los Angeles, CA',
          linkedin: 'linkedin.com/in/sophia-uiux',
          portfolio: 'sophiadesign.dev'
        },
        objective: 'Empathetic UI/UX Designer with 5 years of experience creating intuitive digital experiences. Boosted user engagement metrics by 35% on flagship mobile app.',
        education: [{ degree: 'B.F.A. in Interaction Design', institution: 'Rhode Island School of Design', tenure: '2015 - 2019' }],
        skills: { languages: 'User Research, Wireframing, Prototyping', frameworks: 'Design Systems, Usability Testing, Information Architecture', tools: 'Figma, Adobe XD, Principle, Miro, Framer' },
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
          email: 'j.miller@careerelite.app',
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
          email: 'claire.d@careerelite.app',
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
          email: 'b.cole@careerelite.app',
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
