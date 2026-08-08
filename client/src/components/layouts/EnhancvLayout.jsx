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

  const getSkillsCategorized = () => {
    const parseStr = (str) => str ? str.split(/·|•|-|,/).map(s => s.trim()).filter(Boolean) : [];
    if (typeof skills === 'object' && !Array.isArray(skills)) {
      return {
        languages: parseStr(skills.languages),
        frameworks: parseStr(skills.frameworks),
        tools: parseStr(skills.tools)
      };
    }
    let arr = [];
    if (Array.isArray(skills)) arr = skills;
    else if (typeof skills === 'string') arr = parseStr(skills);
    return { languages: arr, frameworks: [], tools: [] };
  };

  const skillsCat = getSkillsCategorized();
  const hasSkills = skillsCat.languages.length > 0 || skillsCat.frameworks.length > 0 || skillsCat.tools.length > 0;

  

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
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.35rem', position: 'relative', top: '-1px' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{contact.email}</span>
              </span>
            )}
            {contact.linkedin && (
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: primaryAccent  }}>
                <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.35rem', position: 'relative', top: '-1px' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={primaryAccent} strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{contact.linkedin}</span>
              </span>
            )}
            {contact.location && (
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.35rem', position: 'relative', top: '-1px' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{contact.location}</span>
              </span>
            )}
            {contact.github && (
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: primaryAccent }}>
                <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.35rem', position: 'relative', top: '-1px' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={primaryAccent} strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{contact.github}</span>
              </span>
            )}
            {contact.portfolio && (
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap', color: primaryAccent }}>
                <svg style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.35rem', position: 'relative', top: '-1px' }} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={primaryAccent} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>{contact.portfolio}</span>
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
              return hasSkills ? (
                <div key="skills">
                  <SectionHeader title={titleStr} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    
                    {skillsCat.languages.length > 0 && (
                      <div>
                        <div style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programming Languages</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {skillsCat.languages.map((skill, idx) => (
                            <span key={idx} style={{ background: '#f3f4f6', color: '#374151', fontSize: `${0.76 * fScale}rem`, fontWeight: 500, padding: '0.25rem 0.65rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skillsCat.frameworks.length > 0 && (
                      <div>
                        <div style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frameworks & Libraries</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {skillsCat.frameworks.map((skill, idx) => (
                            <span key={idx} style={{ background: '#f3f4f6', color: '#374151', fontSize: `${0.76 * fScale}rem`, fontWeight: 500, padding: '0.25rem 0.65rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {skillsCat.tools.length > 0 && (
                      <div>
                        <div style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#4b5563', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Databases & Tools</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {skillsCat.tools.map((skill, idx) => (
                            <span key={idx} style={{ background: '#f3f4f6', color: '#374151', fontSize: `${0.76 * fScale}rem`, fontWeight: 500, padding: '0.25rem 0.65rem', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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
                        {(proj.github || proj.liveDemo) && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                            {proj.github && (
                              <a
                                href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`}
                                target="_blank" rel="noreferrer"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                  background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0',
                                  padding: '0.18rem 0.55rem', borderRadius: '99px',
                                  fontSize: `${0.72 * fScale}rem`, fontWeight: 600,
                                  textDecoration: 'none', whiteSpace: 'nowrap'
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                GitHub
                              </a>
                            )}
                            {proj.liveDemo && (
                              <a
                                href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`}
                                target="_blank" rel="noreferrer"
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                  background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe',
                                  padding: '0.18rem 0.55rem', borderRadius: '99px',
                                  fontSize: `${0.72 * fScale}rem`, fontWeight: 600,
                                  textDecoration: 'none', whiteSpace: 'nowrap'
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                Live Demo
                              </a>
                            )}
                          </div>
                        )}
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
                            {edu.degree}{edu.department ? ` in ${edu.department}` : ''}
                          </span>
                          <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#6b7280', fontWeight: 500 }}>
                            {edu.tenure || edu.year}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 600, color: '#4b5563' }}>
                            {edu.institution || edu.school}{edu.cgpa ? ` (CGPA: ${edu.cgpa})` : ''}
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

            case 'certifications':
            case 'certificates':
            case 'training':
              const certs = data.certifications || data.certificates || data.training || [];
              return certs.length > 0 ? (
                <div key="certifications">
                  <SectionHeader title={titleStr} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {certs.map((cert, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 700, color: '#111827' }}>
                            {cert.name || cert.title}
                          </span>
                          <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#6b7280', fontWeight: 500 }}>
                            {cert.year || ''}
                          </span>
                        </div>
                        {(cert.organization || cert.org) && (
                          <div style={{ fontSize: `${0.76 * fScale}rem`, color: '#4b5563', fontWeight: 500 }}>
                            {cert.organization || cert.org}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;

            case 'languages':
              const langs = data.languagesList || [];
              return langs.length > 0 ? (
                <div key="languages">
                  <SectionHeader title={titleStr} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {langs.map((lang, idx) => (
                      <span key={idx} style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        fontSize: `${0.76 * fScale}rem`,
                        fontWeight: 500,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb'
                      }}>
                        {typeof lang === 'string' ? lang : lang.name}
                        {typeof lang === 'object' && lang.level ? ` (${lang.level})` : ''}
                      </span>
                    ))}
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
