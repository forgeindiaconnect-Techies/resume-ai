import React from 'react';
import ResumeFooter from './ResumeFooter';

/**
 * EnhancvLayout - 100% Exact Pixel-Perfect Replica of Enhancv Project Manager Flagship Template
 * Typography: Rubik (Headers) & Source Sans 3 (Body)
 * Features: Sentence Case Name, Contact SVG Icons, Accent Underlines, Skill Pill Tags, 3-Column Grid Achievements
 */
const EnhancvLayout = ({data, customColor,
  fontSize,
  lineHeight,
  theme,
  customFont
}) => {
  if (!data) return null;

  const fontFamily = customFont || "'Inter', sans-serif";

  const fScale = (fontSize || 13) / 13;
  const lineH = lineHeight || 1.6;

  const primaryAccent = customColor || '#2563eb'; // Enhancv Signature Blue

  const SectionHeader = ({ title }) => (
    <div style={{ marginBottom: '0.9rem', marginTop: '1.25rem' }}>
      <h3 style={{
        fontSize: `${0.92 * fScale}rem`,
        fontWeight: 700,
        fontFamily: "'Rubik', sans-serif",
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: '#111827',
        margin: '0 0 0.3rem',
        paddingBottom: '0.25rem',
        borderBottom: `2px solid ${primaryAccent}`
      }}>
        {title}
      </h3>
    </div>
  );
  
  const {
    name = 'Joshua Nelson',
    role = 'Project Manager | Renewable Energy | Agile | PMP',
    contact = {},
    objective,
    education = [],
    skills = {},
    projects = [],
    experience = [],
    achievements = []
  } = data || {};

  // Convert name to Sentence Case if all caps
  const formatName = (str) => {
    if (!str) return 'Joshua Nelson';
    if (str === str.toUpperCase()) {
      return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    return str;
  };

  const formattedName = formatName(name);

  const getSkillsArray = () => {
    if (typeof skills === 'object') {
      const combined = [skills.languages, skills.frameworks, skills.tools].filter(Boolean).join(' · ');
      return combined ? combined.split(/·|•|-/).map(s => s.trim()).filter(Boolean) : [];
    }
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') return skills.split(/·|•|-/).map(s => s.trim()).filter(Boolean);
    return [];
  };

  const skillsArr = getSkillsArray();

  

  return (
    <div style={{
      minHeight: '297mm',
      width: '100%',
      fontFamily: "'Source Sans 3', 'Helvetica Neue', Arial, sans-serif",
      background: '#ffffff',
      color: '#374151',
      padding: '3rem 3.25rem 2rem',
      boxSizing: 'border-box',
      lineHeight: lineH,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* === HEADER: Sentence Case Name + Subtitle + Contact SVG Icons Row === */}
        <div style={{ marginBottom: '1.4rem' }}>
          <h1 style={{
            fontSize: `${1.9 * fScale}rem`,
            fontWeight: 700,
            fontFamily: "'Rubik', sans-serif",
            color: '#111827',
            margin: '0 0 0.25rem',
            lineHeight: lineH,
            letterSpacing: '-0.02em'
          }}>
            {formattedName}
          </h1>

          <div style={{
            fontSize: `${0.92 * fScale}rem`,
            fontWeight: 500,
            color: '#4b5563',
            marginBottom: '0.65rem',
            letterSpacing: '0.01em'
          }}>
            {role}
          </div>

          {/* Contact Row with SVG Icons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            fontSize: `${0.78 * fScale}rem`,
            color: '#4b5563',
            fontWeight: 500
          }}>
            {contact.phone && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                {contact.phone}
              </span>
            )}
            {contact.email && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {contact.email}
              </span>
            )}
            {contact.linkedin && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: primaryAccent }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={primaryAccent} strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                {contact.linkedin}
              </span>
            )}
            {contact.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {contact.location}
              </span>
            )}
          </div>
        </div>

        {/* === SUMMARY === */}
        {objective && (
          <div>
            <SectionHeader title="Summary" />
            <p style={{ margin: 0, fontSize: `${0.82 * fScale}rem`, color: '#374151', lineHeight: lineH }}>
              {objective}
            </p>
          </div>
        )}

        {/* === SKILLS (Styled Tag Pills Grid - Exact Enhancv Style) === */}
        {skillsArr.length > 0 && (
          <div>
            <SectionHeader title="Skills" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {skillsArr.map((skill, idx) => (
                <span key={idx} style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  fontSize: `${0.76 * fScale}rem`,
                  fontWeight: 500,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* === EXPERIENCE === */}
        {experience && experience.length > 0 && (
          <div>
            <SectionHeader title="Experience" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {experience.map((exp, idx) => (
                <div key={idx}>
                  {/* Line 1: Job Title (Bold) + Dates (Right) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: `${0.88 * fScale}rem`, fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#111827' }}>
                      {exp.title || exp.role}
                    </span>
                    <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#6b7280', fontWeight: 500 }}>
                      {exp.duration || exp.period}
                    </span>
                  </div>

                  {/* Line 2: Company + Location */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 600, color: '#4b5563' }}>
                      {exp.company}
                    </span>
                    <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#6b7280', fontWeight: 500 }}>
                      {exp.location || ''}
                    </span>
                  </div>

                  {/* Bullets */}
                  {exp.desc && (
                    <div style={{ fontSize: `${0.79 * fScale}rem`, color: '#374151', lineHeight: lineH }}>
                      {exp.desc.split('\n').map((line, i) => (
                        <div key={i} style={{ marginBottom: '0.2rem', paddingLeft: '0.85rem', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, top: 0, color: '#6b7280' }}>•</span>
                          {line.replace(/^•\s*/, '')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === EDUCATION === */}
        {education && education.length > 0 && (
          <div>
            <SectionHeader title="Education" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: `${0.88 * fScale}rem`, fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#111827' }}>
                      {edu.degree}
                    </span>
                    <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#6b7280', fontWeight: 500 }}>
                      {edu.tenure || edu.year}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 600, color: '#4b5563' }}>
                      {edu.institution || edu.school}
                    </span>
                    <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#6b7280', fontWeight: 500 }}>
                      {edu.location || ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === KEY ACHIEVEMENTS (Exact Enhancv 3-Column Grid) === */}
        {achievements && achievements.length > 0 && (
          <div>
            <SectionHeader title="Key Achievements" />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(achievements.length, 3)}, 1fr)`, gap: '1.25rem' }}>
              {achievements.map((ach, idx) => {
                const icons = [
                  // Pen / Award Icon
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                  // Checkmark Icon
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
                  // Lightbulb Icon
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M9 18h6m-5 3h4m-4-7a6 6 0 1 1 8 0c0 2-1 3.5-2 4.5h-4c-1-1-2-2.5-2-4.5z"/></svg>
                ];
                return (
                  <div key={idx} style={{ display: 'flex', gap: '0.55rem', alignItems: 'flex-start' }}>
                    <span style={{ marginTop: '2px', flexShrink: 0 }}>{icons[idx % 3]}</span>
                    <div>
                      <div style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#111827', lineHeight: lineH, marginBottom: '0.2rem' }}>
                        {ach.title}
                      </div>
                      <p style={{ margin: 0, fontSize: `${0.72 * fScale}rem`, color: '#4b5563', lineHeight: lineH }}>
                        {ach.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* === PERMANENT WATERMARK FOOTER === */}
      <ResumeFooter />
    </div>
  );
};

export default EnhancvLayout;
