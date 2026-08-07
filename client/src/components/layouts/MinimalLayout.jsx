import React from 'react';

import SignatureBlock from '../common/SignatureBlock';
import ResumeFooter from './ResumeFooter';

const MinimalLayout = ({data, customColor, customFont,
  fontSize,
  lineHeight,
  theme,
  spacing = 'normal',
  layoutMode = 'left-sidebar',
  sections: customSections
}) => {
  if (!data) return null;

  const fScale = (fontSize || 13) / 13;
  const lineH = lineHeight || 1.6;
  const spacingPadding = theme?.margin ? `${theme.margin}px`
    : spacing === 'compact' ? '1.1rem'
    : spacing === 'comfortable' ? '2.8rem'
    : '2rem';
  const sectionGap = spacing === 'compact' ? '1rem' : spacing === 'comfortable' ? '2.2rem' : '1.75rem';
  const isRightSidebar = layoutMode === 'right-sidebar';
  const isSingleColumn = layoutMode === 'single';

  const sidebarBg = customColor || '#1e3a5f';
  const fontFamily = customFont || "'Inter', sans-serif";

  const { name, role, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], achievements = [], profilePhoto, photoData } = data;

  const photoObj = profilePhoto || photoData || (typeof data?.profilePhoto === 'object' ? data.profilePhoto : null);
  const photoUrl = photoObj?.url || (typeof data?.profilePhoto === 'string' ? data.profilePhoto : null);

  const getPhotoBorder = () => {
    if (photoObj?.border === 'white') return '3px solid #ffffff';
    if (photoObj?.border === 'black') return '3px solid #0f172a';
    if (photoObj?.border === 'theme') return `3px solid ${sidebarBg}`;
    return 'none';
  };

  const getPhotoShadow = () => {
    return photoObj?.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none';
  };

  const skillsList = (skills && typeof skills === 'object' && !Array.isArray(skills))
    ? [skills.languages, skills.frameworks, skills.tools].filter(Boolean).join(' • ')
    : (Array.isArray(skills) ? skills.join(' • ') : (skills || ''));

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
      <div style={{ display: 'flex', flex: 1, flexDirection: isSingleColumn ? 'column' : (isRightSidebar ? 'row-reverse' : 'row') }}>
        {/* SIDEBAR (left or right based on layoutMode) */}
        <div style={{
          width: isSingleColumn ? '100%' : '34%',
          background: sidebarBg,
          color: '#ffffff',
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: sectionGap,
          boxSizing: 'border-box'
        }}>
          {/* Name & Photo */}
          <div style={{ textAlign: photoObj?.position === 'right' ? 'right' : photoObj?.position === 'center' ? 'center' : 'left' }}>
            {photoUrl && (
              <img 
                src={photoUrl} 
                alt="Profile" 
                style={{ 
                  width: photoObj?.size ? `${photoObj.size}px` : '90px', 
                  height: photoObj?.size ? `${photoObj.size}px` : '90px', 
                  borderRadius: photoObj?.shape === 'square' ? '0px' : photoObj?.shape === 'rounded' ? '16px' : '50%', 
                  objectFit: 'cover',
                  border: getPhotoBorder(),
                  boxShadow: getPhotoShadow(),
                  flexShrink: 0,
                  marginBottom: '1rem'
                }} 
              />
            )}
            <h1 style={{
              fontSize: `${1.65 * fScale}rem`,
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 0.35rem',
              lineHeight: lineH
            }}>
              {name || 'AMELIA JOHNSON'}
            </h1>
          </div>

          {(customSections || [
            { id: 'languages', title: 'Languages', enabled: true },
            { id: 'achievements', title: 'Key Achievements', enabled: true },
            { id: 'skills', title: 'Skills', enabled: true }
          ]).map(secObj => {
            const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
            const isEnabled = typeof secObj === 'string' ? true : secObj.enabled !== false;
            if (!isEnabled) return null;

            const SIDEBAR_SECTION_IDS = ['languages', 'skills', 'competencies', 'achievements', 'interests', 'publication', 'publications', 'certifications', 'certificates', 'volunteering', 'awards', 'references'];
            const placement = (typeof secObj === 'object' && secObj.column) ? secObj.column : (SIDEBAR_SECTION_IDS.includes(secId) ? 'sidebar' : 'main');
            if (placement !== 'sidebar') return null;

            const titleStr = typeof secObj === 'string' ? secObj : (secObj.title || secObj.id);

            switch(secId) {
              case 'languages':
                return (
                  <div key="languages">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>English</span>
                        <span style={{ fontSize: `${0.7 * fScale}rem`, color: '#93c5fd' }}>Native •••••</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>German</span>
                        <span style={{ fontSize: `${0.7 * fScale}rem`, color: '#93c5fd' }}>Proficient ••••</span>
                      </div>
                    </div>
                  </div>
                );
              
              case 'achievements':
                return (
                  <div key="achievements">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {(achievements.length > 0 ? achievements : [
                        { title: '94% State Test Pass Rate', desc: 'Achieved high state exam pass rates.' },
                        { title: 'STEM Teacher of the Year', desc: 'Awarded regional STEM teaching honor.' }
                      ]).map((ach, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: `${0.8 * fScale}rem`, color: '#93c5fd', marginTop: '1px' }}>✓</span>
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff', lineHeight: lineH, marginBottom: '0.15rem' }}>
                              {ach.title}
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: `${0.7 * fScale}rem`, lineHeight: lineH }}>
                              {ach.desc}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              
              case 'skills':
              case 'competencies':
                return (
                  <div key="skills">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <p style={{ margin: 0, fontSize: `${0.78 * fScale}rem`, color: '#f8fafc', lineHeight: lineH, fontWeight: 500 }}>
                      {skillsList || 'Biology · Chemistry · Physics · STEM Curriculum · Differentiated Instruction'}
                    </p>
                  </div>
                );
              
              default:
                return (
                  <div key={secId}>
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ fontSize: `${0.74 * fScale}rem`, color: '#cbd5e1', lineHeight: lineH }}>
                      • Added custom content for {titleStr}
                    </div>
                  </div>
                );
            }
          })}
        </div>

        {/* RIGHT MAIN COLUMN */}
        <div style={{
          flex: 1,
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: sectionGap,
          boxSizing: 'border-box'
        }}>
          {/* Role Header */}
          <div>
            <h2 style={{
              fontSize: `${1.05 * fScale}rem`,
              fontWeight: 800,
              color: '#1e3a5f',
              margin: '0 0 0.4rem'
            }}>
              {role || 'High School Science Teacher | STEM Developer'}
            </h2>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              fontSize: `${0.75 * fScale}rem`,
              color: '#64748b',
              borderBottom: '2px solid #1e3a5f',
              paddingBottom: '0.75rem'
            }}>
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
              {contact.location && <span>📍 {contact.location}</span>}
            </div>
          </div>

          {(customSections || [
            { id: 'summary', title: 'Summary', enabled: true },
            { id: 'experience', title: 'Experience', enabled: true },
            { id: 'education', title: 'Education', enabled: true }
          ]).map(secObj => {
            const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
            const isEnabled = typeof secObj === 'string' ? true : secObj.enabled !== false;
            if (!isEnabled) return null;

            const SIDEBAR_SECTION_IDS = ['languages', 'skills', 'competencies', 'achievements', 'interests', 'publication', 'publications', 'certifications', 'certificates', 'volunteering', 'awards', 'references'];
            const placement = (typeof secObj === 'object' && secObj.column) ? secObj.column : (SIDEBAR_SECTION_IDS.includes(secId) ? 'sidebar' : 'main');
            if (placement === 'sidebar') return null;

            const titleStr = typeof secObj === 'string' ? secObj : (secObj.title || secObj.id);

            switch(secId) {
              case 'summary':
                return objective ? (
                  <div key="summary">
                    <h3 style={{
                      fontSize: `${0.8 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#334155',
                      margin: '0 0 0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
                    </h3>
                    <p style={{ margin: 0, fontSize: `${0.82 * fScale}rem`, color: '#334155', lineHeight: lineH }}>
                      {objective}
                    </p>
                  </div>
                ) : null;
              
              case 'experience':
                return experience && experience.length > 0 ? (
                  <div key="experience">
                    <h3 style={{
                      fontSize: `${0.8 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#334155',
                      margin: '0 0 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      {experience.map((exp, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: `${0.9 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                              {exp.title || exp.role}
                            </h4>
                            <span style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#64748b' }}>
                              {exp.duration || exp.period}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: `${0.8 * fScale}rem`, fontWeight: 700, color: '#1e3a5f' }}>
                              {exp.company}
                            </span>
                            <span style={{ fontSize: `${0.73 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>
                              {exp.location || ''}
                            </span>
                          </div>
                          {exp.desc && (
                            <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>
                              {exp.desc.split('\n').map((line, i) => (
                                <div key={i} style={{ marginBottom: '0.15rem', paddingLeft: '0.75rem', position: 'relative' }}>
                                  <span style={{ position: 'absolute', left: 0, top: 0, color: '#64748b' }}>•</span>
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
                    <h3 style={{
                      fontSize: `${0.8 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#334155',
                      margin: '0 0 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {education.map((edu, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: `${0.85 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                              {edu.degree}
                            </h4>
                            <span style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#64748b' }}>
                              {edu.tenure || edu.year}
                            </span>
                          </div>
                          <div style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 700, color: '#334155' }}>
                            {edu.institution || edu.school}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              
              default:
                return (
                  <div key={secId}>
                    <h3 style={{
                      fontSize: `${0.8 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#334155',
                      margin: '0 0 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
                    </h3>
                    <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>
                      • Added custom content for {titleStr}
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </div>

      {/* FULL-WIDTH FOOTER WATERMARK ACROSS ENTIRE BOTTOM */}
      <SignatureBlock signature={data.signature} />
      <div style={{ padding: '0 1.8rem 1rem', background: 'white' }}>
        <ResumeFooter />
      </div>
          
    </div>
  );
};

export default MinimalLayout;
