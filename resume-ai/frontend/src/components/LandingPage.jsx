import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ForgeLogo from '../components/common/ForgeLogo';
import {
  Sparkles, Compass, FileSearch, FileText, MessageCircle, Briefcase, 
  ArrowRight, ChevronRight, Layers, Shield, HelpCircle, X, Upload
} from 'lucide-react';

import * as Icons from 'lucide-react';
import ResumePreview from '../components/ResumePreview';

const fallbackIndustries = [
  { _id: 'it', name: 'Information Technology', icon: 'Laptop', description: 'Software Engineering, DevOps, Cloud, Cybersecurity, QA, AI & Data Science examples.' },
  { _id: 'biz', name: 'Business', icon: 'Briefcase', description: 'Management, consulting, project management, and business operation layouts.' },
  { _id: 'eng', name: 'Engineering', icon: 'Settings', description: 'Civil, mechanical, electrical, chemical, and aerospace designs.' },
  { _id: 'health', name: 'Healthcare', icon: 'Activity', description: 'Clinicians, nurses, pharmacologists, and healthcare advisors.' },
  { _id: 'fin', name: 'Finance', icon: 'DollarSign', description: 'Certified accountant, auditor, risk manager, and investor formats.' },
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

const getFallbackRoles = (industryId) => {
  const defaults = [
    { _id: 'fe', jobTitle: 'Frontend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 92, resumeScore: 95, description: 'Responsive web engineering, React optimization, and CSS/Tailwind design tokens.' },
    { _id: 'be', jobTitle: 'Backend Developer', experience: '2-5 Years', template: 'Modern', atsScore: 94, resumeScore: 91, description: 'API setups, database indexes, server controllers, and system architecture.' },
    { _id: 'fs', jobTitle: 'Full Stack Developer', experience: '5-10 Years', template: 'Modern', atsScore: 97, resumeScore: 96, description: 'End-to-end architectures, microservices, secure authentication, and AWS deployments.' }
  ];
  
  if (industryId === 'biz') {
    return [
      { _id: 'pm', jobTitle: 'Project Manager', experience: '5-10 Years', template: 'Executive', atsScore: 96, resumeScore: 94 },
      { _id: 'ba', jobTitle: 'Business Analyst', experience: '2-5 Years', template: 'Professional', atsScore: 94, resumeScore: 92 }
    ].map(r => ({ ...r, resumeJson: mockResumeJson(r.jobTitle) }));
  }
  
  return defaults.map(r => ({ ...r, resumeJson: mockResumeJson(r.jobTitle) }));
};

const LandingPage = () => {
  const navigate = useNavigate();
  const onEnterApp = (action) => {
    if (action === 'create') navigate('/onboarding/start');
    else if (action === 'upload') navigate('/upload');
    else if (action === 'login') navigate('/login');
    else navigate('/onboarding/start');
  };
  const isLoggedIn = false;
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'advisor',
      text: "Hi! I'm your Career Advisor. I've helped thousands land their dream jobs. What brings you here today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Industry Examples States
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [examples, setExamples] = useState([]);
  const [loadingExamples, setLoadingExamples] = useState(false);
  const [previewExample, setPreviewExample] = useState(null);

  // Fetch industries on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/industries');
        const data = await res.json();
        const cleanData = data.success && data.data.length > 0 ? data.data : fallbackIndustries;
        setIndustries(cleanData);
        setSelectedIndustry(cleanData[0]);
      } catch (e) {
        setIndustries(fallbackIndustries);
        setSelectedIndustry(fallbackIndustries[0]);
      }
    };
    fetchAll();
  }, []);

  // Fetch roles when selected category changes
  useEffect(() => {
    if (!selectedIndustry) return;
    const fetchRoles = async () => {
      setLoadingExamples(true);
      try {
        const res = await fetch(`http://localhost:5000/api/industries/${selectedIndustry._id}/examples`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setExamples(data.data);
        } else {
          setExamples(getFallbackRoles(selectedIndustry._id));
        }
      } catch (e) {
        setExamples(getFallbackRoles(selectedIndustry._id));
      }
      setLoadingExamples(false);
    };
    fetchRoles();
  }, [selectedIndustry]);

  // Load external Playfair Display font dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleAdvisorChoice = (choiceText, choiceId) => {
    if (isTyping) return;

    // Add user message
    setChatHistory(prev => [...prev, { sender: 'user', text: choiceText }]);
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      switch (choiceId) {
        case 'strategy':
          botResponse = "Developing a long-term trajectory requires identifying your core growth areas. Let's start by designing your Career 360° profile!";
          break;
        case 'analysis':
          botResponse = "Analyzing your ATS compatibility score will help us target performance metrics. Let's import your resume to run the analysis.";
          break;
        case 'creation':
          botResponse = "Excellent. We will construct a clean, modern, and recruiter-ready resume in minutes. Let's enter the builder workspace.";
          break;
        case 'prep':
          botResponse = "Interview preparedness is crucial. We'll map role-specific mock questions for your target track. Let's sign in to practice.";
          break;
        default:
          botResponse = "Let's explore your possibilities together and find your next premium role.";
      }

      setChatHistory(prev => [...prev, { sender: 'advisor', text: botResponse, triggerAction: true }]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fb', 
      color: '#1e293b', 
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-15%', width: 700, height: 700, background: 'rgba(165, 243, 252, 0.45)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', top: '45%', left: '-15%', width: 600, height: 600, background: 'rgba(199, 210, 254, 0.35)', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '15%', width: 500, height: 500, background: 'rgba(219, 234, 254, 0.4)', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.8 }} />
      </div>

      {/* Navigation Header */}
      <nav style={{
        background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <ForgeLogo size={36} showText={true} variant="dark" />
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[
            { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Features', href: '#features' },
            { label: 'Templates', onClick: () => navigate('/templates') },
            { label: 'Examples', onClick: () => navigate('/industry-examples') },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Contact', onClick: () => setShowContactModal(true) }
          ].map((item, idx) => (
            <span
              key={idx}
              onClick={item.onClick || (() => {
                const el = document.querySelector(item.href);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              })}
              style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              {item.label}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => onEnterApp(isLoggedIn ? null : 'login')}
            className="glass-btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #4f46e5)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1.25rem',
              borderRadius: '24px',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 8px 20px rgba(6,182,212,0.25)',
              cursor: 'pointer'
            }}
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Login'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Hero Section */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '7rem 2rem 5rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '1.35rem', color: '#334155', fontWeight: 500, margin: 0 }}>
              Thinking about your next career move — not sure where to start?
            </p>
            <p style={{ 
              fontSize: '1.65rem', 
              fontFamily: "'Playfair Display', serif", 
              fontStyle: 'italic', 
              color: '#4f46e5',
              fontWeight: 600,
              margin: 0
            }}>
              Let's find your next role.
            </p>
          </div>

          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.4rem 1.1rem', 
            borderRadius: '50px', 
            border: '1px solid #e0e7ff', 
            background: '#eef2ff', 
            color: '#4f46e5', 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            marginBottom: '2rem' 
          }}>
            <Layers size={14} /> Introducing Career 360°
          </div>

          <h1 style={{ 
            fontSize: '4.5rem', 
            fontWeight: 900, 
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            marginBottom: '2.5rem'
          }}>
            Build Professional <span style={{ 
              background: 'linear-gradient(90deg, #06b6d4, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900
            }}>ATS-Friendly Resume</span> with AI
          </h1>

          <p style={{ 
            fontSize: '1.5rem', 
            fontFamily: "'Playfair Display', serif", 
            fontStyle: 'italic',
            color: '#475569',
            maxWidth: '800px',
            margin: '0 auto 3.5rem',
            lineHeight: 1.55
          }}>
            Career 360° gives you the <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0891b2' }}>standout resume</span> + <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#4f46e5' }}>executive one-pager</span> — <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0f172a' }}>in minutes.</span>
            <span style={{ display: 'block', marginTop: '1rem', fontStyle: 'normal', fontSize: '1.05rem', color: '#64748b' }}>
              It also maps your next roles — so recruiters can find you for what's coming, not just what's been.
            </span>
          </p>
 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onEnterApp('create')}
              className="glass-btn btn-primary"
              style={{
                background: 'linear-gradient(90deg, #06b6d4, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '1.25rem 2.8rem',
                borderRadius: '16px',
                minWidth: '260px',
                textAlign: 'left',
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(6,182,212,0.3)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                gap: '0.25rem'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em' }}>Create Resume</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Start Building <ArrowRight size={14} />
              </span>
            </button>
 
            <button 
              onClick={() => onEnterApp('upload')}
              className="glass-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                color: '#0f172a',
                border: '2px solid #e2e8f0',
                padding: '1.25rem 2.8rem',
                borderRadius: '16px',
                minWidth: '260px',
                textAlign: 'left',
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                gap: '0.25rem'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 950, letterSpacing: '-0.02em' }}>Upload Resume</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Analyze with AI <ArrowRight size={14} />
              </span>
            </button>
          </div>
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 700 }}>
            <Sparkles size={16} color="#eab308" /> Trusted by 10,000+ Professionals
          </div>
        </section>

        {/* Embedded Industry Examples Section */}
        <section id="industry-examples" style={{
          maxWidth: '1200px',
          margin: '0 auto 6rem',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
          border: '1.5px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              background: '#eff6ff',
              color: '#0056b8',
              padding: '0.3rem 0.9rem',
              borderRadius: '50px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'inline-block',
              marginBottom: '1rem'
            }}>Browse Role Templates</span>
            <h2 style={{
              fontSize: '2.5rem',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              color: '#0f172a',
              marginBottom: '1rem'
            }}>
              Explore Job-Specific Resume Examples
            </h2>
            <p style={{ color: '#475569', maxWidth: '680px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Choose an industry below to browse premium resume templates customized for your role. Preview layouts and duplicate them instantly.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', height: '620px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            
            {/* Categories Sidebar */}
            <div style={{
              width: '260px',
              background: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              overflowY: 'auto'
            }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Categories
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem 0' }}>
                {industries.map(ind => {
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
                        padding: '0.75rem 1.5rem',
                        background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: isActive ? '#ffffff' : '#94a3b8',
                        border: 'none',
                        borderLeft: isActive ? '4px solid #0056b8' : '4px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 800 : 500,
                        transition: 'all 0.15s'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#94a3b8'; }}
                    >
                      <IconComponent size={16} color={isActive ? '#eab308' : '#64748b'} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ind.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roles Grid Panel */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
              {selectedIndustry && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.25rem' }}>
                    {selectedIndustry.name} Resume Formats
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    {selectedIndustry.description || `Browse recruiters approved formats for ${selectedIndustry.name} professional roles.`}
                  </p>
                </div>
              )}

              {loadingExamples ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b', fontWeight: 650 }}>
                  Loading templates...
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {examples.map(ex => (
                    <div
                      key={ex._id}
                      style={{
                        background: 'white',
                        borderRadius: '16px',
                        border: '2px solid #e2e8f0',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.2s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#0056b8';
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 86, 184, 0.06)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ background: '#f8fafc', height: '110px', padding: '0.5rem', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                        <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', height: '100%', padding: '6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ height: '8px', background: '#0056b8', borderRadius: '1.5px', width: '60%' }} />
                          <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '1px', width: '25%' }} />
                          <div style={{ display: 'flex', gap: '4px', flex: 1, marginTop: '2px' }}>
                            <div style={{ width: '25%', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div style={{ height: '4px', background: '#cbd5e1', borderRadius: '1px' }} />
                              <div style={{ height: '4px', background: '#cbd5e1', borderRadius: '1px' }} />
                            </div>
                            <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '2px' }} />
                          </div>
                        </div>
                      </div>
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.15rem' }}>{ex.jobTitle}</h4>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0056b8', background: '#eff6ff', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>
                            Exp: {ex.experience}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', marginTop: 'auto' }}>
                          <button
                            onClick={() => setPreviewExample(ex)}
                            style={{
                              flex: 1,
                              background: '#f1f5f9',
                              color: '#0f172a',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.45rem',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              cursor: 'pointer'
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
                              borderRadius: '6px',
                              padding: '0.45rem',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            Use
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Preview Side-Panel Modal */}
        {previewExample && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 10000
          }}>
            <div style={{
              width: '100%',
              maxWidth: '900px',
              background: '#f1f5f9',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.15)'
            }}>
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
                      cursor: 'pointer'
                    }}
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => setPreviewExample(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      padding: '0.25rem'
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 2rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <ResumePreview
                  data={previewExample.resumeJson || mockResumeJson(previewExample.jobTitle)}
                  color="#0056b8"
                />
              </div>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <section style={{ 
          borderTop: '1px solid #f1f5f9', 
          background: 'linear-gradient(180deg, #f8f9fb 0%, #eef2ff 100%)', 
          padding: '5rem 2rem', 
          position: 'relative' 
        }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: '#0f172a', marginBottom: '0.5rem' }}>
                See where you're going next
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', margin: 0 }}>
                Built from your real career. Designed for your next one.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {/* Step 1 */}
              <div style={{ 
                background: '#ecfeff', 
                border: '1px solid #cffafe', 
                padding: '2rem', 
                borderRadius: '24px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Sparkles size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#cffafe', color: '#0891b2', textTransform: 'uppercase' }}>
                    Your Story
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 1</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>We read your career</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Upload your resume or import from LinkedIn. Career 360° understands not just where you've been — but the trajectory you're on.
                </p>
              </div>

              {/* Step 2 */}
              <div style={{ 
                background: '#eef2ff', 
                border: '1px solid #e0e7ff', 
                padding: '2rem', 
                borderRadius: '24px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Compass size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#e0e7ff', color: '#4f46e5', textTransform: 'uppercase' }}>
                    Your Next Move
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 2</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>AI predicts your future roles</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Most people stay stuck because they can't see what's next. Career 360° maps the next roles your career is pointing toward.
                </p>
              </div>

              {/* Step 3 */}
              <div style={{ 
                background: '#fffbeb', 
                border: '1px solid #fef3c7', 
                padding: '2rem', 
                borderRadius: '24px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Layers size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#fef3c7', color: '#b45309', textTransform: 'uppercase' }}>
                    Get Discovered
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 3</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Recruiters find you</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Recruiters search Career 360° for candidates ready for their open roles — not based on your old title, but on where you're going next.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables Section */}
        <section style={{ borderTop: '1px solid #f1f5f9', padding: '5rem 2rem', background: '#fff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>What you get</p>
              <h2 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: '#0f172a', margin: 0 }}>
                Three ways Career 360° gets you found.
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div style={{ background: '#ecfeff', border: '1px solid #cffafe', padding: '2.2rem 2rem', borderRadius: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}>01</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Standout Resume</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  AI-optimized for the roles you're targeting next. Pick from templates that suit your industry — ready to share in minutes.
                </p>
              </div>

              <div style={{ background: '#eef2ff', border: '1px solid #e0e7ff', padding: '2.2rem 2rem', borderRadius: '24px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}>02</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Executive One-Pager</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  A single polished document that tells your complete career story. Built from your data, in stunning themes — ready to share in 30 seconds.
                </p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #fffbeb, #fff7ed)', 
                border: '2px solid #fcd34d', 
                padding: '2.2rem 2rem', 
                borderRadius: '24px',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: '-14px', right: '24px', background: 'linear-gradient(90deg, #f59e0b, #ea580c)', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '0.3rem 0.8rem', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}>
                  THE UNLOCK
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}>03</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Discoverable on TalentElite</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  Your Career 360° makes you searchable on TalentElite — our hiring network — based on the next roles you're ready for, not just your current role.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Career Advisor Chat Simulator Section */}
        <section style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
          padding: '6rem 2rem',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', padding: '0.4rem 1rem', borderRadius: '50px', color: '#22d3ee', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'pulse 1.8s infinite' }} />
                Career Advisor · Online
              </div>
              <h2 style={{ fontSize: '2.6rem', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>
                Talk to your Career Advisor
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#94a3b8', margin: 0 }}>
                AI-powered guidance for every stage of your career
              </p>
            </div>

            {/* Chatbot Interface */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              backdropFilter: 'blur(16px)', 
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '24px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Interactive Simulator
                </span>
              </div>

              {/* Message Flow Container */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '260px' }}>
                {chatHistory.map((msg, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      width: '100%' 
                    }}
                  >
                    <div style={{ 
                      maxWidth: '75%', 
                      padding: '1rem 1.25rem', 
                      borderRadius: '16px',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      fontWeight: 500,
                      background: msg.sender === 'user' ? 'linear-gradient(135deg, #06b6d4, #4f46e5)' : 'rgba(255,255,255,0.06)',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      boxShadow: msg.sender === 'user' ? '0 8px 20px rgba(6,182,212,0.15)' : 'none'
                    }}>
                      {msg.text}
                      {msg.triggerAction && (
                        <button 
                          onClick={onEnterApp}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginTop: '0.75rem',
                            background: 'white',
                            color: '#0f172a',
                            border: 'none',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Launch Platform Workspace <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', gap: '0.35rem', paddingLeft: '1rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1s infinite' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1s infinite 0.2s' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', animation: 'pulse 1s infinite 0.4s' }} />
                  </div>
                )}
              </div>

              {/* Interactive Choice Selector */}
              <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[
                    { text: 'Career Strategy', id: 'strategy', icon: Compass, color: '#6366f1' },
                    { text: 'Resume Analysis', id: 'analysis', icon: FileSearch, color: '#06b6d4' },
                    { text: 'Resume Creation', id: 'creation', icon: FileText, color: '#10b981' },
                    { text: 'Interview Prep', id: 'prep', icon: MessageCircle, color: '#f59e0b' }
                  ].map(btn => {
                    const IconComp = btn.icon;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => handleAdvisorChoice(btn.text, btn.id)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '1rem 0.5rem',
                          color: 'rgba(255,255,255,0.9)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.borderColor = btn.color;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        <IconComp size={20} style={{ color: btn.color }} />
                        {btn.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Bottom Section */}
        <section style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '6rem 2rem',
          textAlign: 'center',
          color: 'white',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h2 style={{ 
              fontSize: '3rem', 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 500, 
              color: 'white', 
              marginBottom: '2rem',
              lineHeight: 1.2
            }}>
              Your potential isn't hidden.<br />
              <span style={{ 
                background: 'linear-gradient(90deg, #22d3ee, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontStyle: 'italic'
              }}>
                It's just not mapped.
              </span>
            </h2>

            <button 
              onClick={onEnterApp}
              className="glass-btn btn-primary"
              style={{
                background: '#ffffff',
                color: '#0f172a',
                border: 'none',
                padding: '1.25rem 3rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 30px rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Create My Career 360° <ArrowRight size={20} />
            </button>
            <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Join thousands of professionals today · No credit card required
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(90deg, #0f172a, #1e3a8a)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '4rem 2rem',
        color: '#94a3b8',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <span style={{ 
              fontSize: '1.6rem', 
              fontWeight: 800, 
              color: '#38bdf8',
              display: 'block',
              marginBottom: '1rem'
            }}>
              FORGE <span style={{ color: '#eab308' }}>INDIA</span> <span style={{ color: '#ffffff' }}>CONNECT</span>
            </span>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              AI-powered career transformation platform. Expert-driven optimization, intelligent insights, and accelerated career advancement. Powered by Forge India Connect Pvt. Ltd.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forge India Connect</h4>
            <span onClick={onEnterApp} style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer', display: 'block', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Dashboard</span>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</h4>
            <span onClick={() => setShowContactModal(true)} style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer', display: 'block', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>About Forge India</span>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>Privacy</span>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block' }}>Terms</span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', fontSize: '0.8rem' }}>
          <span>© 2025 Forge India Connect Pvt. Ltd. All rights reserved.</span>
          <span style={{ color: 'white', fontWeight: 600 }}>AI Brought to Life</span>
        </div>
      </footer>

      {/* Floating Cookie Consent */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ 
              position: 'fixed', 
              bottom: '16px', 
              left: '16px', 
              right: '16px', 
              maxWidth: '640px', 
              margin: '0 auto', 
              background: '#1e293b', 
              borderRadius: '16px', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
              zIndex: 9999,
              padding: '20px 24px',
              pointerEvents: 'all'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <div style={{ color: '#38bdf8', marginTop: '2px' }}>
                <Shield size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>We use cookies</p>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
                  We use cookies to improve your experience, analyse site traffic, and show relevant content. Necessary cookies are always active.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button 
                onClick={() => setShowCookieConsent(false)}
                style={{ 
                  background: 'linear-gradient(135deg, #06b6d4, #4f46e5)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '9px 20px', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Accept All
              </button>
              <button 
                onClick={() => setShowCookieConsent(false)}
                style={{ 
                  background: 'transparent', 
                  color: '#94a3b8', 
                  border: '1px solid #334155', 
                  borderRadius: '8px', 
                  padding: '9px 20px', 
                  fontSize: '13px', 
                  fontWeight: 600, 
                  cursor: 'pointer' 
                }}
              >
                Reject All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <ContactModal 
            isOpen={showContactModal} 
            onClose={() => setShowContactModal(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
