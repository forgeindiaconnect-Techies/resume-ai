import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ResumePreview from '../components/ResumePreview';
import { getIndustries, getExamplesByIndustry, getExampleById } from '../services/industryService';
import * as Icons from 'lucide-react';

const fallbackIndustries = [
  { _id: 'it', name: 'Information Technology', icon: 'Laptop', description: 'Software Engineering, DevOps, Cloud, Cybersecurity, QA, AI & Data Science examples.' },
  { _id: 'biz', name: 'Business', icon: 'Briefcase', description: 'Management, consulting, project management, and business operation layouts.' },
  { _id: 'eng', name: 'Engineering', icon: 'Settings', description: 'Civil, mechanical, electrical, chemical, and aerospace designs.' },
  { _id: 'health', name: 'Healthcare', icon: 'Activity', description: 'Clinicians, nurses, pharmacologists, and healthcare advisors.' },
  { _id: 'fin', name: 'DollarSign', name: 'Finance', icon: 'DollarSign', description: 'Certified accountant, auditor, risk manager, and investor formats.' },
  { _id: 'edu', name: 'Education', icon: 'BookOpen', description: 'Teachers, professors, academic advisors, and librarians.' },
  { _id: 'design', name: 'Design', icon: 'Palette', description: 'Graphic, fashion, UI/UX, product, and architectural layouts.' },
  { _id: 'mktg', name: 'Marketing', icon: 'TrendingUp', description: 'SEO consultants, content writers, marketing managers, and social developers.' },
  { _id: 'sales', name: 'Sales', icon: 'Target', description: 'Account managers, business development associates, and retail reps.' },
  { _id: 'hosp', name: 'Hospitality', icon: 'Coffee', description: 'Head chefs, catering directors, hotel management, and receptionists.' },
  { _id: 'gov', name: 'Government', icon: 'FileText', description: 'Public policy analysts, program coordinators, and public safety officers.' },
  { _id: 'legal', name: 'Legal', icon: 'Shield', description: 'Lawyer, paralegal, associate counselor, and corporate law resumes.' },
  { _id: 'av', name: 'Aviation', icon: 'Plane', description: 'Commercial pilots, flight attendants, and aerospace safety inspectors.' },
  { _id: 'mfg', name: 'Manufacturing', icon: 'Cpu', description: 'Plant managers, supply chain analysts, and production lines.' },
  { _id: 'other', name: 'Others', icon: 'HelpCircle', description: 'Customer success reps, translators, and creative freelance layouts.' }
];

