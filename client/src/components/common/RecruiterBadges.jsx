import React from 'react';
import { Clock, Briefcase, MapPin } from 'lucide-react';

const RecruiterBadges = ({ 
  noticePeriod = 'Immediate Joiner', 
  totalExp = '5+ Years', 
  workPreference = 'Hybrid',
  location = '',
  accentColor = '#2563eb',
  theme = 'light' // 'light' | 'dark'
}) => {
  const isDark = theme === 'dark';

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.22rem 0.55rem',
    borderRadius: '16px',
    fontSize: '0.68rem',
    fontWeight: 700,
    background: isDark ? 'rgba(255, 255, 255, 0.12)' : `${accentColor}12`,
    color: isDark ? '#ffffff' : (accentColor || '#1e293b'),
    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : `1px solid ${accentColor}30`,
    whiteSpace: 'nowrap'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.45rem',
      flexWrap: 'wrap',
      margin: '0.4rem 0'
    }}>
      {noticePeriod && (
        <span style={{
          ...badgeStyle,
          background: noticePeriod.includes('Immediate') ? (isDark ? 'rgba(16, 185, 129, 0.25)' : '#ecfdf5') : badgeStyle.background,
          color: noticePeriod.includes('Immediate') ? (isDark ? '#a7f3d0' : '#059669') : badgeStyle.color,
          border: noticePeriod.includes('Immediate') ? (isDark ? '1px solid #10b981' : '1px solid #a7f3d0') : badgeStyle.border
        }}>
          <Clock size={11} /> Notice: {noticePeriod}
        </span>
      )}

      {totalExp && (
        <span style={badgeStyle}>
          <Briefcase size={11} /> Exp: {totalExp}
        </span>
      )}

      {workPreference && (
        <span style={badgeStyle}>
          <MapPin size={11} /> {location ? `${location.split(',')[0]} · ` : ''}{workPreference}
        </span>
      )}
    </div>
  );
};

export default RecruiterBadges;
