import React from 'react';

import SignatureBlock from '../common/SignatureBlock';
import ResumeFooter from './ResumeFooter';

const CreativeLayout = ({data, customColor, customFont,
  fontSize,
  lineHeight,
  theme,
  sections: customSections,
  layoutMode = 'two-column',
  spacing = 'normal'
}) => {
  if (!data) return null;

  const fScale = (fontSize || 13) / 13;
  
  // Apply Spacing & White Space from props
  let lineH = lineHeight || 1.6;
  let spacingPadding = theme?.margin ? `${theme.margin}px` : '2rem';
  let sectionGapSidebar = '1.5rem';
  let sectionGapMain = '1.25rem';
  let itemGapMain = '1rem';

  if (spacing === 'compact') {
    lineH = 1.4;
    spacingPadding = '1.25rem';
    sectionGapSidebar = '1rem';
    sectionGapMain = '0.85rem';
    itemGapMain = '0.65rem';
  } else if (spacing === 'comfortable') {
    lineH = 1.8;
    spacingPadding = '2.5rem';
    sectionGapSidebar = '2rem';
    sectionGapMain = '1.75rem';
    itemGapMain = '1.25rem';
  }

  const sidebarBg = customColor || '#1f5756'; 
  const accentTeal = '#2d8a87';
  const fontFamily = customFont || "'Inter', sans-serif";

  const {
    name = 'AVA JOHNSON',
    role = 'Actor | Character Development | Film & TV',
    contact = {},
    objective,
    education = [],
    skills = {},
    projects = [],
    experience = [],
    achievements = [],
    profilePhoto,
    photoData
  } = data;

  const photoObj = profilePhoto || photoData || (typeof data?.profilePhoto === 'object' ? data.profilePhoto : null);
  const photoUrl = photoObj?.url || (typeof data?.profilePhoto === 'string' ? data.profilePhoto : null);

  const getPhotoBorder = () => {
    if (photoObj?.border === 'white') return '3px solid #ffffff';
    if (photoObj?.border === 'black') return '3px solid #0f172a';
    if (photoObj?.border === 'theme') return `3px solid ${accentTeal}`;
    return 'none';
  };

  const getPhotoShadow = () => {
    return photoObj?.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none';
  };

  const skillsList = (skills && typeof skills === 'object' && !Array.isArray(skills))
    ? [skills.languages, skills.frameworks, skills.tools].filter(Boolean).join(' • ')
    : (Array.isArray(skills) ? skills.join(' • ') : (skills || ''));

  // Define how the sections map works
  const SIDEBAR_SECTION_IDS = ['languages', 'skills', 'competencies', 'achievements', 'interests', 'publication', 'publications', 'certifications', 'certificates', 'volunteering', 'awards', 'references'];
  const sectionsList = customSections || [
    { id: 'languages', title: 'Languages', enabled: true },
    { id: 'achievements', title: 'Key Achievements', enabled: true },
    { id: 'skills', title: 'Skills', enabled: true },
    { id: 'interests', title: 'Interests', enabled: true },
    { id: 'summary', title: 'Summary', enabled: true },
    { id: 'experience', title: 'Experience', enabled: true },
    { id: 'education', title: 'Education', enabled: true },
    { id: 'projects', title: 'Training / Courses', enabled: true }
  ];

  // Helper to render a specific section
  const renderSection = (secObj, isSidebarContext = false) => {
    const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
    const isEnabled = typeof secObj === 'string' ? true : secObj.enabled !== false;
    if (!isEnabled) return null;

    const titleStr = typeof secObj === 'string' ? secObj : (secObj.title || secObj.id);

    // Sidebar rendering style
    if (isSidebarContext) {
      switch(secId) {
        case 'languages':
          return (
            <div key="languages">
              <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '0.3rem', margin: `0 0 0.65rem` }}>
                {titleStr}
              </h3>
              <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>English</span><span style={{ fontSize: `${0.7 * fScale}rem`, color: '#cbd5e1' }}>Native •••••</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Spanish</span><span style={{ fontSize: `${0.7 * fScale}rem`, color: '#cbd5e1' }}>Advanced •••••</span>
                </div>
              </div>
            </div>
          );
        case 'achievements':
          return (
            <div key="achievements">
              <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '0.3rem', margin: `0 0 0.65rem` }}>
                {titleStr}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: `${0.74 * fScale}rem` }}>
                {(achievements.length > 0 ? achievements : [
                  { title: 'Critically Acclaimed Lead Role', desc: 'Received critical acclaim for leading role that boosted project viewership by 30%.' },
                  { title: 'Featured in Film Festival', desc: 'Acted in a film selected for Sundance Film Festival.' },
                  { title: 'Social Media Campaign Success', desc: 'Promoted film release effectively on social media.' }
                ]).map((ach, idx) => {
                  const icons = ['♥', '♥', '✂', '✂'];
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: `${0.8 * fScale}rem`, color: '#93c5fd', marginTop: '1px' }}>{icons[idx % 4]}</span>
                      <div>
                        <div style={{ fontWeight: 800, color: '#ffffff', lineHeight: lineH, marginBottom: '0.15rem' }}>{ach.title}</div>
                        <div style={{ color: '#cbd5e1', fontSize: `${0.7 * fScale}rem`, lineHeight: lineH }}>{ach.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        case 'skills':
        case 'competencies':
          return (
            <div key="skills">
              <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '0.3rem', margin: `0 0 0.65rem` }}>
                {titleStr}
              </h3>
              <p style={{ margin: 0, fontSize: `${0.74 * fScale}rem`, color: '#e2e8f0', lineHeight: lineH, fontWeight: 500 }}>
                {skillsList || 'Script Analysis - Character Development - Voice-over Techniques - Improvisational Acting - Film Production'}
              </p>
            </div>
          );
        case 'interests':
          return (
            <div key="interests">
              <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '0.3rem', margin: `0 0 0.65rem` }}>
                {titleStr}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: `${0.72 * fScale}rem` }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff' }}>Independent Films</div>
                  <div style={{ color: '#cbd5e1', fontSize: `${0.68 * fScale}rem`, lineHeight: lineH }}>Deep interest in analyzing and participating in storytelling.</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff' }}>Voice Acting</div>
                  <div style={{ color: '#cbd5e1', fontSize: `${0.68 * fScale}rem`, lineHeight: lineH }}>Exploring different vocal techniques for animated characters.</div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div key={secId}>
              <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ffffff', borderBottom: '1px solid rgba(255,255,255,0.25)', paddingBottom: '0.3rem', margin: `0 0 0.65rem` }}>
                {titleStr}
              </h3>
              <div style={{ fontSize: `${0.74 * fScale}rem`, color: '#cbd5e1', lineHeight: lineH }}>• Added custom content for {titleStr}</div>
            </div>
          );
      }
    }

    // Main column rendering style (or single column)
    switch(secId) {
      case 'summary':
        return objective ? (
          <div key="summary">
            <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', margin: `0 0 0.45rem` }}>
              {titleStr}
            </h3>
            <p style={{ margin: 0, fontSize: `${0.76 * fScale}rem`, color: '#334155', lineHeight: lineH }}>{objective}</p>
          </div>
        ) : null;
      case 'experience':
        return experience && experience.length > 0 ? (
          <div key="experience">
            <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', margin: `0 0 0.65rem` }}>
              {titleStr}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: itemGapMain }}>
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: `${0.84 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>{exp.title || exp.role}</span>
                    <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>{exp.duration || exp.period}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, color: accentTeal }}>{exp.company}</span>
                    <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>{exp.location || ''}</span>
                  </div>
                  {exp.desc && (
                    <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#334155', lineHeight: lineH }}>
                      {exp.desc.split('\n').map((line, i) => (
                        <div key={i} style={{ marginBottom: '0.15rem', paddingLeft: '0.75rem', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0, top: 0, color: '#64748b' }}>•</span>{line.replace(/^•\s*/, '')}
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
            <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', margin: `0 0 0.55rem` }}>
              {titleStr}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>{edu.degree}</span>
                    <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>{edu.tenure || edu.year}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 700, color: accentTeal }}>{edu.institution || edu.school}</span>
                    <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>{edu.location || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case 'projects':
      case 'training':
      case 'courses':
        return projects && projects.length > 0 ? (
          <div key="projects">
            <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', margin: `0 0 0.55rem` }}>
              {titleStr}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              {projects.map((p, idx) => (
                <div key={idx}>
                  <div style={{ fontSize: `${0.76 * fScale}rem`, fontWeight: 800, color: accentTeal }}>{p.title || p.name}</div>
                  <div style={{ fontSize: `${0.71 * fScale}rem`, color: '#64748b' }}>{p.technology || p.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      default:
        // Render sidebar items as main items if in single column mode
        if (SIDEBAR_SECTION_IDS.includes(secId) && layoutMode === 'single') {
          return (
             <div key={secId}>
              <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', margin: `0 0 0.55rem` }}>
                {titleStr}
              </h3>
              <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>• {secId} content</div>
            </div>
          );
        }
        return (
          <div key={secId}>
            <h3 style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.25rem', margin: `0 0 0.55rem` }}>
              {titleStr}
            </h3>
            <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>• Added custom content for {titleStr}</div>
          </div>
        );
    }
  };

  // Determine flex direction based on layoutMode
  let containerFlexDirection = 'row';
  if (layoutMode === 'right-sidebar') containerFlexDirection = 'row-reverse';
  if (layoutMode === 'single') containerFlexDirection = 'column';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '297mm',
      width: '210mm',
      fontFamily: fontFamily,
      background: 'white',
      color: '#1e293b',
      boxSizing: 'border-box',
      lineHeight: lineH,
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: containerFlexDirection }}>
        
        {/* SIDEBAR (only rendered if not single) */}
        {layoutMode !== 'single' && (
          <div style={{
            width: layoutMode === 'two-column' ? '50%' : '35%',
            background: sidebarBg,
            color: '#ffffff',
            padding: spacingPadding,
            display: 'flex',
            flexDirection: 'column',
            gap: sectionGapSidebar,
            boxSizing: 'border-box'
          }}>
            {/* Name & Photo */}
            <div style={{ textAlign: photoObj?.position === 'right' ? 'right' : photoObj?.position === 'center' ? 'center' : 'left' }}>
              {photoUrl && layoutMode !== 'single' && (
                <img 
                  src={photoUrl} 
                  alt="Profile" 
                  style={{ 
                    width: photoObj?.size ? `${photoObj.size}px` : '90px', 
                    height: photoObj?.size ? `${photoObj.size}px` : '90px', 
                    borderRadius: photoObj?.shape === 'square' ? '0px' : photoObj?.shape === 'rounded' ? '16px' : '50%', 
                    objectFit: 'cover',
                    marginBottom: '1rem',
                    border: getPhotoBorder() === 'none' ? '3px solid rgba(255,255,255,0.2)' : getPhotoBorder(),
                    boxShadow: getPhotoShadow(),
                    flexShrink: 0
                  }} 
                />
              )}
              <h1 style={{ fontSize: `${1.65 * fScale}rem`, fontWeight: 900, letterSpacing: '0.04em', color: '#ffffff', margin: '0 0 0.35rem', lineHeight: lineH }}>
                {name}
              </h1>
            </div>

            {sectionsList.map(secObj => {
              const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
              const placement = (typeof secObj === 'object' && secObj.column) ? secObj.column : (SIDEBAR_SECTION_IDS.includes(secId) ? 'sidebar' : 'main');
              if (placement !== 'sidebar') return null;
              return renderSection(secObj, true);
            })}
          </div>
        )}

        {/* MAIN COLUMN */}
        <div style={{
          flex: 1,
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: sectionGapMain,
          boxSizing: 'border-box'
        }}>
          
          {/* Header Role & Contact Row */}
          <div style={{ textAlign: photoObj?.position === 'right' ? 'right' : photoObj?.position === 'center' ? 'center' : 'left', marginBottom: '1.25rem' }}>
            {photoUrl && layoutMode === 'single' && (
              <img 
                src={photoUrl} 
                alt="Profile" 
                style={{ 
                  width: photoObj?.size ? `${photoObj.size}px` : '90px', 
                  height: photoObj?.size ? `${photoObj.size}px` : '90px', 
                  borderRadius: photoObj?.shape === 'square' ? '0px' : photoObj?.shape === 'rounded' ? '16px' : '50%', 
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  border: getPhotoBorder() === 'none' ? `3px solid ${accentTeal}` : getPhotoBorder(),
                  boxShadow: getPhotoShadow(),
                  flexShrink: 0
                }} 
              />
            )}
            {layoutMode === 'single' && (
              <h1 style={{ fontSize: `${1.8 * fScale}rem`, fontWeight: 900, letterSpacing: '0.04em', color: sidebarBg, margin: '0 0 0.35rem', lineHeight: lineH }}>
                {name}
              </h1>
            )}
            
            <h2 style={{ fontSize: `${1 * fScale}rem`, fontWeight: 800, color: accentTeal, margin: '0 0 0.4rem' }}>
              {role}
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: `${0.72 * fScale}rem`, color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.65rem' }}>
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
              {contact.location && <span>📍 {contact.location}</span>}
            </div>
          </div>

          {sectionsList.map(secObj => {
            const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
            const placement = (typeof secObj === 'object' && secObj.column) ? secObj.column : (SIDEBAR_SECTION_IDS.includes(secId) ? 'sidebar' : 'main');
            
            // If single layout, render everything in the main column. Otherwise, only main items.
            if (layoutMode !== 'single' && placement === 'sidebar') return null;
            return renderSection(secObj, false);
          })}
        </div>
      </div>

      {/* FULL-WIDTH FOOTER */}
      <SignatureBlock signature={data.signature} />
      <div style={{ padding: '0 1.8rem 1rem', background: 'white' }}>
        <ResumeFooter />
      </div>
          
    </div>
  );
};

export default CreativeLayout;
