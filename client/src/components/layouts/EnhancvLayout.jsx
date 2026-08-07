import React from 'react';

import SignatureBlock from '../common/SignatureBlock';
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
  customFont,
  spacing = 'normal',
  layoutMode = 'left-sidebar',
  sections: customSections,
  profilePosition = 'left',
  headingSize
}) => {
  if (!data) return null;

  const fontFamily = customFont || "'Inter', sans-serif";

  const fScale = (fontSize || 13) / 13;
  const lineH = lineHeight || 1.6;
  const spacingPadding = theme?.margin ? `${theme.margin}px`
    : spacing === 'compact' ? '1.5rem 1.75rem 1rem'
    : spacing === 'comfortable' ? '4rem 4.25rem 3rem'
    : '3rem 3.25rem 2rem';
  const sectionGap = spacing === 'compact' ? '1rem' : spacing === 'comfortable' ? '2.2rem' : '1.5rem';

  const primaryAccent = customColor || '#2563eb'; // Enhancv Signature Blue

  const SectionHeader = ({ title }) => (
    <div style={{ marginBottom: '0.9rem', marginTop: '1.25rem' }}>
      <h3 style={{
        fontSize: `${0.92 * fScale}rem`,
        fontWeight: 700,
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
    achievements = [],
    profilePhoto,
    photoData
  } = data || {};

  const photoObj = profilePhoto || photoData || (typeof data?.profilePhoto === 'object' ? data.profilePhoto : null);
  const photoUrl = photoObj?.url || (typeof data?.profilePhoto === 'string' ? data.profilePhoto : null);

  const getPhotoBorder = () => {
    if (photoObj?.border === 'white') return '3px solid #ffffff';
    if (photoObj?.border === 'black') return '3px solid #0f172a';
    if (photoObj?.border === 'theme') return `3px solid ${primaryAccent}`;
    return 'none';
  };

  const getPhotoShadow = () => {
    return photoObj?.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none';
  };

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
      return combined ? combined.split(/·|•|-|,/).map(s => s.trim()).filter(Boolean) : [];
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
      fontFamily: fontFamily,
      background: '#ffffff',
      color: '#374151',
      padding: spacingPadding,
      boxSizing: 'border-box',
      lineHeight: lineH,
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* === HEADER: Sentence Case Name + Subtitle + Contact SVG Icons Row === */}
        <div style={{ 
          marginBottom: '1.4rem', 
          display: 'flex', 
          justifyContent: profilePosition === 'center' ? 'center' : 'space-between', 
          alignItems: profilePosition === 'center' ? 'center' : 'flex-start',
          flexDirection: profilePosition === 'left' ? 'row-reverse' : (profilePosition === 'center' ? 'column-reverse' : 'row'),
          gap: '1.5rem',
          textAlign: profilePosition === 'center' ? 'center' : 'left'
        }}>
          <div>
            <h1 style={{
              fontSize: headingSize ? `${headingSize}px` : `${1.9 * fScale}rem`,
              fontWeight: 700,
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
          {photoUrl && (
            <img 
              src={photoUrl} 
              alt="Profile" 
              style={{ 
                width: photoObj?.size ? `${photoObj.size}px` : '100px', 
                height: photoObj?.size ? `${photoObj.size}px` : '100px', 
                borderRadius: photoObj?.shape === 'square' ? '0px' : photoObj?.shape === 'rounded' ? '16px' : '50%', 
                objectFit: 'cover',
                border: getPhotoBorder(),
                boxShadow: getPhotoShadow(),
                flexShrink: 0
              }} 
            />
          )}
        </div>

        {/* === DYNAMIC SECTIONS === */}
        {(customSections || [
          { id: 'summary', title: 'Summary', enabled: true },
          { id: 'skills', title: 'Skills', enabled: true },
          { id: 'experience', title: 'Experience', enabled: true },
          { id: 'projects', title: 'Projects', enabled: true },
          { id: 'education', title: 'Education', enabled: true },
          { id: 'achievements', title: 'Key Achievements', enabled: true }
        ]).map(secObj => {
          const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
          const isEnabled = typeof secObj === 'string' ? true : secObj.enabled !== false;
          if (!isEnabled) return null;

          const titleStr = typeof secObj === 'string' ? secObj : (secObj.title || secObj.id);

          switch (secId) {
            case 'summary':
              return objective ? (
                <div key="summary">
                  <SectionHeader title={titleStr} />
                  <p style={{ margin: 0, fontSize: `${0.82 * fScale}rem`, color: '#374151', lineHeight: lineH }}>
                    {objective}
                  </p>
                </div>
              ) : null;

            case 'skills':
            case 'competencies':
              return skillsArr.length > 0 ? (
                <div key="skills">
                  <SectionHeader title={titleStr} />
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
              ) : null;

            case 'experience':
              return experience && experience.length > 0 ? (
                <div key="experience">
                  <SectionHeader title={titleStr} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    {experience.map((exp, idx) => (
                      <div key={idx}>
                        {/* Line 1: Job Title (Bold) + Dates (Right) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: `${0.88 * fScale}rem`, fontWeight: 700, color: '#111827' }}>
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
              ) : null;

            case 'projects':
              return projects && projects.length > 0 ? (
                <div key="projects">
                  <SectionHeader title={titleStr} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    {projects.map((proj, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: `${0.88 * fScale}rem`, fontWeight: 700, color: '#111827' }}>
                            {proj.title || proj.name}
                          </span>
                          <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#4b5563', fontWeight: 600 }}>
                            {proj.technology}
                          </span>
                        </div>
                        {proj.desc && (
                          <div style={{ fontSize: `${0.79 * fScale}rem`, color: '#374151', lineHeight: lineH, marginTop: '0.35rem' }}>
                            {proj.desc.split('\n').map((line, i) => (
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
              ) : null;

            case 'education':
              return education && education.length > 0 ? (
                <div key="education">
                  <SectionHeader title={titleStr} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {education.map((edu, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: `${0.88 * fScale}rem`, fontWeight: 700, color: '#111827' }}>
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
              ) : null;

            case 'achievements':
              return achievements && achievements.length > 0 ? (
                <div key="achievements">
                  <SectionHeader title={titleStr} />
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
                            <div style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 700, color: '#111827', lineHeight: lineH, marginBottom: '0.2rem' }}>
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
              ) : null;
              
            default:
              return (
                <div key={secId}>
                  <SectionHeader title={titleStr} />
                  <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>
                    • Added custom content for {titleStr}
                  </div>
                </div>
              );
          }
        })}
      </div>

      {/* === SIGNATURE === */}
      <SignatureBlock signature={data.signature} />

      {/* === PERMANENT WATERMARK FOOTER === */}
      <ResumeFooter />
          
    </div>
  );
};

export default EnhancvLayout;
