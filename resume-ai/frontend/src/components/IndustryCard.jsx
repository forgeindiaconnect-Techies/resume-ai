import React from 'react';
import * as Icons from 'lucide-react';

const IndustryCard = ({ industry, onClick }) => {
  const { name, icon, description } = industry;
  
  // Dynamically resolve icon from Lucide-React exports
  const IconComponent = Icons[icon] || Icons.Briefcase;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '20px',
        border: '2px solid #e2e8f0',
        padding: '2rem 1.75rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        transition: 'all 0.2s',
        textAlign: 'left'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#0056b8';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 86, 184, 0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        background: '#eff6ff',
        color: '#0056b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <IconComponent size={28} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 900,
          color: '#0f172a',
          margin: 0,
          fontFamily: "'Outfit', sans-serif"
        }}>{name}</h3>
        <p style={{
          fontSize: '0.88rem',
          color: '#64748b',
          lineHeight: 1.6,
          margin: 0
        }}>{description || `Professional ${name} Resume Examples`}</p>
      </div>
    </div>
  );
};

export default IndustryCard;
