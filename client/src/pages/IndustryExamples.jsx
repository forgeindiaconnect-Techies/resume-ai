import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import EnhancvLayout from '../components/layouts/EnhancvLayout';
import ModernLayout from '../components/layouts/ModernLayout';
import CreativeLayout from '../components/layouts/CreativeLayout';
import ProfessionalLayout from '../components/layouts/ProfessionalLayout';
import MinimalLayout from '../components/layouts/MinimalLayout';
import { Search, Edit3 } from 'lucide-react';

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
  { id: 'it_dir',       title: 'IT Director',         category: 'Information technology resume examples', layout: 'modern',       color: '#0b2545' },
  { id: 'sys_admin',    title: 'System Administrator',category: 'Information technology resume examples', layout: 'enhancv',      color: '#1e293b' },
  { id: 'cyber_sec',    title: 'Cybersecurity Analyst',category:'Information technology resume examples', layout: 'modern',       color: '#134e4a' },
  { id: 'cloud_arch',   title: 'Cloud Architect',     category: 'Information technology resume examples', layout: 'modern',       color: '#0284c7' },
  { id: 'devops_spec',  title: 'DevOps Specialist',   category: 'Information technology resume examples', layout: 'enhancv',      color: '#1d4ed8' },
  { id: 'net_eng',      title: 'Network Engineer',    category: 'Information technology resume examples', layout: 'modern',       color: '#0f172a' },

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
  'Project Manager': {
    name: 'Joshua Nelson',
    role: 'Project Manager | Renewable Energy | Agile | PMP',
    contact: { email: 'help@enhancv.com', phone: '+1-(234)-555-1234', location: 'Los Angeles, California', linkedin: 'linkedin.com/in/joshua-nelson-pmp' },
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
    contact: { email: 'v.rodriguez@enhancv.com', phone: '+1-(555)-555-1234', location: 'Dallas, Texas', linkedin: 'linkedin.com/in/violet-rodriguez' },
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

  'IT Director': {
    name: 'Marcus Vance',
    role: 'IT Director | Cloud Transformation | Enterprise Security | Infrastructure',
    contact: { email: 'm.vance@enhancv.com', phone: '+1-(555)-789-0123', location: 'San Jose, California', linkedin: 'linkedin.com/in/marcus-vance-it' },
    objective: 'Results-driven IT Director with 10+ years of experience managing enterprise IT infrastructure, cloud migration initiatives, and multi-million dollar technology budgets. Led a 35-person engineering team overseeing 99.99% system uptime.',
    skills: { languages: 'Enterprise IT Strategy · AWS Cloud Migration · Cybersecurity Governance · Disaster Recovery · Budgeting & P&L · Vendor Management · Agile ITSM' },
    experience: [
      { company: 'Apex Technology Partners', location: 'San Jose, CA', title: 'Director of Information Technology', duration: '03/2021 - Present', desc: '• Oversaw global IT infrastructure operations across 12 offices supporting 3,500+ employees.\n• Directed multi-year hybrid cloud migration to AWS, reducing annual server hosting costs by $420,000.\n• Implemented Zero-Trust Security architecture and ISO 27001 compliance standards.' },
      { company: 'Vanguard Systems Solutions', location: 'San Francisco, CA', title: 'Senior Infrastructure Manager', duration: '06/2017 - 02/2021', desc: '• Managed daily operations of enterprise data centers, SAN storage networks, and Cisco VoIP telephony systems.' }
    ],
    education: [{ degree: 'Bachelor of Science in Computer Information Systems', institution: 'San Jose State University', location: 'San Jose, CA', tenure: '09/2012 - 06/2016' }],
    achievements: [
      { title: '$420K Cloud Savings', desc: 'Migrated on-premise infrastructure to AWS hybrid cloud architecture.' },
      { title: '99.99% Uptime SLA', desc: 'Maintained continuous high-availability systems for enterprise applications.' },
      { title: 'ISO 27001 Certified', desc: 'Secured full compliance certification for global security standards.' }
    ],
    languagesList: [
      { name: 'English', level: 'Native •••••' },
      { name: 'German', level: 'Professional ••••' }
    ],
    interests: [
      { title: 'Cloud Innovation', desc: 'Passionate about modern serverless architecture and containerized microservices.' },
      { title: 'Cybersecurity Research', desc: 'Following threat intelligence feeds and zero-day vulnerability patches.' }
    ],
    training: [
      { title: 'AWS Certified Solutions Architect – Professional', org: 'Amazon Web Services', year: '2023' },
      { title: 'CISSP – Certified Information Systems Security Professional', org: '(ISC)²', year: '2021' }
    ]
  },

  'System Administrator': {
    name: 'Ethan Hunt',
    role: 'Senior System Administrator | Linux/Windows | Virtualization | Active Directory',
    contact: { email: 'e.hunt@enhancv.com', phone: '+1-(555)-234-5678', location: 'Seattle, Washington', linkedin: 'linkedin.com/in/ethan-hunt-sysadmin' },
    objective: 'Proactive Senior System Administrator with 7+ years of experience administering Linux/Windows servers, Active Directory, VMware ESXi cluster environments, and automated bash/Python scripting.',
    skills: { languages: 'Linux (RHEL/Ubuntu) · Windows Server 2022 · Active Directory · VMware vSphere · Bash · Python Scripting · PowerShell · Ansible · Docker' },
    experience: [
      { company: 'CloudScale Managed Services', location: 'Seattle, WA', title: 'Senior System Administrator', duration: '01/2020 - Present', desc: '• Maintained 250+ virtualized Linux & Windows server instances with 99.98% operational reliability.\n• Automated routine system patch management using Ansible playbooks, saving 15 hours per week.' }
    ],
    education: [{ degree: 'Bachelor of Science in Information Technology', institution: 'University of Washington', location: 'Seattle, WA', tenure: '2015 - 2019' }],
    achievements: [
      { title: 'Automated Patch Management', desc: 'Reduced server patching cycles from 3 days to 4 hours using Ansible.' },
      { title: 'Disaster Recovery Preparedness', desc: 'Engineered automated offsite Veeam backup pipeline with sub-15-min RTO.' }
    ]
  },

  'Cybersecurity Analyst': {
    name: 'Sophia Chen',
    role: 'Cybersecurity Threat Analyst | SIEM | Incident Response | SOC',
    contact: { email: 's.chen@enhancv.com', phone: '+1-(555)-901-2345', location: 'Austin, Texas', linkedin: 'linkedin.com/in/sophia-chen-sec' },
    objective: 'Certified Security Analyst (CEH) with 5+ years of experience conducting vulnerability assessments, SIEM log monitoring (Splunk), penetration testing, and incident response for financial enterprise networks.',
    skills: { languages: 'Splunk SIEM · Incident Response · Vulnerability Assessment · Penetration Testing · Wireshark · Python · Threat Hunting · Network Security' },
    experience: [
      { company: 'CyberGuard Operations Center', location: 'Austin, TX', title: 'Lead SOC Security Analyst', duration: '04/2021 - Present', desc: '• Monitored real-time threat alerts via Splunk SIEM across 10,000+ endpoints.\n• Investigated and mitigated 45+ critical malware & phishing security incidents.' }
    ],
    education: [{ degree: 'Bachelor of Science in Cybersecurity & Networking', institution: 'The University of Texas at Austin', location: 'Austin, TX', tenure: '2016 - 2020' }],
    achievements: [
      { title: '45+ Incident Mitigations', desc: 'Zero data breach incidents under active SOC surveillance.' },
      { title: 'CEH Certified', desc: 'Passed Certified Ethical Hacker exam with distinction.' }
    ]
  },

  'Actor': {
    name: 'Ava Johnson',
    role: 'Actor | Character Development | Film & TV',
    contact: { email: 'help@enhancv.com', phone: '+1-(234)-555-1234', location: 'Austin, Texas', linkedin: 'linkedin.com/in/ava-johnson-acting' },
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
  }
};