const fallbackExamples = {
  'it': [
    { _id: 'fe', jobTitle: 'Frontend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 92, resumeScore: 95, description: 'Responsive web engineering, React optimization, and CSS/Tailwind design tokens.' },
    { _id: 'be', jobTitle: 'Backend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 94, resumeScore: 91, description: 'API setups, database indexes, server controllers, and system architecture.' },
    { _id: 'fs', jobTitle: 'Full Stack Developer', experience: '5-10 Years', template: 'Modern', atsScore: 97, resumeScore: 96, description: 'End-to-end architectures, microservices, secure authentication, and AWS deployments.' },
    { _id: 'rd', jobTitle: 'React Developer', experience: '2-5 Years', template: 'Modern', atsScore: 95, resumeScore: 94, description: 'State management, React hooks, custom state logic, and client optimization.' },
    { _id: 'ad', jobTitle: 'Angular Developer', experience: '2-5 Years', template: 'Professional', atsScore: 91, resumeScore: 90, description: 'TypeScript patterns, RxJS data streams, and directive setups.' },
    { _id: 'vd', jobTitle: 'Vue Developer', experience: '2-5 Years', template: 'Minimal', atsScore: 93, resumeScore: 92, description: 'Vuex configurations, single file components, and interface rendering.' }
  ]
};

const mockResumeJson = (jobTitle) => ({
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
  education: [{ degree: 'Master of Technology', institution: 'IIT Hyderabad', tenure: '2018 - 2020', cgpa: '9.2' }],
  skills: { languages: 'Java, Python, Javascript, SQL', frameworks: 'React, Node, Spring Boot, FastAPI', tools: 'Docker, AWS, Git, Webpack, Figma' },
  experience: [
    {
      title: `Lead ${jobTitle}`,
      company: 'SaaSify Platforms',
      duration: '2021 - Present',
      desc: `Pioneered core modules for enterprise operations as ${jobTitle}.\nOptimized process latency and workflows by 40% through strict code refactoring and agile execution.`
    }
  ],
  projects: [{ title: 'Enterprise Analytics Engine', technology: 'Node, React, PostgreSQL', desc: 'Developed a high-availability dashboard displaying real-time business performance metrics.' }]
});

const IndustryExamples = () => {
  const navigate = useNavigate();
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [examples, setExamples] = useState([]);
  const [loadingIndustries, setLoadingIndustries] = useState(true);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [previewExample, setPreviewExample] = useState(null);

  // Load all 15 industries on mount
  useEffect(() => {
    const fetchAll = async () => {
      const data = await getIndustries();
      const cleanData = data && data.length > 0 ? data : fallbackIndustries;
      setIndustries(cleanData);
      setSelectedIndustry(cleanData[0]);
      setLoadingIndustries(false);
    };
    fetchAll();
  }, []);

  // Fetch roles when active industry changes
  useEffect(() => {
    if (!selectedIndustry) return;
    const fetchRoles = async () => {
      setLoadingExamples(true);
      const data = await getExamplesByIndustry(selectedIndustry._id);
      if (data && data.length > 0) {
        setExamples(data);
      } else {
        const fallbacks = fallbackExamples[selectedIndustry._id] || fallbackExamples['it'] || [];
        // Map fallbacks to include full JSON templates dynamically
        const mapped = fallbacks.map(f => ({
          ...f,
          resumeJson: mockResumeJson(f.jobTitle)
        }));
        setExamples(mapped);
      }
      setLoadingExamples(false);
    };
    fetchRoles();
  }, [selectedIndustry]);

  const handleUseTemplate = (ex) => {
    localStorage.setItem('selectedTemplateId', ex.template || 'Modern');
    localStorage.setItem('prefilledJobTitle', ex.jobTitle);
    localStorage.setItem('prefilledResumeJson', JSON.stringify(ex.resumeJson || mockResumeJson(ex.jobTitle)));
    navigate('/onboarding/start');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Main Workspace Split Layout: Category Menu Left, Cards Grid Right */}
      <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
        
        {/* Left Sidebar Category List (Sitemap Navigation) */}
        <aside style={{
          width: '260px',
          background: '#0f172a',
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          overflowY: 'auto',
          flexShrink: 0
        }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', margin: 0 }}>
              Resume Libraries
            </h2>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 0' }}>
            {loadingIndustries ? (
              <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '1rem 1.5rem' }}>Loading sitemaps...</div>
            ) : (
              industries.map(ind => {
                const isActive = selectedIndustry?._id === ind._id;
                const IconComponent = Icons[ind.icon] || Icons.Briefcase;
                return (
                  <button
                    key={ind._id}
                    onClick={() => setSelectedIndustry(ind)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '0.85rem 1.5rem',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      borderLeft: isActive ? '4px solid #0056b8' : '4px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 800 : 500,
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    <IconComponent size={18} color={isActive ? '#eab308' : '#64748b'} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ind.name}</span>
                  </button>
                );
              })
            )}
          </nav>
        </aside>

        {/* Right Content Workspace */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', background: '#f1f5f9' }}>
          
          {/* Header metadata */}
          {selectedIndustry && (
            <div style={{ marginBottom: '2.5rem', maxWidth: '1000px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0056b8', background: '#eff6ff', padding: '0.25rem 0.65rem', borderRadius: '6px', display: 'inline-block', marginBottom: '0.75rem' }}>
                Enhancv Style Guide
              </span>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                {selectedIndustry.name} Resume Examples
              </h1>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                {selectedIndustry.description || `Browse and duplicate recruiters approved formats for ${selectedIndustry.name} professional roles.`}
              </p>
            </div>
          )}

          {/* Cards Grid */}
          {loadingExamples ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontWeight: 650 }}>
              Loading examples...
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              maxWidth: '1200px'
            }}>
              {examples.map((ex) => (
                <div
                  key={ex._id}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    border: '2px solid #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    textAlign: 'left'
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
                  {/* Miniature template layout outline */}
                  <div style={{
                    background: '#f8fafc',
                    height: '140px',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '0.75rem',
                    position: 'relative'
                  }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '8px',
                      height: '100%',
                      border: '1px solid #cbd5e1',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
                    }}>
                      <div style={{ height: '12px', background: '#0056b8', borderRadius: '2px', width: '70%' }} />
                      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '1px', width: '30%' }} />
                      <div style={{ display: 'flex', gap: '6px', flex: 1, marginTop: '2px' }}>
                        <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '1px' }} />
                          <div style={{ height: '5px', background: '#e2e8f0', borderRadius: '1px' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ height: '15px', background: '#f1f5f9', borderRadius: '2px' }} />
                          <div style={{ height: '15px', background: '#f1f5f9', borderRadius: '2px' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(15, 23, 42, 0.85)',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '5px',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <span>ATS Friendly</span>
                    </div>
                  </div>

                  {/* Details block */}
                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>{ex.jobTitle}</h4>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        Exp: {ex.experience}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button
                        onClick={() => setPreviewExample(ex)}
                        style={{
                          flex: 1,
                          background: '#f1f5f9',
                          color: '#0f172a',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.55rem',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleUseTemplate(ex)}
                        style={{
                          flex: 1,
                          background: '#0056b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.55rem',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                        onMouseLeave={e => e.currentTarget.style.opacity = 1}
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Side-Drawer Overlay for high-fidelity resume examples preview (Step 5) */}
      {previewExample && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15,23,42,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '900px',
            background: '#f1f5f9',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            position: 'relative'
          }}>
            {/* Header toolbar */}
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>{previewExample.jobTitle} Resume Preview</h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0', fontWeight: 650 }}>ATS Score: {previewExample.atsScore}% &bull; Resume Score: {previewExample.resumeScore}%</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => handleUseTemplate(previewExample)}
                  style={{
                    background: '#eab308',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '0.55rem 1.4rem',
                    fontWeight: 900,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(234,179,8,0.25)'
                  }}
                >
                  Use Template
                </button>
                <button
                  onClick={() => setPreviewExample(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    padding: '0.25rem'
                  }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Scrollable canvas */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '3rem 2rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}>
              <ResumePreview
                data={previewExample.resumeJson || mockResumeJson(previewExample.jobTitle)}
                color="#0056b8"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryExamples;
