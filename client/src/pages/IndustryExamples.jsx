import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import ModernLayout from '../components/layouts/ModernLayout';
import CreativeLayout from '../components/layouts/CreativeLayout';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import MinimalLayout from '../components/layouts/MinimalLayout';
import ResumeFooter from '../components/layouts/ResumeFooter';
import { Search, Edit3, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { startSession, trackEvent } from '../utils/sessionTracker';

const categorySlugMap = {
  'most-popular': 'Most Popular Resume Examples',
  'accounting-and-finance': 'Accounting and finance resume examples',
  'business-and-management': 'Business and management resume examples',
  'creative-and-cultural-fields': 'Creative and cultural fields resume examples',
  'data-science': 'Data science resume examples',
  'design': 'Design resume examples',
  'engineering': 'Engineering resume examples',
  'executive-and-management': 'Executive and management resume examples',
  'famous-people': 'Famous people resume examples',
  'food-service': 'Food service resume examples',
  'freelance': 'Freelance resume examples',
  'government-and-federal': 'Government and federal resume examples',
  'healthcare': 'Healthcare resume examples',
  'human-resources': 'Human resources resume examples',
  'information-technology': 'Information technology resume examples',
  'legal': 'Legal resume examples',
  'marketing': 'Marketing resume examples',
  'sales': 'Sales resume examples',
  'software-engineering': 'Software engineering resume examples'
};

const categoryList = Object.values(categorySlugMap);

const getSlugByCategory = (catName) => {
  return Object.keys(categorySlugMap).find(key => categorySlugMap[key] === catName) || 'most-popular';
};

const initialRoles = [
  // --- MOST POPULAR ---
  { id: 'pm',        title: 'Project Manager',       category: 'Most Popular Resume Examples', altCategory: 'Business and management resume examples', layout: 'enhancv',       color: '#2563eb' },
  { id: 'ba',        title: 'Business Analyst',      category: 'Most Popular Resume Examples', altCategory: 'Business and management resume examples', layout: 'modern',        color: '#0b2545' },
  { id: 'exec',      title: 'Executive',             category: 'Most Popular Resume Examples', altCategory: 'Executive and management resume examples',layout: 'enhancv',       color: '#1e293b' },
  { id: 'ds',        title: 'Data Scientist',        category: 'Most Popular Resume Examples', altCategory: 'Data science resume examples',           layout: 'modern',        color: '#134e4a' },
  { id: 'prm',       title: 'Product Manager',       category: 'Most Popular Resume Examples', altCategory: 'Business and management resume examples', layout: 'creative',      color: '#6d28d9' },
  { id: 'swe',       title: 'Software Engineer',     category: 'Most Popular Resume Examples', altCategory: 'Software engineering resume examples',    layout: 'professional',  color: '#1d4ed8' },
  { id: 'dm',        title: 'Digital Marketing',     category: 'Most Popular Resume Examples', altCategory: 'Marketing resume examples',              layout: 'enhancv',       color: '#92400e' },
  { id: 'sales',     title: 'Sales Director',        category: 'Most Popular Resume Examples', altCategory: 'Sales resume examples',                  layout: 'modern',        color: '#7f1d1d' },
  { id: 'teacher',   title: 'Teacher',               category: 'Most Popular Resume Examples', altCategory: 'Creative and cultural fields resume examples', layout: 'minimal', color: '#1e3a5f' },
  { id: 'eng',       title: 'Mechanical Engineer',   category: 'Most Popular Resume Examples', altCategory: 'Engineering resume examples',             layout: 'professional',  color: '#14532d' },

  // --- CREATIVE & CULTURAL ---
  { id: 'actor',        title: 'Actor',              category: 'Creative and cultural fields resume examples', layout: 'creative',color: '#1f5756' },
  { id: 'voice_actor',  title: 'Voice Actor',        category: 'Creative and cultural fields resume examples', layout: 'creative',color: '#1f5756' },
  { id: 'content_writer',title:'Content Writer',     category: 'Creative and cultural fields resume examples', layout: 'creative',color: '#6d28d9' },
  { id: 'graphic_des',  title: 'Graphic Designer',   category: 'Creative and cultural fields resume examples', layout: 'creative',color: '#5b21b6' },
  { id: 'video_editor', title: 'Video Editor',       category: 'Creative and cultural fields resume examples', layout: 'modern',  color: '#7c2d12' },
  { id: 'art_dir',      title: 'Art Director',       category: 'Creative and cultural fields resume examples', layout: 'minimal', color: '#1e293b' },

  // --- ACCOUNTING & FINANCE ---
  { id: 'acc',          title: 'Accounting Lead',     category: 'Accounting and finance resume examples', layout: 'enhancv',      color: '#1e293b' },
  { id: 'fin_analyst',  title: 'Financial Analyst',  category: 'Accounting and finance resume examples', layout: 'enhancv',      color: '#374151' },
  { id: 'sr_accountant',title:'Senior Accountant',   category: 'Accounting and finance resume examples', layout: 'professional', color: '#1e293b' },
  { id: 'bookkeeper',   title: 'Bookkeeper',         category: 'Accounting and finance resume examples', layout: 'minimal',      color: '#0f172a' },
  { id: 'inv_banker',   title: 'Investment Banker',  category: 'Accounting and finance resume examples', layout: 'enhancv',      color: '#0b2545' },
  { id: 'auditor',      title: 'Internal Auditor',   category: 'Accounting and finance resume examples', layout: 'modern',       color: '#134e4a' },

  // --- BUSINESS & MANAGEMENT ---
  { id: 'ops_mgr',      title: 'Operations Manager', category: 'Business and management resume examples', layout: 'professional', color: '#1e293b' },
  { id: 'mgmt_consult', title: 'Management Consultant',category:'Business and management resume examples', layout: 'enhancv',      color: '#0f172a' },
  { id: 'scrum_master', title: 'Scrum Master',       category: 'Business and management resume examples', layout: 'modern',       color: '#1d4ed8' },

  // --- DATA SCIENCE ---
  { id: 'mle',          title: 'Machine Learning Eng',category: 'Data science resume examples', layout: 'modern',       color: '#134e4a' },
  { id: 'data_analyst', title: 'Data Analyst',       category: 'Data science resume examples', layout: 'professional', color: '#0b2545' },
  { id: 'ai_engineer',  title: 'AI Engineer',        category: 'Data science resume examples', layout: 'creative',     color: '#6d28d9' },

  // --- DESIGN ---
  { id: 'des',          title: 'UI/UX Designer',      category: 'Design resume examples', layout: 'creative',     color: '#5b21b6' },
  { id: 'prod_designer',title:'Product Designer',    category: 'Design resume examples', layout: 'modern',       color: '#5b21b6' },
  { id: 'web_designer', title: 'Web Designer',        category: 'Design resume examples', layout: 'minimal',      color: '#0f172a' },
  { id: 'motion_des',   title: 'Motion Designer',    category: 'Design resume examples', layout: 'creative',     color: '#7c3aed' },

  // --- ENGINEERING ---
  { id: 'civil_eng',    title: 'Civil Engineer',     category: 'Engineering resume examples', layout: 'minimal',      color: '#14532d' },
  { id: 'elect_eng',    title: 'Electrical Engineer',category: 'Engineering resume examples', layout: 'modern',       color: '#0b2545' },
  { id: 'chem_eng',     title: 'Chemical Engineer',  category: 'Engineering resume examples', layout: 'enhancv',      color: '#1e293b' },

  // --- EXECUTIVE & MANAGEMENT ---
  { id: 'ceo',          title: 'Chief Executive Officer',category:'Executive and management resume examples', layout: 'enhancv', color: '#0f172a' },
  { id: 'vp_sales',     title: 'VP of Sales',        category: 'Executive and management resume examples', layout: 'modern',  color: '#7f1d1d' },
  { id: 'cto',          title: 'Chief Technology Officer',category:'Executive and management resume examples', layout: 'professional', color: '#1d4ed8' },

  // --- FAMOUS PEOPLE ---
  { id: 'steve_jobs',   title: 'Steve Jobs',         category: 'Famous people resume examples', layout: 'creative',     color: '#0f172a' },
  { id: 'elon_musk',    title: 'Elon Musk',          category: 'Famous people resume examples', layout: 'modern',       color: '#1e293b' },
  { id: 'einstein',     title: 'Albert Einstein',    category: 'Famous people resume examples', layout: 'minimal',      color: '#334155' },

  // --- FOOD SERVICE ---
  { id: 'chef',         title: 'Head Chef',          category: 'Food service resume examples', layout: 'creative',     color: '#7c2d12' },
  { id: 'rest_mgr',     title: 'Restaurant Manager', category: 'Food service resume examples', layout: 'modern',       color: '#92400e' },
  { id: 'bartender',    title: 'Mixologist / Bartender',category:'Food service resume examples', layout: 'minimal',    color: '#1e293b' },

  // --- FREELANCE ---
  { id: 'freelancer',   title: 'Freelance Consultant',category: 'Freelance resume examples', layout: 'minimal',      color: '#3730a3' },
  { id: 'free_dev',     title: 'Freelance Web Dev',  category: 'Freelance resume examples', layout: 'modern',       color: '#1d4ed8' },

  // --- GOVERNMENT AND FEDERAL ---
  { id: 'gov_pm',       title: 'Federal Project Manager',category:'Government and federal resume examples', layout: 'enhancv', color: '#0f172a' },
  { id: 'policy_analyst',title:'Public Policy Analyst',category:'Government and federal resume examples', layout: 'professional', color: '#1e3a5f' },
  { id: 'gov_spec',     title: 'Government Specialist',category:'Government and federal resume examples', layout: 'minimal',   color: '#334155' },
  { id: 'foreign_officer',title:'Foreign Service Officer',category:'Government and federal resume examples', layout: 'enhancv',color: '#0b2545' },

  // --- HEALTHCARE ---
  { id: 'nurse',        title: 'Registered Nurse',    category: 'Healthcare resume examples', layout: 'minimal',      color: '#065f46' },
  { id: 'med_assistant',title: 'Medical Assistant',   category: 'Healthcare resume examples', layout: 'minimal',      color: '#047857' },
  { id: 'health_admin', title: 'Healthcare Administrator',category:'Healthcare resume examples', layout: 'professional', color: '#0f172a' },

  // --- HUMAN RESOURCES ---
  { id: 'hrm',          title: 'HR Manager',          category: 'Human resources resume examples', layout: 'professional', color: '#3b0764' },
  { id: 'recruiter',    title: 'Talent Acquisition',  category: 'Human resources resume examples', layout: 'modern',       color: '#6d28d9' },

  // --- INFORMATION TECHNOLOGY ---
  { id: 'fe_dev',       title: 'Front-End Developer',  category: 'Information technology resume examples', layout: 'modern',       color: '#1d4ed8' },
  { id: 'py_dev',       title: 'Python Developer',     category: 'Information technology resume examples', layout: 'professional', color: '#0b2545' },
  { id: 'fs_dev',       title: 'Full-Stack Developer', category: 'Information technology resume examples', layout: 'modern',       color: '#1e3a5f' },
  { id: 'sys_admin',    title: 'System Administrator', category: 'Information technology resume examples', layout: 'enhancv',      color: '#1e293b' },
  { id: 'it_dir',       title: 'IT Director',          category: 'Information technology resume examples', layout: 'modern',       color: '#0b2545' },
  { id: 'it_pm',        title: 'IT Project Manager',   category: 'Information technology resume examples', layout: 'enhancv',      color: '#0f172a' },
  { id: 'tech_lead',    title: 'Tech Lead',            category: 'Information technology resume examples', layout: 'professional', color: '#1d4ed8' },
  { id: 'web_dev',      title: 'Web Developer',        category: 'Information technology resume examples', layout: 'modern',       color: '#0284c7' },
  { id: 'net_eng',      title: 'Network Engineer',     category: 'Information technology resume examples', layout: 'modern',       color: '#0f172a' },
  { id: 'devops_eng',   title: 'DevOps Engineer',      category: 'Information technology resume examples', layout: 'professional', color: '#1d4ed8' },
  { id: 'comp_sci',     title: 'Computer Science',     category: 'Information technology resume examples', layout: 'minimal',      color: '#1e293b' },
  { id: 'cyber_sec',    title: 'Cybersecurity Analyst',category: 'Information technology resume examples', layout: 'modern',       color: '#134e4a' },
  { id: 'cloud_arch',   title: 'Cloud Architect',      category: 'Information technology resume examples', layout: 'modern',       color: '#0284c7' },
  { id: 'devops_spec',  title: 'DevOps Specialist',    category: 'Information technology resume examples', layout: 'enhancv',      color: '#1d4ed8' },

  // --- LEGAL ---
  { id: 'lawyer',       title: 'Attorney / Lawyer',   category: 'Legal resume examples', layout: 'enhancv',      color: '#0f172a' },
  { id: 'paralegal',    title: 'Paralegal',           category: 'Legal resume examples', layout: 'minimal',      color: '#334155' },

  // --- MARKETING ---
  { id: 'seo_spec',     title: 'SEO Specialist',      category: 'Marketing resume examples', layout: 'modern',       color: '#7c2d12' },
  { id: 'brand_mgr',    title: 'Brand Manager',       category: 'Marketing resume examples', layout: 'creative',     color: '#92400e' },

  // --- SALES ---
  { id: 'account_exec', title: 'Account Executive',   category: 'Sales resume examples', layout: 'modern',       color: '#7f1d1d' },
  { id: 'biz_dev',      title: 'Business Development',category: 'Sales resume examples', layout: 'professional', color: '#0f172a' },

  // --- SOFTWARE ENGINEERING ---
  { id: 'devops',       title: 'DevOps Engineer',     category: 'Software engineering resume examples', layout: 'professional', color: '#1d4ed8' },
  { id: 'fullstack',    title: 'Full Stack Developer',category: 'Software engineering resume examples', layout: 'modern',       color: '#1e3a5f' }
];

const resumeDataByRole = {
  'Executive': {
    name: 'Jonathan Ross',
    role: 'Executive Director | Operations & Strategic Expansion',
    contact: { email: 'j.ross@forgeindiaconnect.com', phone: '+1-(212)-998-1122', location: 'New York, NY', linkedin: 'linkedin.com/in/jonathan-ross-exec' },
    objective: 'Senior Executive with 18+ years driving P&L management, strategic mergers & acquisitions, and global operational expansion across Fortune 500 tech and enterprise companies.',
    skills: { languages: 'Executive Leadership · P&L Management · Strategic M&A · Corporate Governance · Capital Allocation · Organizational Transformation · Global Expansion' },
    experience: [
      { company: 'Global Vanguard Enterprises', location: 'New York, NY', title: 'Executive Vice President of Operations', duration: '03/2018 - Present', desc: '• Managed $350M annual P&L portfolio, driving 28% net profit margin growth across North American operations.\n• Led strategic acquisition of 3 regional logistics providers, integrating 1,200+ employees with 0 business disruption.\n• Spearheaded digital transformation initiative reducing annual operational overhead by $14.5M.' },
      { company: 'Apex Corporate Group', location: 'Boston, MA', title: 'Director of Strategic Growth', duration: '05/2012 - 02/2018', desc: '• Oversaw expansion into EMEA markets, opening 4 new regional hubs and generating $85M in net-new revenue within 3 years.' }
    ],
    education: [{ degree: 'Master of Business Administration (MBA)', institution: 'Harvard Business School', location: 'Boston, MA', tenure: '2008 - 2010' }],
    achievements: [
      { title: '$14.5M Annual Savings', desc: 'Led enterprise transformation reducing operational costs across 12 divisions.' },
      { title: '28% Profit Margin Gain', desc: 'Optimized capital allocation and P&L efficiency across North American operations.' }
    ]
  },

  'Chief Technology Officer': {
    name: 'Dr. Alexander Wright',
    role: 'Chief Technology Officer (CTO) | Cloud Architecture & Engineering Leadership',
    contact: { email: 'a.wright@forgeindiaconnect.com', phone: '+1-(415)-555-8833', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexwright-cto' },
    objective: 'CTO with 16+ years building enterprise SaaS platforms, scaling 150+ person engineering organizations, and leading cloud modernizations.',
    skills: { languages: 'Cloud Architecture · Engineering Leadership · AI Strategy · System Design · Enterprise SaaS · DevOps · Cybersecurity Governance' },
    experience: [
      { company: 'OmniCloud Platform', location: 'San Francisco, CA', title: 'Chief Technology Officer', duration: '05/2017 - Present', desc: '• Led 150-person engineering & product team building multi-tenant SaaS platform supporting 10M+ daily active users.\n• Architected zero-trust cloud infrastructure reducing security incident response time by 80%.' },
      { company: 'Nexus Software Systems', location: 'Palo Alto, CA', title: 'VP of Engineering', duration: '01/2012 - 04/2017', desc: '• Scaled engineering organization from 20 to 90 engineers while maintaining high release velocity.' }
    ],
    education: [{ degree: 'Ph.D. in Computer Science', institution: 'MIT', location: 'Cambridge, MA', tenure: '2003 - 2008' }],
    achievements: [
      { title: '150-Person Engineering Org', desc: 'Scaled engineering department while maintaining high velocity.' },
      { title: '10M+ Daily Active Users', desc: 'Architected SaaS platform with 99.999% uptime availability.' }
    ]
  },

  'Chief Executive Officer': {
    name: 'Victoria Vance',
    role: 'Chief Executive Officer (CEO) | Enterprise Scaling & Corporate Strategy',
    contact: { email: 'v.vance@forgeindiaconnect.com', phone: '+1-(212)-555-0011', location: 'New York, NY', linkedin: 'linkedin.com/in/victoriavance-ceo' },
    objective: 'Visionary CEO with 15+ years leading high-growth tech enterprises from Series B through successful IPO and market expansion.',
    skills: { languages: 'Corporate Strategy · Capital Allocation · M&A · Board Governance · Global Expansion · Investor Relations · Executive Leadership' },
    experience: [
      { company: 'Apex Tech Holdings', location: 'New York, NY', title: 'Chief Executive Officer', duration: '06/2018 - Present', desc: '• Scaled enterprise ARR from $25M to $180M, leading successful NASDAQ IPO in 2022.\n• Navigated 2 strategic M&A acquisitions expanding market share across Europe and Asia.' }
    ],
    education: [{ degree: 'MBA in Finance & Strategy', institution: 'Wharton School, UPenn', location: 'Philadelphia, PA', tenure: '2006 - 2008' }],
    achievements: [
      { title: 'Successful NASDAQ IPO', desc: 'Led company through initial public offering valued at $1.2B.' },
      { title: '7x Revenue Scaling', desc: 'Expanded annual recurring revenue from $25M to $180M in 5 years.' }
    ]
  },

  'VP of Sales': {
    name: 'Marcus Sterling',
    role: 'VP of Global Sales | Enterprise SaaS & B2B Expansion',
    contact: { email: 'm.sterling@forgeindiaconnect.com', phone: '+1-(312)-555-7788', location: 'Chicago, IL', linkedin: 'linkedin.com/in/marcussterling-sales' },
    objective: 'Data-driven VP of Sales delivering $80M+ ARR growth across enterprise software markets.',
    skills: { languages: 'Enterprise B2B Sales · Sales Strategy · Pipeline Management · Revenue Operations · Contract Negotiation · Sales Leadership' },
    experience: [
      { company: 'CloudScale Global', location: 'Chicago, IL', title: 'VP of Global Sales', duration: '02/2019 - Present', desc: '• Managed 45-person global sales team delivering $80M in net-new ARR across Fortune 500 accounts.\n• Re-engineered sales compensation models, increasing quota attainment from 62% to 89%.' }
    ],
    education: [{ degree: 'B.S. in Marketing & Business', institution: 'Northwestern University', location: 'Evanston, IL', tenure: '2008 - 2012' }],
    achievements: [
      { title: '$80M Net-New ARR', desc: 'Built enterprise sales motion closing multi-million dollar annual contracts.' }
    ]
  },

  'Software Engineer': {
    name: 'Ethan Hunt',
    role: 'Senior Software Engineer | Full-Stack & Cloud Architecture',
    contact: { email: 'e.hunt@forgeindiaconnect.com', phone: '+1-(415)-555-4422', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/ethanhunt-dev', github: 'github.com/ethanhunt-dev' },
    objective: 'Software Engineer with 7+ years architecting microservices, high-throughput backend systems, and responsive React applications.',
    skills: { languages: 'React · TypeScript · Node.js · Python · AWS · Docker · PostgreSQL · Microservices · GraphQL · CI/CD · Distributed Systems' },
    experience: [
      { company: 'Stripe', location: 'San Francisco, CA', title: 'Senior Software Engineer', duration: '03/2021 - Present', desc: '• Architected payment processing microservices handling 50M+ API requests daily with 99.99% reliability.\n• Reduced frontend bundle load times by 45% through code splitting and tree-shaking optimizations.' },
      { company: 'Uber', location: 'San Francisco, CA', title: 'Software Engineer', duration: '06/2017 - 02/2021', desc: '• Developed real-time location tracking services using Node.js and Redis pub/sub streams.' }
    ],
    education: [{ degree: 'B.S. in Computer Science', institution: 'UC Berkeley', location: 'Berkeley, CA', tenure: '2013 - 2017' }],
    achievements: [
      { title: '50M+ Daily API Requests', desc: 'Architected distributed backend service with 99.99% uptime SLA.' }
    ]
  },

  'Data Scientist': {
    name: 'Dr. Maya Patel',
    role: 'Lead Data Scientist | Machine Learning & Predictive Analytics',
    contact: { email: 'm.patel@forgeindiaconnect.com', phone: '+1-(650)-555-9988', location: 'Palo Alto, CA', linkedin: 'linkedin.com/in/mayapatel-ds' },
    objective: 'Data Scientist specializing in deep learning, LLM fine-tuning, and scalable predictive modeling for enterprise applications.',
    skills: { languages: 'Python · PyTorch · TensorFlow · Scikit-Learn · SQL · Spark · NLP · LLM Fine-Tuning · Feature Engineering · A/B Testing' },
    experience: [
      { company: 'Meta AI Labs', location: 'Menlo Park, CA', title: 'Lead Data Scientist', duration: '01/2020 - Present', desc: '• Built recommendation models boosting user engagement by 22% across 100M+ active profiles.\n• Trained custom transformer LLM pipelines for automated customer sentiment extraction.' }
    ],
    education: [{ degree: 'Ph.D. in Data Science & Machine Learning', institution: 'Stanford University', location: 'Stanford, CA', tenure: '2015 - 2019' }],
    achievements: [
      { title: '22% Engagement Lift', desc: 'Engineered high-throughput ML recommendation algorithm.' }
    ]
  },

  'Product Manager': {
    name: 'Jessica Martinez',
    role: 'Senior Product Manager | Enterprise SaaS & Mobile Platforms',
    contact: { email: 'j.martinez@forgeindiaconnect.com', phone: '+1-(212)-555-3344', location: 'New York, NY', linkedin: 'linkedin.com/in/jessicamartinez-pm' },
    objective: 'Product Leader with 8+ years shipping customer-facing features, scaling user retention, and managing product roadmaps.',
    skills: { languages: 'Product Strategy · User Research · Agile/Scrum · A/B Testing · Roadmap Design · Wireframing · Data Analytics · SQL' },
    experience: [
      { company: 'Salesforce', location: 'New York, NY', title: 'Senior Product Manager', duration: '04/2020 - Present', desc: '• Led cross-functional team of 14 engineers and designers launching new workflow automation product used by 250K+ businesses.\n• Increased 30-day user retention by 35% through streamlined onboarding UX redesign.' }
    ],
    education: [{ degree: 'B.S. in Management Information Systems', institution: 'NYU Stern', location: 'New York, NY', tenure: '2012 - 2016' }],
    achievements: [
      { title: '250K+ Business Users', desc: 'Launched enterprise automation tool generating $18M in ARR.' }
    ]
  },

  'Digital Marketing': {
    name: 'Liam Hemsworth',
    role: 'Digital Marketing Director | Growth & Performance Marketing',
    contact: { email: 'l.hemsworth@forgeindiaconnect.com', phone: '+1-(310)-555-6677', location: 'Los Angeles, CA', linkedin: 'linkedin.com/in/liamhemsworth-mktg' },
    objective: 'Growth Marketer with 7+ years scaling CAC/ROAS across Google Ads, Meta Ads, and SEO channels.',
    skills: { languages: 'Performance Marketing · SEO · Google Analytics 4 · Meta Ads · Email Marketing · Growth Hacking · Conversion Rate Optimization' },
    experience: [
      { company: 'Shopify Merchant Network', location: 'Los Angeles, CA', title: 'Growth Marketing Director', duration: '02/2021 - Present', desc: '• Managed $5M annual ad spend achieving average 4.2x ROAS across paid search and social channels.' }
    ],
    education: [{ degree: 'B.A. in Communications & Marketing', institution: 'USC', location: 'Los Angeles, CA', tenure: '2013 - 2017' }],
    achievements: [
      { title: '4.2x Average ROAS', desc: 'Scaled paid user acquisition channels while lowering overall CAC by 28%.' }
    ]
  },

  'Teacher': {
    name: 'Rachel Adams',
    role: 'Lead High School Educator | STEM & Curriculum Development',
    contact: { email: 'r.adams@forgeindiaconnect.com', phone: '+1-(617)-555-2233', location: 'Boston, MA', linkedin: 'linkedin.com/in/racheladams-edu' },
    objective: 'Passionate Educator with 9+ years creating engaging STEM curricula and fostering inclusive classroom environments.',
    skills: { languages: 'Curriculum Development · STEM Education · Classroom Management · Student Assessment · Educational Technology · Parent Communication' },
    experience: [
      { company: 'Boston Public Schools', location: 'Boston, MA', title: 'Lead Physics & Mathematics Teacher', duration: '08/2016 - Present', desc: '• Designed interactive STEM curriculum improving standardized test pass rates by 24% over 3 years.' }
    ],
    education: [{ degree: 'Master of Education (M.Ed.)', institution: 'Boston University', location: 'Boston, MA', tenure: '2014 - 2016' }],
    achievements: [
      { title: '24% Test Pass Rate Gain', desc: 'Recognized with District Teacher of the Year award in 2022.' }
    ]
  },

  'Mechanical Engineer': {
    name: 'Carlos Mendoza',
    role: 'Senior Mechanical Engineer | Automotive & Manufacturing',
    contact: { email: 'c.mendoza@forgeindiaconnect.com', phone: '+1-(313)-555-9900', location: 'Detroit, MI', linkedin: 'linkedin.com/in/carlosmendoza-eng' },
    objective: 'Mechanical Engineer with 8+ years specializing in automotive chassis design, CAD modeling, and FEA simulation.',
    skills: { languages: 'SolidWorks · CATIA · ANSYS FEA · Six Sigma · Lean Manufacturing · GD&T · Rapid Prototyping · Material Selection' },
    experience: [
      { company: 'Ford Motor Company', location: 'Dearborn, MI', title: 'Senior Mechanical Engineer', duration: '05/2018 - Present', desc: '• Led redesign of EV battery enclosure assembly, cutting structural component weight by 18% while meeting crash safety standards.' }
    ],
    education: [{ degree: 'B.S. in Mechanical Engineering', institution: 'University of Michigan', location: 'Ann Arbor, MI', tenure: '2014 - 2018' }],
    achievements: [
      { title: '18% Weight Reduction', desc: 'Engineered lightweight aluminum EV battery housing assembly.' }
    ]
  },

  'Actor': {
    name: 'Ava Johnson',
    role: 'Actor | Stage, Film & Voice Over',
    contact: { email: 'a.johnson@forgeindiaconnect.com', phone: '+1-(310)-555-0199', location: 'Los Angeles, CA', linkedin: 'linkedin.com/in/avajohnson-actor' },
    objective: 'Classically trained actor with 8+ years performing in feature films, regional theater productions, and commercial voice-overs.',
    skills: { languages: 'Character Development · Script Analysis · Stage Combat · Voice Over · Improv · Classical Theater · Dialects' },
    experience: [
      { company: 'Sundance Film Festival Feature', location: 'Los Angeles, CA', title: 'Lead Actor (Feature Film)', duration: '2023', desc: '• Performed lead dramatic role in indie feature film selected for official competition at Sundance.' },
      { company: 'Geffen Playhouse', location: 'Los Angeles, CA', title: 'Resident Stage Actor', duration: '2019 - 2022', desc: '• Starred in 6 mainstage theatrical productions receiving critical acclaim.' }
    ],
    education: [{ degree: 'B.F.A. in Drama & Theater Arts', institution: 'Juilliard School', location: 'New York, NY', tenure: '2015 - 2019' }],
    achievements: [
      { title: 'Sundance Official Selection', desc: 'Recognized for standout dramatic performance in independent feature film.' }
    ]
  },

  'Head Chef': {
    name: 'Chef Mateo Rossi',
    role: 'Executive Head Chef | Fine Dining & Culinary Operations',
    contact: { email: 'm.rossi@forgeindiaconnect.com', phone: '+1-(212)-555-4400', location: 'New York, NY', linkedin: 'linkedin.com/in/mateorossi-chef' },
    objective: 'Michelin-trained Executive Chef with 12+ years managing fine dining kitchen operations, menu engineering, and food safety.',
    skills: { languages: 'Menu Engineering · Fine Dining · Kitchen Leadership · Inventory Management · Food Safety (ServSafe) · Farm-to-Table Sourcing' },
    experience: [
      { company: 'Le Ciel Fine Dining', location: 'New York, NY', title: 'Executive Head Chef', duration: '03/2019 - Present', desc: '• Awarded 1 Michelin Star in 2021; maintained 38% gross profit margin on seasonal tasting menus.' }
    ],
    education: [{ degree: 'Culinary Arts Degree', institution: 'Culinary Institute of America (CIA)', location: 'Hyde Park, NY', tenure: '2008 - 2010' }],
    achievements: [
      { title: '1 Michelin Star Awarded', desc: 'Earned Michelin star recognition within 2 years of restaurant launch.' }
    ]
  },

  'Steve Jobs': {
    name: 'Steve Jobs',
    role: 'Visionary Founder & CEO | Apple Inc. & Pixar',
    contact: { email: 's.jobs@apple.com', phone: '+1-(408)-996-1010', location: 'Cupertino, CA', linkedin: 'linkedin.com/in/stevejobs' },
    objective: 'Co-founder of Apple Inc. Driven by relentless focus on design excellence, product simplification, and revolutionary user experience.',
    skills: { languages: 'Product Vision · Design Excellence · Keynote Presentation · Brand Storytelling · Ecosystem Design · Consumer Tech Leadership' },
    experience: [
      { company: 'Apple Inc.', location: 'Cupertino, CA', title: 'Co-Founder & CEO', duration: '1997 - 2011', desc: '• Led creation of iconic products including iPhone, iPad, iPod, and MacBook, transforming personal technology worldwide.' },
      { company: 'Pixar Animation Studios', location: 'Emeryville, CA', title: 'CEO & Majority Shareholder', duration: '1986 - 2006', desc: '• Produced Toy Story, revolutionizing computer graphics animation in cinema.' }
    ],
    education: [{ degree: 'Honorary Doctorate & Reed College Studies', institution: 'Reed College', location: 'Portland, OR', tenure: '1972 - 1974' }],
    achievements: [
      { title: 'Revolutionized 6 Industries', desc: 'Transformed personal computing, animated movies, music, phones, tablet computing, and digital publishing.' }
    ]
  },

  'Elon Musk': {
    name: 'Elon Musk',
    role: 'Chief Engineer & CEO | SpaceX & Tesla',
    contact: { email: 'e.musk@tesla.com', phone: '+1-(650)-681-5000', location: 'Austin, TX', linkedin: 'linkedin.com/in/elonmusk' },
    objective: 'Chief Engineer and CEO leading aerospace transportation, sustainable electric mobility, and neurotechnology manufacturing.',
    skills: { languages: 'Rocket Engineering · Electric Vehicle Architecture · First-Principles Thinking · High-Volume Manufacturing · Artificial Intelligence' },
    experience: [
      { company: 'SpaceX', location: 'Hawthorne, CA', title: 'Chief Engineer & CEO', duration: '2002 - Present', desc: '• Architected Falcon 9 reusable orbital rockets, reducing space launch costs by over 70%.' },
      { company: 'Tesla Inc.', location: 'Austin, TX', title: 'CEO & Product Architect', duration: '2004 - Present', desc: '• Scaled EV production to millions of vehicles annually with Model 3 and Model Y platforms.' }
    ],
    education: [{ degree: 'B.S. in Physics & Economics', institution: 'University of Pennsylvania', location: 'Philadelphia, PA', tenure: '1992 - 1997' }],
    achievements: [
      { title: 'First Reusable Orbital Rocket', desc: 'Successfully landed and re-flew Falcon 9 boosters, pioneering commercial space access.' }
    ]
  },

  'Albert Einstein': {
    name: 'Albert Einstein',
    role: 'Theoretical Physicist | Nobel Laureate in Physics',
    contact: { email: 'a.einstein@ias.edu', phone: '+1-(609)-734-8000', location: 'Princeton, NJ', linkedin: 'linkedin.com/in/alberteinstein' },
    objective: 'Theoretical Physicist who developed the general theory of relativity and made foundational contributions to quantum theory.',
    skills: { languages: 'Theoretical Physics · General Relativity · Quantum Mechanics · Mathematical Physics · Thought Experiments · Statistical Mechanics' },
    experience: [
      { company: 'Institute for Advanced Study', location: 'Princeton, NJ', title: 'Professor of Theoretical Physics', duration: '1933 - 1955', desc: '• Conducted research on Unified Field Theory and quantum foundation paradoxes (EPR paradox).' },
      { company: 'Prussian Academy of Sciences', location: 'Berlin, Germany', title: 'Director of Kaiser Wilhelm Institute', duration: '1914 - 1933', desc: '• Formulated the General Theory of Relativity (E=mc²), predicting gravitational lensing.' }
    ],
    education: [{ degree: 'Ph.D. in Physics', institution: 'University of Zurich', location: 'Zurich, Switzerland', tenure: '1905' }],
    achievements: [
      { title: 'Nobel Prize in Physics (1921)', desc: 'Awarded for discovery of the law of the photoelectric effect.' }
    ]
  },

  'DevOps Engineer': {
    name: 'Lucas Vance',
    role: 'Senior DevOps Engineer | Kubernetes · AWS · Terraform · CI/CD',
    contact: { email: 'l.vance@forgeindiaconnect.com', phone: '+1-(206)-555-8877', location: 'Seattle, WA', linkedin: 'linkedin.com/in/lucasvance-devops', github: 'github.com/lucasvance-ops' },
    objective: 'DevOps Engineer with 6+ years automating multi-cloud infrastructure and zero-downtime deployment pipelines.',
    skills: { languages: 'Kubernetes · Docker · AWS · Terraform · Ansible · Jenkins · GitHub Actions · Prometheus · Grafana · Python' },
    experience: [
      { company: 'Amazon Web Services', location: 'Seattle, WA', title: 'Senior DevOps Engineer', duration: '04/2020 - Present', desc: '• Automated EKS Kubernetes deployment pipelines, scaling cluster capacity for 200+ microservices.' }
    ],
    education: [{ degree: 'B.S. in Computer Engineering', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2014 - 2018' }],
    achievements: [
      { title: '99.999% Pipeline Reliability', desc: 'Eliminated deployment failures through automated canary deployment testing.' }
    ]
  },

  'UI/UX Designer': {
    name: 'Chloe Miller',
    role: 'Senior UI/UX Designer | Product Design & Design Systems',
    contact: { email: 'c.miller@forgeindiaconnect.com', phone: '+1-(415)-555-3311', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/chloemiller-ux' },
    objective: 'UI/UX Designer with 6+ years creating intuitive user journeys, wireframes, interactive prototypes, and design systems.',
    skills: { languages: 'Figma · User Research · Wireframing · Interactive Prototyping · Design Systems · Usability Testing · HTML/CSS' },
    experience: [
      { company: 'Airbnb', location: 'San Francisco, CA', title: 'Senior Product Designer', duration: '03/2021 - Present', desc: '• Redesigned search and checkout UX flow, boosting booking conversion rate by 18% across mobile apps.' }
    ],
    education: [{ degree: 'B.F.A. in Interaction Design', institution: 'Rhode Island School of Design (RISD)', location: 'Providence, RI', tenure: '2015 - 2019' }],
    achievements: [
      { title: '18% Conversion Lift', desc: 'Redesigned mobile checkout flow used by tens of millions of guests.' }
    ]
  },

  'Cybersecurity Analyst': {
    name: 'Alex Rivera',
    role: 'Cybersecurity Analyst | Information Security · SOC · CISSP',
    contact: { email: 'a.rivera@forgeindiaconnect.com', phone: '+1-(703)-555-4433', location: 'Arlington, VA', linkedin: 'linkedin.com/in/alexrivera-sec' },
    objective: 'Cybersecurity Specialist with 6+ years conducting threat monitoring, incident response, vulnerability scans, and SIEM management.',
    skills: { languages: 'SIEM (Splunk) · Threat Hunting · Incident Response · Penetration Testing · CISSP · Wireshark · Firewalls · SOC' },
    experience: [
      { company: 'General Dynamics IT', location: 'Arlington, VA', title: 'Senior Cybersecurity Analyst', duration: '01/2020 - Present', desc: '• Monitored SOC security alerts for enterprise network with 10,000+ endpoints, detecting and mitigating 50+ critical zero-day threats.' }
    ],
    education: [{ degree: 'B.S. in Cybersecurity & Networking', institution: 'George Mason University', location: 'Fairfax, VA', tenure: '2014 - 2018' }],
    achievements: [
      { title: '0 Data Breaches', desc: 'Maintained 100% clean security incident containment record over 4 consecutive years.' }
    ]
  },

  'Project Manager': {
    name: 'Joshua Nelson',
    role: 'Project Manager | Renewable Energy | Agile | PMP',
    contact: { email: 'help@forgeindiaconnect.com', phone: '+1-(234)-555-1234', location: 'Los Angeles, California', linkedin: 'linkedin.com/in/joshua-nelson-pmp' },
    objective: 'Enthusiastic Project Manager with over 5 years of experience in the renewable energy sector, specializing in Agile and Waterfall methodologies. Expertise in project planning and execution, with a proven track record of leading multi-disciplinary teams to achieve on-time, on-budget project delivery.',
    skills: { languages: 'Project Management · Agile Methodologies · Waterfall · Microsoft Project · Jira · Risk Management' },
    experience: [
      { company: 'TekWave Systems', location: 'Los Angeles, CA', title: 'Project Manager', duration: '01/2024 - Present', desc: '• Spearheaded the development and implementation of 12 renewable energy projects, achieving an on-time delivery rate of 95%.\n• Collaborated effectively with engineers, designers, and vendors to streamline processes, reducing project costs by 20%.\n• Designed an innovative risk management protocol, decreasing project-related delays by 30% through proactive problem solving.' },
      { company: 'EcoTech Solutions', location: 'Irvine, CA', title: 'Project Coordinator', duration: '08/2022 - 12/2023', desc: '• Coordinated 8 cross-departmental teams in executing sustainable solutions, enhancing project outcomes and customer satisfaction by 18%.\n• Optimized project timelines using Agile methodologies, cutting project completion time by 20% on average.' }
    ],
    education: [{ degree: 'Bachelor of Business Administration', institution: 'University of California, Los Angeles', location: 'Los Angeles, CA', tenure: '01/2017 - 01/2021' }],
    achievements: [
      { title: 'Successful Renewable Energy Project Execution', desc: 'Led a $5 million project deploying solar panels across the state, delivering 10% under budget and weeks ahead of schedule.' },
      { title: 'Excellence in Team Leadership', desc: 'Recognized for outstanding leadership in managing a diverse team of professionals, increasing team efficiency by 30% within a year.' },
      { title: 'Implemented Cost-Reduction Strategy', desc: 'Executed new supplier contract negotiations resulting in a 15% cost reduction across multiple projects.' }
    ]
  },

  'Business Analyst': {
    name: 'Violet Rodriguez',
    role: 'Business Analyst | Data Insights & Visualization',
    contact: { email: 'v.rodriguez@forgeindiaconnect.com', phone: '+1-(555)-555-1234', location: 'Dallas, Texas', linkedin: 'linkedin.com/in/violet-rodriguez' },
    objective: 'Business Analyst with 5 years of experience in data analytics and visualization using tools like Power BI and Tableau. Expert in collaboration with cross-functional teams. Successfully increased reporting accuracy by 35%, streamlining strategic decision-making processes.',
    skills: { languages: 'Power BI · Tableau · SQL · Data Modeling · Dashboard Development · JIRA · Confluence · Python · Advanced Excel' },
    experience: [
      { company: 'Data Solutions Corp.', location: 'Dallas, TX', title: 'Business Analyst', duration: '01/2023 - Present', desc: '• Collaborated with stakeholders to gather requirements, leading to 40% increase in project alignment.\n• Spearheaded Tableau dashboard initiatives improving data accessibility by 50% across 6 departments.' },
      { company: 'Innovative Analytics LLC', location: 'Fort Worth, TX', title: 'Data Analyst', duration: '06/2021 - 12/2022', desc: '• Analyzed revenue trends driving 15% YoY growth.\n• Implemented automated Power BI dashboards reducing reporting time by 40%.' }
    ],
    education: [{ degree: 'Bachelor of Business Administration in Information Systems', institution: 'The University of Texas at Austin', location: 'Austin, TX', tenure: '01/2018 - 01/2021' }],
    achievements: [
      { title: 'Boosted Client Revenue by 15%', desc: 'Through comprehensive data analysis and insights, contributed to significant revenue increase.' },
      { title: 'Improved Reporting Accuracy by 35%', desc: 'Led a team initiative that enhanced reporting accuracy, streamlining decision-making.' },
      { title: 'Reduced Reporting Time by 40%', desc: 'Implemented new dashboards, decreasing time required to generate reports.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' }
    ],
    interests: [
      { title: 'Data-Driven Decision Making', desc: 'Passion for using data analytics to drive informed strategic business decisions.' },
      { title: 'Travel', desc: 'Enjoy exploring different cultures and perspectives, which fosters a global mindset.' },
      { title: 'Photography', desc: 'Capturing moments and experiences through creative visual storytelling and composition.' }
    ],
    training: [
      { title: 'Certified Business Analysis Professional (CBAP)', org: 'International Institute of Business Analysis', year: '2021' },
      { title: 'Advanced Data Visualization with Tableau', org: 'Coursera', year: '2020' }
    ]
  },

  'Accounting Lead': {
    name: 'Eleanor Vance',
    role: 'Accounting Lead | CPA · Financial Reporting · Audit Compliance · Team Leadership',
    contact: { email: 'e.vance@forgeindiaconnect.com', phone: '+1-(212)-456-7890', location: 'New York, NY', linkedin: 'linkedin.com/in/eleanor-vance-cpa' },
    objective: 'Certified Public Accountant (CPA) with 8+ years of experience leading accounting teams in fast-paced corporate environments. Expert in US GAAP, SEC reporting, internal controls (SOX), and financial audit preparation. Managed annual financial closes across $150M+ operations with zero audit discrepancies.',
    skills: { languages: 'US GAAP · SEC Reporting (10-K, 10-Q) · SOX Compliance · Financial Auditing · SAP S/4HANA · Oracle Financials · Team Leadership · Budgeting & Forecasting · Month-End Close' },
    experience: [
      { company: 'Apex Financial Global', location: 'New York, NY', title: 'Senior Accounting Manager', duration: '02/2021 - Present', desc: '• Managed a team of 9 accountants overseeing month-end and year-end financial close for $180M annual revenue operations.\n• Spearheaded SOX 404 internal compliance overhaul, reducing external audit fees by 25% ($90,000 savings).\n• Automated multi-currency consolidation using SAP S/4HANA, cutting close cycle time from 10 days to 4 days.\n• Prepared complex SEC filings (10-K, 10-Q) ensuring 100% timeliness and regulatory accuracy.' },
      { company: 'Vanguard Financial Solutions', location: 'Boston, MA', title: 'Accounting Lead', duration: '05/2017 - 01/2021', desc: '• Led financial reporting team responsible for ledger accounts, accounts payable/receivable, and payroll.\n• Reduced operational accounting discrepancies by 45% through implementation of automated reconciliation scripts.' },
      { company: 'KPMG US', location: 'Boston, MA', title: 'Senior Staff Accountant', duration: '08/2014 - 04/2017', desc: '• Conducted external audit procedures for Fortune 500 financial services clients.' }
    ],
    education: [
      { degree: 'Master of Science in Accounting', institution: 'New York University (NYU)', location: 'New York, NY', tenure: '2012 - 2014' }
    ],
    projects: [
      { title: 'ERP Migration to SAP S/4HANA', technology: 'SAP · SOX · Financial Modeling' },
      { title: 'SOX 404 Audit Optimization', technology: 'Internal Controls · GAAP Compliance' }
    ],
    achievements: [
      { title: '$90K Audit Fee Savings', desc: 'Overhauled internal controls framework, streamlining external auditor review process.' },
      { title: '60% Faster Close Cycle', desc: 'Automated month-end consolidation, reducing close timeline from 10 to 4 business days.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'German', level: 'Professional ••••' }
    ],
    interests: [
      { title: 'Corporate Finance Trends', desc: 'Regular participant in AICPA accounting & financial strategy symposiums.' }
    ],
    training: [
      { title: 'Certified Public Accountant (CPA)', org: 'NY State Board of Accountancy', year: '2015' }
    ]
  },

  'Financial Analyst': {
    name: 'Michael Sterling',
    role: 'Senior Financial Analyst | Financial Modeling | Valuation | Variance Analysis | Corporate Finance',
    contact: { email: 'm.sterling@forgeindiaconnect.com', phone: '+1-(312)-789-0123', location: 'Chicago, Illinois', linkedin: 'linkedin.com/in/michaelsterling-fa' },
    objective: 'Detail-oriented Financial Analyst with 6+ years of experience specializing in financial modeling, corporate budgeting, variance analysis, and M&A forecasting. Built dynamic financial models driving $40M+ capital allocations with high forecast accuracy.',
    skills: { languages: 'Financial Modeling (DCF, LBO, M&A) · Corporate Budgeting · Variance Analysis · Power BI · Tableau · Advanced Excel (VBA) · SQL · Capital Allocation · FP&A' },
    experience: [
      { company: 'Midwest Capital Partners', location: 'Chicago, IL', title: 'Senior Financial Analyst (FP&A)', duration: '04/2022 - Present', desc: '• Led annual budgeting and quarterly forecasting process for 4 business divisions generating $220M in revenue.\n• Developed 3-way integrated financial model for $45M acquisition, achieving 96% EBITDA forecast precision.\n• Built automated Power BI executive dashboards, reducing weekly financial reporting prep time by 75%.\n• Conducted monthly variance analyses presenting actionable insights to CFO and executive leadership.' },
      { company: 'Horizon Healthcare Systems', location: 'Chicago, IL', title: 'Financial Analyst', duration: '06/2019 - 03/2022', desc: '• Analyzed departmental OPEX budgets, identifying $1.8M in cost-reduction opportunities across operations.\n• Modeled ROI for $12M capital expenditure initiatives supporting new medical facility expansion.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Finance', institution: 'University of Illinois Urbana-Champaign', location: 'Urbana, IL', tenure: '2015 - 2019' }
    ],
    projects: [
      { title: '$45M M&A Valuation Model', technology: 'DCF · LBO · Excel VBA · Power BI' },
      { title: 'Automated Executive Dashboard', technology: 'Power BI · SQL · Financial Analytics' }
    ],
    achievements: [
      { title: '$1.8M Cost Reduction Identified', desc: 'Variance analysis uncovered vendor redundancies and operational cost savings.' },
      { title: '75% Faster Reporting Time', desc: 'Built automated Power BI data pipelines replacing manual Excel compilation.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' }
    ],
    interests: [
      { title: 'Macroeconomic Analysis', desc: 'Enthusiast of market research, macroeconomic trends, and algorithmic financial modeling.' }
    ],
    training: [
      { title: 'CFA Charterholder (Passed Level III)', org: 'CFA Institute', year: '2023' }
    ]
  },

  'Senior Accountant': {
    name: 'Sophia Martinez',
    role: 'Senior Accountant | General Ledger | Tax Compliance | Payroll | Financial Reconciliation',
    contact: { email: 's.martinez@forgeindiaconnect.com', phone: '+1-(713)-555-8901', location: 'Houston, Texas', linkedin: 'linkedin.com/in/sophiamartinez-cpa' },
    objective: 'CPA-certified Senior Accountant with 7+ years of expertise in full-cycle accounting, tax compliance, bank reconciliations, and payroll processing. Proven track record of improving financial reporting accuracy and managing tax audits with zero discrepancies.',
    skills: { languages: 'General Ledger · Tax Compliance (Corporate & Sales Tax) · QuickBooks Online · NetSuite · Bank Reconciliations · Payroll (ADP) · GAAP Compliance · Financial Audits' },
    experience: [
      { company: 'Sterling Logistics Group', location: 'Houston, TX', title: 'Senior Accountant', duration: '01/2021 - Present', desc: '• Oversaw full-cycle accounting operations including revenue recognition, AP/AR, and payroll for 450+ staff.\n• Prepared quarterly tax returns and sales tax filings across 14 state jurisdictions with 100% compliance.\n• Migrated company accounting framework from QuickBooks to Oracle NetSuite, improving reporting speed by 40%.\n• Reconciled multi-million dollar bank accounts monthly with zero unresolved variances.' },
      { company: 'Gulf Coast Energy Services', location: 'Houston, TX', title: 'Staff Accountant', duration: '08/2017 - 12/2020', desc: '• Conducted balance sheet account reconciliations, identifying and adjusting $320,000 in legacy discrepancies.\n• Assisted external CPA firm during annual audits, producing audit workpapers on schedule.' }
    ],
    education: [
      { degree: 'Bachelor of Business Administration in Accounting', institution: 'University of Houston', location: 'Houston, TX', tenure: '2013 - 2017' }
    ],
    projects: [
      { title: 'NetSuite ERP Implementation', technology: 'Oracle NetSuite · Tax Engine · GAAP' }
    ],
    achievements: [
      { title: 'Zero Audit Discrepancies', desc: 'Maintained 100% clean audit compliance records over 4 consecutive fiscal years.' },
      { title: '40% Reporting Speed Increase', desc: 'Spearheaded NetSuite ERP migration, streamlining monthly closing activities.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Fluent ••••' }
    ],
    interests: [
      { title: 'Tax Policy Research', desc: 'Tracks state and federal corporate tax code updates to optimize corporate tax efficiency.' }
    ],
    training: [
      { title: 'Certified Public Accountant (CPA)', org: 'Texas State Board of Public Accountancy', year: '2018' }
    ]
  },

  'Bookkeeper': {
    name: 'David Miller',
    role: 'Full-Charge Bookkeeper | QuickBooks Certified | Accounts Payable & Receivable | Payroll',
    contact: { email: 'd.miller@forgeindiaconnect.com', phone: '+1-(408)-345-6789', location: 'San Jose, CA', linkedin: 'linkedin.com/in/davidmiller-bk' },
    objective: 'Meticulous Full-Charge Bookkeeper with 6+ years of experience managing financial records, invoicing, payroll processing, and vendor accounts for small to mid-sized businesses. QuickBooks Online ProAdvisor certified.',
    skills: { languages: 'QuickBooks Online / Desktop · Xero · Accounts Payable (AP) · Accounts Receivable (AR) · Payroll (Gusto, Paychex) · Bank Reconciliation · Financial Statements · Bill.com' },
    experience: [
      { company: 'Bay Area Tech Services', location: 'San Jose, CA', title: 'Senior Bookkeeper', duration: '03/2021 - Present', desc: '• Managed full-charge bookkeeping for 15+ corporate clients with annual revenues up to $10M.\n• Processed bi-weekly payroll for 120 employees across 3 states using Gusto with zero errors.\n• Reduced average AR collection time from 45 days to 22 days by implementing automated billing follow-ups.\n• Maintained 100% accurate general ledger entries and bank reconciliations for month-end close.' },
      { company: 'Silicon Valley Creative Agency', location: 'Santa Clara, CA', title: 'Bookkeeper', duration: '05/2018 - 02/2021', desc: '• Handled AP/AR invoicing, vendor bill payments, and expense tracking using QuickBooks Online and Bill.com.\n• Prepared monthly P&L statements, balance sheets, and cash flow reports for company management.' }
    ],
    education: [
      { degree: 'Associate Degree in Accounting', institution: 'De Anza College', location: 'Cupertino, CA', tenure: '2016 - 2018' }
    ],
    projects: [
      { title: 'Automated Billing & AR Overhaul', technology: 'QuickBooks · Bill.com · Gusto' }
    ],
    achievements: [
      { title: '50% Faster AR Collections', desc: 'Reduced client invoice payment turnarounds from 45 days down to 22 days.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' }
    ],
    interests: [
      { title: 'Financial Software Automation', desc: 'Enjoys testing new accounting integration tools for small business workflows.' }
    ],
    training: [
      { title: 'QuickBooks Online Certified ProAdvisor (Advanced)', org: 'Intuit', year: '2021' }
    ]
  },

  'Investment Banker': {
    name: 'Julian Vance',
    role: 'Investment Banking Associate | M&A Execution | Valuation (LBO/DCF) | Capital Markets',
    contact: { email: 'j.vance@forgeindiaconnect.com', phone: '+1-(212)-890-1234', location: 'New York, NY', linkedin: 'linkedin.com/in/julianvance-ib' },
    objective: 'High-performing Investment Banking Associate with 5+ years of experience executing M&A transactions, leveraged buyouts, and equity offerings in the Technology and Healthcare sectors. Closed 12 transactions totaling $3.2B+ in enterprise value.',
    skills: { languages: 'M&A Structuring & Execution · Financial Modeling (LBO, DCF, Comps) · Pitch Books · Pitch Deck Presentation · Due Diligence · Debt & Equity Capital Markets · Bloomberg Terminal · PitchBook' },
    experience: [
      { company: 'Goldman Sachs', location: 'New York, NY', title: 'Investment Banking Associate', duration: '07/2021 - Present', desc: '• Executed 7 sell-side and buy-side M&A transactions representing $2.1B in cumulative deal value.\n• Built complex LBO and DCF financial models to evaluate takeover target valuations for private equity clients.\n• Drafted confidential information memorandums (CIMs), pitch books, and board presentation decks.\n• Led due diligence streams coordinating legal, accounting, and tax advisors during deal execution.' },
      { company: 'Morgan Stanley', location: 'New York, NY', title: 'Investment Banking Analyst', duration: '06/2019 - 06/2021', desc: '• Supported senior bankers in executing 5 equity underwriting transactions raising $1.1B in capital.\n• Prepared comparable company analyses (Comps) and precedent transaction analyses for client pitches.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Finance & Economics (Magna Cum Laude)', institution: 'Wharton School, University of Pennsylvania', location: 'Philadelphia, PA', tenure: '2015 - 2019' }
    ],
    projects: [
      { title: '$1.4B Tech M&A Advisory', technology: 'LBO Model · Valuation · CIM · Deal Structuring' }
    ],
    achievements: [
      { title: '$3.2B+ Closed Deal Volume', desc: 'Successfully structured and closed 12 M&A and capital market transactions.' },
      { title: 'Top-Tier Analyst Rating', desc: 'Ranked top 5% analyst in annual performance review at Morgan Stanley.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'French', level: 'Conversational •••' }
    ],
    interests: [
      { title: 'Global Capital Markets', desc: 'Keen follower of global equity capital markets, PE trends, and cross-border M&A.' }
    ],
    training: [
      { title: 'FINRA Series 79 & Series 63 Licenses', org: 'FINRA', year: '2019' }
    ]
  },

  'Internal Auditor': {
    name: 'Marcus Sterling',
    role: 'Senior Internal Auditor | Risk Assessment | SOX Compliance | Operational Audits | Fraud Investigation',
    contact: { email: 'm.sterling@forgeindiaconnect.com', phone: '+1-(404)-567-8901', location: 'Atlanta, Georgia', linkedin: 'linkedin.com/in/marcussterling-cia' },
    objective: 'Certified Internal Auditor (CIA) with 6+ years of experience conducting operational, financial, and compliance audits for enterprise clients. Expert in risk assessment frameworks (COSO, ISO 31000), SOX 404 testing, and internal control design.',
    skills: { languages: 'COSO Framework · SOX 404 Testing · Operational Auditing · Fraud Risk Assessment · ACL Analytics · Internal Controls · Audit Reporting · Risk Management' },
    experience: [
      { company: 'Global Financial Assurance Corp', location: 'Atlanta, GA', title: 'Senior Internal Auditor', duration: '03/2021 - Present', desc: '• Led operational and financial audits across 12 business units, identifying control deficiencies and recommending remediation plans.\n• Conducted annual SOX 404 internal control testing, evaluating design and operating effectiveness of key financial controls.\n• Automated audit sampling procedures using ACL Data Analytics, increasing test coverage by 300% while reducing manual hours by 40%.\n• Authored audit reports for Audit Committee and C-suite leadership detailing findings and risk mitigation strategies.' },
      { company: 'Southern Energy Systems', location: 'Atlanta, GA', title: 'Internal Auditor', duration: '06/2018 - 02/2021', desc: '• Executed 15+ comprehensive audits evaluating operational efficiency, compliance with regulations, and asset safeguarding.\n• Uncovered $450,000 vendor billing discrepancy through forensic data analysis, recovering full amount for the firm.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Accounting & Information Systems', institution: 'Georgia Institute of Technology', location: 'Atlanta, GA', tenure: '2014 - 2018' }
    ],
    projects: [
      { title: 'Data-Driven Audit Automation', technology: 'ACL Analytics · SQL · Python · SOX' }
    ],
    achievements: [
      { title: '300% Audit Coverage Increase', desc: 'Implemented ACL Analytics automation, dramatically scaling audit testing capacity.' },
      { title: ' $450K Billing Recovery', desc: 'Discovered vendor overbilling through forensic audit techniques, achieving full recovery.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' }
    ],
    interests: [
      { title: 'Forensic Accounting & Fraud Analytics', desc: 'Passionate about leveraging data mining to detect financial anomalies and prevent corporate fraud.' }
    ],
    training: [
      { title: 'Certified Internal Auditor (CIA)', org: 'Institute of Internal Auditors (IIA)', year: '2020' },
      { title: 'Certified Fraud Examiner (CFE)', org: 'ACFE', year: '2022' }
    ]
  },

  'Front-End Developer': {
    name: 'Scarlett Anderson',
    role: 'Front End Developer | HTML | CSS | JavaScript | React | Team Collaboration',
    contact: { email: 'scarlett.a@forgeindiaconnect.com', phone: '(800) 840-7371', location: 'Los Angeles, California', linkedin: 'linkedin.com/in/scarlett-anderson', github: 'GitHub' },
    objective: 'With over 5 years of experience in front-end development, specializing in JavaScript and user-centric design. I have significantly enhanced online platforms for top retailers. Notably, I led projects that have driven user engagement by 43%. My technical expertise and proven track record make me an excellent fit for contributing to your team.',
    skills: { languages: 'HTML · CSS · JavaScript · React · TypeScript · Vue.js · Sass · Webpack · Git · Figma · REST APIs · Performance Optimization · Responsive Design · Accessibility (WCAG)' },
    experience: [
      { company: 'Amazon', location: 'Seattle, WA', title: 'Front End Developer', duration: '01/2022 - Present', desc: '• Led the integration of a responsive web layout using modern JavaScript libraries, which decreased load time by 20%, improving overall customer satisfaction metrics significantly.\n• Collaborated with 24 UI designers to revamp the e-commerce web site\'s visual CSS aesthetics, leading to a 52% reduction in bounce rates and an increased user retention rate.\n• Contributed to the development of a new feature set utilizing React framework, producing an immediately impactful tool that improved user engagement scores by 37% more than before.\n• Configured regular code reviews and collaborative brainstorming sessions, fostering a culture of continuous improvement, which led to a code reduction in coding errors by 5%.\n• Participated in cross-functional teams that executed multiple enhancements, resulting in an ability to deliver quality features at scale, improving our deployment schedule, increasing on-ability to deliver quality ahead of deadlines.' },
      { company: 'Walmart', location: 'Bentonville, AR', title: 'Web Developer', duration: '05/2019 - 12/2021', desc: '• Designed and built user web applications that optimized the digital shopping experience, resulting in a 10% increase in online sales for the holiday season.\n• Improved APIs that delivered ResponseWith 459% API utilization, enhancing overall system performance and scalability across service APIs.\n• Refactored complex website structures using JavaScript to boost performance by 15% through performance testing and maintained a 97% accuracy on critical bugs.\n• Improved backend development processes by leading 25%, including implementing feedback systems, making impact-on project adjustment data-driven.\n• Facilitated workshops for junior developers, enhancing and refactoring engineering policies and reducing onboarding time by 20%.' },
      { company: 'Target', location: 'Minneapolis, MN', title: 'Junior Web Developer', duration: '06/2017 - 04/2019', desc: '• Supported senior developers in constructing web applications aligned with user requirements, leading to the successful launch of three high-traffic features.\n• Assisted in the design of standards and standards, achieving a 15% reduction in production bugs compared to previous project cycles.\n• Assisted in the initiative for responsive web design, improving UX compliance by 12%.\n• Documented lessons learned from each project, creating a repository of knowledge that saved approximately 10% when implementing future improvements.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Science', institution: 'University of California, Los Angeles', location: 'Los Angeles, CA', tenure: '01/2013 - 01/2017' },
      { degree: 'Master of Science in Information Technology', institution: 'Stanford University', location: 'Stanford, CA', tenure: '01/2017 - 01/2019' }
    ],
    projects: [
      { title: 'E-commerce Accessibility Project', technology: 'React · WCAG · JavaScript · CSS Modules' },
      { title: 'Minimalist Web Template', technology: 'Vue.js · Nuxt · Tailwind · Figma' }
    ],
    achievements: [
      { title: 'Improved Site Engagement', desc: 'Redesigned site aesthetics and functionality resulting in a 43% increase in user engagement across the board.' },
      { title: 'Increased Online Sales', desc: 'Drove an excellent 10% improvement in user experience and online sales during the holiday shopping season.' },
      { title: 'Enhanced Code Efficiency', desc: 'Cultivated a culture of continuous improvement that decreased development errors by 20% through rigorous code review.' },
      { title: 'Successful Project Completion', desc: 'Successfully led the launch of critical features ahead of tight deadlines, achieving a more efficient project timeline by 12%.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' },
      { name: 'French', level: 'Intermediate •••' }
    ],
    interests: [
      { title: 'Advanced JavaScript Concepts', desc: 'Deep diving into JavaScript Concepts by Udemy: focusing on understanding complex JavaScript patterns and collection practices.' },
      { title: 'Web Performance Optimization', desc: 'Mastering techniques from a Coursera course to use the necessary skills for enhancing the performance and speed of web applications.' }
    ],
    training: [
      { title: 'React Advanced Certification', org: 'Udemy, Year 2024', year: '2024' },
      { title: 'Web Accessibility (WCAG 2.1)', org: 'Google Developers', year: '2023' }
    ]
  },

  'Python Developer': {
    name: 'Owen Wright',
    role: 'Python Developer | Healthcare Solutions | Scalable Applications',
    contact: { email: 'help@forgeindiaconnect.com', phone: '+1-(234)-555-5234', location: 'San Jose, CA', linkedin: 'linkedin.com/in/owenwright' },
    objective: 'With over 8 years of experience in Python development, specializes in healthcare applications to enhance patient outcomes. Expertise in developing scalable applications using Django, AWS, and Docker. A key achievement included leading a team to reduce processing time by 30%, improving system efficiency and client satisfaction.',
    skills: { languages: 'Python · Django · Flask · AWS · Docker · PostgreSQL · Redis · Celery · REST APIs · GraphQL · NumPy · Pandas · Scikit-learn · TensorFlow · Kubernetes' },
    experience: [
      { company: 'MedSys Technologies', location: 'Seattle, WA', title: 'Senior Python Developer', duration: '06/2020 - Present', desc: '• Developed robust Python applications, reducing processing time by 30% and improving overall system efficiency.\n• Collaborated with a team to integrate Django applications with cloud solutions, boosting efficiency in data handling.\n• Led Python on-code reviews, improving code quality standards and reducing bugs by 20% across the team.\n• Collaborated with front-end developers, improving collaboration by 15%, and led project management meetings, enhancing team performance by 20% in project completion acceleration.' },
      { company: 'HealthLink Networks', location: 'Redwood City, CA', title: 'Python Developer', duration: '03/2017 - 05/2020', desc: '• Optimized database queries using PostgreSQL, cutting data retrieval time by 45%.\n• Implemented RESTful APIs with Task that increased interoperability with external systems by 50%.\n• Employed Docker & Kubernetes for efficient application containerization, reducing deployment latency by 40%.\n• Enhanced team productivity through collaborative sprints with engineers and product managers, resulting in a 20% project completion acceleration.' },
      { company: 'CareTech Innovations', location: 'Mountain View, CA', title: 'Software Engineer', duration: '06/2014 - 02/2017', desc: '• Developed backend systems in Python that improved data processing speed.\n• Created innovative solutions for data analytics, helping clients achieve better insights through user-friendly application interfaces, resulting in a 25% increase in user satisfaction.\n• Introduced best practices for code writing and application design, decreasing code maintenance time by 20%.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Science', institution: 'San Jose State University', location: 'San Jose, CA', tenure: '01/2010 - 01/2014' }
    ],
    projects: [
      { title: 'Open Source Healthcare API Project', technology: 'Python · Django · REST · Docker · AWS' },
      { title: 'Patient Data Visualization Tool', technology: 'Python · Pandas · D3.js · PostgreSQL' }
    ],
    achievements: [
      { title: 'Reduced Processing Time by 30%', desc: 'Led a team to improve Python application efficiency, resulting in reduced processing time and enhanced system performance.' },
      { title: 'Increased Deployment Speed by 25%', desc: 'Successfully integrated cloud solutions with a team, increasing deployment speeds and improving time to market.' },
      { title: 'Improved Data Retrieval Efficiency', desc: 'Optimized database operations, achieving a 52% reduction in data retrieval times and improved user experience.' },
      { title: 'Enhanced Code Quality and Reduced Bugs', desc: 'Mentored bugs by 20%, boosting software reliability.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' }
    ],
    interests: [
      { title: 'Healthcare Technology Innovation', desc: 'Driven by the potential of technology to enhance healthcare systems and patient care.' },
      { title: 'Open Source Development', desc: 'Eager to contribute to and enhance open source projects that are freely available to the programming community.' },
      { title: 'Rock Climbing', desc: 'Enjoy outdoor activities that challenge physical and mental strength, providing a balance to tech work.' }
    ],
    training: [
      { title: 'AWS Certified Developer – Associate', org: 'Amazon Web Services', year: '2023' },
      { title: 'Django REST Framework Mastery', org: 'Udemy', year: '2022' }
    ]
  },

  'Full-Stack Developer': {
    name: 'Marcus Chen',
    role: 'Oracle Certified Full Stack Developer',
    contact: { email: 'hall@forgeindiaconnect.com', phone: '(234)-253-6094', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/marcuschen', github: 'github.com/danette.aext' },
    objective: 'Full Stack Developer with over 10 years of experience in JavaScript/JS, Angular, Vue Stack, Python, NumPy, SciPy, Scikit-learn. Development of CSSS-based algorithms. Web-acquainted with all methodologies.',
    skills: { languages: 'HTML · CSS · JS · Angular · React · Vue · Redux · TypeScript · Backbone · Bootstrap · Python · NumPy · SciPy · Scikit-learn · Keras · EBS · TensorFlow · MySQL · NodeJS · Redis · AWS · MongoDB · Spark · HTTP/2 · JUnit · NUnit · PyUnit · TestCafe · Mocha · Jasmine · Jest · Scrum · Agile · GIT · Azure DevOps' },
    experience: [
      { company: 'Boyle', location: 'San Francisco, CA', title: 'Senior Full Stack Developer', duration: '2013 - 2025', desc: '• Hired, trained and led an agile team of 7 full-stack developers.\n• Developed robust database architecture including via SQL procedures and triggers for 10 different applications.\n• Increased company revenue by 30% within 2 months after developing and implementing business logic for over 20 features.\n• Directed UI design and developed in deep over 15 clients using CSS, HTML, ASP.NET, Vue, and React: website standing over 95 on Lighthouse.' },
      { company: 'Lamont', location: 'San Francisco, CA', title: 'Full Stack Developer', duration: '2019 - 2025', desc: '• Simultaneously created & maintained scheduled jobs in SQL Server for space maintenance, and daily transactions of system and user databases for 10 clients.\n• Increased company revenue by 30% within 2 months after developing and implementing business logic for over 20 features.\n• Created 8 dynamic web solutions with a clientele of 100K+ school supply products using mainly NodeJS and MongoDB; completed in 1 month.' },
      { company: 'Keshing Group', location: 'Palo Alto, CA', title: 'Solution Architect', duration: '2015 - 2019', desc: '• Pioneered a product that grew the company\'s largest customer by managing relationship with 3rd party vendors, taking over $65K.\n• Development of CSSS-based algorithm, which was deemed a "gold standard" by the client.\n• Performed Web Scraping over a dataset of 100K+ school supply products using mainly NodeJS and MongoDB; completed in 1 month.' }
    ],
    education: [
      { degree: 'M.S. in Computer Science', institution: 'Stanford University', location: 'Palo Alto, CA', tenure: '2013 - 2015' }
    ],
    projects: [
      { title: 'OpenFlow-based Firewall', technology: 'Python · NodeJS · MongoDB · SDN · Firewall' },
      { title: 'Enterprise Rule Engine', technology: 'NodeJS · MS-GAL · Kubernetes · MongoDB' }
    ],
    achievements: [
      { title: 'Certified Agile Practitioner', desc: 'Amazon Web Services, 2022' },
      { title: 'AWS Solutions Architect – Associate Level', desc: 'Amazon Web Services. 2022' },
      { title: 'Java Development Certified Professional', desc: 'Oracle. 2015' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' }
    ],
    interests: [
      { title: 'System Architecture', desc: 'Passionate about building scalable, resilient distributed systems and microservices architectures.' },
      { title: 'Open Source', desc: 'Active contributor to JavaScript and Python open source projects on GitHub.' }
    ],
    training: [
      { title: 'Oracle Certified Full Stack Developer', org: 'Oracle', year: '2021' },
      { title: 'AWS Solutions Architect – Associate', org: 'Amazon Web Services', year: '2022' }
    ]
  },

  'IT Project Manager': {
    name: 'Daniel Foster',
    role: 'IT Project Manager | Agile · PMP · Scrum Master · Digital Transformation',
    contact: { email: 'd.foster@forgeindiaconnect.com', phone: '+1-(469)-234-5678', location: 'Dallas, Texas', linkedin: 'linkedin.com/in/daniel-foster-itpm', github: 'github.com/danielfoster' },
    objective: 'PMP-certified IT Project Manager with 9+ years of experience delivering complex technology projects on time and within budget. Expert in Agile/Scrum, stakeholder management, and digital transformation initiatives. Successfully delivered 35+ IT projects valued at over $15M with an average on-time delivery rate of 97%.',
    skills: { languages: 'Project Management (PMP) · Agile / Scrum · JIRA · Confluence · MS Project · Risk Management · Stakeholder Communication · Budget Management · Digital Transformation · ITIL · Vendor Management · Waterfall · SAFe' },
    experience: [
      { company: 'GlobalTech Enterprises', location: 'Dallas, TX', title: 'Senior IT Project Manager', duration: '04/2021 - Present', desc: '• Managed portfolio of 12 concurrent IT projects with total budget of $8.5M, achieving 97% on-time delivery rate.\n• Led digital transformation initiative migrating 3 legacy systems to cloud-native architecture, saving $1.2M annually.\n• Facilitated Agile ceremonies for 4 scrum teams (40+ developers), improving sprint velocity by 35%.\n• Implemented PMO governance framework standardizing delivery processes across 6 development teams.\n• Coordinated with C-suite stakeholders ensuring IT roadmap alignment with strategic business objectives.' },
      { company: 'NexusTech Solutions', location: 'Austin, TX', title: 'IT Project Manager', duration: '08/2017 - 03/2021', desc: '• Delivered 18 ERP and CRM implementation projects for Fortune 500 clients, totaling $6M in project value.\n• Reduced project delivery time by 25% through adoption of hybrid Agile-Waterfall methodology.\n• Managed cross-functional teams of 25+ members spanning development, QA, infrastructure, and business analysis.' },
      { company: 'DataBridge Consulting', location: 'Houston, TX', title: 'Associate Project Manager', duration: '06/2015 - 07/2017', desc: '• Supported delivery of 8 IT infrastructure projects including network upgrades and data center migrations.\n• Maintained detailed project schedules, risk registers, and status reporting for executive stakeholders.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Information Systems', institution: 'University of Texas at Dallas', location: 'Dallas, TX', tenure: '2011 - 2015' }
    ],
    projects: [
      { title: 'Cloud Migration Program ($8.5M)', technology: 'AWS · Azure · Agile · JIRA · Terraform' },
      { title: 'ERP Implementation (SAP)', technology: 'SAP · Waterfall · MS Project · Stakeholder Mgmt' }
    ],
    achievements: [
      { title: '97% On-Time Delivery Rate', desc: 'Maintained near-perfect delivery rate across 35+ IT projects over 9-year career.' },
      { title: '$1.2M Annual Cloud Savings', desc: 'Led legacy-to-cloud migration reducing infrastructure costs while improving system reliability.' },
      { title: '35% Sprint Velocity Improvement', desc: 'Agile coaching and ceremony facilitation drove measurable productivity gains across scrum teams.' },
      { title: '$15M+ Portfolio Delivered', desc: 'Successfully managed cumulative project portfolio of over $15M with zero failed projects.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'French', level: 'Conversational •••' }
    ],
    interests: [
      { title: 'Agile Transformation', desc: 'Passionate about scaling Agile practices across organizations to improve delivery speed and quality.' },
      { title: 'Leadership Development', desc: 'Mentors junior project managers through PMI chapter programs and online coaching.' },
      { title: 'Technology Trends', desc: 'Follows AI/ML adoption trends and their impact on enterprise IT project delivery methodologies.' }
    ],
    training: [
      { title: 'Project Management Professional (PMP)', org: 'PMI', year: '2020' },
      { title: 'Certified Scrum Master (CSM)', org: 'Scrum Alliance', year: '2019' },
      { title: 'ITIL 4 Foundation', org: 'Axelos', year: '2021' }
    ]
  },

  'Tech Lead': {
    name: 'Jordan Kim',
    role: 'Tech Lead | Software Architecture | Team Leadership | Full-Stack Engineering',
    contact: { email: 'j.kim@forgeindiaconnect.com', phone: '+1-(206)-789-3456', location: 'Seattle, Washington', linkedin: 'linkedin.com/in/jordan-kim-techlead', github: 'github.com/jordankimtech' },
    objective: 'Experienced Tech Lead with 10+ years in software engineering and 4+ years in technical leadership roles. Expert in building high-performance engineering teams, defining technical architecture, and delivering scalable software products. Reduced system latency by 60% and improved team velocity by 45% through architectural improvements and mentorship.',
    skills: { languages: 'React · Node.js · TypeScript · Python · AWS · Docker · Kubernetes · PostgreSQL · Redis · GraphQL · System Design · Technical Mentorship · Code Review · CI/CD · Agile · Microservices Architecture' },
    experience: [
      { company: 'CloudPeak Software', location: 'Seattle, WA', title: 'Tech Lead / Principal Engineer', duration: '03/2021 - Present', desc: '• Led team of 10 engineers building B2B SaaS platform serving 500K+ users, improving sprint velocity by 45%.\n• Architected microservices migration from monolith, reducing system latency by 60% and deployment frequency from monthly to daily.\n• Established engineering best practices: code review standards, testing culture, and technical documentation norms.\n• Mentored 6 junior/mid engineers through 1:1 coaching, 3 of whom earned promotions within 18 months.\n• Drove technical hiring process, interviewing 80+ candidates and growing team from 6 to 14 engineers.' },
      { company: 'InnovateTech Labs', location: 'Bellevue, WA', title: 'Senior Software Engineer', duration: '07/2017 - 02/2021', desc: '• Developed React/Node.js applications processing $2M+ in daily transactions for fintech clients.\n• Designed GraphQL API layer eliminating over-fetching and reducing client-side data consumption by 40%.\n• Led adoption of Docker and Kubernetes, enabling zero-downtime deployments across production environments.' },
      { company: 'StartupForge', location: 'San Francisco, CA', title: 'Software Engineer', duration: '08/2014 - 06/2017', desc: '• Built core product features using React, Python, and PostgreSQL for an early-stage SaaS startup.\n• Implemented automated test suite achieving 85% code coverage, reducing production bugs by 55%.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Science', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2010 - 2014' }
    ],
    projects: [
      { title: 'Microservices Architecture Migration', technology: 'Node.js · Docker · Kubernetes · AWS EKS' },
      { title: 'Real-Time Analytics Dashboard', technology: 'React · GraphQL · Redis · WebSockets · D3.js' }
    ],
    achievements: [
      { title: '60% Latency Reduction', desc: 'Microservices migration and caching strategy slashed API response times from 800ms to 320ms.' },
      { title: '45% Sprint Velocity Increase', desc: 'Team restructuring and Agile coaching drove consistent velocity improvement over 12 months.' },
      { title: '3 Engineers Promoted Under Leadership', desc: 'Direct mentorship and growth plans enabled 3 team members to advance to senior roles.' },
      { title: '55% Bug Reduction', desc: 'Test culture adoption and automated testing pipeline dramatically reduced production defects.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Korean', level: 'Native •••••' }
    ],
    interests: [
      { title: 'Engineering Culture', desc: 'Passionate about building psychologically safe teams where engineers can take technical risks and grow.' },
      { title: 'System Design', desc: 'Fascinated by distributed systems design patterns and large-scale architecture challenges.' },
      { title: 'Technical Writing', desc: 'Publishes architecture deep-dives and engineering blog posts read by 15,000+ monthly readers.' }
    ],
    training: [
      { title: 'AWS Solutions Architect – Associate', org: 'Amazon Web Services', year: '2022' },
      { title: 'Certified Kubernetes Application Developer (CKAD)', org: 'CNCF', year: '2021' }
    ]
  },

  'Web Developer': {
    name: 'Luna Thomas',
    role: 'Web Developer | Front-End Technologies | Scalability',
    contact: { email: 'help@forgeindiaconnect.com', phone: '+1-(234)-555-1234', location: 'Columbus, Ohio', linkedin: 'linkedin.com/in/lunathomas', github: 'github' },
    objective: 'Driven Web Developer with 6 years of experience proficient in HTML5, CSS, and JavaScript. Demonstrates exceptional problem-solving skills and attention to detail while efficiently balancing technical and non-technical aspects. Through focus on code optimization, web performance improved website speed by 36% at previous companies, significantly enhancing user experience.',
    skills: { languages: 'HTML · CSS · JavaScript · React · Vue.js · Node.js · Express · MongoDB · PostgreSQL · REST APIs · GraphQL · Git · Webpack · Performance Optimization · Responsive Design · SEO · Accessibility' },
    experience: [
      { company: 'BrightIdea Solutions', location: 'Columbus, Ohio', title: 'Senior Web Developer', duration: '06/2024 - Present', desc: '• Developed robust websites using CSS, HTML5, JavaScript, and React, resulting in a 40% increase in user engagement.\n• Collaborated with designers and project managers to create seamless user interfaces, improving client satisfaction scores by 25%.\n• Implemented advanced JavaScript programming to streamline interfaces, improving page load time by 30% across major browsers.\n• Led code review sessions, providing constructive feedback and enhancing team knowledge by sharing best practices.\n• Integrated REST APIs to seamlessly improve user experience data flow and improve user experience across platforms by 25%.' },
      { company: 'Creative Web Dynamics', location: 'Columbus, Ohio', title: 'Web Developer', duration: '06/2022 - 05/2024', desc: '• Built responsive websites with HTML, CSS, and JavaScript, improving mobile performance by 35%.\n• Collaborated with cross-functional teams to develop features as per client requirements, improving client retention by 22%.\n• Implemented a version control system using Git, enhancing team coordination and reducing code conflicts by 18%.\n• Troubleshot and resolved website bugs and performance issues, maintaining a 99% uptime for client websites.' },
      { company: 'InnovaGlobal', location: 'Columbus, Ohio', title: 'Junior Web Developer', duration: '06/2020 - 05/2022', desc: '• Assisted clients in developing high-quality, dynamic websites using JavaScript frameworks, improving mobile performance by 16%.\n• Implemented performance strategies for faster load times, increasing page speed by 35% on Google PageSpeed Insights.\n• Maintained excellent relationships with clients, implementing client changes with a turnaround time reduced by 25%.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Science', institution: 'Ohio State University', location: 'Columbus, Ohio', tenure: '01/2017 - 09/2020' }
    ],
    projects: [
      { title: 'Open Source UI Library', technology: 'React · TypeScript · Storybook · NPM · GitHub' },
      { title: 'Community Science Blog Platform', technology: 'Next.js · MongoDB · Vercel · Tailwind CSS' }
    ],
    achievements: [
      { title: 'Speed Optimization Initiative', desc: 'Led a client to optimize client interfaces, boosting website loading speed by 36% across all measured environments.' },
      { title: 'Client Satisfaction Award', desc: 'Received accolade for increasing client satisfaction by 25% through improved digital communications and project management.' },
      { title: 'Cross-Functional Collaboration Success', desc: 'Drove a successful cross-functional project, achieving a 22% increase in projects\' client and retention.' },
      { title: 'Innovative Feature Implementation', desc: 'Implemented a new feature set increasing web capabilities by 40%, recognized company-wide as a best practice.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' }
    ],
    interests: [
      { title: 'Coding and Web Development', desc: 'Passionate about creating creative and technical web applications, always exploring new technologies to improve user experience.' },
      { title: 'Digital Art and Design', desc: 'Enjoy experimenting with design tools to create visually appealing and interactive web experiences.' }
    ],
    training: [
      { title: 'React Advanced Certification', org: 'Udemy, Year 2024', year: '2024' },
      { title: 'Web Performance Optimization', org: 'Google Developers', year: '2023' }
    ]
  },

  'DevOps Engineer': {
    name: 'Alex Rivera',
    role: 'DevOps Engineer | AWS · Kubernetes · Terraform · Jenkins · CI/CD · Docker',
    contact: { email: 'a.rivera@forgeindiaconnect.com', phone: '+1-(512)-456-7890', location: 'Austin, Texas', linkedin: 'linkedin.com/in/alex-rivera-devops', github: 'github.com/alexrivera-ops' },
    objective: 'Passionate DevOps Engineer with 6+ years of experience designing and maintaining robust CI/CD pipelines, container orchestration platforms, and cloud infrastructure on AWS. Reduced deployment lead time by 80% and production incidents by 55% through automation, observability, and SRE best practices.',
    skills: { languages: 'AWS (EKS, EC2, Lambda, RDS, S3) · Kubernetes · Docker · Terraform · Jenkins · GitHub Actions · Ansible · Prometheus · Grafana · ELK Stack · Python · Bash · Go · Site Reliability Engineering · GitOps · ArgoCD' },
    experience: [
      { company: 'ScaleLine Tech', location: 'Austin, TX', title: 'Senior DevOps Engineer', duration: '06/2021 - Present', desc: '• Built fully automated CI/CD pipelines with Jenkins and GitHub Actions enabling 15+ deployments per day across 8 services.\n• Managed EKS Kubernetes clusters for production workloads, maintaining 99.97% uptime SLA.\n• Implemented GitOps workflow using ArgoCD, eliminating manual deployment steps and reducing config drift by 75%.\n• Set up Prometheus + Grafana observability stack reducing MTTR from 2.5 hours to 35 minutes.\n• Authored Terraform modules for AWS infrastructure standardizing provisioning across 5 engineering teams.' },
      { company: 'CloudForge Systems', location: 'San Antonio, TX', title: 'DevOps Engineer', duration: '09/2018 - 05/2021', desc: '• Containerized 20 legacy Python/Java applications using Docker and migrated to Kubernetes on AWS EKS.\n• Established automated security scanning in CI pipelines using SAST/DAST tools, reducing vulnerabilities by 60%.\n• Maintained 99.95% availability for SaaS platform serving 200,000+ active users globally.' },
      { company: 'TechStart Agency', location: 'Dallas, TX', title: 'Junior DevOps / Systems Engineer', duration: '07/2016 - 08/2018', desc: '• Managed Linux server infrastructure on AWS EC2 supporting 50+ development and production environments.\n• Automated server provisioning using Ansible, reducing server setup time from 3 hours to 20 minutes.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Engineering', institution: 'University of Texas at Austin', location: 'Austin, TX', tenure: '2012 - 2016' }
    ],
    projects: [
      { title: 'Fully Automated GitOps Pipeline', technology: 'ArgoCD · Terraform · EKS · GitHub Actions' },
      { title: 'Observability Platform', technology: 'Prometheus · Grafana · Loki · PagerDuty' }
    ],
    achievements: [
      { title: '80% Deployment Lead Time Reduction', desc: 'Automated CI/CD pipelines enabled teams to go from weekly to 15+ daily deployments with confidence.' },
      { title: '55% Fewer Production Incidents', desc: 'Observability, alerting, and runbook automation dramatically reduced operational noise and downtime.' },
      { title: 'MTTR: 2.5 Hours → 35 Minutes', desc: 'Prometheus/Grafana stack enabled sub-minute anomaly detection and faster incident resolution.' },
      { title: '60% Vulnerability Reduction', desc: 'Integrated security scanning tools into CI pipelines enforcing security gates before every deployment.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Fluent ••••' }
    ],
    interests: [
      { title: 'Cloud Native Ecosystem', desc: 'Actively follows CNCF projects and contributes to Kubernetes and Helm chart open source repositories.' },
      { title: 'Developer Experience (DX)', desc: 'Passionate about building internal tooling and platforms that make engineers more productive.' },
      { title: 'Security Engineering', desc: 'Advocates for DevSecOps — integrating security practices early into the CI/CD pipeline lifecycle.' }
    ],
    training: [
      { title: 'AWS DevOps Engineer – Professional', org: 'Amazon Web Services', year: '2022' },
      { title: 'Certified Kubernetes Administrator (CKA)', org: 'CNCF / Linux Foundation', year: '2021' },
      { title: 'HashiCorp Terraform Associate', org: 'HashiCorp', year: '2020' }
    ]
  },

  'Computer Science': {
    name: 'Emma Liu',
    role: 'Computer Science Graduate | Software Engineering | Machine Learning | Research',
    contact: { email: 'e.liu@forgeindiaconnect.com', phone: '+1-(617)-890-1234', location: 'Cambridge, Massachusetts', linkedin: 'linkedin.com/in/emma-liu-cs', github: 'github.com/emmaliu-cs' },
    objective: 'Computer Science graduate from MIT with strong foundations in algorithms, machine learning, and distributed systems. Published research in NLP and computer vision. Interned at Google and Amazon, building production ML pipelines and scalable backend systems. Seeking a full-time software engineering or ML engineering role.',
    skills: { languages: 'Python · Java · C++ · JavaScript · TensorFlow · PyTorch · Scikit-learn · SQL · PostgreSQL · Spark · Hadoop · AWS · Docker · Kubernetes · Git · MATLAB · R · Algorithms & Data Structures · System Design' },
    experience: [
      { company: 'Google', location: 'Mountain View, CA', title: 'Software Engineering Intern', duration: '05/2024 - 08/2024', desc: '• Developed NLP text classification model using BERT fine-tuning, improving search relevance by 12% in A/B testing.\n• Built data pipeline processing 2TB/day of user interaction data using Apache Beam and BigQuery.\n• Collaborated with senior engineers on code reviews and design docs for production ML infrastructure.\n• Presented research findings to 50-person team, receiving intern excellence award for project impact.' },
      { company: 'Amazon Web Services', location: 'Seattle, WA', title: 'Cloud Engineering Intern', duration: '05/2023 - 08/2023', desc: '• Implemented automated testing framework for AWS Lambda, reducing regression testing time by 40%.\n• Designed and built RESTful microservice using Java and DynamoDB handling 10,000 requests per second.\n• Contributed 1,200+ lines of production code reviewed and merged into AWS codebase.' },
      { company: 'MIT CSAIL Research Lab', location: 'Cambridge, MA', title: 'Undergraduate Research Assistant', duration: '09/2022 - 05/2024', desc: '• Researched computer vision algorithms for real-time object detection, achieving 94.3% accuracy on COCO dataset.\n• Co-authored research paper accepted at NeurIPS 2023 workshop on efficient deep learning architectures.\n• Maintained ML training infrastructure using Python, PyTorch, and SLURM cluster.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Science (GPA: 3.92)', institution: 'Massachusetts Institute of Technology', location: 'Cambridge, MA', tenure: '2021 - 2025' }
    ],
    projects: [
      { title: 'Real-Time Object Detection System', technology: 'PyTorch · YOLO · OpenCV · CUDA · Python' },
      { title: 'Distributed Key-Value Store', technology: 'Go · Raft Consensus · Docker · gRPC · Redis' }
    ],
    achievements: [
      { title: 'NeurIPS 2023 Paper Acceptance', desc: 'Co-authored research paper on efficient deep learning architectures accepted at NeurIPS 2023 workshop.' },
      { title: 'Google Intern Excellence Award', desc: 'Received top intern recognition for NLP project improving search relevance by 12% in production A/B test.' },
      { title: 'MIT Dean\'s List (6 Semesters)', desc: 'Consistently maintained GPA above 3.9, earning Dean\'s List recognition every semester.' },
      { title: 'ACM ICPC Regional Finalist', desc: 'Competitive programming finalist, ranked in top 5% at ACM International Collegiate Programming Contest.' }
    ],
    languagesList: [
      { name: 'English', level: 'Fluent •••••' },
      { name: 'Mandarin', level: 'Native •••••' }
    ],
    interests: [
      { title: 'Machine Learning Research', desc: 'Passionate about advancing the field of NLP and computer vision through novel research contributions.' },
      { title: 'Competitive Programming', desc: 'Regularly competes on LeetCode, Codeforces, and in hackathons — 1800+ rating on LeetCode.' },
      { title: 'Open Source AI', desc: 'Contributes to HuggingFace Transformers library and maintains several ML utility packages on PyPI.' }
    ],
    training: [
      { title: 'Deep Learning Specialization', org: 'Coursera / deeplearning.ai', year: '2023' },
      { title: 'AWS Machine Learning – Specialty', org: 'Amazon Web Services', year: '2024' }
    ]
  },

  'IT Director': {
    name: 'Marcus Vance',
    role: 'IT Director | Cloud Transformation | Enterprise Security | Digital Infrastructure',
    contact: { email: 'm.vance@forgeindiaconnect.com', phone: '+1-(555)-789-0123', location: 'San Jose, California', linkedin: 'linkedin.com/in/marcus-vance-it', github: 'github.com/marcusvance' },
    objective: 'Results-driven IT Director with 12+ years of experience managing enterprise IT infrastructure, cloud migration initiatives, and multi-million dollar technology budgets. Led a 35-person global engineering team overseeing 99.99% system uptime across 12 offices. Expert in aligning IT strategy with organizational goals to drive innovation and measurable cost savings.',
    skills: { languages: 'Enterprise IT Strategy · AWS & Azure Cloud Migration · Cybersecurity Governance · Zero-Trust Architecture · Disaster Recovery Planning · Vendor Management · ITSM · ITIL v4 · Budget & P&L Management · Agile Delivery' },
    experience: [
      { company: 'Apex Technology Partners', location: 'San Jose, CA', title: 'Director of Information Technology', duration: '03/2021 - Present', desc: '• Oversaw global IT infrastructure operations across 12 offices supporting 3,500+ employees with 99.99% uptime SLA.\n• Directed multi-year hybrid cloud migration to AWS, reducing annual server hosting costs by $420,000 and improving scalability.\n• Implemented Zero-Trust Security architecture and achieved ISO 27001 compliance across all business units.\n• Established IT governance framework, reducing audit findings by 65% and streamlining policy adherence.\n• Led vendor negotiations reducing annual software licensing expenditure by $180,000.' },
      { company: 'Vanguard Systems Solutions', location: 'San Francisco, CA', title: 'Senior Infrastructure Manager', duration: '06/2017 - 02/2021', desc: '• Managed daily operations of enterprise data centers, SAN storage networks, and Cisco VoIP telephony for 1,200 users.\n• Drove deployment of SD-WAN across 8 regional offices, improving WAN performance by 40% and reducing MPLS costs.\n• Built and mentored a 14-member infrastructure team achieving top departmental satisfaction scores (4.8/5).' },
      { company: 'TechFirst Global', location: 'Oakland, CA', title: 'IT Systems Manager', duration: '01/2014 - 05/2017', desc: '• Oversaw on-premise server refresh project consolidating 80 legacy servers into 12 high-performance VMware ESXi hosts.\n• Implemented ITIL-based incident management framework reducing mean-time-to-resolution by 52%.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Information Systems', institution: 'San Jose State University', location: 'San Jose, CA', tenure: '2010 - 2014' }
    ],
    projects: [
      { title: 'Enterprise Cloud Migration Program', technology: 'AWS · Azure · Terraform · Ansible' },
      { title: 'Zero-Trust Security Implementation', technology: 'Zscaler · CrowdStrike · Okta SSO' }
    ],
    achievements: [
      { title: '$420K Annual Cloud Cost Savings', desc: 'Successfully migrated on-premise workloads to AWS hybrid cloud, slashing infrastructure hosting costs significantly.' },
      { title: '99.99% Uptime SLA Achievement', desc: 'Maintained enterprise-grade high availability across all production systems, exceeding contractual SLA by 0.04%.' },
      { title: 'ISO 27001 Certification', desc: 'Led the company through full ISO 27001 information security certification with zero major non-conformances.' },
      { title: '65% Reduction in Audit Findings', desc: 'Implemented IT governance framework eliminating recurring compliance gaps identified in prior audits.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'German', level: 'Professional ••••' }
    ],
    interests: [
      { title: 'Cloud-Native Innovation', desc: 'Passionate about serverless architecture, containerized microservices, and platform engineering.' },
      { title: 'Cybersecurity Research', desc: 'Actively follows threat intelligence feeds and contributes to zero-day vulnerability analysis communities.' },
      { title: 'Technology Leadership', desc: 'Mentors emerging IT leaders through professional development workshops and online communities.' }
    ],
    training: [
      { title: 'AWS Certified Solutions Architect – Professional', org: 'Amazon Web Services', year: '2023' },
      { title: 'CISSP – Certified Information Systems Security Professional', org: '(ISC)²', year: '2021' },
      { title: 'ITIL 4 Foundation Certification', org: 'Axelos', year: '2020' }
    ]
  },

  'System Administrator': {
    name: 'Ethan Mitchell',
    role: 'Senior System Administrator | Linux · Windows · VMware · Ansible · Docker',
    contact: { email: 'e.mitchell@forgeindiaconnect.com', phone: '+1-(555)-234-5678', location: 'Seattle, Washington', linkedin: 'linkedin.com/in/ethan-mitchell-sysadmin', github: 'github.com/ethanmitchell' },
    objective: 'Proactive Senior System Administrator with 8+ years of experience designing and administering highly available Linux/Windows server environments, Active Directory domains, VMware ESXi clusters, and automating operations via Ansible and Python scripting. Reduced operational downtime by 35% through proactive monitoring and automated patch management.',
    skills: { languages: 'Linux RHEL/Ubuntu · Windows Server 2022 · Active Directory · VMware vSphere · Ansible · Docker · Kubernetes · PowerShell · Bash · Python · Nagios · Zabbix · LDAP' },
    experience: [
      { company: 'CloudScale Managed Services', location: 'Seattle, WA', title: 'Senior System Administrator', duration: '01/2020 - Present', desc: '• Administered 250+ virtualized Linux & Windows server instances maintaining 99.98% operational uptime across production environments.\n• Automated routine patch management using Ansible playbooks, reducing weekly maintenance cycles from 3 days to 4 hours.\n• Deployed Kubernetes clusters on VMware enabling containerized workload orchestration for 15 internal microservices.\n• Designed and implemented centralized logging and monitoring stack (ELK + Grafana), reducing incident detection time by 60%.\n• Managed DNS, DHCP, LDAP, and PKI infrastructure supporting 800+ enterprise users across 3 data centers.' },
      { company: 'NexGen IT Solutions', location: 'Bellevue, WA', title: 'System Administrator', duration: '06/2016 - 12/2019', desc: '• Supported Windows Server 2016/2019 infrastructure including Active Directory, Group Policy, and Exchange Server for 400 users.\n• Implemented Veeam Backup & Replication solution achieving sub-15 minute RTO and sub-1 hour RPO targets.\n• Migrated 60 physical servers to VMware ESXi virtual infrastructure, improving resource utilization by 70%.' },
      { company: 'DataBridge Technologies', location: 'Tacoma, WA', title: 'Junior Systems Engineer', duration: '08/2014 - 05/2016', desc: "• Maintained company's on-premise network infrastructure including Cisco switches, Palo Alto firewalls, and Fortinet VPN.\n• Configured and deployed workstations, laptops, and mobile devices using MDM for 200 end-users." }
    ],
    education: [
      { degree: 'Bachelor of Science in Information Technology', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2010 - 2014' }
    ],
    projects: [
      { title: 'Ansible Automation Framework', technology: 'Ansible · Python · Jenkins CI/CD' },
      { title: 'Kubernetes Home Lab Cluster', technology: 'K8s · Helm · Docker · Prometheus' }
    ],
    achievements: [
      { title: 'Automated Patch Cycles — 3 Days → 4 Hours', desc: 'Built Ansible playbooks that fully automated monthly patch management across 250+ servers.' },
      { title: 'Sub-15-Min RTO Disaster Recovery', desc: 'Engineered automated offsite Veeam backup pipeline achieving near-instant failover capability.' },
      { title: '70% Server Resource Optimization', desc: 'Virtualized 60 aging physical servers onto VMware ESXi, dramatically improving hardware utilization.' },
      { title: '60% Faster Incident Detection', desc: 'Deployed ELK + Grafana monitoring stack enabling real-time alerting and anomaly detection.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Conversational •••' }
    ],
    interests: [
      { title: 'Infrastructure Automation', desc: 'Passionate about building self-healing infrastructure using Ansible, Terraform, and GitOps workflows.' },
      { title: 'Open Source Contribution', desc: 'Regular contributor to Linux and Ansible community projects on GitHub.' },
      { title: 'Homelab Experiments', desc: 'Maintains a personal Kubernetes homelab for testing emerging container orchestration tools.' }
    ],
    training: [
      { title: 'Red Hat Certified System Administrator (RHCSA)', org: 'Red Hat', year: '2022' },
      { title: 'VMware Certified Professional – Data Center Virtualization', org: 'VMware', year: '2021' },
      { title: 'CompTIA Linux+ Certification', org: 'CompTIA', year: '2019' }
    ]
  },

  'Cybersecurity Analyst': {
    name: 'Sophia Chen',
    role: 'Cybersecurity Threat Analyst | SOC · SIEM · Incident Response · Penetration Testing',
    contact: { email: 's.chen@forgeindiaconnect.com', phone: '+1-(555)-901-2345', location: 'Austin, Texas', linkedin: 'linkedin.com/in/sophia-chen-sec', github: 'github.com/sophiachen-sec' },
    objective: 'Certified Security Analyst (CEH, CompTIA Security+) with 6+ years of experience in SOC threat monitoring, vulnerability assessments, SIEM log analysis, penetration testing, and incident response across financial enterprise networks. Reduced mean incident response time by 45% through automated SOAR playbook implementation.',
    skills: { languages: 'Splunk SIEM · IBM QRadar · CrowdStrike · Incident Response · Vulnerability Assessment · Penetration Testing · Wireshark · Metasploit · Nessus · Python · Threat Hunting · OSINT · NIST Framework · ISO 27001' },
    experience: [
      { company: 'CyberGuard Operations Center', location: 'Austin, TX', title: 'Lead SOC Security Analyst (Tier 3)', duration: '04/2021 - Present', desc: '• Monitored and triaged real-time security threat alerts via Splunk SIEM across 10,000+ enterprise endpoints.\n• Investigated and mitigated 60+ critical malware, ransomware, and phishing incidents with zero data breaches.\n• Developed automated SOAR playbooks reducing mean incident response time from 4.2 hours to 2.3 hours.\n• Led quarterly penetration tests identifying and remediating 45 critical vulnerabilities before exploitation.\n• Mentored team of 5 Tier 1/2 SOC analysts on threat hunting methodologies and SIEM alerting tuning.' },
      { company: 'SecureVault Financial Group', location: 'Dallas, TX', title: 'Cybersecurity Analyst', duration: '06/2018 - 03/2021', desc: '• Performed daily vulnerability scans using Nessus and Qualys across 3,000 network assets, prioritizing remediation.\n• Investigated phishing campaigns targeting 2,500 employees, designing security awareness training that reduced click rates by 72%.\n• Maintained SIEM correlation rules and alert thresholds, reducing false positives by 35%.' },
      { company: 'TechShield IT Services', location: 'Houston, TX', title: 'Junior Security Analyst', duration: '01/2017 - 05/2018', desc: '• Monitored network traffic and endpoint activity for suspicious behavior using IDS/IPS tools.\n• Assisted in forensic investigations of suspected insider threat incidents, producing detailed incident reports.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Cybersecurity & Networking', institution: 'The University of Texas at Austin', location: 'Austin, TX', tenure: '2013 - 2017' }
    ],
    projects: [
      { title: 'SOAR Automated Response Playbooks', technology: 'Splunk SOAR · Python · REST APIs' },
      { title: 'Threat Intelligence Dashboard', technology: 'MISP · OpenCTI · Grafana' }
    ],
    achievements: [
      { title: '45% Faster Incident Response', desc: 'SOAR playbook automation cut mean response time from 4.2 hours to 2.3 hours across all SOC tiers.' },
      { title: '72% Phishing Click Rate Reduction', desc: 'Designed and launched security awareness program dramatically reducing employee susceptibility.' },
      { title: '60+ Critical Incidents — Zero Breaches', desc: 'Investigated and contained 60+ high-severity incidents with no data exfiltration or business disruption.' },
      { title: '35% False Positive Reduction', desc: 'Tuned SIEM alert rules and correlation logic to dramatically improve analyst signal-to-noise ratio.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Mandarin', level: 'Fluent ••••' }
    ],
    interests: [
      { title: 'CTF Competitions', desc: 'Regular participant in Capture The Flag cybersecurity competitions on HackTheBox and TryHackMe.' },
      { title: 'Threat Intelligence Research', desc: 'Follows APT group activity reports and contributes to open-source threat intelligence platforms.' },
      { title: 'Security Blogging', desc: 'Publishes incident response case studies and security analysis articles to a growing technical audience.' }
    ],
    training: [
      { title: 'Certified Ethical Hacker (CEH)', org: 'EC-Council', year: '2022' },
      { title: 'CompTIA Security+ Certification', org: 'CompTIA', year: '2020' },
      { title: 'Splunk Certified Power User', org: 'Splunk', year: '2021' }
    ]
  },

  'Cloud Architect': {
    name: 'Aiden Torres',
    role: 'Senior Cloud Architect | AWS · Azure · GCP · Terraform · Kubernetes',
    contact: { email: 'a.torres@forgeindiaconnect.com', phone: '+1-(415)-234-7890', location: 'San Francisco, California', linkedin: 'linkedin.com/in/aiden-torres-cloud', github: 'github.com/aicloud-torres' },
    objective: 'Innovative Cloud Architect with 9+ years of experience designing, implementing, and optimizing multi-cloud and hybrid cloud architectures on AWS, Azure, and GCP. Expert in infrastructure-as-code (Terraform, CDK), Kubernetes orchestration, and cost optimization — reducing cloud spend by 35% while improving system resilience and scalability.',
    skills: { languages: 'AWS (EC2, EKS, Lambda, S3, RDS) · Azure (AKS, App Service, Functions) · GCP (GKE, BigQuery) · Terraform · Kubernetes · Helm · Docker · CI/CD · GitOps · Python · Cost Optimization · FinOps' },
    experience: [
      { company: 'Nexus Cloud Consulting', location: 'San Francisco, CA', title: 'Senior Cloud Architect', duration: '02/2021 - Present', desc: '• Designed multi-region AWS architectures for 8 enterprise clients achieving 99.99% availability and sub-100ms latency.\n• Automated infrastructure provisioning using Terraform and AWS CDK, cutting deployment cycles from 2 weeks to 4 hours.\n• Implemented FinOps practices and AWS Cost Explorer dashboards reducing aggregate client cloud spend by 35%.\n• Architected event-driven microservices platform on AWS Lambda + SQS + DynamoDB processing 5M+ daily events.\n• Led Kubernetes (EKS) cluster migrations for 3 enterprise clients, enabling zero-downtime deployments.' },
      { company: 'InfraScale Technologies', location: 'Oakland, CA', title: 'Cloud Infrastructure Engineer', duration: '07/2017 - 01/2021', desc: '• Built and maintained 40+ AWS accounts using AWS Organizations and Service Control Policies for security governance.\n• Established CI/CD pipelines using GitHub Actions, Jenkins, and ArgoCD reducing release frequency from monthly to daily.\n• Migrated monolithic application to containerized microservices on EKS, improving scalability by 10x.' },
      { company: 'DataVault Systems', location: 'Palo Alto, CA', title: 'DevOps Engineer', duration: '06/2015 - 06/2017', desc: '• Maintained AWS infrastructure for SaaS platform serving 500,000+ users across 4 availability zones.\n• Implemented infrastructure monitoring using Prometheus and Grafana, reducing MTTR by 40%.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Engineering', institution: 'University of California, Berkeley', location: 'Berkeley, CA', tenure: '2011 - 2015' }
    ],
    projects: [
      { title: 'Multi-Region AWS High Availability Design', technology: 'AWS · Route53 · EKS · Terraform' },
      { title: 'GitOps Infrastructure Pipeline', technology: 'ArgoCD · Helm · GitHub Actions · Kubernetes' }
    ],
    achievements: [
      { title: '35% Cloud Cost Reduction', desc: 'Applied FinOps practices and Reserved Instance strategies to cut enterprise cloud bills significantly.' },
      { title: '4-Hour Deployment Cycle', desc: 'Replaced 2-week manual infrastructure provisioning with fully automated Terraform + CDK pipelines.' },
      { title: '10x Scalability Improvement', desc: 'Migrated monolithic architecture to microservices on Kubernetes, enabling elastic horizontal scaling.' },
      { title: '99.99% Uptime Architecture', desc: 'Designed multi-region active-active AWS architectures with full automated failover capabilities.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Spanish', level: 'Advanced ••••' }
    ],
    interests: [
      { title: 'FinOps & Cloud Economics', desc: 'Passionate about cloud cost visibility, unit economics, and sustainable cloud spending practices.' },
      { title: 'Platform Engineering', desc: 'Building internal developer platforms that improve developer experience and deployment velocity.' },
      { title: 'Open Source Terraform Modules', desc: 'Maintains a collection of open-source Terraform modules used by 2,000+ developers globally.' }
    ],
    training: [
      { title: 'AWS Certified Solutions Architect – Professional', org: 'Amazon Web Services', year: '2023' },
      { title: 'Certified Kubernetes Administrator (CKA)', org: 'CNCF / Linux Foundation', year: '2022' },
      { title: 'HashiCorp Terraform Associate', org: 'HashiCorp', year: '2021' }
    ]
  },

  'DevOps Specialist': {
    name: 'Ryan Patel',
    role: 'DevOps Engineer | CI/CD · Kubernetes · Terraform · Jenkins · Docker · AWS',
    contact: { email: 'r.patel@forgeindiaconnect.com', phone: '+1-(312)-567-8901', location: 'Chicago, Illinois', linkedin: 'linkedin.com/in/ryan-patel-devops', github: 'github.com/ryanpatelops' },
    objective: 'Results-driven DevOps Engineer with 7+ years specializing in building robust CI/CD pipelines, container orchestration, infrastructure-as-code, and SRE practices. Delivered a 70% improvement in release frequency and 50% reduction in production incidents through automation-first engineering culture.',
    skills: { languages: 'Jenkins · GitLab CI · GitHub Actions · Docker · Kubernetes · Helm · Terraform · Ansible · AWS · Prometheus · Grafana · ELK Stack · Python · Bash · Go · SRE · Agile' },
    experience: [
      { company: 'FinStream Technologies', location: 'Chicago, IL', title: 'Senior DevOps Engineer', duration: '05/2021 - Present', desc: '• Built and maintained CI/CD pipelines using Jenkins and GitLab CI, enabling daily deployments for 12 engineering teams.\n• Managed Kubernetes clusters (EKS) across dev, staging, and production environments supporting 35 microservices.\n• Implemented Helm chart library standardizing application deployments and reducing configuration drift by 80%.\n• Established full observability stack (Prometheus + Grafana + Loki) reducing MTTR from 3 hours to 45 minutes.\n• Automated AWS infrastructure provisioning via Terraform, enabling one-click environment creation for dev teams.\n• Led blameless postmortem culture adoption resulting in 50% fewer repeat production incidents year-over-year.' },
      { company: 'CloudOps Agency', location: 'Detroit, MI', title: 'DevOps Engineer', duration: '08/2017 - 04/2021', desc: '• Containerized 25 legacy Java/Python applications using Docker, then migrated to Kubernetes for scalable deployments.\n• Built blue-green and canary deployment strategies eliminating customer-facing downtime during releases.\n• Maintained 99.95% uptime SLA for e-commerce platform processing $2M+ in daily transactions.' },
      { company: 'TechBridge Systems', location: 'Indianapolis, IN', title: 'Junior DevOps / Build Engineer', duration: '07/2015 - 07/2017', desc: '• Managed Maven and Gradle build systems for Java applications and maintained Nexus artifact repository.\n• Implemented automated test reporting in Jenkins reducing QA cycle time by 30%.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Software Engineering', institution: 'Illinois Institute of Technology', location: 'Chicago, IL', tenure: '2011 - 2015' }
    ],
    projects: [
      { title: 'GitOps Kubernetes Deployment Platform', technology: 'ArgoCD · Helm · Terraform · EKS' },
      { title: 'Full Observability Stack', technology: 'Prometheus · Grafana · Loki · AlertManager' }
    ],
    achievements: [
      { title: '70% Increase in Release Frequency', desc: 'CI/CD pipeline modernization enabled teams to ship from monthly to daily releases safely.' },
      { title: '50% Fewer Production Incidents', desc: 'Postmortem culture and observability improvements dramatically reduced repeat failure patterns.' },
      { title: 'MTTR: 3 Hours → 45 Minutes', desc: 'Full observability stack implementation enabled pinpoint issue identification and resolution.' },
      { title: '80% Reduction in Config Drift', desc: 'Standardized Helm chart library ensured consistent, auditable deployments across all environments.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'Hindi', level: 'Fluent ••••' }
    ],
    interests: [
      { title: 'Site Reliability Engineering', desc: 'Advocates for SRE principles including error budgets, SLOs, and blameless postmortem culture.' },
      { title: 'Platform Engineering', desc: 'Building golden path tooling and self-service platforms that empower development teams.' },
      { title: 'CNCF Ecosystem', desc: 'Actively follows and experiments with Cloud Native Computing Foundation project ecosystem.' }
    ],
    training: [
      { title: 'Certified Kubernetes Administrator (CKA)', org: 'CNCF / Linux Foundation', year: '2022' },
      { title: 'AWS DevOps Engineer – Professional', org: 'Amazon Web Services', year: '2021' },
      { title: 'GitLab Certified CI/CD Associate', org: 'GitLab', year: '2020' }
    ]
  },

  'Network Engineer': {
    name: 'Liam Nguyen',
    role: 'Senior Network Engineer | Cisco · SD-WAN · BGP · MPLS · Network Security',
    contact: { email: 'l.nguyen@forgeindiaconnect.com', phone: '+1-(617)-345-9012', location: 'Boston, Massachusetts', linkedin: 'linkedin.com/in/liam-nguyen-network', github: 'github.com/liamnguyen-net' },
    objective: 'CCIE-certified Senior Network Engineer with 10+ years of experience designing, implementing, and optimizing enterprise LAN/WAN networks, SD-WAN deployments, BGP/OSPF routing, and network security infrastructure. Reduced WAN costs by 42% and improved network performance by 55% through strategic SD-WAN migration.',
    skills: { languages: 'Cisco IOS/NX-OS · Juniper JunOS · SD-WAN (VeloCloud, Meraki) · BGP · OSPF · MPLS · VLAN · QoS · Palo Alto Firewalls · F5 Load Balancers · Python (Netmiko) · Ansible · SNMP · Wireshark · Network Automation' },
    experience: [
      { company: 'Global Enterprise Networks Inc.', location: 'Boston, MA', title: 'Senior Network Engineer', duration: '03/2020 - Present', desc: '• Designed and deployed enterprise SD-WAN solution (VMware VeloCloud) across 35 branch offices, cutting WAN costs by 42%.\n• Architected BGP peering and MPLS backbone infrastructure supporting 50 Gbps peak traffic throughput.\n• Implemented Palo Alto next-generation firewall policies and Panorama centralized management for 40+ firewall nodes.\n• Automated network configuration management using Ansible + Netmiko reducing configuration change risk by 65%.\n• Led network capacity planning and traffic engineering for a 99.999% (five-nines) uptime commitment.' },
      { company: 'NetCore Managed Services', location: 'Cambridge, MA', title: 'Network Engineer', duration: '07/2016 - 02/2020', desc: '• Managed Cisco Catalyst and Nexus switching infrastructure across 3 data centers and 20 enterprise campus sites.\n• Implemented QoS policies prioritizing voice and video traffic, eliminating jitter issues in 200-seat VoIP deployment.\n• Migrated 15 remote sites from MPLS to broadband internet with DMVPN, saving $600K annually.' },
      { company: 'DataLink Systems', location: 'Worcester, MA', title: 'Junior Network Administrator', duration: '06/2014 - 06/2016', desc: '• Configured and maintained Cisco ASA firewalls, IPSec VPN tunnels, and access control lists for 300-user organization.\n• Assisted in network documentation, topology diagrams, and IP address management (IPAM) using SolarWinds.' }
    ],
    education: [
      { degree: 'Bachelor of Science in Computer Networking & Telecommunications', institution: 'Northeastern University', location: 'Boston, MA', tenure: '2010 - 2014' }
    ],
    projects: [
      { title: 'Enterprise SD-WAN Deployment', technology: 'VMware VeloCloud · BGP · IPSec · MPLS' },
      { title: 'Network Automation Framework', technology: 'Python · Netmiko · Ansible · Nornir' }
    ],
    achievements: [
      { title: '42% WAN Cost Reduction', desc: 'SD-WAN deployment across 35 branches replaced expensive MPLS circuits with broadband internet.' },
      { title: '55% Network Performance Improvement', desc: 'Application-aware routing and QoS policies dramatically improved user experience for cloud apps.' },
      { title: '$600K Annual Savings via DMVPN', desc: 'Migrated 15 remote sites from MPLS to DMVPN over broadband eliminating expensive WAN circuits.' },
      { title: '65% Config Change Risk Reduction', desc: 'Ansible automation replaced manual CLI changes, adding peer review workflow to network operations.' }
    ],
    languagesList: [
      { name: 'English', level: 'Fluent •••••' },
      { name: 'Vietnamese', level: 'Native •••••' }
    ],
    interests: [
      { title: 'Network Automation', desc: 'Advocates for NetDevOps — treating network configuration as code with version control and CI/CD pipelines.' },
      { title: 'IPv6 & Future Internet', desc: 'Deeply interested in IPv6 transition strategies and next-generation internet protocol development.' },
      { title: 'Wireless & 5G Research', desc: 'Follows emerging Wi-Fi 6E and private 5G enterprise deployment trends and use cases.' }
    ],
    training: [
      { title: 'Cisco Certified Internetwork Expert (CCIE) – Enterprise Infrastructure', org: 'Cisco', year: '2022' },
      { title: 'Palo Alto Networks PCNSE Certification', org: 'Palo Alto Networks', year: '2021' },
      { title: 'VMware SD-WAN Professional', org: 'VMware', year: '2020' }
    ]
  },

  'Actor': {
    name: 'Ava Johnson',
    role: 'Actor | Character Development | Film & TV',
    contact: { email: 'help@forgeindiaconnect.com', phone: '+1-(234)-555-1234', location: 'Austin, Texas', linkedin: 'linkedin.com/in/ava-johnson-acting' },
    objective: 'Accomplished Actor with 6 years of experience in film and television, excelling in character development and script interpretation. Skilled in collaboration and adaptability while maintaining professionalism and consistency across performances. Received critical acclaim for a performance that increased viewership by 30%, driven by effective communication and passion for storytelling.',
    skills: { languages: 'Script Analysis - Character Development - Voice-over Techniques - Improvisational Acting - Film Production - Audio Recording' },
    experience: [
      { company: 'Crescent Entertainment', location: 'Los Angeles, CA', title: 'Lead Actor', duration: '04/2026 - Present', desc: '• Developed complex character profiles, portraying a diverse array of roles in independent films and series, enhancing narrative depth.\n• Collaborated with directors to reshape character arcs, ensuring a coherent creative vision across the production lifecycle.\n• Engaged in promotional events and interviews, increasing project visibility with professional presence and audience engagement.' },
      { company: 'Starline Productions', location: 'New York, NY', title: 'Supporting Actor', duration: '01/2023 - 03/2026', desc: '• Performed in feature films and television dramas, consistently delivering compelling and dynamic character portrayals.\n• Participated actively in table reads and rehearsals, offering constructive insights to enhance script and character alignment.' },
      { company: 'Blue Sky Productions', location: 'Austin, TX', title: 'Actor', duration: '06/2020 - 12/2022', desc: '• Portrayed primary and secondary roles in various productions, contributing to critically acclaimed performances and film success.' }
    ],
    education: [{ degree: "Bachelor's Degree in Drama", institution: 'The University of Texas at Austin', location: 'Austin, TX', tenure: '01/2016 - 01/2020' }],
    projects: [
      { title: 'Advanced Method Acting', technology: 'Lee Strasberg Theatre & Film Institute, 2024' },
      { title: 'Voice and Speech for Actors', technology: 'The Juilliard School, 2025' }
    ],
    achievements: [
      { title: 'Critically Acclaimed Lead Role', desc: 'Received critical acclaim for leading role that boosted project viewership by 30% and garnered multiple awards.' },
      { title: 'Featured in Film Festival', desc: 'Acted in a film selected for Sundance Film Festival, attracting widespread attention and engaging new audiences.' },
      { title: 'Social Media Campaign Success', desc: 'Promoted a film release effectively on social media, resulting in a significant increase in followers and engagement.' },
      { title: 'Completed Intensive Acting Workshop', desc: 'Completed an esteemed acting workshop at a renowned acting school, enhancing improvisational and character-driven skills.' }
    ]
  },
  'Executive': {
    name: 'Victoria Sterling',
    role: 'Executive Vice President | Operations & Corporate Strategy',
    contact: { email: 'v.sterling@forgeindiaconnect.com', phone: '+1-(212)-901-2345', location: 'New York, NY', linkedin: 'linkedin.com/in/victoriasterling-exec' },
    objective: 'Senior Executive with 15+ years leading global business transformation, operational scaling, and cross-functional teams across Fortune 500 tech companies. Oversaw $400M+ P&L while growing enterprise valuation by 40%.',
    skills: { languages: 'Corporate Strategy · Executive Leadership · P&L Management · Global Operations · Mergers & Acquisitions · Digital Transformation · Board Governance' },
    experience: [
      { company: 'Global Tech Enterprises', location: 'New York, NY', title: 'Executive Vice President', duration: '03/2020 - Present', desc: '• Oversaw $400M+ P&L across 18 international offices supporting 4,500+ employees.\n• Directed multi-year digital transformation initiative, increasing operational EBITDA margins by 18%.\n• Spearheaded 2 strategic acquisitions totaling $120M, expanding market share by 35% in EMEA.\n• Established corporate ESG framework reducing carbon footprint across facilities by 30%.' },
      { company: 'Vanguard Systems', location: 'Boston, MA', title: 'Vice President of Operations', duration: '05/2014 - 02/2020', desc: '• Managed daily operations for 3 business divisions, scaling team from 120 to 600+ personnel.\n• Reduced operational overhead by $14M annually via supply chain restructuring.' }
    ],
    education: [{ degree: 'MBA in General Management', institution: 'Harvard Business School', location: 'Boston, MA', tenure: '2010 - 2012' }],
    achievements: [
      { title: '18% EBITDA Margin Increase', desc: 'Streamlined enterprise operations across 18 international locations.' },
      { title: '$120M M&A Acquisition', desc: 'Led strategic buy-side acquisition expanding global footprint.' },
      { title: '$14M Annual Cost Savings', desc: 'Restructured supply chain logistics and procurement contracts.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }, { name: 'French', level: 'Fluent ••••' }],
    interests: [{ title: 'Corporate Governance', desc: 'Frequent keynote speaker at Fortune 500 leadership summits.' }],
    training: [{ title: 'Executive Leadership Program', org: 'Harvard Executive Education', year: '2021' }]
  },

  'Data Scientist': {
    name: 'Dr. Aris Thorne',
    role: 'Lead Data Scientist | Machine Learning | Predictive Analytics | NLP',
    contact: { email: 'a.thorne@forgeindiaconnect.com', phone: '+1-(415)-555-0199', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/aris-thorne-ds' },
    objective: 'Data Scientist with 7+ years of experience engineering predictive models, neural networks, and scalable data pipelines. Deployed ML models boosting customer retention by 28% and generating $4.5M in incremental revenue.',
    skills: { languages: 'Python · PyTorch · TensorFlow · SQL · Scikit-Learn · Spark · Data Pipeline Design · A/B Testing · Deep Learning · NLP' },
    experience: [
      { company: 'DataScale Inc.', location: 'San Francisco, CA', title: 'Lead Data Scientist', duration: '06/2021 - Present', desc: '• Built customer churn prediction model using XGBoost & PyTorch, boosting retention by 28%.\n• Designed distributed data processing pipelines in Spark processing 5TB daily log data.\n• Mentored 5 junior data analysts on Statistical Modeling and ML experiment design.' },
      { company: 'Neural Analytics', location: 'San Jose, CA', title: 'Senior Data Scientist', duration: '01/2017 - 05/2021', desc: '• Developed automated recommendation engine increasing average basket size by 22%.\n• Conducted multivariate A/B tests optimizing website conversion funnels.' }
    ],
    education: [{ degree: 'Ph.D. in Computer Science & Machine Learning', institution: 'Stanford University', location: 'Stanford, CA', tenure: '2012 - 2017' }],
    achievements: [
      { title: '$4.5M Incremental Revenue', desc: 'Deployed machine learning recommendation system for e-commerce clients.' },
      { title: '28% Churn Reduction', desc: 'Engineered predictive retention model identifying at-risk accounts early.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }, { name: 'Mandarin', level: 'Fluent ••••' }],
    interests: [{ title: 'AI Ethics & Research', desc: 'Publishes peer-reviewed research papers on fair ML model evaluation.' }],
    training: [{ title: 'Deep Learning Specialization', org: 'Coursera / deeplearning.ai', year: '2020' }]
  },

  'Product Manager': {
    name: 'Claire Dupont',
    role: 'Senior Product Manager | SaaS Platform | User Growth | Agile',
    contact: { email: 'c.dupont@forgeindiaconnect.com', phone: '+1-(415)-890-4321', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/claire-dupont-pm' },
    objective: 'Product Manager with 6+ years driving end-to-end product lifecycles for high-growth B2B SaaS products. Scaled monthly active users from 100K to 1.2M while reducing churn by 35%.',
    skills: { languages: 'Product Strategy · User Research · Agile / Scrum · Product Analytics (Amplitude, Mixpanel) · Roadmap Planning · Wireframing · A/B Testing' },
    experience: [
      { company: 'SaaSify Cloud', location: 'San Francisco, CA', title: 'Senior Product Manager', duration: '04/2021 - Present', desc: '• Led product roadmap for flagship B2B SaaS tool, growing ARR from $8M to $24M in 3 years.\n• Spearheaded complete UX redesign resulting in 35% improvement in 30-day user retention.\n• Facilitated weekly Agile ceremonies for 3 engineering squads (24 developers).' },
      { company: 'Innovate Labs', location: 'Palo Alto, CA', title: 'Product Manager', duration: '06/2018 - 03/2021', desc: '• Launched self-serve onboarding flow increasing user activation rate by 42%.' }
    ],
    education: [{ degree: 'B.S. in Information Systems', institution: 'UC Berkeley', location: 'Berkeley, CA', tenure: '2013 - 2017' }],
    achievements: [
      { title: '3x ARR Growth ($8M → $24M)', desc: 'Owned end-to-end product strategy and feature delivery.' },
      { title: '42% Higher Activation', desc: 'Redesigned self-serve onboarding user flow.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }, { name: 'French', level: 'Native •••••' }],
    interests: [{ title: 'Product Design Principles', desc: 'Passionate about human-centered design and SaaS product analytics.' }],
    training: [{ title: 'Certified Product Manager (CPM)', org: 'AIPMM', year: '2021' }]
  },

  'Software Engineer': {
    name: 'David Vance',
    role: 'Senior Software Engineer | Distributed Systems | Java · Go · AWS',
    contact: { email: 'd.vance@forgeindiaconnect.com', phone: '+1-(206)-555-7812', location: 'Seattle, WA', linkedin: 'linkedin.com/in/davidvance-dev' },
    objective: 'Software Engineer with 8+ years building high-throughput microservices and distributed database architectures. Improved API throughput by 4x and decreased p99 latency to under 15ms.',
    skills: { languages: 'Java · Go · C++ · AWS (DynamoDB, ECS, SQS) · Docker · Kubernetes · Microservices · System Architecture · PostgreSQL' },
    experience: [
      { company: 'CloudCore Systems', location: 'Seattle, WA', title: 'Senior Software Engineer', duration: '01/2020 - Present', desc: '• Architected payment processing backend handling $10M+ daily throughput with 99.999% uptime.\n• Refactored legacy monolithic backend to Go microservices, reducing server infrastructure costs by 45%.\n• Implemented automated CI/CD pipeline reducing deployment cycle time from 2 hours to 8 minutes.' },
      { company: 'NextGen Solutions', location: 'Bellevue, WA', title: 'Software Engineer', duration: '06/2016 - 12/2019', desc: '• Built scalable REST and gRPC APIs handling 20,000 requests per second.' }
    ],
    education: [{ degree: 'B.S. in Computer Science', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2012 - 2016' }],
    achievements: [
      { title: '4x API Throughput Improvement', desc: 'Redesigned core microservices architecture to process 50,000 requests/sec.' },
      { title: '45% Server Cost Reduction', desc: 'Migrated legacy monolith to containerized Go microservices.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }],
    interests: [{ title: 'Distributed Systems', desc: 'Active contributor to open-source Go and Kubernetes libraries.' }],
    training: [{ title: 'AWS Solutions Architect – Professional', org: 'Amazon Web Services', year: '2022' }]
  },

  'Digital Marketing': {
    name: 'Jessica Alba-Reyes',
    role: 'Digital Marketing Director | Growth Strategy | SEO | Paid Media · Analytics',
    contact: { email: 'j.reyes@forgeindiaconnect.com', phone: '+1-(310)-555-6543', location: 'Los Angeles, CA', linkedin: 'linkedin.com/in/jessicareyes-mktg' },
    objective: 'Data-driven Digital Marketer with 7+ years driving multi-channel growth campaigns. Scaled digital ad revenue by 140% YoY while reducing Customer Acquisition Cost (CAC) by 32%.',
    skills: { languages: 'SEO & SEM · Google Ads · Meta Ads · Content Strategy · Google Analytics 4 · Email Marketing · Conversion Rate Optimization (CRO)' },
    experience: [
      { company: 'BrightGrowth Media', location: 'Los Angeles, CA', title: 'Digital Marketing Director', duration: '02/2021 - Present', desc: '• Managed $3.5M annual digital ad budget across Google, Meta, and LinkedIn channels.\n• Decreased CAC by 32% while increasing monthly qualified leads by 115%.\n• Built automated GA4 performance reporting dashboard for C-suite executive team.' },
      { company: 'Apex Interactive', location: 'Santa Monica, CA', title: 'Growth Marketing Manager', duration: '05/2017 - 01/2021', desc: '• Executed email automation drip campaigns resulting in $1.2M pipeline revenue.' }
    ],
    education: [{ degree: 'B.A. in Communications & Marketing', institution: 'USC', location: 'Los Angeles, CA', tenure: '2012 - 2016' }],
    achievements: [
      { title: '32% CAC Reduction', desc: 'Optimized ad creative and landing page conversion funnels.' },
      { title: '115% Qualified Lead Growth', desc: 'Scaled multi-channel paid acquisition campaigns.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }, { name: 'Spanish', level: 'Fluent ••••' }],
    interests: [{ title: 'Growth Hacking & Analytics', desc: 'Regular speaker at Digital Marketing & Conversion Optimization conferences.' }],
    training: [{ title: 'Google Search Ads & GA4 Certified', org: 'Google Skillshop', year: '2023' }]
  },

  'Sales Director': {
    name: 'Robert Sterling',
    role: 'Sales Director | Enterprise B2B SaaS | Revenue Growth | Team Building',
    contact: { email: 'r.sterling@forgeindiaconnect.com', phone: '+1-(312)-555-9087', location: 'Chicago, IL', linkedin: 'linkedin.com/in/robertsterling-sales' },
    objective: 'Results-driven Sales Director with 10+ years closing enterprise SaaS deals and building high-performing sales organizations. Closed $28M+ in ARR while leading a 20-person account executive team.',
    skills: { languages: 'Enterprise B2B Sales · Sales Operations · Salesforce CRM · Account-Based Marketing · Negotiation · Contract Closing · Pipeline Management' },
    experience: [
      { company: 'Enterprise SaaS Corp', location: 'Chicago, IL', title: 'Sales Director', duration: '06/2019 - Present', desc: '• Built and led a 20-person AE & SDR sales team generating $28M in annual recurring revenue.\n• Exceeded annual team quota by 145% for 3 consecutive fiscal years.\n• Implemented MEDDIC sales methodology, shortening sales cycle duration by 25%.' },
      { company: 'Vanguard Software', location: 'Chicago, IL', title: 'Enterprise Account Executive', duration: '01/2014 - 05/2019', desc: '• Closed 30+ Fortune 500 accounts totaling $12M in new ARR.' }
    ],
    education: [{ degree: 'B.S. in Business Administration', institution: 'Northwestern University', location: 'Evanston, IL', tenure: '2009 - 2013' }],
    achievements: [
      { title: '$28M ARR Generated', desc: 'Scaled enterprise sales division from $5M to $28M ARR in 4 years.' },
      { title: '145% Quota Attainment', desc: 'Consistently surpassed revenue targets across all quarters.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }],
    interests: [{ title: 'Sales Leadership Mentorship', desc: 'Mentors junior Account Executives through Chicago B2B Sales Network.' }],
    training: [{ title: 'MEDDPICC Enterprise Sales Certified', org: 'Force Management', year: '2021' }]
  },

  'Teacher': {
    name: 'Hannah Abbott',
    role: 'STEM Educator & Department Head | Curriculum Development | EdTech',
    contact: { email: 'h.abbott@forgeindiaconnect.com', phone: '+1-(617)-555-4321', location: 'Boston, MA', linkedin: 'linkedin.com/in/hannahabbott-edu' },
    objective: 'Dedicated STEM Educator with 9+ years experience designing interactive science curricula and integrating EdTech tools. Improved state standardized test pass rates by 24%.',
    skills: { languages: 'STEM Curriculum Design · Classroom Management · EdTech Integration · Differentiated Instruction · Parent & Administration Communication' },
    experience: [
      { company: 'Boston Academy', location: 'Boston, MA', title: 'STEM Department Head & Senior Educator', duration: '08/2017 - Present', desc: '• Taught Advanced Placement Chemistry & Physics to 140+ students annually.\n• Boosted AP exam pass rates from 68% to 92% over a 4-year period.\n• Integrated Google Classroom and interactive simulation software for hybrid learning.' },
      { company: 'Cambridge High School', location: 'Cambridge, MA', title: 'Science Teacher', duration: '08/2014 - 07/2017', desc: '• Developed hands-on laboratory experiments fostering student STEM engagement.' }
    ],
    education: [{ degree: 'Master of Education (M.Ed.)', institution: 'Boston University', location: 'Boston, MA', tenure: '2013 - 2015' }],
    achievements: [
      { title: '92% AP Pass Rate', desc: 'Achieved top AP Chemistry pass rate in school district history.' },
      { title: 'Teacher of the Year 2022', desc: 'Awarded by Boston District Education Board.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }, { name: 'Spanish', level: 'Conversational •••' }],
    interests: [{ title: 'EdTech Innovation', desc: 'Enthusiast for applying virtual reality and interactive labs to science education.' }],
    training: [{ title: 'Massachusetts Educator License (Physics & Chemistry)', org: 'MA DESE', year: '2015' }]
  },

  'Mechanical Engineer': {
    name: 'Carlos Mendez',
    role: 'Senior Mechanical Engineer | Thermal Systems | CAD · SolidWorks · FEA',
    contact: { email: 'c.mendez@forgeindiaconnect.com', phone: '+1-(313)-555-7766', location: 'Detroit, MI', linkedin: 'linkedin.com/in/carlosmendez-eng' },
    objective: 'Mechanical Engineer with 8+ years designing automotive & aerospace mechanical components. Led structural FEA analysis reducing product defect rate by 45%.',
    skills: { languages: 'SolidWorks · ANSYS FEA · CATIA · Thermal Modeling · GD&T · Rapid Prototyping · Manufacturing Processes · HVAC Systems' },
    experience: [
      { company: 'Detroit Auto Tech', location: 'Detroit, MI', title: 'Senior Mechanical Engineer', duration: '03/2018 - Present', desc: '• Engineered EV battery cooling systems reducing thermal throttling by 35%.\n• Managed 3D CAD modeling and finite element analysis (FEA) for structural components.\n• Coordinated with manufacturing teams to streamline assembly line tolerance stack-ups.' },
      { company: 'MotorCity Engineering', location: 'Dearborn, MI', title: 'Mechanical Engineer', duration: '06/2014 - 02/2018', desc: '• Designed HVAC fluid handling assemblies for commercial vehicles.' }
    ],
    education: [{ degree: 'B.S. in Mechanical Engineering', institution: 'University of Michigan', location: 'Ann Arbor, MI', tenure: '2010 - 2014' }],
    achievements: [
      { title: '45% Defect Reduction', desc: 'Implemented rigorous GD&T standards and FEA simulation testing.' },
      { title: 'EV Cooling Patent Co-Inventor', desc: 'Co-invented patent for high-efficiency battery thermal management.' }
    ],
    languagesList: [{ name: 'English', level: 'Native •••••' }, { name: 'Spanish', level: 'Native •••••' }],
    interests: [{ title: 'Automotive Innovation', desc: 'Follows EV drivetrain engineering and additive manufacturing technologies.' }],
    training: [{ title: 'Certified SolidWorks Professional (CSWP)', org: 'Dassault Systèmes', year: '2017' }]
  },

  'Voice Actor': {
    name: 'Ethan Hunt',
    role: 'Voice Actor | Animation, Audiobooks, Commercials & Gaming',
    contact: { email: 'e.hunt@forgeindiaconnect.com', phone: '+1-(818)-555-9988', location: 'Burbank, CA', linkedin: 'linkedin.com/in/ethanhunt-vo' },
    objective: 'Versatile Voice Actor with 6+ years voicing over 100+ commercials, animated series, and AAA video games. Recorded audiobooks exceeding 50,000 downloads.',
    skills: { languages: 'Voice Acting · Character Dialects · Home Studio Recording (Pro Tools) · Commercial Voiceover · Audiobook Narration · ADR' },
    experience: [
      { company: 'Burbank VO Studios', location: 'Burbank, CA', title: 'Lead Voice Artist', duration: '01/2019 - Present', desc: '• Provided principal character voices for 4 animated series broadcast on national networks.\n• Narrated 15+ bestselling fiction audiobooks with 4.9/5 listener rating.' }
    ],
    education: [{ degree: 'B.A. in Theater & Performing Arts', institution: 'UCLA', location: 'Los Angeles, CA', tenure: '2014 - 2018' }],
    achievements: [{ title: '50,000+ Audiobook Downloads', desc: 'Voiced top-rated fantasy audiobook series on Audible.' }]
  },

  'Content Writer': {
    name: 'Chloe Bennett',
    role: 'Senior Content Strategist & Writer | B2B SaaS | Copywriting & SEO',
    contact: { email: 'c.bennett@forgeindiaconnect.com', phone: '+1-(503)-555-3210', location: 'Portland, OR', linkedin: 'linkedin.com/in/chloebennett-writer' },
    objective: 'SEO Content Writer with 5+ years producing viral tech blogs, whitepapers, and landing pages. Grew organic blog traffic by 250% in 12 months.',
    skills: { languages: 'SEO Writing · B2B Copywriting · Content Strategy · WordPress · Ahrefs / SEMrush · Technical Documentation · Email Newsletters' },
    experience: [
      { company: 'TechScribe Media', location: 'Portland, OR', title: 'Senior Content Writer', duration: '04/2020 - Present', desc: '• Wrote 120+ long-form technical guides generating 500,000+ annual organic visits.\n• Optimized web landing pages increasing reader email signup conversion rate by 40%.' }
    ],
    education: [{ degree: 'B.A. in English & Journalism', institution: 'University of Oregon', location: 'Eugene, OR', tenure: '2014 - 2018' }],
    achievements: [{ title: '250% Organic Traffic Growth', desc: 'Ranked 45+ keywords on Page 1 of Google within 9 months.' }]
  },

  'Graphic Designer': {
    name: 'Liam Walker',
    role: 'Senior Graphic Designer | Brand Identity | Adobe Creative Suite | UI Visuals',
    contact: { email: 'l.walker@forgeindiaconnect.com', phone: '+1-(415)-555-7654', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/liamwalker-design' },
    objective: 'Creative Graphic Designer with 7+ years shaping brand identities, marketing collateral, and packaging for tier-1 brands. Redesigned brand identity driving 50% brand recognition gain.',
    skills: { languages: 'Adobe Photoshop · Illustrator · InDesign · Figma · Brand Strategy · Typography · Print & Digital Media · Illustration' },
    experience: [
      { company: 'Studio Design Co.', location: 'San Francisco, CA', title: 'Senior Graphic Designer', duration: '02/2019 - Present', desc: '• Created complete brand identity packages for 25+ tech startups and retail clients.\n• Designed digital ad assets generating 10M+ impressions across social campaigns.' }
    ],
    education: [{ degree: 'B.F.A. in Graphic Design', institution: 'Rhode Island School of Design (RISD)', location: 'Providence, RI', tenure: '2012 - 2016' }],
    achievements: [{ title: 'Design Excellence Award 2023', desc: 'Recognized for outstanding brand identity redesign in consumer tech sector.' }]
  },

  'Video Editor': {
    name: 'Noah Miller',
    role: 'Senior Video Editor & Motion Designer | Premiere Pro · After Effects · DaVinci',
    contact: { email: 'n.miller@forgeindiaconnect.com', phone: '+1-(310)-555-8811', location: 'Culver City, CA', linkedin: 'linkedin.com/in/noahmiller-video' },
    objective: 'Video Editor with 6+ years producing high-impact brand videos, YouTube commercials, and documentary shorts. Videos generated over 15M combined views.',
    skills: { languages: 'Adobe Premiere Pro · After Effects · DaVinci Resolve · Color Grading · Sound Design · Motion Graphics · Video Production' },
    experience: [
      { company: 'CineMedia Studios', location: 'Culver City, CA', title: 'Senior Video Editor', duration: '05/2019 - Present', desc: '• Edited 80+ commercial videos for major consumer brands resulting in 15M+ views.\n• Performed color grading and audio mixing for short-form documentary films.' }
    ],
    education: [{ degree: 'B.A. in Film & Electronic Arts', institution: 'Cal State Long Beach', location: 'Long Beach, CA', tenure: '2014 - 2018' }],
    achievements: [{ title: '15M+ Video Views', desc: 'Edited promotional campaign video that went viral across YouTube and Instagram.' }]
  },

  'Art Director': {
    name: 'Sophia Chen-Ross',
    role: 'Creative Art Director | Visual Campaigns | Brand Strategy | UX & Design',
    contact: { email: 's.chenross@forgeindiaconnect.com', phone: '+1-(212)-555-2233', location: 'New York, NY', linkedin: 'linkedin.com/in/sophiachenross' },
    objective: 'Art Director with 10+ years directing commercial photoshoots, brand campaigns, and UI style guides for global luxury brands.',
    skills: { languages: 'Creative Direction · Brand Strategy · Photography Direction · Team Leadership · Adobe CC · UI/UX Style Guides' },
    experience: [
      { company: 'Vogue Media Group', location: 'New York, NY', title: 'Creative Art Director', duration: '01/2018 - Present', desc: '• Led visual direction for print & digital campaigns generating $12M in annual ad revenue.\n• Managed team of 12 designers, photographers, and copywriters.' }
    ],
    education: [{ degree: 'B.F.A. in Visual Arts', institution: 'Parsons School of Design', location: 'New York, NY', tenure: '2008 - 2012' }],
    achievements: [{ title: 'Clio Fashion & Beauty Award', desc: 'Awarded for outstanding creative art direction in luxury retail campaign.' }]
  },

  'Operations Manager': {
    name: 'Jameson Reed',
    role: 'Director of Operations | Supply Chain | Process Optimization | Lean Six Sigma',
    contact: { email: 'j.reed@forgeindiaconnect.com', phone: '+1-(404)-555-6677', location: 'Atlanta, GA', linkedin: 'linkedin.com/in/jamesonreed-ops' },
    objective: 'Operations Manager with 9+ years managing logistics, facility operations, and vendor networks. Reduced annual operating costs by $2.3M using Lean Six Sigma methodology.',
    skills: { languages: 'Supply Chain Management · Operations Strategy · Lean Six Sigma Green Belt · Vendor Negotiations · Logistics · ERP Systems' },
    experience: [
      { company: 'LogiScale Global', location: 'Atlanta, GA', title: 'Director of Operations', duration: '03/2018 - Present', desc: '• Managed daily warehouse & distribution operations across 4 regional fulfillment centers.\n• Cut fulfillment shipping error rate from 3.2% to 0.4% through process standardization.' }
    ],
    education: [{ degree: 'B.S. in Industrial Operations', institution: 'Georgia Tech', location: 'Atlanta, GA', tenure: '2010 - 2014' }],
    achievements: [{ title: '$2.3M Annual Cost Savings', desc: 'Optimized inventory routing and carrier contract negotiations.' }]
  },

  'Management Consultant': {
    name: 'Audrey Hepburn-Wright',
    role: 'Management Consultant | Strategy & Restructuring | McKinsey Alum',
    contact: { email: 'a.wright@forgeindiaconnect.com', phone: '+1-(212)-555-3456', location: 'New York, NY', linkedin: 'linkedin.com/in/audreywright-consulting' },
    objective: 'Former Tier-1 Management Consultant with 7+ years advising C-suite executives on strategic growth, cost optimization, and post-merger integration ($500M+ transactions).',
    skills: { languages: 'Corporate Strategy · M&A Integration · Financial Modeling · Market Entry Strategy · Executive Presentation · Change Management' },
    experience: [
      { company: 'McKinsey & Company', location: 'New York, NY', title: 'Engagement Manager', duration: '08/2019 - Present', desc: '• Advised C-level executives of Fortune 100 retail client on $300M digital transformation.\n• Formulated market entry strategy for healthcare client, unlocking $85M new revenue.' }
    ],
    education: [{ degree: 'MBA in Finance & Strategy', institution: 'Columbia Business School', location: 'New York, NY', tenure: '2017 - 2019' }],
    achievements: [{ title: '$85M Revenue Unlocked', desc: 'Formulated new market entry strategy for Fortune 500 healthcare client.' }]
  },

  'Scrum Master': {
    name: 'Brandon Hayes',
    role: 'Certified Scrum Master (CSM) | Agile Coaching | JIRA | Team Velocity',
    contact: { email: 'b.hayes@forgeindiaconnect.com', phone: '+1-(512)-555-9012', location: 'Austin, TX', linkedin: 'linkedin.com/in/brandonhayes-agile' },
    objective: 'Agile Scrum Master with 6+ years facilitating high-performing engineering teams. Increased team sprint velocity by 40% while reducing bug escapes by 65%.',
    skills: { languages: 'Agile / Scrum · SAFe · JIRA & Confluence · Sprint Planning · Retrospectives · Team Mentorship · KanBan' },
    experience: [
      { company: 'AgileTech Solutions', location: 'Austin, TX', title: 'Senior Scrum Master', duration: '04/2020 - Present', desc: '• Facilitated Scrum ceremonies for 3 engineering teams (28 developers), increasing velocity by 40%.\n• Mentored 4 junior Scrum Masters across the enterprise PMO organization.' }
    ],
    education: [{ degree: 'B.S. in Computer Information Systems', institution: 'UT Austin', location: 'Austin, TX', tenure: '2013 - 2017' }],
    achievements: [{ title: '40% Sprint Velocity Increase', desc: 'Coached engineering teams on backlog refinement and sprint estimations.' }]
  },

  'Machine Learning Eng': {
    name: 'Dr. Maya Patel',
    role: 'Machine Learning Engineer | PyTorch · TensorFlow · MLOps · LLM Fine-Tuning',
    contact: { email: 'm.patel@forgeindiaconnect.com', phone: '+1-(650)-555-1122', location: 'Palo Alto, CA', linkedin: 'linkedin.com/in/mayapatel-ml' },
    objective: 'ML Engineer with 6+ years building production recommendation engines, transformer models, and real-time inference pipelines handling 50M daily API calls.',
    skills: { languages: 'Python · PyTorch · TensorFlow · MLOps (Kubeflow, MLflow) · Docker · CUDA · LLM Fine-Tuning · C++' },
    experience: [
      { company: 'AI Vision Labs', location: 'Palo Alto, CA', title: 'Senior ML Engineer', duration: '06/2020 - Present', desc: '• Built LLM RAG application for enterprise search, improving query accuracy by 34%.\n• Optimized PyTorch model inference using TensorRT, reducing latency from 120ms to 18ms.' }
    ],
    education: [{ degree: 'Ph.D. in Artificial Intelligence', institution: 'UC Berkeley', location: 'Berkeley, CA', tenure: '2014 - 2019' }],
    achievements: [{ title: '18ms Model Inference', desc: 'Optimized deep learning model pipeline using TensorRT and GPU acceleration.' }]
  },

  'Data Analyst': {
    name: 'Kevin Zhang',
    role: 'Senior Data Analyst | SQL · Tableau · Python · Business Intelligence',
    contact: { email: 'k.zhang@forgeindiaconnect.com', phone: '+1-(206)-555-4433', location: 'Seattle, WA', linkedin: 'linkedin.com/in/kevinzhang-data' },
    objective: 'Data Analyst with 5+ years translating complex datasets into executive dashboards and strategic growth insights. Discovered $3.5M revenue leak via SQL analysis.',
    skills: { languages: 'SQL (PostgreSQL, Snowflake) · Tableau · Power BI · Python (Pandas) · Data Modeling · A/B Testing' },
    experience: [
      { company: 'DataMetrics Corp', location: 'Seattle, WA', title: 'Senior Data Analyst', duration: '03/2021 - Present', desc: '• Built automated Tableau dashboards tracking company KPIs for executive team.\n• Conducted SQL audit of subscription billing data, uncovering $3.5M unbilled revenue.' }
    ],
    education: [{ degree: 'B.S. in Statistics & Data Science', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2015 - 2019' }],
    achievements: [{ title: '$3.5M Revenue Recovery', desc: 'Identified billing anomaly through SQL data auditing.' }]
  },

  'AI Engineer': {
    name: 'Sebastian Vance',
    role: 'AI Engineer | Generative AI · LangChain · RAG · Computer Vision',
    contact: { email: 's.vance@forgeindiaconnect.com', phone: '+1-(415)-555-9900', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/sebastianvance-ai' },
    objective: 'AI Engineer specializing in Generative AI, RAG architecture, and fine-tuning LLMs for enterprise applications. Built AI assistant serving 200,000 active users.',
    skills: { languages: 'Python · LangChain · LlamaIndex · OpenAI API · Vector DBs (Pinecone, Chroma) · PyTorch · FastAPI' },
    experience: [
      { company: 'GenAI Innovators', location: 'San Francisco, CA', title: 'Senior AI Engineer', duration: '01/2022 - Present', desc: '• Architected RAG-based AI knowledge assistant serving 200,000 active customer support queries.\n• Fine-tuned Llama-3 model on domain-specific medical data achieving 94% response accuracy.' }
    ],
    education: [{ degree: 'M.S. in Computer Science (AI Track)', institution: 'Stanford University', location: 'Stanford, CA', tenure: '2019 - 2021' }],
    achievements: [{ title: '200,000 Active AI Users', desc: 'Built high-throughput RAG architecture processing 100K daily tokens.' }]
  },

  'UI/UX Designer': {
    name: 'Elena Rostova',
    role: 'Lead UI/UX Designer | Product Design · Design Systems · Figma',
    contact: { email: 'e.rostova@forgeindiaconnect.com', phone: '+1-(212)-555-7788', location: 'New York, NY', linkedin: 'linkedin.com/in/elenarostova-design' },
    objective: 'UI/UX Designer with 7+ years crafting intuitive digital interfaces for web & mobile apps. Redesigned core checkout flow increasing conversion rate by 34%.',
    skills: { languages: 'Figma · Design Systems · Wireframing · User Research · Usability Testing · Information Architecture · Prototyping' },
    experience: [
      { company: 'DesignCraft Global', location: 'New York, NY', title: 'Lead UI/UX Designer', duration: '04/2019 - Present', desc: '• Created comprehensive multi-platform Design System used by 45+ product engineers.\n• Redesigned mobile app onboarding flow, boosting user completion rate by 34%.' }
    ],
    education: [{ degree: 'B.F.A. in Interaction Design', institution: 'Pratt Institute', location: 'Brooklyn, NY', tenure: '2012 - 2016' }],
    achievements: [{ title: '34% Conversion Boost', desc: 'Overhauled mobile checkout interface reducing user friction.' }]
  },

  'Product Designer': {
    name: 'Oliver Bennett',
    role: 'Senior Product Designer | User Research · Wireframing · Prototyping',
    contact: { email: 'o.bennett@forgeindiaconnect.com', phone: '+1-(415)-555-3344', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/oliverbennett-design' },
    objective: 'Product Designer with 6+ years combining human-centered design principles with rapid prototyping to build top-rated iOS and Web products.',
    skills: { languages: 'Product Design · Figma · Principle · User Interviews · Interactive Prototyping · HTML/CSS' },
    experience: [
      { company: 'NextGen Apps', location: 'San Francisco, CA', title: 'Senior Product Designer', duration: '02/2020 - Present', desc: '• Led end-to-end product design for iOS app rated 4.8/5 on App Store with 1M+ downloads.' }
    ],
    education: [{ degree: 'B.S. in Human-Computer Interaction', institution: 'Stanford University', location: 'Stanford, CA', tenure: '2014 - 2018' }],
    achievements: [{ title: '4.8 App Store Rating', desc: 'Designed top-charting mobile productivity app.' }]
  },

  'Web Designer': {
    name: 'Grace Taylor',
    role: 'Web Designer | Responsive Web Design · Webflow · HTML/CSS · Branding',
    contact: { email: 'g.taylor@forgeindiaconnect.com', phone: '+1-(503)-555-6611', location: 'Portland, OR', linkedin: 'linkedin.com/in/gracetaylor-web' },
    objective: 'Web Designer with 5+ years crafting high-converting marketing websites and landing pages for tech startups.',
    skills: { languages: 'Webflow · HTML5 / CSS3 · Figma · Responsive Design · SEO Basics · JavaScript' },
    experience: [
      { company: 'PixelPerfect Web', location: 'Portland, OR', title: 'Web Designer', duration: '06/2020 - Present', desc: '• Designed and launched 35+ custom Webflow marketing sites for SaaS clients.' }
    ],
    education: [{ degree: 'B.A. in Digital Arts', institution: 'Portland State University', location: 'Portland, OR', tenure: '2015 - 2019' }],
    achievements: [{ title: '35+ Client Sites Launched', desc: 'Delivered high-converting web designs ahead of deadlines.' }]
  },

  'Motion Designer': {
    name: 'Lucas Silva',
    role: 'Senior Motion Designer | 2D/3D Animation · Cinema 4D · After Effects',
    contact: { email: 'l.silva@forgeindiaconnect.com', phone: '+1-(310)-555-2244', location: 'Los Angeles, CA', linkedin: 'linkedin.com/in/lucassilva-motion' },
    objective: 'Motion Graphics Designer with 6+ years creating 3D product animations, broadcast graphics, and UI micro-interactions for global brands.',
    skills: { languages: 'Cinema 4D · Octane Render · After Effects · Premiere Pro · 3D Modeling · Character Rigging' },
    experience: [
      { company: 'MotionFX Agency', location: 'Los Angeles, CA', title: 'Senior Motion Designer', duration: '03/2019 - Present', desc: '• Animated 3D product teasers for tech product launches generating 8M+ social views.' }
    ],
    education: [{ degree: 'B.F.A. in Animation', institution: 'CalArts', location: 'Valencia, CA', tenure: '2013 - 2017' }],
    achievements: [{ title: '8M+ Social Campaign Views', desc: 'Created 3D motion graphics for major product launch.' }]
  },

  'Civil Engineer': {
    name: 'Robert Lawson',
    role: 'Senior Civil Engineer | Infrastructure & Structural Engineering | AutoCAD',
    contact: { email: 'r.lawson@forgeindiaconnect.com', phone: '+1-(214)-555-8899', location: 'Dallas, TX', linkedin: 'linkedin.com/in/robertlawson-ce' },
    objective: 'Licensed Professional Engineer (PE) with 9+ years overseeing commercial & highway infrastructure projects up to $80M.',
    skills: { languages: 'Civil 3D · AutoCAD · Structural Design · Site Development · Project Management · Stormwater Management' },
    experience: [
      { company: 'TexBuild Engineering', location: 'Dallas, TX', title: 'Senior Civil Engineer', duration: '05/2017 - Present', desc: '• Managed design and construction oversight for $80M highway expansion project.' }
    ],
    education: [{ degree: 'B.S. in Civil Engineering', institution: 'Texas A&M University', location: 'College Station, TX', tenure: '2009 - 2013' }],
    achievements: [{ title: 'PE License Certification', desc: 'Licensed Professional Engineer in State of Texas.' }]
  },

  'Electrical Engineer': {
    name: 'Dr. Vikram Patel',
    role: 'Senior Electrical Engineer | PCB Design · Embedded Systems · Power Electronics',
    contact: { email: 'v.patel@forgeindiaconnect.com', phone: '+1-(408)-555-3322', location: 'San Jose, CA', linkedin: 'linkedin.com/in/vikrampatel-ee' },
    objective: 'Electrical Engineer with 8+ years designing high-speed PCB layouts, IoT hardware, and power management circuits.',
    skills: { languages: 'Altium Designer · C/C++ Embedded · PCB Layout · Oscilloscopes · Signal Integrity · FPGA' },
    experience: [
      { company: 'Silicon Circuitry', location: 'San Jose, CA', title: 'Senior Electrical Engineer', duration: '01/2018 - Present', desc: '• Designed 12-layer high-speed PCB circuit for IoT gateway device.' }
    ],
    education: [{ degree: 'Ph.D. in Electrical Engineering', institution: 'UC Berkeley', location: 'Berkeley, CA', tenure: '2011 - 2016' }],
    achievements: [{ title: '12-Layer PCB Gateway Design', desc: 'Engineered high-efficiency power management circuit.' }]
  },

  'Chemical Engineer': {
    name: 'Samantha Reed',
    role: 'Senior Chemical Engineer | Process Optimization · Aspen Plus · Refining',
    contact: { email: 's.reed@forgeindiaconnect.com', phone: '+1-(713)-555-4455', location: 'Houston, TX', linkedin: 'linkedin.com/in/samanthareed-cheme' },
    objective: 'Chemical Process Engineer with 7+ years optimizing industrial chemical plant operations, yields, and safety protocols.',
    skills: { languages: 'Aspen Plus · Process Safety Management (PSM) · Chemical Reaction Engineering · P&ID · HAZOP' },
    experience: [
      { company: 'Gulf Chemical Corp', location: 'Houston, TX', title: 'Senior Process Engineer', duration: '04/2018 - Present', desc: '• Optimized chemical reactor parameters, boosting annual plant product yield by 14%.' }
    ],
    education: [{ degree: 'B.S. in Chemical Engineering', institution: 'University of Texas at Austin', location: 'Austin, TX', tenure: '2011 - 2015' }],
    achievements: [{ title: '14% Yield Improvement', desc: 'Redesigned catalyst flow rate in primary synthesis reactor.' }]
  },

  'Chief Executive Officer': {
    name: 'Harrison Vance',
    role: 'Chief Executive Officer | Global Enterprise Scaling | Board Governance',
    contact: { email: 'h.vance@forgeindiaconnect.com', phone: '+1-(212)-555-1000', location: 'New York, NY', linkedin: 'linkedin.com/in/harrisonvance-ceo' },
    objective: 'Visionary CEO with 18+ years leading enterprise growth, fundraising ($150M+ Series A-D), and strategic M&A exits ($800M+ valuation).',
    skills: { languages: 'Executive Leadership · Venture Capital & Private Equity · Corporate M&A · Investor Relations · Strategic Vision' },
    experience: [
      { company: 'Nova Global Tech', location: 'New York, NY', title: 'Chief Executive Officer', duration: '01/2016 - Present', desc: '• Scaled company from 30 employees to 1,200+ globally, driving ARR from $2M to $110M.\n• Raised $150M in venture funding from top-tier VC firms.' }
    ],
    education: [{ degree: 'MBA', institution: 'Harvard Business School', location: 'Boston, MA', tenure: '2004 - 2006' }],
    achievements: [{ title: '$110M ARR Growth', desc: 'Led enterprise transformation and global market expansion.' }]
  },

  'VP of Sales': {
    name: 'Catherine Ross',
    role: 'VP of Global Sales | Revenue Generation | Enterprise SaaS Scaling',
    contact: { email: 'c.ross@forgeindiaconnect.com', phone: '+1-(312)-555-7711', location: 'Chicago, IL', linkedin: 'linkedin.com/in/catherineross-sales' },
    objective: 'Executive Sales Leader with 14+ years scaling annual recurring revenue (ARR) from $10M to $100M+ across international markets.',
    skills: { languages: 'Global Sales Strategy · GTM Execution · Enterprise Deals · Sales Team Leadership · Compensation Planning' },
    experience: [
      { company: 'CloudScale Global', location: 'Chicago, IL', title: 'VP of Global Sales', duration: '03/2018 - Present', desc: '• Led 90-person global sales organization generating $100M+ ARR.' }
    ],
    education: [{ degree: 'B.S. in Marketing', institution: 'Northwestern University', location: 'Evanston, IL', tenure: '2005 - 2009' }],
    achievements: [{ title: '$100M ARR Scaled', desc: 'Built enterprise sales engine spanning Americas, EMEA, and APAC.' }]
  },

  'Chief Technology Officer': {
    name: 'Dr. Alexander Wright',
    role: 'Chief Technology Officer (CTO) | Cloud Architecture & Engineering Leadership',
    contact: { email: 'a.wright@forgeindiaconnect.com', phone: '+1-(415)-555-8833', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/alexwright-cto' },
    objective: 'CTO with 16+ years building enterprise SaaS platforms, scaling 150+ person engineering organizations, and leading cloud modernizations.',
    skills: { languages: 'Technology Vision · Cloud Architecture · Engineering Leadership · AI Strategy · Cybersecurity Governance' },
    experience: [
      { company: 'OmniCloud Platform', location: 'San Francisco, CA', title: 'Chief Technology Officer', duration: '05/2017 - Present', desc: '• Led 150-person engineering & product team building multi-tenant SaaS platform.' }
    ],
    education: [{ degree: 'Ph.D. in Computer Science', institution: 'MIT', location: 'Cambridge, MA', tenure: '2003 - 2008' }],
    achievements: [{ title: '150-Person Engineering Org', desc: 'Scaled engineering department while maintaining high velocity.' }]
  },

  'Steve Jobs': {
    name: 'Steve Jobs',
    role: 'Co-Founder & CEO of Apple | Product Visionary & Designer',
    contact: { email: 'steve@apple.com', phone: '+1-(408)-996-1010', location: 'Cupertino, California', linkedin: 'linkedin.com/in/steve-jobs' },
    objective: 'Visionary leader who revolutionized personal computing, mobile devices, music, and digital publishing. Focused on simplicity, elegance, and technological perfection.',
    skills: { languages: 'Product Design · Visionary Leadership · Brand Innovation · Industrial Design · Typography · User Experience' },
    experience: [
      { company: 'Apple Inc.', location: 'Cupertino, CA', title: 'Chief Executive Officer', duration: '1997 - 2011', desc: '• Spearheaded design and launch of revolutionary products: iMac, iPod, iPhone, and iPad.\n• Built Apple into the world\'s most valuable technology company.' },
      { company: 'Pixar Animation Studios', location: 'Emeryville, CA', title: 'CEO & Majority Shareholder', duration: '1986 - 2006', desc: '• Produced Toy Story, the first feature-length computer-animated film.' }
    ],
    education: [{ degree: 'Audit Courses in Calligraphy & Design', institution: 'Reed College', location: 'Portland, OR', tenure: '1972 - 1974' }],
    achievements: [{ title: 'Inventor of iPhone & iPad', desc: 'Transformed mobile communication and computing worldwide.' }]
  },

  'Elon Musk': {
    name: 'Elon Musk',
    role: 'CEO & Chief Engineer of SpaceX & Tesla | Founder of Neuralink & xAI',
    contact: { email: 'elon@x.com', phone: '+1-(512)-555-0100', location: 'Austin, Texas', linkedin: 'x.com/elonmusk' },
    objective: 'Engineering innovator focused on accelerating sustainable energy adoption and making humanity a multi-planetary species.',
    skills: { languages: 'Rocket Engineering · EV Architecture · First-Principles Thinking · AI · Manufacturing Scaling · Autonomous Systems' },
    experience: [
      { company: 'SpaceX', location: 'Hawthorne, CA', title: 'CEO & Chief Engineer', duration: '2002 - Present', desc: '• Engineered Falcon 9 reusable rockets and Starship space exploration vehicles.' },
      { company: 'Tesla, Inc.', location: 'Austin, TX', title: 'Technoking & CEO', duration: '2004 - Present', desc: '• Led mass production of electric vehicles (Model S, 3, X, Y, Cybertruck).' }
    ],
    education: [{ degree: 'B.S. in Physics & Economics', institution: 'University of Pennsylvania', location: 'Philadelphia, PA', tenure: '1992 - 1997' }],
    achievements: [{ title: 'Reusable Spacecraft Pioneer', desc: 'First private company to launch, orbit, and recover a orbital rocket booster.' }]
  },

  'Albert Einstein': {
    name: 'Albert Einstein',
    role: 'Theoretical Physicist | Nobel Laureate | General Theory of Relativity',
    contact: { email: 'einstein@ias.edu', phone: '+1-(609)-734-8000', location: 'Princeton, New Jersey', linkedin: 'nobelprize.org/laureates/einstein' },
    objective: 'Nobel Prize-winning Theoretical Physicist who formulated the theories of Special and General Relativity, fundamental to modern physics.',
    skills: { languages: 'Theoretical Physics · Mathematical Modeling · Quantum Mechanics · Relativity Theory · Scientific Thought Experiments' },
    experience: [
      { company: 'Institute for Advanced Study', location: 'Princeton, NJ', title: 'Professor of Theoretical Physics', duration: '1933 - 1955', desc: '• Researched Unified Field Theory and quantum foundation paradoxes.' },
      { company: 'Prussian Academy of Sciences', location: 'Berlin, Germany', title: 'Director of Physics', duration: '1914 - 1932', desc: '• Formulated General Theory of Relativity explaining gravitational bending of light.' }
    ],
    education: [{ degree: 'Ph.D. in Physics', institution: 'University of Zurich', location: 'Zurich, Switzerland', tenure: '1905' }],
    achievements: [{ title: 'Nobel Prize in Physics (1921)', desc: 'Awarded for services to Theoretical Physics and discovery of Photoelectric Effect.' }]
  },

  'Head Chef': {
    name: 'Chef Antoine Laurent',
    role: 'Executive Head Chef | Michelin Star Dining | Farm-to-Table Cuisine',
    contact: { email: 'a.laurent@forgeindiaconnect.com', phone: '+1-(212)-555-6633', location: 'New York, NY', linkedin: 'linkedin.com/in/chef-antoine-laurent' },
    objective: 'Executive Head Chef with 12+ years leading Michelin-recognized kitchens, crafting seasonal menus, and managing kitchen inventory.',
    skills: { languages: 'Culinary Arts · Menu Design · Kitchen Management · French Gastronomy · Food Safety (ServSafe) · Inventory Control' },
    experience: [
      { company: 'Le Jardin Restaurant', location: 'New York, NY', title: 'Executive Head Chef', duration: '04/2018 - Present', desc: '• Awarded 2 Michelin stars for 4 consecutive years.\n• Curated seasonal tasting menus generating $4.5M in annual food revenue.' }
    ],
    education: [{ degree: 'Grand Diplôme in Culinary Arts', institution: 'Le Cordon Bleu', location: 'Paris, France', tenure: '2008 - 2011' }],
    achievements: [{ title: '2 Michelin Stars Maintained', desc: 'Recognized for culinary innovation and kitchen leadership.' }]
  },

  'Restaurant Manager': {
    name: 'Maria Santos',
    role: 'Restaurant General Manager | Hospitality Excellence | P&L Management',
    contact: { email: 'm.santos@forgeindiaconnect.com', phone: '+1-(305)-555-4422', location: 'Miami, FL', linkedin: 'linkedin.com/in/mariasantos-hospitality' },
    objective: 'Hospitality General Manager with 8+ years managing high-volume fine dining establishments ($6M+ annual revenue).',
    skills: { languages: 'Restaurant Operations · Staff Training · POS Systems (Toast) · Inventory Auditing · Guest Relations · P&L Management' },
    experience: [
      { company: 'Ocean Prime Dining', location: 'Miami, FL', title: 'General Manager', duration: '02/2019 - Present', desc: '• Managed daily front-of-house & back-of-house operations for 180-seat restaurant.' }
    ],
    education: [{ degree: 'B.S. in Hospitality Management', institution: 'Florida International University', location: 'Miami, FL', tenure: '2011 - 2015' }],
    achievements: [{ title: '$6M+ Annual Revenue Operations', desc: 'Increased annual dining revenue by 22% via floor service optimization.' }]
  },

  'Mixologist / Bartender': {
    name: 'Julian Drake',
    role: 'Master Mixologist & Beverage Director | Craft Cocktails & Menu Design',
    contact: { email: 'j.drake@forgeindiaconnect.com', phone: '+1-(702)-555-8833', location: 'Las Vegas, NV', linkedin: 'linkedin.com/in/juliandrake-mixology' },
    objective: 'Award-winning Mixologist with 7+ years crafting bespoke cocktail programs for luxury hotel lounges and upscale speakeasies.',
    skills: { languages: 'Craft Cocktails · Beverage Costing · Spirits Pairing · Bar Operations · Menu Creation · High-Volume Service' },
    experience: [
      { company: 'The Velvet Lounge', location: 'Las Vegas, NV', title: 'Beverage Director & Head Mixologist', duration: '05/2019 - Present', desc: '• Created signature cocktail program boosting bar profit margin by 35%.' }
    ],
    education: [{ degree: 'Master Mixologist Certification', institution: 'USBG', location: 'Las Vegas, NV', tenure: '2016' }],
    achievements: [{ title: 'Best Cocktail Bar 2023', desc: 'Awarded Top Mixologist by Las Vegas Dining Review.' }]
  },

  'Freelance Consultant': {
    name: 'Derek Morgan',
    role: 'Independent Strategy & Growth Consultant | B2B Scale-ups',
    contact: { email: 'd.morgan@forgeindiaconnect.com', phone: '+1-(415)-555-1199', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/derekmorgan-consultant' },
    objective: 'Independent Strategy Consultant with 8+ years helping SaaS and eCommerce startups scale operations and unlock new market growth.',
    skills: { languages: 'Growth Consulting · Go-To-Market Strategy · Business Audits · Financial Planning · Pitch Decks' },
    experience: [
      { company: 'Morgan Advisory LLC', location: 'San Francisco, CA', title: 'Principal Consultant', duration: '01/2018 - Present', desc: '• Advised 20+ Series A-C startups on go-to-market execution, boosting client revenue by average 45%.' }
    ],
    education: [{ degree: 'B.S. in Economics', institution: 'UC Berkeley', location: 'Berkeley, CA', tenure: '2010 - 2014' }],
    achievements: [{ title: '20+ Startup Clients Scaled', desc: 'Drove strategic growth advisory generating $15M+ client value.' }]
  },

  'Freelance Web Dev': {
    name: 'Nora Vance',
    role: 'Freelance Full-Stack Developer | React · Node.js · Shopify · Webflow',
    contact: { email: 'n.vance@forgeindiaconnect.com', phone: '+1-(503)-555-2277', location: 'Portland, OR', linkedin: 'linkedin.com/in/noravance-dev' },
    objective: 'Freelance Developer with 6+ years building custom web applications, eCommerce stores, and API integrations for global clients.',
    skills: { languages: 'React · Node.js · TypeScript · Shopify Liquid · Webflow · Tailwind CSS · GraphQL' },
    experience: [
      { company: 'NoraVance Code Studio', location: 'Portland, OR', title: 'Freelance Full-Stack Developer', duration: '06/2019 - Present', desc: '• Built custom web applications and Shopify stores for 40+ international clients.' }
    ],
    education: [{ degree: 'B.S. in Computer Science', institution: 'Portland State University', location: 'Portland, OR', tenure: '2014 - 2018' }],
    achievements: [{ title: '40+ Projects Delivered', desc: 'Maintained 5.0 rating on Upwork and independent client reviews.' }]
  },

  'Federal Project Manager': {
    name: 'Commander Jonathan Vance',
    role: 'Senior Federal Project Manager | PMP | IT Infrastructure & Cybersecurity',
    contact: { email: 'j.vance@fedgov.example', phone: '+1-(202)-555-0144', location: 'Washington, D.C.', linkedin: 'linkedin.com/in/jonathanvance-gov' },
    objective: 'PMP-certified Federal Project Manager with 10+ years leading multi-million dollar defense & civilian agency IT projects.',
    skills: { languages: 'Federal PM (FAR) · PMP · NIST Cybersecurity · Government Contracting · Earned Value Management (EVM)' },
    experience: [
      { company: 'Department of Veterans Affairs', location: 'Washington, D.C.', title: 'Senior Federal Project Manager', duration: '03/2017 - Present', desc: '• Managed $45M IT modernization program upgrading healthcare records systems across 20 hospitals.' }
    ],
    education: [{ degree: 'M.S. in Project Management', institution: 'George Washington University', location: 'Washington, D.C.', tenure: '2011 - 2013' }],
    achievements: [{ title: '$45M Federal IT Program Delivered', desc: 'Achieved 100% compliance with FAR and NIST regulations.' }]
  },

  'Public Policy Analyst': {
    name: 'Dr. Evelyn Reed',
    role: 'Senior Policy Analyst | Legislative Strategy · Environmental & Economic Policy',
    contact: { email: 'e.reed@forgeindiaconnect.com', phone: '+1-(202)-555-3388', location: 'Washington, D.C.', linkedin: 'linkedin.com/in/evelynreed-policy' },
    objective: 'Policy Analyst with 7+ years researching environmental regulation, drafting legislative briefs, and advising congressional committees.',
    skills: { languages: 'Public Policy Research · Econometrics · Legislative Briefings · Data Analysis (STATA) · Stakeholder Engagement' },
    experience: [
      { company: 'Policy Research Institute', location: 'Washington, D.C.', title: 'Senior Policy Analyst', duration: '05/2018 - Present', desc: '• Authored 12 policy briefs cited in federal clean energy legislation.' }
    ],
    education: [{ degree: 'Ph.D. in Public Policy', institution: 'Georgetown University', location: 'Washington, D.C.', tenure: '2013 - 2018' }],
    achievements: [{ title: '12 Published Legislative Briefs', desc: 'Influenced federal clean energy legislative standards.' }]
  },

  'Government Specialist': {
    name: 'Marcus Brody',
    role: 'Government Operations Specialist | Grants Management & Compliance',
    contact: { email: 'm.brody@forgeindiaconnect.com', phone: '+1-(202)-555-7799', location: 'Washington, D.C.', linkedin: 'linkedin.com/in/marcusbrody-gov' },
    objective: 'Government Operations Specialist with 8+ years managing federal grant programs ($50M+ distribution) and agency compliance audits.',
    skills: { languages: 'Grants.gov · Federal Regulatory Compliance · Audit Preparation · Agency Operations · Budget Oversight' },
    experience: [
      { company: 'Federal Grant Administration', location: 'Washington, D.C.', title: 'Operations Specialist', duration: '02/2018 - Present', desc: '• Administered $50M in federal education grants with 100% audit accuracy.' }
    ],
    education: [{ degree: 'B.A. in Political Science', institution: 'American University', location: 'Washington, D.C.', tenure: '2011 - 2015' }],
    achievements: [{ title: '$50M Federal Grants Audited', desc: 'Maintained 0 error rate across multi-state grant disbursements.' }]
  },

  'Foreign Service Officer': {
    name: 'Ambassador Thomas Sterling',
    role: 'Senior Foreign Service Officer | Diplomatic Relations & International Trade',
    contact: { email: 't.sterling@state.gov.example', phone: '+1-(202)-555-9911', location: 'Washington, D.C.', linkedin: 'linkedin.com/in/thomassterling-fso' },
    objective: 'Diplomatic Officer with 12+ years representing national interests abroad, negotiating trade agreements, and managing embassy operations.',
    skills: { languages: 'International Relations · Foreign Languages (French, Arabic) · Diplomatic Negotiation · Crisis Management' },
    experience: [
      { company: 'U.S. Department of State', location: 'Washington, D.C. / Overseas', title: 'Senior Foreign Service Officer', duration: '09/2012 - Present', desc: '• Negotiated bilateral trade agreements unlocking $200M in export markets.' }
    ],
    education: [{ degree: 'M.A. in International Affairs', institution: 'Fletcher School at Tufts', location: 'Medford, MA', tenure: '2008 - 2010' }],
    achievements: [{ title: '$200M Trade Deal Negotiated', desc: 'Led diplomatic mission securing bilateral trade pact.' }]
  },

  'Registered Nurse': {
    name: 'Sarah Jenkins, RN',
    role: 'Registered Nurse (BSN, RN) | ICU & Critical Care Nursing',
    contact: { email: 's.jenkins@forgeindiaconnect.com', phone: '+1-(617)-555-1144', location: 'Boston, MA', linkedin: 'linkedin.com/in/sarahjenkins-rn' },
    objective: 'Compassionate ICU Registered Nurse with 7+ years delivering critical patient care in Level 1 Trauma Centers.',
    skills: { languages: 'Critical Care (ICU) · Patient Triage · Ventilator Management · BLS/ACLS Certified · EHR (Epic) · Pharmacology' },
    experience: [
      { company: 'Boston General Hospital', location: 'Boston, MA', title: 'ICU Staff Nurse (BSN, RN)', duration: '06/2018 - Present', desc: '• Managed care for critically ill patients in 24-bed intensive care unit with high survival recovery rates.' }
    ],
    education: [{ degree: 'Bachelor of Science in Nursing (BSN)', institution: 'Northeastern University', location: 'Boston, MA', tenure: '2012 - 2016' }],
    achievements: [{ title: 'Daisy Award Winner 2022', desc: 'Recognized for nursing excellence and extraordinary patient care.' }]
  },

  'Medical Assistant': {
    name: 'Emily Watson, CMA',
    role: 'Certified Medical Assistant (CMA) | Clinical & Administrative Support',
    contact: { email: 'e.watson@forgeindiaconnect.com', phone: '+1-(312)-555-6655', location: 'Chicago, IL', linkedin: 'linkedin.com/in/emilywatson-cma' },
    objective: 'Certified Medical Assistant with 5+ years providing clinical triage, patient intake, and EHR management for busy outpatient clinics.',
    skills: { languages: 'Clinical Triage · Vital Signs · Phlebotomy · EHR (Cerner, Epic) · Patient Scheduling · Medical Billing' },
    experience: [
      { company: 'Chicago Medical Clinic', location: 'Chicago, IL', title: 'Certified Medical Assistant', duration: '04/2020 - Present', desc: '• Conducted patient vitals intake and laboratory blood draws for 40+ daily patients.' }
    ],
    education: [{ degree: 'Associate in Applied Science (Medical Assisting)', institution: 'Malcolm X College', location: 'Chicago, IL', tenure: '2016 - 2018' }],
    achievements: [{ title: 'Certified Medical Assistant (AAMA)', desc: 'Maintained 100% active CMA credential.' }]
  },

  'Healthcare Administrator': {
    name: 'Dr. Arthur Pendelton',
    role: 'Healthcare Operations Administrator | Hospital Management & HIPAA',
    contact: { email: 'a.pendelton@forgeindiaconnect.com', phone: '+1-(404)-555-8800', location: 'Atlanta, GA', linkedin: 'linkedin.com/in/arthurpendelton-ha' },
    objective: 'Healthcare Administrator with 11+ years directing clinical operations, hospital staff workflow, and healthcare regulatory compliance.',
    skills: { languages: 'Healthcare Operations · HIPAA & Joint Commission Compliance · Clinical Budgeting · Staff Management' },
    experience: [
      { company: 'Atlanta Health System', location: 'Atlanta, GA', title: 'Healthcare Operations Director', duration: '01/2016 - Present', desc: '• Managed clinical department operations supporting 250+ healthcare staff.' }
    ],
    education: [{ degree: 'Master of Health Administration (MHA)', institution: 'Emory University', location: 'Atlanta, GA', tenure: '2008 - 2011' }],
    achievements: [{ title: 'Joint Commission Gold Seal Accreditation', desc: 'Achieved 100% audit pass rate for hospital clinical operations.' }]
  },

  'HR Manager': {
    name: 'Rachel Green',
    role: 'Human Resources Manager | Employee Relations · Talent Strategy · SHRM-SCP',
    contact: { email: 'r.green@forgeindiaconnect.com', phone: '+1-(212)-555-9944', location: 'New York, NY', linkedin: 'linkedin.com/in/rachelgreen-hr' },
    objective: 'SHRM-SCP certified HR Manager with 8+ years leading employee engagement, performance management, and HR operations for 600+ staff.',
    skills: { languages: 'Employee Relations · SHRM-SCP · Performance Management · HRIS (Workday, BambooHR) · Onboarding & Offboarding' },
    experience: [
      { company: 'Manhattan Tech Corp', location: 'New York, NY', title: 'Human Resources Manager', duration: '03/2019 - Present', desc: '• Oversee HR policies, benefits administration, and talent retention programs for 600 employees.' }
    ],
    education: [{ degree: 'B.A. in Psychology & Human Resources', institution: 'NYU', location: 'New York, NY', tenure: '2011 - 2015' }],
    achievements: [{ title: '25% Retention Improvement', desc: 'Implemented career ladder frameworks and employee wellness initiatives.' }]
  },

  'Talent Acquisition': {
    name: 'Jason Miller',
    role: 'Senior Technical Recruiter | Executive Search · Tech Recruiting',
    contact: { email: 'j.miller@forgeindiaconnect.com', phone: '+1-(415)-555-2200', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/jasonmiller-recruiter' },
    objective: 'Technical Recruiter with 6+ years placing software engineers, engineering managers, and executive tech leaders at high-growth startups.',
    skills: { languages: 'Technical Sourcing · LinkedIn Recruiter · ATS (Greenhouse, Lever) · Offer Negotiation · Executive Search' },
    experience: [
      { company: 'Silicon Talent Group', location: 'San Francisco, CA', title: 'Senior Technical Recruiter', duration: '05/2019 - Present', desc: '• Placed 120+ software engineers and engineering directors with an average time-to-hire of 28 days.' }
    ],
    education: [{ degree: 'B.S. in Communications', institution: 'San Jose State University', location: 'San Jose, CA', tenure: '2013 - 2017' }],
    achievements: [{ title: '120+ Tech Placements', desc: 'Maintained 95% 1-year engineer retention rate at client companies.' }]
  },

  'Attorney / Lawyer': {
    name: 'Victoria Sterling, Esq.',
    role: 'Corporate Counsel & Senior Attorney | M&A · Intellectual Property · Litigation',
    contact: { email: 'v.sterling@lawfirm.example', phone: '+1-(212)-555-3311', location: 'New York, NY', linkedin: 'linkedin.com/in/victoriasterling-esq' },
    objective: 'Licensed Corporate Attorney with 9+ years advising technology & financial corporations on commercial contracts, M&A, and IP litigation.',
    skills: { languages: 'Corporate Law · M&A Deal Drafting · Contract Negotiation · Intellectual Property · Litigation Defense' },
    experience: [
      { company: 'Sterling & Partners LLP', location: 'New York, NY', title: 'Senior Corporate Attorney', duration: '01/2018 - Present', desc: '• Drafted and negotiated commercial contracts valued at $300M+ for corporate tech clients.' }
    ],
    education: [{ degree: 'Juris Doctor (J.D.)', institution: 'Columbia Law School', location: 'New York, NY', tenure: '2010 - 2013' }],
    achievements: [{ title: 'Admitted to NY State Bar', desc: 'Active member of American Bar Association in Corporate Law.' }]
  },

  'Paralegal': {
    name: 'Nathan Drake',
    role: 'Certified Senior Paralegal | Legal Research · Trial Prep · Corporate Filings',
    contact: { email: 'n.drake@forgeindiaconnect.com', phone: '+1-(312)-555-7744', location: 'Chicago, IL', linkedin: 'linkedin.com/in/nathandrake-paralegal' },
    objective: 'Certified Senior Paralegal with 6+ years supporting trial attorneys in complex civil litigation, discovery management, and legal research.',
    skills: { languages: 'Legal Research (Westlaw, LexisNexis) · E-Discovery · Trial Exhibits · Deposition Preparation · Docketing' },
    experience: [
      { company: 'Chicago Legal Partners', location: 'Chicago, IL', title: 'Senior Paralegal', duration: '04/2019 - Present', desc: '• Prepared trial exhibits and legal briefs for 35+ high-stakes commercial litigation trials.' }
    ],
    education: [{ degree: 'B.A. in Legal Studies', institution: 'Loyola University Chicago', location: 'Chicago, IL', tenure: '2014 - 2018' }],
    achievements: [{ title: 'Certified Paralegal (NALA)', desc: 'Maintained active Certified Paralegal credential.' }]
  },

  'SEO Specialist': {
    name: 'Alex Turner',
    role: 'Senior SEO Manager | Technical SEO · Organic Growth · Content Strategy',
    contact: { email: 'a.turner@forgeindiaconnect.com', phone: '+1-(206)-555-8822', location: 'Seattle, WA', linkedin: 'linkedin.com/in/alexturner-seo' },
    objective: 'Technical SEO Specialist with 6+ years driving organic growth for enterprise websites. Increased organic search traffic by 320% in 18 months.',
    skills: { languages: 'Technical SEO · Screaming Frog · Ahrefs / SEMrush · Google Search Console · Schema Markup · Site Architecture' },
    experience: [
      { company: 'SearchGrowth Agency', location: 'Seattle, WA', title: 'Senior SEO Manager', duration: '03/2019 - Present', desc: '• Managed SEO strategy for 15 enterprise SaaS clients, driving 320% organic traffic increase.' }
    ],
    education: [{ degree: 'B.S. in Computer Information Systems', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2013 - 2017' }],
    achievements: [{ title: '320% Organic Search Traffic Growth', desc: 'Fixed technical crawl errors and optimized site architecture.' }]
  },

  'Brand Manager': {
    name: 'Sophia Laurent',
    role: 'Global Brand Manager | Brand Positioning · Product Marketing · PR',
    contact: { email: 's.laurent@forgeindiaconnect.com', phone: '+1-(212)-555-5511', location: 'New York, NY', linkedin: 'linkedin.com/in/sophialaurent-brand' },
    objective: 'Brand Manager with 7+ years managing multi-million dollar global brand campaigns, market positioning, and product launches for CPG brands.',
    skills: { languages: 'Brand Strategy · Product Marketing · PR & Communications · Campaign Execution · Market Research' },
    experience: [
      { company: 'Lux Brand Holdings', location: 'New York, NY', title: 'Global Brand Manager', duration: '06/2018 - Present', desc: '• Directed $15M annual brand campaign launching new luxury product line across North America.' }
    ],
    education: [{ degree: 'B.S. in Marketing', institution: 'NYU Stern School of Business', location: 'New York, NY', tenure: '2011 - 2015' }],
    achievements: [{ title: '$15M Brand Campaign Launch', desc: 'Increased brand equity score by 40% in post-campaign surveys.' }]
  },

  'Account Executive': {
    name: 'Marcus Vance',
    role: 'Senior Enterprise Account Executive | B2B SaaS Sales · Quota Crusher',
    contact: { email: 'm.vance@forgeindiaconnect.com', phone: '+1-(415)-555-6600', location: 'San Francisco, CA', linkedin: 'linkedin.com/in/marcusvance-ae' },
    objective: 'Enterprise Account Executive with 6+ years selling high-ticket SaaS solutions to Fortune 500 accounts. Consistently achieved 140%+ of annual quota.',
    skills: { languages: 'B2B SaaS Sales · Enterprise Account Closing · MEDDIC · Salesforce CRM · Contract Negotiation' },
    experience: [
      { company: 'CloudScale SaaS', location: 'San Francisco, CA', title: 'Senior Enterprise AE', duration: '01/2020 - Present', desc: '• Closed $4.2M in new ARR across 12 Fortune 500 enterprise accounts in 2023.' }
    ],
    education: [{ degree: 'B.A. in Economics', institution: 'UC Berkeley', location: 'Berkeley, CA', tenure: '2013 - 2017' }],
    achievements: [{ title: '140% Quota Achievement', desc: 'Finished #1 Account Executive out of 45-person sales organization.' }]
  },

  'Business Development': {
    name: 'Elena Rostova',
    role: 'Director of Business Development | Strategic Partnerships & Alliances',
    contact: { email: 'e.rostova@forgeindiaconnect.com', phone: '+1-(212)-555-8877', location: 'New York, NY', linkedin: 'linkedin.com/in/elenarostova-bizdev' },
    objective: 'Business Development Executive with 8+ years structuring revenue-generating strategic partnerships, channel distribution, and co-marketing deals.',
    skills: { languages: 'Strategic Partnerships · Channel Sales · Deal Structuring · B2B Contract Negotiation · Executive Presentation' },
    experience: [
      { company: 'Partnership Alliance Group', location: 'New York, NY', title: 'Director of Business Development', duration: '04/2018 - Present', desc: '• Negotiated 15 strategic distribution partnerships generating $12M in annual co-sell revenue.' }
    ],
    education: [{ degree: 'B.S. in International Business', institution: 'Columbia University', location: 'New York, NY', tenure: '2010 - 2014' }],
    achievements: [{ title: '$12M Co-Sell Revenue', desc: 'Established strategic channel partnership program with tier-1 tech partners.' }]
  }
};

const getDefaultData = (roleTitle) => {
  if (!roleTitle) return resumeDataByRole['Project Manager'];
  if (resumeDataByRole[roleTitle]) return resumeDataByRole[roleTitle];

  // Case-insensitive & partial match fallback lookup
  const lowerTitle = roleTitle.toLowerCase().trim();
  const matchedKey = Object.keys(resumeDataByRole).find(key => key.toLowerCase().trim() === lowerTitle || lowerTitle.includes(key.toLowerCase().trim()));
  if (matchedKey && resumeDataByRole[matchedKey]) {
    return resumeDataByRole[matchedKey];
  }

  const cleanTitle = roleTitle || 'Professional';
  return {
    name: `${cleanTitle} Specialist`,
    role: `${cleanTitle} | Experienced Industry Professional`,
    contact: { email: `${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`, phone: '+1-(555)-234-5678', location: 'New York, NY', linkedin: `linkedin.com/in/${cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}` },
    objective: `Results-driven ${cleanTitle} with 5+ years of hands-on experience optimizing workflows, executing high-impact initiatives, and driving performance improvements across enterprise environments.`,
    skills: { languages: `${cleanTitle} Strategy · Operations Management · Data Analysis · Project Execution · Cross-Functional Leadership · Workflow Optimization` },
    experience: [
      { company: `Enterprise ${cleanTitle} Solutions Inc.`, location: 'New York, NY', title: `Lead ${cleanTitle}`, duration: '2022 - Present', desc: `• Spearheaded multi-million dollar operational initiatives using ${cleanTitle} best practices, resulting in a 32% increase in project delivery speed.\n• Mentored and led a high-performing team of 8+ specialists, achieving a 98% quality audit score across all department deliverables.\n• Automated routine tracking workflows, reducing manual error rates by 40% YoY.` },
      { company: 'Vanguard Global Systems', location: 'Austin, TX', title: `Senior ${cleanTitle}`, duration: '2019 - 2022', desc: `• Orchestrated end-to-end execution of high-priority client assignments using ${cleanTitle} frameworks.\n• Designed and implemented standardized SOP protocols that decreased operational overhead costs by $180,000 annually.` }
    ],
    education: [{ degree: `B.S. in Engineering & Business`, institution: 'University of Washington', location: 'Seattle, WA', tenure: '2015 - 2019' }],
    achievements: [
      { title: '30% Efficiency Gain', desc: `Led key initiative workflows resulting in YoY performance improvements.` },
      { title: '100% Compliance', desc: `Audited enterprise financial procedures with 0 discrepancy rating.` }
    ]
  };
};

const RESUME_FULL_WIDTH = 794; // 210mm at 96dpi = 794px

const IndustryExamples = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState('Most Popular Resume Examples');
  const [selectedRoleTitle, setSelectedRoleTitle] = useState('Project Manager');
  const [previewContainerWidth, setPreviewContainerWidth] = useState(720);
  const [previewContentHeight, setPreviewContentHeight] = useState(1122);
  const [userZoom, setUserZoom] = useState(1);
  const resumeSheetRef = React.useRef(null);
  const previewRef = React.useRef(null);

  useEffect(() => {
    const rawHash = location.hash ? location.hash.replace('#', '').toLowerCase().trim() : '';
    if (rawHash && categorySlugMap[rawHash]) {
      const catName = categorySlugMap[rawHash];
      setSelectedCategory(catName);
      const categoryRoles = initialRoles.filter(r => r.category === catName || r.altCategory === catName);
      if (categoryRoles.length > 0) {
        setSelectedRoleTitle(categoryRoles[0].title);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    const updateWidth = () => {
      if (previewRef.current) {
        const availableWidth = previewRef.current.offsetWidth - 32;
        setPreviewContainerWidth(Math.max(580, Math.min(availableWidth, 794)));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    try {
      startSession("/industry-examples");
      trackEvent("Viewed Resume Examples", "/industry-examples");
    } catch (e) {}
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoles = useMemo(() => {
    return initialRoles.filter(role => {
      const q = searchQuery.toLowerCase().trim();
      if (q) return role.title.toLowerCase().includes(q) || role.category.toLowerCase().includes(q);
      return role.category === selectedCategory || role.altCategory === selectedCategory;
    });
  }, [selectedCategory, searchQuery]);

  const activeRole = useMemo(() => {
    const matched = filteredRoles.find(r => r.title === selectedRoleTitle);
    if (matched) return matched;
    return filteredRoles[0] || initialRoles[0];
  }, [selectedRoleTitle, filteredRoles]);

  const currentResumeData = useMemo(() => {
    return getDefaultData(activeRole.title);
  }, [activeRole]);

  // Measure actual resume content height after each role change
  // (must be after activeRole + currentResumeData are declared)
  useEffect(() => {
    const measure = () => {
      if (resumeSheetRef.current) {
        const naturalH = resumeSheetRef.current.scrollHeight;
        setPreviewContentHeight(Math.max(1122, naturalH));
      }
    };
    const t = setTimeout(measure, 150);
    return () => clearTimeout(t);
  }, [activeRole, currentResumeData, previewContainerWidth]);

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setSearchQuery('');
    const slug = getSlugByCategory(catName);
    navigate(`/industry-examples#${slug}`, { replace: true });
    const categoryRoles = initialRoles.filter(r => r.category === catName || r.altCategory === catName);
    if (categoryRoles.length > 0) {
      setSelectedRoleTitle(categoryRoles[0].title);
    }
  };

  const handleUseTemplate = () => {
    localStorage.setItem('source', 'template');
    const routeMap = { enhancv: '/editor/enhancv', modern: '/editor/modern', creative: '/editor/creative', professional: '/editor/professional', minimal: '/editor/minimal' };
    const editorRoute = routeMap[activeRole.layout] || '/editor/executive';
    // Convert skills.languages string (dot-separated) to an array
    const skillsArray = (currentResumeData.skills?.languages || '')
      .split('·')
      .map(s => s.trim())
      .filter(Boolean);

    // Map training entries → certificates format expected by the editor
    const certificates = (currentResumeData.training || []).map(t => ({
      id: Date.now() + Math.random(),
      name: t.title || '',
      organization: t.org || '',
      year: t.year || ''
    }));

    // Map projects (some roles store them under currentResumeData.projects)
    const projects = (currentResumeData.projects || []).map(p => ({
      id: Date.now() + Math.random(),
      name: p.title || p.name || '',
      technology: p.technology || '',
      desc: p.desc || p.description || ''
    }));

    // Map experience — normalise title/role field names
    const experience = (currentResumeData.experience || []).map(e => ({
      id: Date.now() + Math.random(),
      role: e.title || e.role || e.position || '',
      company: e.company || '',
      duration: e.duration || '',
      desc: e.desc || e.description || ''
    }));

    // Map education — normalise field names
    const education = (currentResumeData.education || []).map(e => ({
      id: Date.now() + Math.random(),
      degree: e.degree || '',
      institution: e.institution || e.school || '',
      tenure: e.tenure || e.year || '',
      cgpa: e.cgpa || ''
    }));

    // Achievements
    const achievements = (currentResumeData.achievements || []).map(a => ({
      id: Date.now() + Math.random(),
      title: a.title || '',
      desc: a.desc || a.description || ''
    }));

    // Languages list
    const languagesList = (currentResumeData.languagesList || []).map(l => ({
      id: Date.now() + Math.random(),
      name: l.name || '',
      level: l.level || ''
    }));

    const templateSettings = {
      color: activeRole.color || '#0369a1',
      fontFamily: "'Inter', sans-serif",
      headingSize: 24,
      bodySize: 14,
      layoutMode: 'left-sidebar',
      spacingDensity: 'normal'
    };

    const sessionData = {
      title: `${activeRole.title} Resume`,
      templateId: activeRole.layout || 'modern',
      color: templateSettings.color,
      font: templateSettings.fontFamily,
      settings: templateSettings,
      personalInfo: {
        name: currentResumeData.name || '',
        role: currentResumeData.role || '',
        email: currentResumeData.contact?.email || '',
        phone: currentResumeData.contact?.phone || '',
        location: currentResumeData.contact?.location || '',
        linkedin: currentResumeData.contact?.linkedin || '',
        github: currentResumeData.contact?.github || '',
        portfolio: currentResumeData.contact?.portfolio || '',
        summary: currentResumeData.objective || ''
      },
      skills: {
        programming: skillsArray,
        frameworks: [],
        databases: []
      },
      experience,
      education,
      projects,
      certificates,
      achievements,
      languagesList
    };

    const newSessionId = 'session_' + Date.now();
    localStorage.setItem('activeResumeSessionId', newSessionId);
    localStorage.setItem(`resume_draft_${newSessionId}`, JSON.stringify(sessionData));
    localStorage.setItem('localResumeDraft', JSON.stringify(sessionData));

    try {
      trackEvent(`Selected Template Example: ${activeRole.title}`, `${editorRoute}/${newSessionId}`, {
        resumeCreated: true,
        resumeName: currentResumeData.name || null,
        email: currentResumeData.contact?.email || null
      });
    } catch (e) {}

    navigate(`${editorRoute}/${newSessionId}`);
  };

  const renderPreviewLayout = () => {
    const templateSettings = {
      color: activeRole.color || '#0369a1',
      fontFamily: "'Inter', sans-serif",
      headingSize: 24,
      bodySize: 14,
      layoutMode: 'left-sidebar',
      spacingDensity: 'normal'
    };
    
    // Default sections to match Editor
    const sections = [
      { id: 'summary', title: 'Summary', enabled: true },
      { id: 'experience', title: 'Experience', enabled: true },
      { id: 'education', title: 'Education', enabled: true },
      { id: 'skills', title: 'Skills', enabled: true },
      { id: 'certifications', title: 'Certifications', enabled: true },
    ];

    // Transform currentResumeData into the EXACT shape expected by Editor's previewData
    // This ensures 100% visual parity between Industry Examples and the Editor (e.g. skills arrays vs strings)
    const editorPreviewData = {
      name: currentResumeData.name || '',
      role: currentResumeData.role || '',
      contact: currentResumeData.contact || {},
      objective: currentResumeData.objective || currentResumeData.summary || '',
      skills: [
        ...((currentResumeData.skills?.languages || '').split('·').map(s => s.trim())),
        ...(currentResumeData.skills?.frameworks || []),
        ...(currentResumeData.skills?.databases || [])
      ].filter(Boolean),
      experience: (currentResumeData.experience || []).map(e => ({
        title: e.title || e.role || '',
        company: e.company || '',
        duration: e.duration || '',
        desc: e.desc || e.description || ''
      })),
      education: (currentResumeData.education || []).map(e => ({
        degree: e.degree || '',
        institution: e.institution || e.school || '',
        tenure: e.tenure || e.year || ''
      })),
      projects: [],
      training: (currentResumeData.certificates || currentResumeData.training || []).map(c => ({
        title: c.name || c.title || '',
        org: c.organization || c.org || '',
        year: c.year || ''
      })),
      certifications: (currentResumeData.certificates || currentResumeData.training || []).map(c => ({
        id: Math.random(),
        name: c.name || c.title || '',
        org: c.organization || c.org || '',
        year: c.year || ''
      })),
      languagesList: (currentResumeData.languagesList || []).map(l => `${l.name}${l.level ? ' (' + l.level + ')' : ''}`).filter(Boolean),
      achievements: currentResumeData.achievements || [],
      signature: currentResumeData.signature
    };

    const props = { 
      data: editorPreviewData, 
      customColor: templateSettings.color, 
      customFont: templateSettings.fontFamily,
      headingSize: templateSettings.headingSize,
      fontSize: templateSettings.bodySize,
      layoutMode: templateSettings.layoutMode,
      spacing: templateSettings.spacingDensity,
      sections: sections
    };
    switch (activeRole.layout) {
      case 'modern':       return <ModernLayout {...props} />;
      case 'creative':     return <CreativeLayout {...props} />;
      case 'professional': return <ProfessionalLayout {...props} />;
      case 'minimal':      return <MinimalLayout {...props} />;
      default:             return <EnhancvLayout {...props} />;
    }
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#f8fafc', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexShrink: 0 }}><Navbar /></div>

      <div className="ie-page-container" style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* COL 1: Sidebar Categories */}
        <div className="ie-col-scroll ie-col-categories" style={{ width: '190px', flexShrink: 0, background: '#eaf4fe', padding: '1.5rem 0.9rem', overflowY: 'auto', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3b82f6', margin: '0 0 1rem', paddingBottom: '0.2rem', borderBottom: '2px solid #60a5fa', display: 'inline-block' }}>
            Categories
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {categoryList.map(catName => {
              const isActive = selectedCategory === catName && !searchQuery;
              return (
                <button
                  key={catName}
                  onClick={() => handleCategoryClick(catName)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.2rem 0',
                    color: isActive ? '#6d28d9' : '#334155',
                    fontSize: '0.84rem',
                    fontWeight: isActive ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#2563eb'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#334155'; }}
                >
                  {catName}
                </button>
              );
            })}
          </div>
        </div>

        {/* COL 2: Search + Role Grid Cards */}
        <div className="ie-col-scroll ie-col-roles" style={{ width: '260px', flexShrink: 0, background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '1.5rem 1rem', overflowY: 'auto', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem', letterSpacing: '-0.01em' }}>
            Search Resume Examples
          </h1>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.7rem 0.85rem 0.7rem 2.4rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem', outline: 'none', background: '#f9fafb', boxSizing: 'border-box' }}
            />
          </div>

          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.85rem' }}>
            {searchQuery ? `Results for "${searchQuery}"` : selectedCategory}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {filteredRoles.map(r => {
              const isSelected = activeRole.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoleTitle(r.title)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0.75rem 0.4rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #10b981' : '1px solid #d1d5db',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none'
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#9ca3af'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#d1d5db'; }}
                >
                  <span style={{ color: isSelected ? '#059669' : '#374151', fontSize: '0.84rem', fontWeight: isSelected ? 700 : 500, textAlign: 'center' }}>
                    {r.title}
                  </span>
                  {isSelected && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUseTemplate(); }}
                      style={{
                        marginTop: '0.4rem',
                        padding: '0.35rem 0',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '90%',
                        alignSelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      <Edit3 size={12} /> Use Template
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COL 3: Live Preview Header Bar & Centered Scaled Resume */}
        <div ref={previewRef} className="ie-col-scroll" style={{ flex: 1, background: '#f1f5f9', padding: '1.5rem 1.75rem 3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', overflowX: 'auto', boxSizing: 'border-box', position: 'relative' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* HEADER BAR: Title on left, Zoom controls + Green Button on right */}
            <div style={{ width: '100%', maxWidth: `${Math.max(previewContainerWidth, 794)}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                {activeRole.title} Resume Example
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Zoom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0.25rem 0.5rem', gap: '0.35rem' }}>
                  <button onClick={() => setUserZoom(z => Math.max(0.7, z - 0.1))} title="Zoom Out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                    <ZoomOut size={16} />
                  </button>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', minWidth: '40px', textAlign: 'center' }}>
                    {Math.round(userZoom * 100)}%
                  </span>
                  <button onClick={() => setUserZoom(z => Math.min(1.4, z + 0.1))} title="Zoom In" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}>
                    <ZoomIn size={16} />
                  </button>
                  {userZoom !== 1 && (
                    <button onClick={() => setUserZoom(1)} title="Reset Zoom" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', marginLeft: '0.2rem' }}>
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>

                <button
                  onClick={handleUseTemplate}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
                    transition: 'transform 0.15s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Edit3 size={15} /> Use This Template
                </button>
              </div>
            </div>

            {/* SCALED LIVE RESUME PREVIEW CONTAINER */}
            {(() => {
              const baseScale = previewContainerWidth / 794;
              const finalScale = baseScale * userZoom;
              return (
                <div className="resume-preview-container" style={{ padding: 0, marginBottom: '2rem' }}>
                  <div 
                    className="resume-scale-wrapper"
                    style={{ transform: `scale(${finalScale})` }}
                  >
                    <div ref={resumeSheetRef} id="resume-preview-sheet" className="resume-page">
                      {renderPreviewLayout()}
                      <ResumeFooter />
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryExamples;