const getDefaultData = (roleTitle) => {
  if (resumeDataByRole[roleTitle]) return resumeDataByRole[roleTitle];

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
  const [previewContainerWidth, setPreviewContainerWidth] = useState(580);
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
        const availableWidth = previewRef.current.offsetWidth - 48;
        setPreviewContainerWidth(Math.max(500, Math.min(availableWidth, 720)));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
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
    const routeMap = { enhancv: '/editor/executive', modern: '/editor/modern', creative: '/editor/creative', professional: '/editor/professional', minimal: '/editor/minimal' };
    const editorRoute = routeMap[activeRole.layout] || '/editor/executive';
    const sessionData = {
      title: `${activeRole.title} Resume`,
      personalInfo: { name: currentResumeData.name, role: currentResumeData.role, email: currentResumeData.contact.email, phone: currentResumeData.contact.phone, location: currentResumeData.contact.location, linkedin: currentResumeData.contact.linkedin, github: currentResumeData.contact.github || '', summary: currentResumeData.objective },
      skills: { programming: (currentResumeData.skills.languages || '').split('·').map(s => s.trim()).filter(Boolean) },
      experience: currentResumeData.experience,
      education: currentResumeData.education
    };
    const newSessionId = 'session_' + Date.now();
    localStorage.setItem('activeResumeSessionId', newSessionId);
    localStorage.setItem(`resume_draft_${newSessionId}`, JSON.stringify(sessionData));
    navigate(`${editorRoute}/${newSessionId}`);
  };

  const renderPreviewLayout = () => {
    const props = { data: currentResumeData, customColor: activeRole.color, customFont: "'Inter', sans-serif" };
    switch (activeRole.layout) {
      case 'modern':       return <ModernLayout {...props} />;
      case 'creative':     return <CreativeLayout {...props} />;
      case 'professional': return <ProfessionalLayout {...props} />;
      case 'minimal':      return <MinimalLayout {...props} />;
      default:             return <EnhancvLayout {...props} />;
    }
  };

  return (
    <div style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', background: '#f8fafc', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ flexShrink: 0 }}><Navbar /></div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* COL 1: Sidebar Categories — EXACT ENHANCV WIDTH (220px) & SOFT BLUE (#eaf4fe) */}
        <div style={{ width: '220px', flexShrink: 0, background: '#eaf4fe', padding: '1.5rem 1.1rem', overflowY: 'auto', boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3b82f6', margin: '0 0 1rem', paddingBottom: '0.2rem', borderBottom: '2px solid #60a5fa', display: 'inline-block' }}>
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
                    fontSize: '0.86rem',
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

        {/* COL 2: Search + Role Grid Cards — EXACT ENHANCV WIDTH (320px) */}
        <div style={{ width: '320px', flexShrink: 0, background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '1.5rem 1.1rem', overflowY: 'auto', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1.2rem', letterSpacing: '-0.01em' }}>
            Search Resume Examples
          </h1>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.88rem', outline: 'none', background: '#f9fafb', boxSizing: 'border-box' }}
            />
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem' }}>
            {searchQuery ? `Results for "${searchQuery}"` : selectedCategory}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {filteredRoles.map(r => {
              const isSelected = activeRole.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleTitle(r.title)}
                  style={{
                    padding: '0.85rem 0.5rem',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #10b981' : '1px solid #d1d5db',
                    background: 'white',
                    color: isSelected ? '#059669' : '#374151',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 700 : 500,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none'
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#9ca3af'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#d1d5db'; }}
                >
                  {r.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* COL 3: Live Preview Header Bar & Centered Scaled Resume */}
        <div ref={previewRef} style={{ flex: 1, background: '#f1f5f9', padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box', position: 'relative' }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* ✅ HEADER BAR: Title on left, Green Button on right (NEVER FLOATS OVER RESUME) */}
            <div style={{ width: '100%', maxWidth: '720px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.25rem 0 1.25rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                {activeRole.title} Resume Preview
              </h2>
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
                <Edit3 size={15} /> Use This Resume Template
              </button>
            </div>

            {/* ✅ SCALED LIVE RESUME PREVIEW CONTAINER */}
            <div style={{
              width: `${previewContainerWidth}px`,
              height: `${Math.round(previewContainerWidth * (1122 / RESUME_FULL_WIDTH))}px`,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              borderRadius: '2px',
              marginBottom: '2rem',
              background: 'white'
            }}>
              <div
                id="resume-preview-sheet"
                className="print-paper-sheet"
                style={{
                  width: `${RESUME_FULL_WIDTH}px`,
                  minHeight: '1122px',
                  background: 'white',
                  transformOrigin: 'top left',
                  transform: `scale(${previewContainerWidth / RESUME_FULL_WIDTH})`,
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {renderPreviewLayout()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryExamples;
