import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ForgeLogo from '../components/common/ForgeLogo';
import ContactModal from '../components/common/ContactModal';
import {
  Sparkles, Compass, FileText, MessageCircle, Briefcase, 
  ArrowRight, ChevronRight, HelpCircle, Upload, Layers,
  FileSearch, X, Menu, Mail, Phone, MapPin, Globe, ExternalLink,
  CheckCircle2, Zap, Star, ShieldCheck
} from 'lucide-react';
import { generateResumeAI } from '../services/aiService';
import { getOrCreateUser } from '../utils/userIdentity';
import { createResume } from '../services/resumeService';
import { startSession, trackEvent } from '../utils/sessionTracker';

const LandingPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const onEnterApp = async (action) => {
    try {
      await getOrCreateUser();
      await trackEvent(
        action === 'create' ? "Clicked 'Create Resume' (Manual Builder)" : "Clicked 'Get Started' (Landing CTA)",
        '/builder'
      );
    } catch (e) {}
    localStorage.setItem('builder_mode', 'manual');
    localStorage.setItem('source', 'create');
    navigate('/builder');
  };

  const [showContactModal, setShowContactModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // AI Generator Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiExperience, setAiExperience] = useState('2-5 Years');
  const [aiSkills, setAiSkills] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  // Create Resume Modal States
  // States removed to navigate directly to the builder
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'advisor',
      text: "Hi! I'm your Career Advisor. I've helped thousands land their dream jobs. What brings you here today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Start tracking user session as soon as they hit the landing page
    startSession();
    trackEvent("🌐 Visited Landing Page", "/");
  }, []);

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
    try {
      trackEvent(`💬 Used Career Advisor: ${choiceText}`, "/");
    } catch (e) {}
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

  const handleGenerateAiResume = async (e) => {
    e.preventDefault();
    if (!aiJobTitle.trim()) {
      alert('Please enter a target Job Title.');
      return;
    }
    try {
      const user = await getOrCreateUser();
      console.log("Current user:", user);
      
      setGeneratingAi(true);
      const res = await generateResumeAI({ jobTitle: aiJobTitle, experience: aiExperience, skills: aiSkills });
      const aiData = typeof res.data?.data === 'string' ? JSON.parse(res.data.data) : (res.data?.data || res.data);
      const newSessionId = 'session_ai_' + Date.now();
      const sessionData = {
        title: `${aiJobTitle} Resume`,
        department: aiJobTitle,
        templateId: 'modern',
        source: 'ai',
        price: 99,
        paymentStatus: 'pending',
        personalInfo: {
          name: aiData?.personalInfo?.fullName || aiData?.name || 'Rohan Sharma',
          role: aiJobTitle,
          email: 'rohan.sharma@forgeindiaconnect.com',
          phone: '+91 98765 43210',
          location: 'Bengaluru, Karnataka',
          linkedin: 'linkedin.com/in/rohansharma',
          github: 'github.com/rohansharma',
          summary: aiData?.summary || `Dedicated and performance-driven ${aiJobTitle} with proven results and technical expertise.`
        },
        skills: {
          programming: Array.isArray(aiData?.skills) ? aiData.skills : (aiSkills ? aiSkills.split(',').map(s => s.trim()).filter(Boolean) : ['React.js', 'Node.js', 'TypeScript']),
          frameworks: ['REST APIs', 'Redux Toolkit', 'Tailwind CSS'],
          databases: ['PostgreSQL', 'MongoDB', 'AWS']
        },
        experience: Array.isArray(aiData?.experience) && aiData.experience.length > 0 
          ? aiData.experience.map(e => ({
              title: e.position || e.title || aiJobTitle,
              company: e.company || 'Enterprise Solutions Ltd.',
              duration: e.duration || '2022 - Present',
              desc: e.description || e.desc || `Architected scalable solutions for ${aiJobTitle} initiatives.`
            }))
          : [
              {
                title: `Senior ${aiJobTitle}`,
                company: 'Apex Digital Systems',
                duration: '2022 - Present',
                desc: `Spearheaded key product developments utilizing ${aiSkills || 'modern technical stack'}.\nOptimized performance metrics resulting in 35% efficiency boost.`
              }
            ],
        projects: Array.isArray(aiData?.projects) && aiData.projects.length > 0
          ? aiData.projects.map(p => ({
              name: p.title || p.name || `${aiJobTitle} Core Platform`,
              technology: aiSkills || 'React, Node.js, Cloud',
              desc: p.description || p.desc || 'Designed and deployed automated workflows across modern applications.'
            }))
          : [
              {
                name: `${aiJobTitle} Automation System`,
                technology: aiSkills || 'React, Node.js, Cloud Services',
                desc: 'Built fullstack web platform handling high concurrency requests with zero downtime.'
              }
            ],
        education: [
          { degree: 'B.S. in Computer Science & Engineering', institution: 'University of Washington', tenure: '2016 - 2020', cgpa: '3.9' }
        ]
      };
      localStorage.setItem('activeResumeSessionId', newSessionId);
      localStorage.setItem(`resume_draft_${newSessionId}`, JSON.stringify(sessionData));
      localStorage.setItem('localResumeDraft', JSON.stringify(sessionData));

      // Track AI generation in UserSession
      try {
        await trackEvent(`Generated Resume with AI: ${aiJobTitle}`, `/ai-resume/${newSessionId}`, {
          resumeCreated: true,
          resumeName: sessionData.personalInfo.name,
          email: sessionData.personalInfo.email,
        });
      } catch (trackErr) {}

      setShowAiModal(false);
      navigate(`/ai-resume/${newSessionId}`);
    } catch (err) {
      alert('AI Generation Error: ' + err.message);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fb', 
      color: '#1e293b', 
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'clip'
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="landing-orb-1" style={{ position: 'absolute', top: '-10%', right: '-15%', width: 700, height: 700, background: 'rgba(165, 243, 252, 0.45)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.8 }} />
        <div className="landing-orb-2" style={{ position: 'absolute', top: '45%', left: '-15%', width: 600, height: 600, background: 'rgba(199, 210, 254, 0.35)', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.7 }} />
        <div className="landing-orb-3" style={{ position: 'absolute', bottom: '-5%', right: '15%', width: 500, height: 500, background: 'rgba(219, 234, 254, 0.4)', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.8 }} />
      </div>

      {/* Navigation Header - Fixed at Top */}
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div className="landing-nav-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <ForgeLogo size={46} showText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="landing-desktop-nav">
            {[
              { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { label: 'Features', href: '#features' },
              { label: 'Examples', onClick: () => navigate('/industry-examples') }
            ].map((item, idx) => (
              <span
                key={idx}
                onClick={item.onClick || (() => {
                  const el = document.querySelector(item.href);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                })}
                style={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0284c7'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >
                {item.label}
              </span>
            ))}
          </div>

          {/* Desktop Action Buttons */}
          <div className="landing-desktop-actions">
            <button 
              onClick={async () => {
                try {
                  await getOrCreateUser();
                  await trackEvent("Clicked 'AI Resume Generator' (Navbar)", "/");
                } catch (e) {}
                localStorage.setItem('source', 'ai');
                setShowAiModal(true);
              }}
              style={{
                background: 'white',
                border: '1.5px solid #0284c7',
                color: '#0284c7',
                padding: '0.5rem 1.15rem',
                borderRadius: '24px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 6px rgba(2,132,199,0.08)'
              }}
            >
              <Sparkles size={15} /> ✨ AI Resume Generator
            </button>

            <button 
              onClick={() => {
                if (isLoggedIn) {
                  navigate('/admin/dashboard');
                } else {
                  onEnterApp('create');
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                border: 'none',
                color: 'white',
                padding: '0.55rem 1.35rem',
                borderRadius: '24px',
                fontWeight: 800,
                fontSize: '0.85rem',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                cursor: 'pointer'
              }}
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="landing-mobile-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle Navigation Menu"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'white',
                borderTop: '1px solid #e2e8f0',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
              }}
            >
              <span
                onClick={() => { setShowMobileMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', padding: '0.4rem 0' }}
              >
                Home
              </span>
              <span
                onClick={() => {
                  setShowMobileMenu(false);
                  const el = document.querySelector('#features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', padding: '0.4rem 0' }}
              >
                Features
              </span>
              <span
                onClick={async () => { 
                  setShowMobileMenu(false); 
                  try {
                    await getOrCreateUser();
                    await trackEvent("Clicked 'Resume Examples' (Mobile)", "/industry-examples");
                  } catch (e) {}
                  navigate('/industry-examples'); 
                }}
                style={{ color: '#0f172a', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', padding: '0.4rem 0' }}
              >
                Examples
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button 
                  onClick={async () => { 
                    setShowMobileMenu(false); 
                    try {
                      await getOrCreateUser();
                      await trackEvent("Clicked 'Generate with AI' (Mobile)", "/");
                    } catch (e) {}
                    localStorage.setItem('source', 'ai');
                    setShowAiModal(true); 
                  }}
                  style={{
                    background: '#e0f2fe',
                    border: '1.5px solid #0284c7',
                    color: '#0284c7',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Sparkles size={16} /> AI Resume Generator
                </button>

                <button 
                  onClick={() => { setShowMobileMenu(false); onEnterApp(isLoggedIn ? null : 'login'); }}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                    border: 'none',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                    cursor: 'pointer'
                  }}
                >
                  {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10, paddingTop: '80px' }}>
        
        {/* Hero Section */}
        <section className="landing-hero-section" style={{ position: 'relative', zIndex: 2 }}>
          
          <div className="landing-hero-wrapper">
            {/* Left Floating Interactive Badges (Desktop) */}
            <motion.div 
              className="hero-side-widget hero-side-left-1"
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.45rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>98% ATS Pass Rate</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Algorithm Optimized</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="hero-side-widget hero-side-left-2"
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.35rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={15} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>AI Bullet Optimizer</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 0.45rem', lineHeight: 1.3 }}>Smart impact verbs & metrics</p>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#334155', padding: '0.2rem 0.45rem', borderRadius: '6px', fontWeight: 600 }}>+35% Growth</span>
                <span style={{ fontSize: '0.65rem', background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.45rem', borderRadius: '6px', fontWeight: 600 }}>ATS Ready</span>
              </div>
            </motion.div>

            {/* Right Floating Interactive Badges (Desktop) */}
            <motion.div 
              className="hero-side-widget hero-side-right-1"
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.45rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={18} fill="#d97706" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>4.9/5 Rating</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>10,000+ Resumes Built</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="hero-side-widget hero-side-right-2"
              initial={{ opacity: 0, x: 35 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>ATS Score</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#16a34a' }}>96 / 100</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.45rem' }}>
                <div style={{ width: '96%', height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)', borderRadius: '10px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#0f172a', fontWeight: 700 }}>
                <span style={{ color: '#10b981' }}>✓</span> Recruiter & ATS Approved
              </div>
            </motion.div>

            {/* Central Hero Typography */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}
            >
              <p style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)', color: '#334155', fontWeight: 500, margin: 0, padding: '0 0.5rem' }}>
                Thinking about your next career move — not sure where to start?
              </p>
              <p style={{ 
                fontSize: 'clamp(1.15rem, 3vw, 1.55rem)', 
                fontFamily: "'Playfair Display', serif", 
                fontStyle: 'italic', 
                color: '#0284c7',
                fontWeight: 600,
                margin: 0,
                padding: '0 0.5rem'
              }}>
                Let's find your next role.
              </p>
            </motion.div>

            <motion.h1 
              className="landing-hero-h1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              Build Professional <span style={{ 
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900
              }}>ATS-Friendly Resume</span> with AI
            </motion.h1>

            <motion.p 
              className="landing-hero-sub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            >
              Career 360° gives you the <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0284c7' }}>standout resume</span> + <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0ea5e9' }}>executive one-pager</span> — <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0f172a' }}>in minutes.</span>
              <span style={{ display: 'block', marginTop: '0.65rem', fontStyle: 'normal', fontSize: 'clamp(0.85rem, 1.8vw, 1rem)', color: '#64748b' }}>
                It also maps your next roles — so recruiters can find you for what's coming, not just what's been.
              </span>
            </motion.p>
          </div>

          {/* Hero Action Cards */}
          <div className="landing-hero-cards">
            
            {/* Create Resume */}
            <motion.div 
              className="landing-hero-card landing-card-interactive" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(2, 132, 199, 0.12)' }}
              style={{
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer'
              }}
              onClick={() => onEnterApp('create')}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📝</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Create Resume</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Build your resume your way</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Free to create
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Fully editable
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Live preview
                </div>
              </div>
              <button style={{
                background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: 'auto'
              }}>
                Start Creating <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* AI Resume */}
            <motion.div 
              className="landing-hero-card landing-card-interactive" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.25)' }}
              style={{
                background: '#ffffff', border: '2px solid #0ea5e9', borderRadius: '16px', padding: '1.5rem', textAlign: 'left',
                boxShadow: '0 8px 16px rgba(14, 165, 233, 0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer'
              }}
              onClick={async () => {
                try {
                  await getOrCreateUser();
                  await trackEvent("Clicked 'Generate with AI'", "/");
                } catch (e) {}
                localStorage.setItem('source', 'ai');
                setShowAiModal(true);
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✨</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Generate with AI</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Let AI help build your resume</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> AI-powered writing
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Edit before downloading
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Live preview
                </div>
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: 'auto'
              }}>
                Generate with AI
              </button>
            </motion.div>

            {/* Resume Examples */}
            <motion.div 
              className="landing-hero-card landing-card-interactive" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(2, 132, 199, 0.12)' }}
              style={{
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer'
              }}
              onClick={async () => {
                try {
                  const user = await getOrCreateUser();
                  await trackEvent("Clicked 'Resume Examples'", "/industry-examples");
                  localStorage.setItem('source', 'template');
                  navigate('/industry-examples');
                } catch (error) {
                  navigate('/industry-examples');
                }
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📄</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>Resume Examples</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Start with a professional template</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Professional templates
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Fully customizable
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Live preview
                </div>
              </div>
              <button style={{
                background: '#f1f5f9', color: '#0f172a', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: 'auto'
              }}>
                Browse Examples <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* ATS Resume Checker */}
            <motion.div 
              className="landing-hero-card feature-card landing-card-interactive" 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              whileHover={{ y: -8, boxShadow: '0 20px 35px rgba(2, 132, 199, 0.15)' }}
              style={{
                background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', textAlign: 'left',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer'
              }}
              onClick={async () => {
                try {
                  await getOrCreateUser();
                  await trackEvent("Clicked 'ATS Resume Checker'", "/resume-checker");
                } catch (e) {}
                navigate('/resume-checker');
              }}
            >
              <div className="feature-icon" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📊</div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>ATS Resume Checker</h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Upload your resume and receive a professional ATS score</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.5rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Overall score out of 100
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Identify missing information
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Get improvement suggestions
                </div>
              </div>
              <button 
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await getOrCreateUser();
                    await trackEvent("Clicked 'ATS Resume Checker'", "/resume-checker");
                  } catch (err) {}
                  navigate('/resume-checker');
                }}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: 'auto',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                }}
              >
                Check My Resume <ArrowRight size={16} />
              </button>
            </motion.div>

          </div>

          {/* Trust & Guarantee Highlights Ribbon */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{ 
              maxWidth: '1120px', 
              margin: '3.5rem auto 0',
              padding: '1.25rem 1.75rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(2, 132, 199, 0.04)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1.25rem',
              alignItems: 'center'
            }}
          >
            {/* Guarantee 1 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Free to Create & Edit</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Pay only when you download</div>
              </div>
            </div>

            {/* Guarantee 2 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Zap size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>No Subscriptions</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Single affordable one-time download</div>
              </div>
            </div>

            {/* Guarantee 3 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Star size={22} fill="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>10,000+ Professionals</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Rated 4.9/5 by job seekers</div>
              </div>
            </div>

            {/* Guarantee 4 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textAlign: 'left' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>ATS Verified Formats</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>Recruiter-approved templates</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section - Step 1, 2, 3 */}
        <section id="features" style={{ borderTop: '1px solid #f1f5f9', background: 'linear-gradient(180deg, #f8f9fb 0%, #eef2ff 100%)', padding: 'clamp(3.5rem, 6vw, 5.5rem) 1.5rem', position: 'relative' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: '#0f172a', marginBottom: '0.5rem' }}>
                See where you're going next
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#475569', margin: 0 }}>
                Built from your real career. Designed for your next one.
              </p>
            </motion.div>

            <div className="landing-3col-grid">
              <motion.div 
                className="landing-card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ background: '#ecfeff', border: '1px solid #cffafe', padding: '2rem', borderRadius: '24px', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(2,132,199,0.2)' }}>
                    <Sparkles size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#cffafe', color: '#0284c7', textTransform: 'uppercase' }}>Your Story</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 1</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>We read your career</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Upload your resume or import from LinkedIn. Career 360° understands not just where you've been — but the trajectory you're on.
                </p>
              </motion.div>

              <motion.div 
                className="landing-card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ background: '#eef2ff', border: '1px solid #e0e7ff', padding: '2rem', borderRadius: '24px', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(79,70,229,0.2)' }}>
                    <Compass size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#e0e7ff', color: '#0284c7', textTransform: 'uppercase' }}>Your Next Move</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 2</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>AI predicts your future roles</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Most people stay stuck because they can't see what's next. Career 360° maps the next roles your career is pointing toward.
                </p>
              </motion.div>

              <motion.div 
                className="landing-card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '2rem', borderRadius: '24px', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 8px 16px rgba(245,158,11,0.2)' }}>
                    <Layers size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#fef3c7', color: '#b45309', textTransform: 'uppercase' }}>Get Discovered</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 3</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Recruiters find you</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Recruiters search Career 360° for candidates ready for their open roles — not based on your old title, but on where you're going next.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Cosmic Comparison Showcase: Executive Ready Resumes | Career 360° Output */}
        <section style={{ 
          maxWidth: '1200px', 
          margin: '4rem auto 6rem', 
          padding: '4rem 2rem', 
          background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px rgba(3,7,18,0.4), inset 0 0 100px rgba(2, 132, 199, 0.1)',
          border: '1.5px solid rgba(2, 132, 199, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="cosmic-star-1" style={{ position: 'absolute', top: '15%', left: '10%', width: '4px', height: '4px', background: 'white', borderRadius: '50%', boxShadow: '0 0 12px white', opacity: 0.8 }} />
          <div className="cosmic-star-2" style={{ position: 'absolute', top: '75%', left: '85%', width: '3px', height: '3px', background: 'white', borderRadius: '50%', boxShadow: '0 0 8px white', opacity: 0.6 }} />
          <div className="cosmic-star-3" style={{ position: 'absolute', top: '40%', right: '25%', width: '5px', height: '5px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 15px #38bdf8', opacity: 0.7 }} />
          <div className="cosmic-star-4" style={{ position: 'absolute', top: '80%', left: '20%', width: '3px', height: '3px', background: '#818cf8', borderRadius: '50%', boxShadow: '0 0 10px #818cf8', opacity: 0.6 }} />

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ 
              fontSize: '2.1rem', 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 500, 
              textAlign: 'center', 
              color: '#f3f4f6', 
              marginBottom: '4rem',
              letterSpacing: '0.02em'
            }}
          >
            Executive Ready Resumes | Career 360° Output
          </motion.h2>

          <div className="landing-showcase-container">
            {/* Left Card: Resume Preview */}
            <motion.div 
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ 
                flex: 1.1,
                width: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(2, 132, 199, 0.15)',
                padding: 'clamp(1.25rem, 3vw, 2.2rem)',
                color: '#1e293b',
                textAlign: 'left',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '1.5px solid #cbd5e1', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em', margin: '0 0 0.5rem 0' }}>JOHN ANDERSON</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: '0 0 0.75rem 0', wordBreak: 'break-all' }}>
                  john.anderson@gmail.com • (210) 998-1999 • Charlotte, NC • johnanderson
                </p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.65rem', fontWeight: 800, color: '#047857', background: '#d1fae5', padding: '0.3rem 0.75rem', borderRadius: '50px', textTransform: 'uppercase' }}>
                  🔒 Email & phone hidden from public view
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>PROFESSIONAL SUMMARY</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                  Strategic Marketing Leader with extensive digital marketing experience, driving brand growth & aligning go-to-market strategies.
                </p>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>PROFESSIONAL EXPERIENCE</h4>
                <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '1rem', marginLeft: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                    <div>
                      <h5 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Marketing Solutions Inc.</h5>
                      <h6 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284c7', margin: '0.1rem 0 0.3rem 0' }}>VP Marketing</h6>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Sep 2018 - Present</span>
                  </div>
                  <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: 800, color: '#0369a1', background: '#e0f2fe', padding: '0.25rem 0.6rem', borderRadius: '6px', marginBottom: '0.6rem' }}>
                    ✓ 12 years & current
                  </span>
                  <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                    • Lead integrated campaigns achieving 120% YoY growth in qualified leads.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🎓 EDUCATION</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>✓ Harvard MBA</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🎯 TOP SKILLS</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                    <span>✓ VP Marketing</span>
                    <span>✓ Chief Marketing Officer</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Arrow */}
            <div className="landing-showcase-arrow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <motion.div 
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', filter: 'drop-shadow(0 0 10px #38bdf8)' }}
              >
                →
              </motion.div>
            </div>

            {/* Right Card: Career 360° Profile */}
            <motion.div 
              initial={{ opacity: 0, x: 35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{ 
                flex: 1.1,
                width: '100%',
                background: 'rgba(15, 23, 42, 0.45)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                border: '1.5px solid rgba(56, 189, 248, 0.3)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.25)',
                padding: 'clamp(1.25rem, 3vw, 2.2rem)',
                color: '#f8fafc',
                textAlign: 'left',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', margin: 0 }}>
                Your Career 360° Profile
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 15px rgba(2,132,199,0.4)', flexShrink: 0 }}>
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: 0 }}>John Anderson</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, margin: '0.1rem 0 0 0' }}>Marketing Leader</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>15</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginLeft: '0.4rem' }}>Years</span>
                </div>
                <div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>5</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginLeft: '0.4rem' }}>Roles</span>
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.75rem' }}>TOP STRENGTH</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span style={{ color: 'white' }}>✓ VP Marketing</span>
                    <span style={{ color: 'white' }}>✓ CMO</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', display: 'block', lineHeight: 1 }}>92%</span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginTop: '0.2rem' }}>92 match • 89 match</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>🎓 EDUCATION</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>✓ Harvard MBA</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>💼 NEXT ROLES</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
                    <span>✓ VP Marketing</span>
                    <span>✓ Chief Marketing Officer</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Deliverables Section */}
        <section style={{ borderTop: '1px solid #f1f5f9', padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: '#fff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>What you get</p>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: '#0f172a', margin: 0 }}>
                Three ways Career 360° gets you found.
              </h2>
            </motion.div>

            <div className="landing-3col-grid">
              <motion.div 
                className="landing-card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{ background: '#ecfeff', border: '1px solid #cffafe', padding: '2.2rem 2rem', borderRadius: '24px' }}
              >
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}>01</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Standout Resume</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  AI-optimized for the roles you're targeting next. Pick from templates that suit your industry — ready to share in minutes.
                </p>
              </motion.div>

              <motion.div 
                className="landing-card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ background: '#eef2ff', border: '1px solid #e0e7ff', padding: '2.2rem 2rem', borderRadius: '24px' }}
              >
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}>02</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Executive One-Pager</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  A single polished document that tells your complete career story. Built from your data, in stunning themes — ready to share in 30 seconds.
                </p>
              </motion.div>

              <motion.div 
                className="landing-card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ background: 'linear-gradient(135deg, #fffbeb, #fff7ed)', border: '2px solid #fcd34d', padding: '2.2rem 2rem', borderRadius: '24px', position: 'relative' }}
              >
                <div className="pulse-badge" style={{ position: 'absolute', top: '-14px', right: '24px', background: 'linear-gradient(90deg, #f59e0b, #ea580c)', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '0.3rem 0.8rem', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  THE UNLOCK
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.5rem' }}>03</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Discoverable on TalentElite</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                  Your Career 360° makes you searchable on TalentElite — our hiring network — based on the next roles you're ready for, not just your current role.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Career Advisor Chat Simulator Section */}
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: 'clamp(3.5rem, 6vw, 6rem) 1.5rem', color: 'white', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div className="landing-orb-1" style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, background: 'rgba(6, 182, 212, 0.12)', borderRadius: '50%', filter: 'blur(100px)' }} />
            <div className="landing-orb-2" style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, background: 'rgba(99, 102, 241, 0.12)', borderRadius: '50%', filter: 'blur(100px)' }} />
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', padding: '0.4rem 1rem', borderRadius: '50px', color: '#22d3ee', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
                Career Advisor · Online
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>
                Talk to your Career Advisor
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#94a3b8', margin: 0 }}>
                AI-powered guidance for every stage of your career
              </p>
            </motion.div>

            {/* Chatbot Interface */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Simulator</span>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', minHeight: '260px' }}>
                {chatHistory.map((msg, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}
                  >
                    <div style={{ 
                      maxWidth: '85%', 
                      padding: '1rem 1.25rem', 
                      borderRadius: '16px',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      fontWeight: 500,
                      background: msg.sender === 'user' ? 'linear-gradient(135deg, #0284c7, #0ea5e9)' : 'rgba(255,255,255,0.06)',
                      border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      boxShadow: msg.sender === 'user' ? '0 8px 20px rgba(2,132,199,0.15)' : 'none'
                    }}>
                      {msg.text}
                      {msg.triggerAction && (
                        <button 
                          onClick={() => onEnterApp('create')}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', background: 'white', color: '#0f172a', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Launch Builder <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', gap: '0.4rem', paddingLeft: '1rem', alignItems: 'center', height: '24px' }}>
                    <div className="typing-dot-1" style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                    <div className="typing-dot-2" style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                    <div className="typing-dot-3" style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8' }} />
                  </div>
                )}
              </div>

              <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                <div className="landing-chat-actions">
                  {[
                    { text: 'Career Strategy', id: 'strategy', icon: Compass, color: '#0284c7' },
                    { text: 'Resume Analysis', id: 'analysis', icon: FileSearch, color: '#06b6d4' },
                    { text: 'Resume Creation', id: 'creation', icon: FileText, color: '#10b981' },
                    { text: 'Interview Prep', id: 'prep', icon: MessageCircle, color: '#f59e0b' }
                  ].map(btn => {
                    const IconComp = btn.icon;
                    return (
                      <motion.button
                        key={btn.id}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleAdvisorChoice(btn.text, btn.id)}
                        style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '0.85rem 0.4rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s, border-color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = btn.color; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                      >
                        <IconComp size={20} style={{ color: btn.color }} />
                        {btn.text}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Bottom Section */}
        <section id="pricing" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: 'clamp(3.5rem, 6vw, 6rem) 1.5rem', textAlign: 'center', color: 'white', position: 'relative' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}
          >
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'white', marginBottom: '2rem', lineHeight: 1.2 }}>
              Your potential isn't hidden.<br />
              <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>
                It's just not mapped.
              </span>
            </h2>

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 15px 35px rgba(255,255,255,0.2)' }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onEnterApp('create')}
              style={{ background: '#ffffff', color: '#0f172a', border: 'none', padding: '1.15rem 2.5rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 30px rgba(255,255,255,0.1)', cursor: 'pointer', maxWidth: '100%' }}
            >
              <span style={{ lineHeight: 1, marginTop: '2px' }}>Create My Career 360°</span> <ArrowRight size={20} style={{ marginTop: '1px' }} />
            </motion.button>
            <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Join thousands of professionals today · No credit card required
            </p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(135deg, #090e1a 0%, #0f172a 50%, #1e293b 100%)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '4rem 1.5rem 2rem', color: '#94a3b8', position: 'relative', zIndex: 10 }}>
        <div className="landing-footer-grid" style={{ maxWidth: '1140px', margin: '0 auto' }}>
          
          {/* Brand Column */}
          <div>
            <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                FORGE <span style={{ color: '#f59e0b' }}>INDIA</span> <span style={{ color: '#ffffff' }}>CONNECT</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.7, margin: '0 0 1.25rem 0' }}>
              Empowering careers and business excellence. Premier AI-driven resume builder, career placement, and digital transformation solutions.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
              <Globe size={13} />
              <span>Forge India Connect Pvt. Ltd.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Career Solutions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <span onClick={() => onEnterApp('create')} style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                AI Resume Builder
              </span>
              <span onClick={() => { localStorage.setItem('source', 'ai'); setShowAiModal(true); }} style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                AI Writing Assistant
              </span>
              <span onClick={() => navigate('/industry-examples')} style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                Industry Examples
              </span>
            </div>
          </div>

          {/* Services & Company */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Our Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#cbd5e1' }}>
                Job Consulting & Recruitment
              </span>
              <span style={{ color: '#cbd5e1' }}>
                IT & Web Development
              </span>
              <span style={{ color: '#cbd5e1' }}>
                Campus Placement Programs
              </span>
              <span onClick={() => setShowContactModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                About Forge India
              </span>
              <span onClick={() => setShowContactModal(true)} style={{ color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}>
                Contact Support
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Contact Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                  +91 98765 43210
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                  info@forgeindiaconnect.com
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', lineHeight: 1.5 }}>
                <MapPin size={16} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Rayakottai Road, Opp. HP Petrol Bunk, Krishnagiri, Tamil Nadu
                </span>
              </div>
              <div style={{ marginTop: '0.25rem', color: '#64748b', fontSize: '0.75rem' }}>
                Working Hours: Mon – Sat (9:00 AM – 7:00 PM)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1140px', margin: '0 auto', fontSize: '0.8rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span>© 2026 FORGE INDIA CONNECT PVT. LTD. All rights reserved.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#94a3b8' }}>Empowering Careers & Business Solutions</span>
            <span style={{ color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em' }}>SHAPING FUTURE</span>
          </div>
        </div>
      </footer>


      {/* Modals with Animation */}
      <AnimatePresence>
        {/* AI Resume Generator Modal */}
        {showAiModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ background: 'white', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.6rem', borderRadius: '12px' }}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>Generate Resume with AI</h3>
                  </div>
                </div>
                <button onClick={() => setShowAiModal(false)} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'} onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleGenerateAiResume} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Job Title</label>
                  <input type="text" required placeholder="e.g. Frontend Developer, Project Manager" value={aiJobTitle} onChange={e => setAiJobTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#0ea5e9'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience Level</label>
                  <select value={aiExperience} onChange={e => setAiExperience(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', appearance: 'none', background: 'white' }} onFocus={e => e.target.style.borderColor = '#0ea5e9'} onBlur={e => e.target.style.borderColor = '#e2e8f0'}>
                    <option value="Entry Level (0-2 Years)">Entry Level (0-2 Years)</option>
                    <option value="2-5 Years">2-5 Years</option>
                    <option value="5-8 Years">5-8 Years</option>
                    <option value="8+ Years (Senior/Executive)">8+ Years (Senior/Executive)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Skills (Optional)</label>
                  <input type="text" placeholder="e.g. React, Node.js, Leadership" value={aiSkills} onChange={e => setAiSkills(e.target.value)}
                    style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#0ea5e9'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <button type="submit" disabled={generatingAi}
                  style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontSize: '1rem', fontWeight: 900, cursor: generatingAi ? 'wait' : 'pointer', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'transform 0.2s' }} onMouseEnter={e => !generatingAi && (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => !generatingAi && (e.currentTarget.style.transform = 'translateY(0)')}>
                  {generatingAi ? 'Generating Intelligent Resume...' : 'Generate Resume ✨'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Create Resume Modal removed */}

        {/* Template Modal */}
        {/* Removed template modal as requested */}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && (
          <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
