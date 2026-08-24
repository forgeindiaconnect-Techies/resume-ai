import React from 'react';

import SignatureBlock from '../common/SignatureBlock';
import ResumeQRCode from '../common/ResumeQRCode';
import RecruiterBadges from '../common/RecruiterBadges';

const ProfessionalLayout = ({data, customColor, customFont,
  fontSize,
  lineHeight,
  theme,
  spacing = 'normal',
  layoutMode = 'left-sidebar',
  sections: customSections,
  profilePhoto,
  headingSize
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

  const sidebarBg = customColor || '#14532d';
  const fontFamily = customFont || "'Inter', sans-serif";

  const { name, role, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data || {};

  const getSkillsCategorized = () => {
    const parseStr = (str) => str ? str.split(/·|•|-|,/).map(s => s.trim()).filter(Boolean) : [];
    if (typeof skills === 'object' && !Array.isArray(skills) && skills !== null) {
      const isCat = Boolean((skills.languages && skills.frameworks) || (skills.programming && skills.frameworks));
      return {
        isCategorized: isCat,
        languages: parseStr(skills.languages || skills.programming),
        frameworks: parseStr(skills.frameworks),
        tools: parseStr(skills.tools || skills.databases)
      };
    }
    let arr = [];
    if (Array.isArray(skills)) arr = skills;
    else if (typeof skills === 'string') arr = parseStr(skills);
    return { isCategorized: false, languages: arr, frameworks: [], tools: [] };
  };

  const skillsCat = getSkillsCategorized();
  const hasSkills = skillsCat.languages.length > 0 || skillsCat.frameworks.length > 0 || skillsCat.tools.length > 0;

  const photoObj = profilePhoto || data?.photoData || (typeof data?.profilePhoto === 'object' ? data.profilePhoto : null);
  const photoUrl = photoObj?.url || (typeof data?.profilePhoto === 'string' ? data.profilePhoto : null);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%',
      width: '100%',
      fontFamily: fontFamily,
      background: 'white',
      color: '#1e293b',
      boxSizing: 'border-box',
      lineHeight: lineH,
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: isSingleColumn ? 'column' : (isRightSidebar ? 'row-reverse' : 'row') }}>
        {/* SIDEBAR (Dark Forest Green Background) */}
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
                  border: photoObj?.border === 'white' ? '3px solid #ffffff' : photoObj?.border === 'black' ? '3px solid #000000' : photoObj?.border === 'theme' ? `3px solid ${sidebarBg}` : '3px solid rgba(255,255,255,0.2)',
                  boxShadow: photoObj?.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)' : 'none',
                  marginBottom: '1rem' 
                }} 
              />
            )}
            <h1 style={{
              fontSize: headingSize ? `${headingSize}px` : `${1.65 * fScale}rem`,
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 0.35rem',
              lineHeight: lineH
            }}>
              {name || 'ARJUN MEHTA'}
            </h1>
            {data?.showQrCode !== false && (
              <ResumeQRCode 
                url={
                  contact.customQrImage || data.customQrImage || 
                  (contact.qrTarget === 'github' ? (contact.github || contact.linkedin) :
                   contact.qrTarget === 'portfolio' ? (contact.portfolio || contact.linkedin) :
                   (contact.linkedin || contact.portfolio || contact.github || 'linkedin.com'))
                }
                customQrImage={contact.customQrImage || data.customQrImage}
                label={
                  (contact.customQrImage || data.customQrImage) ? 'Scan Profile' :
                  contact.qrTarget === 'github' ? 'Scan GitHub' :
                  contact.qrTarget === 'portfolio' ? 'Scan Portfolio' : 
                  'Scan LinkedIn'
                }
                size={44}
                variant="sidebar"
              />
            )}
          </div>

          {(customSections || [
            { id: 'languages', title: 'Languages', enabled: true },
            { id: 'achievements', title: 'Key Achievements', enabled: true },
            { id: 'skills', title: 'Engineering Skills', enabled: true }
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
                const langs = Array.isArray(data.languagesList) ? data.languagesList : [];
                return langs.length > 0 ? (
                  <div key="languages">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#86efac',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {langs.map((lang, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{typeof lang === 'string' ? lang : lang.name}</span>
                          {typeof lang === 'object' && lang.level && <span style={{ fontSize: `${0.7 * fScale}rem`, color: '#86efac' }}>{lang.level}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              
              case 'achievements':
                return achievements && achievements.length > 0 ? (
                  <div key="achievements">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#86efac',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {achievements.map((ach, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: `${0.8 * fScale}rem`, color: '#86efac', marginTop: '1px' }}>✓</span>
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
                ) : null;
              
              case 'skills':
              case 'competencies':
                return hasSkills ? (
                  <div key="skills">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#86efac',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {skillsCat.isCategorized ? (
                        <>
                          {skillsCat.languages.length > 0 && (
                            <div>
                              <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 700, color: '#86efac', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Programming Languages</div>
                              <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#f8fafc', lineHeight: lineH, fontWeight: 500 }}>
                                {skillsCat.languages.join(' • ')}
                              </div>
                            </div>
                          )}
                          {skillsCat.frameworks.length > 0 && (
                            <div>
                              <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 700, color: '#86efac', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Frameworks & Libraries</div>
                              <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#f8fafc', lineHeight: lineH, fontWeight: 500 }}>
                                {skillsCat.frameworks.join(' • ')}
                              </div>
                            </div>
                          )}
                          {skillsCat.tools.length > 0 && (
                            <div>
                              <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 700, color: '#86efac', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Databases & Tools</div>
                              <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#f8fafc', lineHeight: lineH, fontWeight: 500 }}>
                                {skillsCat.tools.join(' • ')}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {skillsCat.languages.map((sk, idx) => (
                            <span key={idx} style={{
                              background: 'rgba(255,255,255,0.12)',
                              color: '#ffffff',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: `${0.75 * fScale}rem`,
                              fontWeight: 600
                            }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              
              case 'certifications':
              case 'certificates':
                const certs = data.certifications || data.certificates || data.training || [];
                return certs.length > 0 ? (
                  <div key="certifications">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#86efac',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {titleStr}
                    </h3>
                    <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {certs.map((cert, idx) => (
                        <div key={idx}>
                          <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.15rem' }}>{cert.name || cert.title}</div>
                          <div style={{ color: '#cbd5e1', fontSize: `${0.7 * fScale}rem` }}>{cert.org || cert.organization} {cert.year ? `(${cert.year})` : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              
              default:
                return (
                  <div key={secId}>
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#86efac',
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
              color: '#047857',
              margin: '0 0 0.25rem'
            }}>
              {role || 'Senior Cloud Architect & DevOps Lead'}
            </h2>

            {/* Optional Recruiter Quick-Info Badges */}
            {(data?.showRecruiterBadges || contact?.showRecruiterBadges) && (
              <div style={{ marginBottom: '0.4rem' }}>
                <RecruiterBadges 
                  noticePeriod={data.noticePeriod || contact.noticePeriod || 'Immediate Joiner'}
                  totalExp={data.totalExp || contact.totalExp || '5+ Years'}
                  workPreference={data.workPreference || contact.workPreference || 'Hybrid'}
                  location={contact.location}
                  accentColor="#047857"
                />
              </div>
            )}

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              fontSize: `${0.75 * fScale}rem`,
              color: '#64748b',
              borderBottom: '2px solid #047857',
              paddingBottom: '0.75rem'
            }}>
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
              {contact.location && <span>📍 {contact.location}</span>}
              {contact.github && <span>💻 {contact.github}</span>}
              {contact.portfolio && <span>🌐 {contact.portfolio}</span>}
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
                      color: '#047857',
                      margin: '0 0 0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
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
                      color: '#047857',
                      margin: '0 0 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
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
                            <span style={{ fontSize: `${0.8 * fScale}rem`, fontWeight: 700, color: '#047857' }}>
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
              
              case 'projects':
                return projects && projects.length > 0 ? (
                  <div key="projects">
                    <h3 style={{
                      fontSize: `${0.8 * fScale}rem`,
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#0f172a',
                      margin: '0 0 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      {projects.map((proj, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontSize: `${0.85 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                              {proj.title || proj.name}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: `${0.8 * fScale}rem`, fontWeight: 700, color: '#047857' }}>
                              {proj.technology}
                            </span>
                          </div>
                          {(proj.github || proj.liveDemo) && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                              {proj.github && (
                                <a href={proj.github.startsWith('http') ? proj.github : `https://${proj.github}`} target="_blank" rel="noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '0.18rem 0.55rem', borderRadius: '99px', fontSize: `${0.72 * fScale}rem`, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                  GitHub
                                </a>
                              )}
                              {proj.liveDemo && (
                                <a href={proj.liveDemo.startsWith('http') ? proj.liveDemo : `https://${proj.liveDemo}`} target="_blank" rel="noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.18rem 0.55rem', borderRadius: '99px', fontSize: `${0.72 * fScale}rem`, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                  Live Demo
                                </a>
                              )}
                            </div>
                          )}
                          {proj.desc && (
                            <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>
                              {proj.desc.split('\n').map((line, i) => (
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
                      color: '#047857',
                      margin: '0 0 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {education.map((edu, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: `${0.85 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                              {edu.degree}{edu.department ? ` in ${edu.department}` : ''}
                            </h4>
                            <span style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#64748b' }}>
                              {edu.tenure || edu.year}
                            </span>
                          </div>
                          <div style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 700, color: '#047857' }}>
                            {edu.institution || edu.school}{edu.cgpa ? ` (CGPA: ${edu.cgpa})` : ''}
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
                      color: '#047857',
                      margin: '0 0 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
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
        
      </div>
          
    </div>
  );
};

export default ProfessionalLayout;
