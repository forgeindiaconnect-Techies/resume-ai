import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Star, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'A clean, multi-column layout optimized for tech and creative roles.',
    atsScore: '98%',
    category: 'Popular',
    thumbnail: (color) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px', gap: '6px' }}>
        {/* Header */}
        <div style={{ height: '24px', background: color, borderRadius: '4px' }} />
        {/* Two columns */}
        <div style={{ display: 'flex', flex: 1, gap: '6px' }}>
          {/* Left Column */}
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: '8px', background: '#cbd5e1', borderRadius: '2px' }} />
            <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '2px' }} />
            <div style={{ height: '28px', background: '#e2e8f0', borderRadius: '2px' }} />
          </div>
          {/* Right Column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '2px', width: '40%' }} />
            <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '2px' }} />
            <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '2px', width: '30%' }} />
            <div style={{ height: '20px', background: '#f1f5f9', borderRadius: '2px' }} />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Classic top-down single column layout designed for traditional business industries.',
    atsScore: '96%',
    category: 'Business',
    thumbnail: (color) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px', gap: '8px' }}>
        {/* Centered Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', borderBottom: `2px solid ${color}`, paddingBottom: '6px' }}>
          <div style={{ height: '10px', width: '50%', background: '#0f172a', borderRadius: '2px' }} />
          <div style={{ height: '6px', width: '70%', background: '#64748b', borderRadius: '2px' }} />
        </div>
        {/* Body Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ height: '6px', width: '30%', background: color, borderRadius: '2px' }} />
          <div style={{ height: '18px', background: '#f1f5f9', borderRadius: '2px' }} />
          <div style={{ height: '6px', width: '25%', background: color, borderRadius: '2px' }} />
          <div style={{ height: '24px', background: '#f1f5f9', borderRadius: '2px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'minimalist',
    name: 'Minimal',
    desc: 'Utterly simple layout emphasizing brevity and high-impact white spaces.',
    atsScore: '99%',
    category: 'ATS Friendly',
    thumbnail: (color) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '14px', gap: '10px' }}>
        <div style={{ height: '8px', width: '40%', background: '#0f172a', borderRadius: '2px' }} />
        <div style={{ height: '5px', width: '60%', background: '#64748b', borderRadius: '2px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
          <div style={{ height: '12px', background: '#f8fafc', borderRadius: '2px', borderLeft: `2px solid ${color}` }} />
          <div style={{ height: '12px', background: '#f8fafc', borderRadius: '2px', borderLeft: `2px solid ${color}` }} />
          <div style={{ height: '12px', background: '#f8fafc', borderRadius: '2px', borderLeft: `2px solid ${color}` }} />
        </div>
      </div>
    )
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Elegant formatting featuring high-end styling headers for managers and executives.',
    atsScore: '95%',
    category: 'Management',
    thumbnail: (color) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px', gap: '8px' }}>
        {/* Bold colored top header bar */}
        <div style={{ height: '6px', background: color, borderRadius: '2px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: '12px', width: '45%', background: '#0f172a', borderRadius: '2px' }} />
          <div style={{ height: '14px', width: '14px', borderRadius: '50%', background: color }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ height: '5px', width: '30%', background: color, borderRadius: '2px' }} />
            <div style={{ height: '35px', background: '#f1f5f9', borderRadius: '2px' }} />
          </div>
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ height: '5px', width: '60%', background: '#cbd5e1', borderRadius: '2px' }} />
            <div style={{ height: '25px', background: '#e2e8f0', borderRadius: '2px' }} />
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Dynamic, asymmetrical header blocks to stand out in creative agencies and startups.',
    atsScore: '92%',
    category: 'Creative',
    thumbnail: (color) => (
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Left thick colored stripe */}
        <div style={{ width: '18px', background: color }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '10px', gap: '6px' }}>
          <div style={{ height: '12px', width: '50%', background: '#0f172a', borderRadius: '2px' }} />
          <div style={{ height: '24px', background: '#f1f5f9', borderRadius: '2px' }} />
          <div style={{ height: '4px', width: '30%', background: color, borderRadius: '2px' }} />
          <div style={{ height: '28px', background: '#f1f5f9', borderRadius: '2px' }} />
        </div>
      </div>
    )
  },
  {
    id: 'corporate',
    name: 'Corporate',
    desc: 'Structured block grid designed specifically for high-level enterprise operations.',
    atsScore: '97%',
    category: 'Corporate',
    thumbnail: (color) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ height: '14px', width: '14px', background: color, borderRadius: '2px' }} />
          <div style={{ height: '10px', width: '40%', background: '#0f172a', borderRadius: '2px' }} />
        </div>
        <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }} />
        <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '2px' }} />
        <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '2px' }} />
        <div style={{ height: '16px', background: '#f1f5f9', borderRadius: '2px' }} />
      </div>
    )
  },
  {
    id: 'student',
    name: 'Student',
    desc: 'Highlighting project work and education blocks over traditional work history.',
    atsScore: '96%',
    category: 'Academic',
    thumbnail: (color) => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '12px', gap: '6px' }}>
        <div style={{ height: '12px', width: '40%', background: '#0f172a', borderRadius: '2px' }} />
        <div style={{ height: '5px', width: '70%', background: '#cbd5e1', borderRadius: '2px' }} />
        {/* Education section highly visible */}
        <div style={{ border: `1.5px dashed ${color}`, borderRadius: '4px', padding: '4px', marginTop: '4px' }}>
          <div style={{ height: '5px', width: '50%', background: color, borderRadius: '1px', marginBottom: '2px' }} />
          <div style={{ height: '8px', background: '#f8fafc', borderRadius: '1px' }} />
        </div>
        <div style={{ height: '18px', background: '#f1f5f9', borderRadius: '2px' }} />
      </div>
    )
  },
  {
    id: 'developer',
    name: 'Developer',
    desc: 'Dense tech layout placing technical stack, languages, and Github profiles front and center.',
    atsScore: '99%',
    category: 'Technical',
    thumbnail: (color) => (
      <div style={{ display: 'flex', gap: '8px', height: '100%', padding: '10px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ height: '10px', width: '60%', background: '#0f172a', borderRadius: '2px' }} />
          <div style={{ height: '22px', background: '#f1f5f9', borderRadius: '2px' }} />
          <div style={{ height: '22px', background: '#f1f5f9', borderRadius: '2px' }} />
        </div>
        {/* Left narrow sidebar showing skills tag icons */}
        <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ height: '8px', background: color, borderRadius: '2px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
            <div style={{ height: '6px', width: '10px', background: '#cbd5e1', borderRadius: '1px' }} />
            <div style={{ height: '6px', width: '12px', background: '#cbd5e1', borderRadius: '1px' }} />
            <div style={{ height: '6px', width: '8px', background: '#cbd5e1', borderRadius: '1px' }} />
            <div style={{ height: '6px', width: '14px', background: '#cbd5e1', borderRadius: '1px' }} />
          </div>
        </div>
      </div>
    )
  }
];

const Templates = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '5rem', fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: 'white',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#22d3ee',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '1.25rem'
          }}>Proven Layouts</span>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.8rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            ATS-Optimized Resume Templates
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Every template is meticulously built according to strict recruiter standards. Tested across industry-leading Applicant Tracking Systems.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto 0', padding: '0 1.5rem' }}>
        
        {/* Templates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              style={{
                background: 'white',
                borderRadius: '24px',
                border: '2px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#0056b8';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 35px rgba(0, 86, 184, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Template Graphic Preview Area */}
              <div style={{
                background: '#f8fafc',
                height: '180px',
                borderBottom: '1px solid #e2e8f0',
                position: 'relative',
                padding: '1rem'
              }}>
                <div style={{
                  background: 'white',
                  borderRadius: '10px',
                  height: '100%',
                  border: '1px solid #cbd5e1',
                  overflow: 'hidden',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                }}>
                  {tpl.thumbnail('#0056b8')}
                </div>

                {/* Score badge */}
                <div style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  color: 'white',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backdropFilter: 'blur(4px)'
                }}>
                  <ShieldCheck size={12} color="#10b981" />
                  <span>ATS: {tpl.atsScore}</span>
                </div>
              </div>

              {/* Template Info */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{tpl.name}</h3>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0056b8', background: '#eff6ff', padding: '0.2rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {tpl.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{tpl.desc}</p>
                </div>

                <Link
                  to="/onboarding/start"
                  style={{
                    marginTop: 'auto',
                    textAlign: 'center',
                    background: '#0056b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 12px rgba(0, 86, 184, 0.12)',
                    transition: 'opacity 0.2s',
                    display: 'block'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
