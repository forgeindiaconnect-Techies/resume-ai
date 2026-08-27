import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileEdit, Sparkles, Link2, Upload } from 'lucide-react';
import ForgeLogo from '../components/common/ForgeLogo';

const OnboardingStart = () => {
  const options = [
    {
      id: 'scratch',
      title: 'Start from Scratch',
      desc: 'Build your resume step-by-step with our guided wizard.',
      icon: <FileEdit size={26} color="#2563eb" />,
      bg: '#eff6ff',
      border: '#bfdbfe',
      hoverBorder: '#2563eb',
      link: '/onboarding/wizard'
    },
    {
      id: 'ai',
      title: 'Use AI to Generate',
      desc: 'Let Gemini AI write your entire resume in seconds.',
      icon: <Sparkles size={26} color="#7c3aed" />,
      bg: '#f5f3ff',
      border: '#ddd6fe',
      hoverBorder: '#7c3aed',
      link: null
    },
    {
      id: 'linkedin',
      title: 'Import LinkedIn (Coming Soon)',
      desc: 'Convert your LinkedIn profile into a resume instantly.',
      icon: <Link2 size={26} color="#2563eb" />,
      bg: '#eff6ff',
      border: '#bfdbfe',
      hoverBorder: '#93c5fd',
      link: null,
      disabled: true
    },
    {
      id: 'upload',
      title: 'Upload Existing Resume',
      desc: 'Redesign and get an AI score on your current resume.',
      icon: <Upload size={26} color="#059669" />,
      bg: '#ecfdf5',
      border: '#a7f3d0',
      hoverBorder: '#059669',
      link: null
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Logo */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ForgeLogo size={52} showText={true} variant="light" />
        </Link>
      </div>

      <div style={{ maxWidth: '680px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>
            Welcome to Forge India Connect
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748b', fontWeight: 500, lineHeight: 1.6 }}>
            Let's build your dream resume in just 5 minutes.<br />How would you like to start?
          </p>
        </div>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {options.map(opt => {
            const Card = (
              <div
                key={opt.id}
                style={{
                  background: 'white',
                  border: `2px solid ${opt.border}`,
                  borderRadius: '20px',
                  padding: '1.75rem',
                  cursor: opt.disabled ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: opt.disabled ? 0.55 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
                onMouseEnter={e => { if (!opt.disabled) { e.currentTarget.style.borderColor = opt.hoverBorder; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'; } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = opt.border; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '50px', height: '50px', background: opt.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {opt.icon}
                </div>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '0.3rem' }}>{opt.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>{opt.desc}</p>
                </div>
              </div>
            );

            return opt.link ? (
              <Link key={opt.id} to={opt.link} style={{ textDecoration: 'none' }}>{Card}</Link>
            ) : (
              <div key={opt.id}>{Card}</div>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
          No account needed &bull; Your data is saved automatically
        </p>
      </div>
    </div>
  );
};

export default OnboardingStart;
