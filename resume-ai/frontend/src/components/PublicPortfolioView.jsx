import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Code2, ExternalLink, Send, ArrowLeft, Award, Globe, User
} from 'lucide-react';
import ForgeLogo from './ForgeLogo';

const PublicPortfolioView = ({ resumeId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await fetch(`/api/resumes/public/${resumeId}`);
        const result = await response.json();
        if (response.ok && result.success) {
          setData(result.data);
        } else {
          setError(result.message || 'Failed to load portfolio details.');
        }
      } catch (err) {
        setError('Network error connecting to portfolio server.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [resumeId]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Please fill in all contact fields.');
      return;
    }
    setSent(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', message: '' });
      setSent(false);
      alert('Message sent successfully to candidate!');
    }, 1500);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
          <Code2 size={48} color="#3b82f6" />
        </motion.div>
        <p style={{ marginTop: '1.5rem', fontWeight: 700, letterSpacing: '0.05em' }}>GENERATING PUBLIC PORTFOLIO...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: 'white', padding: '2rem' }}>
        <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', marginBottom: '1.5rem' }}>{error || 'Portfolio not found'}</p>
        {onBack && (
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
            <ArrowLeft size={16} /> Go Back
          </button>
        )}
      </div>
    );
  }

  const { personalInfo = {}, experience = [], education = [], projects = [], skills = {}, department = 'Fullstack' } = data;

  // Visual Themes
  const themes = {
    'Frontend': { primary: '#0d9488', accent: '#14b8a6', glow: 'rgba(13,148,136,0.15)' },
    'Backend': { primary: '#1e40af', accent: '#3b82f6', glow: 'rgba(30,64,175,0.15)' },
    'Fullstack': { primary: '#3b82f6', accent: '#60a5fa', glow: 'rgba(59,130,246,0.15)' },
    'Sales': { primary: '#ea580c', accent: '#f97316', glow: 'rgba(234,88,12,0.15)' },
    'BDA': { primary: '#e11d48', accent: '#f43f5e', glow: 'rgba(225,29,72,0.15)' }
  };
  const theme = themes[department] || themes['Fullstack'];

  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>
      
      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', background: 'rgba(15,23,42,0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, tracking: '-0.02em', background: `linear-gradient(135deg, ${theme.accent}, #fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {personalInfo.name?.toUpperCase() || 'PORTFOLIO'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 700 }}>
          <a href="#home" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.color = theme.accent} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Home</a>
          <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.color = theme.accent} onMouseLeave={e => e.target.style.color = '#94a3b8'}>About</a>
          <a href="#experience" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.color = theme.accent} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Experience</a>
          <a href="#projects" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.color = theme.accent} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Projects</a>
          <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.color = theme.accent} onMouseLeave={e => e.target.style.color = '#94a3b8'}>Contact</a>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: `1px solid ${theme.accent}`, background: 'none', color: theme.accent, padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Back to App
          </button>
        )}
      </nav>

      {/* ── Hero Section (Home) ───────────────────── */}
      <section id="home" style={{ padding: '8rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: theme.glow, filter: 'blur(80px)', zIndex: 0 }} />
        
        <div style={{ maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ color: theme.accent, fontSize: '1.05rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Welcome to my space
            </span>
            <h1 style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: 950, tracking: '-0.04em', color: 'white', lineHeight: 1.05, margin: '1rem 0' }}>
              Hello, I'm <br />
              <span style={{ background: `linear-gradient(135deg, ${theme.accent} 0%, #fff 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {personalInfo.name || 'Your Name'}
              </span>
            </h1>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '2.5rem' }}>
              Professional {department} Specialist
            </h2>
            
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <a href="#contact" style={{ padding: '1rem 2rem', background: theme.accent, color: '#0f172a', textDecoration: 'none', borderRadius: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: `0 10px 25px ${theme.glow}` }}>
                Let's Talk <Send size={18} />
              </a>
              <a href="#projects" style={{ padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', textDecoration: 'none', borderRadius: '12px', fontWeight: 800, transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.target.style.background = 'none'}>
                View Work
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── About Section ─────────────────────────── */}
      <section id="about" style={{ padding: '6rem 4rem', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', boxShadow: '0 20px 45px rgba(0,0,0,0.15)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: theme.accent, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem', fontWeight: 900 }}>
                {personalInfo.name ? personalInfo.name.split(' ').map(n => n[0]).join('') : <User size={40} />}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.5rem' }}>{personalInfo.name}</h3>
              <p style={{ fontSize: '0.85rem', color: theme.accent, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem' }}>{department} Department</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14}/> {personalInfo.email || 'N/A'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14}/> {personalInfo.phone || 'N/A'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14}/> {personalInfo.location || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '1.5rem', tracking: '-0.02em' }}>Professional Biography</h3>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: 1.75, marginBottom: '2rem' }}>
              {personalInfo.summary || 'Summary biography details have not been finalized yet.'}
            </p>
            
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Education Credentials</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ background: theme.glow, color: theme.accent, padding: '0.5rem', borderRadius: '10px' }}><GraduationCap size={18} /></div>
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 900, margin: 0, color: 'white' }}>{edu.degree || 'Degree'}</h5>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{edu.institution || edu.school} • {edu.tenure || edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience Section ────────────────────── */}
      <section id="experience" style={{ padding: '6rem 4rem', maxWidth: '1000px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '3rem', textCenter: 'center', tracking: '-0.02em' }}>Work History</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: `2px solid rgba(255,255,255,0.05)` }}>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              {/* Timeline dot */}
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: theme.accent, border: '3px solid #0f172a', position: 'absolute', left: '-22px', top: '6px' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: 0 }}>{exp.role || 'Job Role'}</h4>
                  <span style={{ fontSize: '0.95rem', color: theme.accent, fontWeight: 700 }}>{exp.company || 'Company'}</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>{exp.duration || exp.year}</span>
              </div>
              <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6 }}>{exp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Projects Section ──────────────────────── */}
      <section id="projects" style={{ padding: '6rem 4rem', maxWidth: '1280px', margin: '0 auto', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '3rem', tracking: '-0.02em' }}>Key Projects</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6, borderColor: theme.accent }}
              style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px', transition: 'border-color 0.2s' }}
            >
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>{proj.title || proj.name}</h4>
                <p style={{ fontSize: '0.85rem', color: theme.accent, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>{proj.role || 'Contributor'}</p>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>{proj.desc || proj.points?.join(' ')}</p>
              </div>
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: theme.accent, fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', marginTop: '1.5rem' }}>
                  View Project <ExternalLink size={14} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Contact Section ───────────────────────── */}
      <section id="contact" style={{ padding: '6rem 4rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2.2rem', fontWeight: 950, marginBottom: '1rem', tracking: '-0.02em' }}>Get In Touch</h3>
        <p style={{ color: '#94a3b8', marginBottom: '3rem', fontSize: '1.05rem' }}>Interested in hiring or collaboration opportunities? Send an instant alert message.</p>
        
        <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Your Name</label>
              <input type="text" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={{ padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', outline: 'none', color: '#fff', fontWeight: 600 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Your Email</label>
              <input type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={{ padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', outline: 'none', color: '#fff', fontWeight: 600 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Your Message</label>
            <textarea value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} rows={4} style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', outline: 'none', color: '#fff', fontWeight: 600, resize: 'none' }} />
          </div>
          
          <button type="submit" disabled={sent} style={{ padding: '1rem 2rem', background: theme.accent, color: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            Send Message <Send size={18} />
          </button>
        </form>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer style={{ padding: '4rem', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        <p>© {new Date().getFullYear()} {personalInfo.name}. Automatically generated by FORGE RESUME.</p>
      </footer>

    </div>
  );
};

export default PublicPortfolioView;
