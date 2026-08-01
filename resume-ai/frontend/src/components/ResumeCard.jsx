import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

const ResumeCard = ({ example, onPreview, onUse }) => {
  const { jobTitle, experience, template, atsScore, resumeScore } = example;

  // Simple layout graphics representing resume preview
  const renderMiniPreview = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '10px', gap: '5px' }}>
        <div style={{ height: '16px', background: '#0056b8', borderRadius: '3px', width: '80%' }} />
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '2px', width: '40%' }} />
        <div style={{ display: 'flex', flex: 1, gap: '6px', marginTop: '4px' }}>
          <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '2px' }} />
            <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '2px' }} />
            <div style={{ height: '6px', background: '#cbd5e1', borderRadius: '2px' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ height: '25px', background: '#f1f5f9', borderRadius: '3px' }} />
            <div style={{ height: '25px', background: '#f1f5f9', borderRadius: '3px' }} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '24px',
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
      {/* Visual Preview */}
      <div style={{
        background: '#f8fafc',
        height: '160px',
        borderBottom: '1px solid #e2e8f0',
        padding: '0.75rem',
        position: 'relative'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '10px',
          height: '100%',
          border: '1px solid #cbd5e1',
          overflow: 'hidden',
          boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
        }}>
          {renderMiniPreview()}
        </div>

        {/* ATS rating stars */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(15, 23, 42, 0.85)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '6px',
          fontSize: '0.65rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          backdropFilter: 'blur(4px)'
        }}>
          <Star size={10} fill="#eab308" color="#eab308" />
          <Star size={10} fill="#eab308" color="#eab308" />
          <Star size={10} fill="#eab308" color="#eab308" />
          <Star size={10} fill="#eab308" color="#eab308" />
          <Star size={10} fill="#eab308" color="#eab308" />
        </div>
      </div>

      {/* Info Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', margin: '0 0 0.5rem' }}>{jobTitle}</h4>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              Exp: {experience}
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', background: '#e6fcf5', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ShieldCheck size={10} /> ATS Friendly
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
          <button
            onClick={onPreview}
            style={{
              width: '100%',
              background: '#f1f5f9',
              color: '#0f172a',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            Preview Resume
          </button>
          
          <button
            onClick={onUse}
            style={{
              width: '100%',
              background: '#0056b8',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
