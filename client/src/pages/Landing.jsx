import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ForgeLogo from '../components/common/ForgeLogo';
import ContactModal from '../components/common/ContactModal';
import {
  Sparkles, Compass, FileSearch, FileText, MessageCircle, Briefcase, 
  ArrowRight, ChevronRight, Layers, HelpCircle, X, Upload
} from 'lucide-react';
import { generateResumeAI } from '../services/aiService';

const LandingPage = () => {
  const navigate = useNavigate();
  const onEnterApp = (action) => {
    localStorage.setItem('builder_mode', 'manual');
    navigate('/builder');
  };
  const isLoggedIn = false;
  const [showContactModal, setShowContactModal] = useState(false);

  // AI Generator Modal States
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiExperience, setAiExperience] = useState('2-5 Years');
  const [aiSkills, setAiSkills] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'advisor',
      text: "Hi! I'm your Career Advisor. I've helped thousands land their dream jobs. What brings you here today?"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

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
      setGeneratingAi(true);
      const res = await generateResumeAI({ jobTitle: aiJobTitle, experience: aiExperience, skills: aiSkills });
      const aiData = typeof res.data?.data === 'string' ? JSON.parse(res.data.data) : (res.data?.data || res.data);
      const newSessionId = 'session_ai_' + Date.now();
      const sessionData = {
        title: `${aiJobTitle} Resume`,
        department: aiJobTitle,
        templateId: 'modern',
        personalInfo: {
          name: aiData?.personalInfo?.fullName || aiData?.name || 'Alexander Wright',
          role: aiJobTitle,
          email: 'user@forgeindiaconnect.app',
          phone: '+1 (555) 000-0000',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/alexander-wright',
          github: 'github.com/alexander-wright',
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
      overflowX: 'hidden'
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-15%', width: 700, height: 700, background: 'rgba(165, 243, 252, 0.45)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', top: '45%', left: '-15%', width: 600, height: 600, background: 'rgba(199, 210, 254, 0.35)', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.7 }} />
        <div style={{ position: 'absolute', bottom: '-5%', right: '15%', width: 500, height: 500, background: 'rgba(219, 234, 254, 0.4)', borderRadius: '50%', filter: 'blur(110px)', opacity: 0.8 }} />
      </div>

      {/* Navigation Header - White & Sky Blue */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <ForgeLogo size={36} showText={true} variant="light" />
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[
            { label: 'Home', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Features', href: '#features' },
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
              style={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0284c7'}
              onMouseLeave={e => e.currentTarget.style.color = '#475569'}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setShowAiModal(true)}
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
            onClick={() => onEnterApp(isLoggedIn ? null : 'login')}
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
      </nav>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        
        {/* Hero Section */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 4rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '1.35rem', color: '#334155', fontWeight: 500, margin: 0 }}>
              Thinking about your next career move — not sure where to start?
            </p>
            <p style={{ 
              fontSize: '1.65rem', 
              fontFamily: "'Playfair Display', serif", 
              fontStyle: 'italic', 
              color: '#0284c7',
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
            border: '1px solid #bae6fd', 
            background: '#e0f2fe', 
            color: '#0284c7', 
            fontSize: '0.875rem', 
            fontWeight: 800, 
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
              background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
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
            Career 360° gives you the <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0284c7' }}>standout resume</span> + <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0ea5e9' }}>executive one-pager</span> — <span style={{ fontStyle: 'normal', fontWeight: 700, color: '#0f172a' }}>in minutes.</span>
            <span style={{ display: 'block', marginTop: '1rem', fontStyle: 'normal', fontSize: '1.05rem', color: '#64748b' }}>
              It also maps your next roles — so recruiters can find you for what's coming, not just what's been.
            </span>
          </p>

          {/* Hero Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => onEnterApp('create')}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                color: 'white',
                border: 'none',
                padding: '1.1rem 2.2rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 10px 25px rgba(2,132,199,0.35)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 30px rgba(2,132,199,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(2,132,199,0.35)'; }}
            >
              <span style={{ lineHeight: 1, marginTop: '2px' }}>Create Resume</span>
              <ArrowRight size={18} style={{ marginTop: '1px' }} />
            </button>

            <button 
              onClick={() => setShowAiModal(true)}
              style={{
                background: '#ffffff',
                color: '#0284c7',
                border: '2px solid #0284c7',
                padding: '1.1rem 2.2rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(2,132,199,0.12)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(2,132,199,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(2,132,199,0.12)'; }}
            >
              <Sparkles size={18} color="#0284c7" />
              <span>Generate with AI</span>
            </button>

            <button 
              onClick={() => navigate('/industry-examples')}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                color: '#0f172a',
                border: '2px solid #cbd5e1',
                padding: '1.1rem 2.2rem',
                borderRadius: '16px',
                fontSize: '1.1rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#0284c7'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            >
              <span style={{ lineHeight: 1, marginTop: '2px' }}>Resume Examples</span>
              <ArrowRight size={18} style={{ marginTop: '1px' }} />
            </button>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 700 }}>
            <Sparkles size={16} color="#eab308" /> Trusted by 10,000+ Professionals
          </div>
        </section>

        {/* Cosmic Comparison Showcase: Executive Ready Resumes | Career 360° Output */}
        <section id="features" style={{ 
          maxWidth: '1200px', 
          margin: '0 auto 6rem', 
          padding: '4rem 2rem', 
          background: 'radial-gradient(circle at center, #111827 0%, #030712 100%)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px rgba(3,7,18,0.4), inset 0 0 100px rgba(2, 132, 199, 0.1)',
          border: '1.5px solid rgba(2, 132, 199, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '15%', left: '10%', width: '4px', height: '4px', background: 'white', borderRadius: '50%', boxShadow: '0 0 12px white', opacity: 0.8 }} />
          <div style={{ position: 'absolute', top: '75%', left: '85%', width: '3px', height: '3px', background: 'white', borderRadius: '50%', boxShadow: '0 0 8px white', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: '40%', right: '25%', width: '5px', height: '5px', background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 15px #38bdf8', opacity: 0.7 }} />
          <div style={{ position: 'absolute', top: '80%', left: '20%', width: '2px', height: '2px', background: '#818cf8', borderRadius: '50%', opacity: 0.5 }} />

          <h2 style={{ 
            fontSize: '2.1rem', 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: 500, 
            textAlign: 'center', 
            color: '#f3f4f6', 
            marginBottom: '4rem',
            letterSpacing: '0.02em'
          }}>
            Executive Ready Resumes | Career 360° Output
          </h2>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '2.5rem',
            position: 'relative',
            zIndex: 10
          }}>
            {/* Left Card: Resume Preview */}
            <div style={{ 
              flex: 1.1,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(2, 132, 199, 0.15)',
              padding: '2.2rem',
              color: '#1e293b',
              textAlign: 'left',
              fontFamily: "'Inter', sans-serif"
            }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
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
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <motion.div 
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', filter: 'drop-shadow(0 0 10px #38bdf8)' }}
              >
                →
              </motion.div>
            </div>

            {/* Right Card: Career 360° Profile */}
            <div style={{ 
              flex: 1.1,
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              border: '1.5px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(56, 189, 248, 0.25)',
              padding: '2.2rem',
              color: '#f8fafc',
              textAlign: 'left',
              fontFamily: "'Inter', sans-serif"
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: "'Playfair Display', serif", color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', margin: 0 }}>
                Your Career 360° Profile
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 15px rgba(2,132,199,0.4)' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
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
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section style={{ borderTop: '1px solid #f1f5f9', background: 'linear-gradient(180deg, #f8f9fb 0%, #eef2ff 100%)', padding: '5rem 2rem', position: 'relative' }}>
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
              <div style={{ background: '#ecfeff', border: '1px solid #cffafe', padding: '2rem', borderRadius: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Sparkles size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#cffafe', color: '#0284c7', textTransform: 'uppercase' }}>Your Story</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 1</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>We read your career</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Upload your resume or import from LinkedIn. Career 360° understands not just where you've been — but the trajectory you're on.
                </p>
              </div>

              <div style={{ background: '#eef2ff', border: '1px solid #e0e7ff', padding: '2rem', borderRadius: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Compass size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#e0e7ff', color: '#0284c7', textTransform: 'uppercase' }}>Your Next Move</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 900, display: 'block', marginBottom: '0.4rem' }}>STEP 2</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>AI predicts your future roles</h3>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Most people stay stuck because they can't see what's next. Career 360° maps the next roles your career is pointing toward.
                </p>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '2rem', borderRadius: '24px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Layers size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '50px', background: '#fef3c7', color: '#b45309', textTransform: 'uppercase' }}>Get Discovered</span>
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
              <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>What you get</p>
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

              <div style={{ background: 'linear-gradient(135deg, #fffbeb, #fff7ed)', border: '2px solid #fcd34d', padding: '2.2rem 2rem', borderRadius: '24px', position: 'relative' }}>
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
        <section style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '6rem 2rem', color: 'white', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 400, height: 400, background: 'rgba(6, 182, 212, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', padding: '0.4rem 1rem', borderRadius: '50px', color: '#22d3ee', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
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
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
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
                      maxWidth: '75%', 
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
                  <div style={{ display: 'flex', gap: '0.35rem', paddingLeft: '1rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
                  </div>
                )}
              </div>

              <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {[
                    { text: 'Career Strategy', id: 'strategy', icon: Compass, color: '#0284c7' },
                    { text: 'Resume Analysis', id: 'analysis', icon: FileSearch, color: '#06b6d4' },
                    { text: 'Resume Creation', id: 'creation', icon: FileText, color: '#10b981' },
                    { text: 'Interview Prep', id: 'prep', icon: MessageCircle, color: '#f59e0b' }
                  ].map(btn => {
                    const IconComp = btn.icon;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => handleAdvisorChoice(btn.text, btn.id)}
                        style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1rem 0.5rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = btn.color; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
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
        <section id="pricing" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '6rem 2rem', textAlign: 'center', color: 'white', position: 'relative' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '3rem', fontFamily: "'Playfair Display', serif", fontWeight: 500, color: 'white', marginBottom: '2rem', lineHeight: 1.2 }}>
              Your potential isn't hidden.<br />
              <span style={{ background: 'linear-gradient(90deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>
                It's just not mapped.
              </span>
            </h2>

            <button 
              onClick={() => onEnterApp('create')}
              style={{ background: '#ffffff', color: '#0f172a', border: 'none', padding: '1.25rem 3rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 30px rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ lineHeight: 1, marginTop: '2px' }}>Create My Career 360°</span> <ArrowRight size={20} style={{ marginTop: '1px' }} />
            </button>
            <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Join thousands of professionals today · No credit card required
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: 'linear-gradient(90deg, #0f172a, #1e3a8a)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '4rem 2rem', color: '#94a3b8', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', display: 'block', marginBottom: '1rem' }}>
              FORGE <span style={{ color: '#f59e0b' }}>INDIA</span> <span style={{ color: '#ffffff' }}>CONNECT</span>
            </span>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
              AI-powered career transformation platform. Expert-driven optimization, intelligent insights, and accelerated career advancement. Powered by Forge India Connect Pvt. Ltd.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</h4>
            <span onClick={() => navigate('/industry-examples')} style={{ fontSize: '0.85rem', color: '#94a3b8', cursor: 'pointer', display: 'block', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>Resume Examples</span>
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
          <span>© 2025 FORGE INDIA CONNECT PVT. LTD. All rights reserved.</span>
          <span style={{ color: 'white', fontWeight: 600 }}>SHAPING FUTURE</span>
        </div>
      </footer>


      {/* AI Resume Generator Modal */}
      {showAiModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '20px', maxWidth: '520px', width: '100%', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.5rem', borderRadius: '10px' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>Generate Resume with AI</h3>
                </div>
              </div>
              <button onClick={() => setShowAiModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleGenerateAiResume} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Job Title</label>
                <input type="text" required placeholder="e.g. Frontend Developer, Project Manager" value={aiJobTitle} onChange={e => setAiJobTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Experience</label>
                <select value={aiExperience} onChange={e => setAiExperience(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="Entry Level (0-2 Years)">Entry Level (0-2 Years)</option>
                  <option value="2-5 Years">2-5 Years</option>
                  <option value="5-8 Years">5-8 Years</option>
                  <option value="8+ Years (Senior/Executive)">8+ Years (Senior/Executive)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '0.35rem' }}>Skills</label>
                <input type="text" placeholder="e.g. React, Node.js, JavaScript" value={aiSkills} onChange={e => setAiSkills(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" disabled={generatingAi}
                style={{ marginTop: '0.5rem', padding: '0.85rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0284c7, #0ea5e9)', color: 'white', fontSize: '0.95rem', fontWeight: 900, cursor: generatingAi ? 'wait' : 'pointer', boxShadow: '0 6px 18px rgba(2, 132, 199, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {generatingAi ? 'Generating Resume...' : 'Generate Resume'}
              </button>
            </form>
          </div>
        </div>
      )}

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
