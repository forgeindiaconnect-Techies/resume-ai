import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ModernResumeTemplate from '../components/builder/ModernResumeTemplate';
import { Briefcase, IndianRupee, BarChart, X, ZoomIn, ZoomOut, Check } from 'lucide-react';

const mockResumes = {
  'Frontend Developer': {
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
        points: [
          'Developed and optimized 15+ user-facing features using React and Next.js, improving page load speeds by 35%.',
          'Collaborated closely with UI/UX designers to translate Figma design tokens into clean, modular CSS/Tailwind components.',
          'Built a reusable component library that reduced code duplication across 3 different company dashboards.'
        ]
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
  },
  'Backend Developer': {
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
        points: [
          'Designed and maintained 30+ RESTful microservices processing over 500,000 monthly transactions.',
          'Optimized SQL database query latency by 45% through custom indexing, normalization, and Redis caching layers.',
          'Set up CI/CD pipelines using GitHub Actions to automate server testing and deployment on AWS ECS instances.'
        ]
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
  },
  'Full Stack Developer': {
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
        points: [
          'Led end-to-end development of a SaaS HR platform, managing a product scale from 0 to 10k active customers.',
          'Refactored legacy Monolith backend to Node/React micro-frontends, increasing engineering workflow speed by 50%.',
          'Worked with JWT-based security layers, OAuth, and custom session middleware to secure sensitive payroll systems.'
        ]
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
  },
  'Sales Specialist': {
    name: 'Arjun Mehta',
    role: 'Sales Specialist',
    contact: {
      email: 'arjun.mehta@example.com',
      phone: '+91 93333 44444',
      location: 'Mumbai, Maharashtra'
    },
    objective: 'High-performing Sales & Business Development Specialist with a proven history of hitting and exceeding corporate revenue targets. Expert in lead generation, client relationships, B2B negotiation, and account growth.',
    education: [
      { degree: 'Bachelor of Business Administration', institution: 'NMIMS Mumbai', tenure: '2018 - 2021' }
    ],
    skills: {
      languages: 'English, Hindi, Marathi',
      frameworks: 'Sales Pitching, Negotiation, B2B Strategy',
      tools: 'Salesforce CRM, HubSpot, LeadFinder, MS Office'
    },
    experience: [
      {
        title: 'Account Executive',
        company: 'SaaSify India Ltd.',
        duration: '2021 - Present',
        points: [
          'Exceeded quarterly sales targets by an average of 120% through aggressive client outbound strategies.',
          'Managed a portfolio of 40+ high-value corporate clients, generating over ₹50 Lakhs in annual contract value.',
          'Streamlined sales pitching cycles by restructuring product demos to focus on actionable client pain-points.'
        ]
      }
    ],
    projects: [
      {
        title: 'Enterprise CRM Migration',
        technology: 'Salesforce, HubSpot Integration',
        desc: 'Helped migrate and clean a database of 12k prospective leads, decreasing sales reps prospecting efforts by 30%.'
      }
    ],
    training: ['Salesforce Certified Administrator', 'HubSpot Sales Software Certificate']
  }
};

const defaultFallbackResume = {
  name: 'Candidate Name',
  role: 'Professional Role',
  contact: { email: 'candidate@example.com', phone: '+91 XXXXX XXXXX', location: 'India' },
  objective: 'Experienced professional dedicated to delivering outstanding organizational value.',
  education: [{ degree: 'Bachelor Degree', institution: 'University Name', tenure: '2018 - 2022' }],
  skills: { languages: 'Communication, Team Leadership', frameworks: 'Problem Solving, Strategy', tools: 'Microsoft Office, Google Workspace' },
  experience: [{ title: 'Associate', company: 'Company Pvt. Ltd.', duration: '2022 - Present', points: ['Contributed to day-to-day operations and team synergy.'] }]
};

const categories = [
  {
    name: 'Software Development',
    roles: [
      { title: 'Frontend Developer', salary: '₹6.5L - ₹18L', level: 'Mid - Senior', desc: 'Expert in user interfaces, React, CSS, and web responsiveness.' },
      { title: 'Backend Developer', salary: '₹7.0L - ₹20L', level: 'Junior - Senior', desc: 'Expert in API development, database architecture, and microservices.' },
      { title: 'Full Stack Developer', salary: '₹8.0L - ₹25L', level: 'Mid - Expert', desc: 'Handling both client-facing React apps and robust server logic.' },
      { title: 'Java Developer', salary: '₹6.0L - ₹16L', level: 'Junior - Senior', desc: 'Building enterprise backends, Spring Boot architectures, and APIs.' },
      { title: 'Python Developer', salary: '₹6.2L - ₹17L', level: 'Junior - Mid', desc: 'Focused on automation scripts, backend services, or data processes.' },
      { title: 'React Developer', salary: '₹6.5L - ₹15L', level: 'Junior - Senior', desc: 'Highly specialized React state management and component engineering.' },
      { title: 'Node.js Developer', salary: '₹6.8L - ₹17L', level: 'Mid Level', desc: 'Focused on high-performance Express/Nest server architectures.' }
    ]
  },
  {
    name: 'Business',
    roles: [
      { title: 'HR Manager', salary: '₹5.0L - ₹12L', level: 'Mid - Senior', desc: 'Employee relations, recruitment structures, and company culture.' },
      { title: 'Marketing Specialist', salary: '₹4.5L - ₹11L', level: 'Junior - Mid', desc: 'Digital marketing, social pipelines, SEO, and paid ad optimization.' },
      { title: 'Sales Specialist', salary: '₹5.0L - ₹14L', level: 'Junior - Senior', desc: 'Client acquisition, relationship building, pitching, and contracts.' },
      { title: 'Finance Analyst', salary: '₹6.0L - ₹15L', level: 'Mid - Senior', desc: 'Corporate budgeting, audit mapping, and financial trend planning.' },
      { title: 'Business Analyst', salary: '₹6.5L - ₹14L', level: 'Junior - Senior', desc: 'Bridging technical tools with business requirement documents (BRD).' }
    ]
  },
  {
    name: 'Healthcare',
    roles: [
      { title: 'Doctor', salary: '₹12L - ₹35L', level: 'Expert', desc: 'Patient diagnosis, clinical prescription, and medical consultation.' },
      { title: 'Nurse', salary: '₹3.5L - ₹8.0L', level: 'Junior - Senior', desc: 'Patient care administration, clinical documentation, and emergency support.' },
      { title: 'Pharmacist', salary: '₹3.0L - ₹7.0L', level: 'Junior - Mid', desc: 'Medical inventory mapping, dosage prescription validation, and supply.' }
    ]
  },
  {
    name: 'Engineering',
    roles: [
      { title: 'Civil Engineer', salary: '₹4.0L - ₹10L', level: 'Junior - Senior', desc: 'Structural design modeling, construction blueprints, and field testing.' },
      { title: 'Mechanical Engineer', salary: '₹4.2L - ₹11L', level: 'Junior - Mid', desc: 'Thermal dynamic studies, CAD assembly modeling, and line validation.' },
      { title: 'Electrical Engineer', salary: '₹4.5L - ₹12L', level: 'Junior - Senior', desc: 'Grid design, power transmission networks, and microelectronic layouts.' }
    ]
  }
];

const IndustryExamples = () => {
  const [activeCategory, setActiveCategory] = useState('Software Development');
  const [selectedResume, setSelectedResume] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(234, 179, 8, 0.15)',
            color: '#eab308',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>Industry Resume Library</span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Job-Specific Resume Examples
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Browse proven resumes for top professions. Click to preview and duplicate templates built to pass ATS filters for each specific role.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          borderBottom: '2px solid #e2e8f0',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: isActive ? '#0056b8' : '#64748b',
                  padding: '0.5rem 1.25rem',
                  cursor: 'pointer',
                  borderBottom: isActive ? '3px solid #0056b8' : '3px solid transparent',
                  marginBottom: '-1.2rem',
                  transition: 'all 0.2s'
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Roles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {categories.find(c => c.name === activeCategory)?.roles.map((role) => (
            <div
              key={role.title}
              style={{
                background: 'white',
                borderRadius: '20px',
                border: '2px solid #e2e8f0',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#0056b8';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 86, 184, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>{role.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{role.desc}</p>
              </div>

              <div style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                  <IndianRupee size={14} color="#0056b8" />
                  <span>Salary: <strong style={{ color: '#0f172a' }}>{role.salary}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                  <Briefcase size={14} color="#0056b8" />
                  <span>Level: <strong style={{ color: '#0f172a' }}>{role.level}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setSelectedResume(role.title)}
                style={{
                  width: '100%',
                  background: '#0056b8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 86, 184, 0.15)',
                  transition: 'opacity 0.2s',
                  marginTop: 'auto'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                View Sample Resume
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* High Fidelity Resume Preview Modal */}
      {selectedResume && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem 1rem'
        }}>
          <div style={{
            background: '#f1f5f9',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '900px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0f172a',
              color: 'white',
              padding: '1.25rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{selectedResume} Resume</h2>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 600 }}>ATS Optimized Format &bull; Free to Duplicate</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link
                  to="/onboarding/start"
                  style={{
                    background: '#eab308',
                    color: '#0f172a',
                    padding: '0.6rem 1.5rem',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 14px rgba(234,179,8,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Check size={14} strokeWidth={3} /> Use This Template
                </Link>
                <button
                  onClick={() => setSelectedResume(null)}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable Sheet Canvas) */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '3rem 2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}>
              {/* White A4 paper container */}
              <div style={{
                background: 'white',
                width: '100%',
                maxWidth: '210mm',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <ModernResumeTemplate
                  data={mockResumes[selectedResume] || defaultFallbackResume}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryExamples;
