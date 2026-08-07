import React from 'react';
import ResumeFooter from './ResumeFooter';
import SignatureBlock from '../common/SignatureBlock';

/**
 * ModernLayout - Exact Replica of Enhancv Business Analyst & Data Scientist Template
 * Typography: Rubik (Headers) & Source Sans 3 (Body)
 */
const ModernLayout = ({ 
  data, 
  sections: customSections,
  customColor, 
  secondaryColor, 
  customFont, 
  headingSize, 
  fontSize,
  lineHeight,
  theme,
  spacing = 'normal', 
  layoutMode = 'left-sidebar',
  profilePosition = 'left',
  profilePhoto 
}) => {
  if (!data) return null;

  const fScale = (fontSize || 13) / 13;

  const sidebarBg = customColor || '#0b2545';
  const primaryAccent = secondaryColor || '#0284c7';
  const fontFamily = customFont || "'Inter', sans-serif";

  const spacingPadding = theme?.margin ? `${theme.margin}px`
    : spacing === 'compact' ? '1.1rem'
    : spacing === 'comfortable' ? '2.8rem'
    : '2rem';
  const spacingGap = spacing === 'compact' ? '0.85rem' : spacing === 'comfortable' ? '1.8rem' : '1.5rem';
  const lineH = lineHeight || 1.6;
  const hSize = headingSize ? `${headingSize}px` : '1.35rem';
  const bSize = fontSize ? `${fontSize}px` : '0.88rem';

  const isRightSidebar = layoutMode === 'right-sidebar';
  const isSingleColumn = layoutMode === 'single';

  const { name = 'Violet Rodriguez', role = 'Business Analyst | Data Insights & Visualization', contact = {}, objective, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;
  
  // Handle complex photo object or legacy string
  const photoObj = profilePhoto || data.photoData || (typeof data.profilePhoto === 'object' ? data.profilePhoto : null);
  const photoUrl = photoObj?.url || (typeof data.profilePhoto === 'string' ? data.profilePhoto : null);

  const getBorderRadius = () => {
    if (!photoObj) return '50%';
    if (photoObj.shape === 'circle') return '50%';
    if (photoObj.shape === 'rounded') return '16px';
    return '0px';
  };

  const getBorderValue = () => {
    if (!photoObj) return '3px solid rgba(255,255,255,0.2)';
    if (photoObj.border === 'white') return '3px solid #ffffff';
    if (photoObj.border === 'black') return '3px solid #0f172a';
    if (photoObj.border === 'theme') return `3px solid ${sidebarBg}`;
    return 'none';
  };

  const getShadowValue = () => {
    if (photoObj?.shadow) return '0 10px 25px -5px rgba(0, 0, 0, 0.4)';
    return 'none';
  };

  const photoSize = photoObj?.size ? `${photoObj.size}px` : '80px';
  const pos = photoObj?.position || profilePosition;

  const formatName = (str) => {
    if (!str) return 'Violet Rodriguez';
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
  const languagesList = (data.languagesList && data.languagesList.length > 0) 
    ? data.languagesList 
    : (data.skills?.languages ? data.skills.languages.split(',').map(s => ({ name: s.trim(), level: 'Proficient' })).filter(l => l.name) : []);

  const interestsList = data.interests || [
    { title: 'Data-Driven Decision Making', desc: 'Passion for using data analytics to drive informed strategic business decisions.' },
    { title: 'Travel', desc: 'Enjoy exploring different cultures and perspectives, which fosters a global mindset.' },
    { title: 'Photography', desc: 'Capturing moments and experiences through creative visual storytelling and composition.' }
  ];

  const trainingList = data.training || data.certifications || [
    { title: 'Certified Business Analysis Professional (CBAP)', org: 'International Institute of Business Analysis', year: '2021' },
    { title: 'Advanced Data Visualization with Tableau', org: 'Coursera', year: '2020' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '297mm',
      width: '100%',
      fontFamily: fontFamily,
      background: '#f8fafc',
      color: '#374151',
      boxSizing: 'border-box',
      lineHeight: lineH,
      textAlign: 'left'
    }}>
      {/* ========================================================================= */}
      {/* === TOP FULL-WIDTH DARK NAVY HEADER BANNER (EXACT ENHANCV BANNER STYLE) === */}
      {/* ========================================================================= */}
      <div style={{
        background: sidebarBg,
        color: '#ffffff',
        padding: '2.25rem 2rem 1.75rem',
        boxSizing: 'border-box',
        borderBottom: '3px solid rgba(255, 255, 255, 0.1)',
        textAlign: pos
      }}>
        {/* Name Header with Optional Profile Photo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.5rem', 
          marginBottom: '0.35rem', 
          justifyContent: pos === 'center' ? 'center' : pos === 'right' ? 'flex-end' : 'flex-start' 
        }}>
          {photoUrl && (
            <img 
              src={photoUrl} 
              alt="Profile" 
              style={{ 
                width: photoSize, 
                height: photoSize, 
                borderRadius: getBorderRadius(), 
                objectFit: 'cover', 
                border: getBorderValue(),
                boxShadow: getShadowValue()
              }} 
            />
          )}
          <h1 style={{
            fontSize: headingSize ? `${headingSize}px` : `${1.95 * fScale}rem`,
            fontWeight: 700,
            
            color: '#ffffff',
            margin: 0,
            lineHeight: lineH,
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}>
            {formattedName}
          </h1>
        </div>

        {/* Role Subtitle in Light Blue Accent */}
        <div style={{
          fontSize: `${0.92 * fScale}rem`,
          fontWeight: 600,
          color: '#93c5fd',
          marginBottom: '0.85rem',
          
          letterSpacing: '0.02em'
        }}>
          {role}
        </div>

        {/* Horizontal Contact Row with Light Blue Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          fontSize: `${0.78 * fScale}rem`,
          color: '#bfdbfe',
          fontWeight: 500,
          justifyContent: profilePosition === 'center' ? 'center' : profilePosition === 'right' ? 'flex-end' : 'flex-start'
        }}>
          {contact.phone && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {contact.phone}
            </span>
          )}
          {contact.email && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              {contact.email}
            </span>
          )}
          {contact.linkedin && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#93c5fd' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              {contact.linkedin}
            </span>
          )}
          {contact.location && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {contact.location}
            </span>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* === TWO-COLUMN BODY CONTENT (SIDEBAR + MAIN COLUMN) === */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flex: 1, flexDirection: isSingleColumn ? 'column' : (isRightSidebar ? 'row-reverse' : 'row') }}>
        {/* SIDEBAR (Dark Navy Background) */}
        <div style={{
          width: isSingleColumn ? '100%' : '34%',
          background: sidebarBg,
          color: '#ffffff',
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          boxSizing: 'border-box'
        }}>
          {/* DYNAMIC SIDEBAR SECTIONS REORDERING */}
          {(customSections || [
            { id: 'languages', title: 'Languages', enabled: true },
            { id: 'skills', title: 'Skills', enabled: true },
            { id: 'achievements', title: 'Key Achievements', enabled: true },
            { id: 'interests', title: 'Interests', enabled: true }
          ]).map(secObj => {
            const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
            const isEnabled = typeof secObj === 'string' ? true : secObj.enabled !== false;
            if (!isEnabled) return null;

            const SIDEBAR_SECTION_IDS = ['languages', 'skills', 'competencies', 'achievements', 'interests', 'publication', 'publications', 'certifications', 'certificates', 'volunteering', 'awards', 'references'];
            const placement = (typeof secObj === 'object' && secObj.column) ? secObj.column : (SIDEBAR_SECTION_IDS.includes(secId) ? 'sidebar' : 'main');
            if (placement !== 'sidebar') return null;

            switch (secId) {
              case 'languages':
                return languagesList && languagesList.length > 0 ? (
                  <div key="languages">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      LANGUAGES
                    </h3>
                    <div style={{ fontSize: `${0.76 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {languagesList.map((lang, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 500 }}>{typeof lang === 'object' ? lang.name : lang}</span>
                          <span style={{ fontSize: `${0.7 * fScale}rem`, color: '#93c5fd' }}>{typeof lang === 'object' ? (lang.level || 'Fluent') : 'Native •••••'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case 'skills':
              case 'competencies':
                return (
                  <div key="skills">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      SKILLS
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
                      {(skillsArr.length > 0 ? skillsArr : ['Power BI', 'Tableau', 'SQL', 'Data Modeling', 'Dashboard Development', 'JIRA', 'Confluence', 'Python', 'Advanced Excel']).map((skill, idx) => (
                        <span key={idx} style={{
                          background: 'rgba(255,255,255,0.15)',
                          color: '#ffffff',
                          padding: '0.22rem 0.55rem',
                          borderRadius: '4px',
                          fontSize: `${0.7 * fScale}rem`,
                          fontWeight: 500,
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );

              case 'achievements':
                return (
                  <div key="achievements">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      KEY ACHIEVEMENTS
                    </h3>
                    <div style={{ fontSize: `${0.74 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {(achievements.length > 0 ? achievements : [
                        { title: 'Boosted Client Revenue by 15%', desc: 'Through comprehensive data analysis and insights, contributed to significant revenue increase.' },
                        { title: 'Improved Reporting Accuracy by 35%', desc: 'Led a team initiative that enhanced reporting accuracy, streamlining decision-making.' },
                        { title: 'Reduced Reporting Time by 40%', desc: 'Implemented new dashboards, significantly decreasing reporting generation time.' }
                      ]).map((ach, idx) => {
                        var icons = ['✓', '💡', '⏱'];
                        return (
                          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: `${0.82 * fScale}rem`, color: '#93c5fd', marginTop: '1px' }}>{icons[idx % 3]}</span>
                            <div>
                              <div style={{ fontWeight: 700,  color: '#ffffff', lineHeight: lineH, marginBottom: '0.15rem' }}>
                                {ach.title}
                              </div>
                              <div style={{ color: '#cbd5e1', fontSize: `${0.7 * fScale}rem`, lineHeight: lineH }}>
                                {ach.desc}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );

              case 'interests':
                return interestsList && interestsList.length > 0 ? (
                  <div key="interests">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      INTERESTS
                    </h3>
                    <div style={{ fontSize: `${0.72 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {interestsList.map((item, idx) => (
                        <div key={idx}>
                          <div style={{ fontWeight: 700,  color: '#ffffff', marginBottom: '0.1rem' }}>
                            {typeof item === 'object' ? item.title : item}
                          </div>
                          {typeof item === 'object' && item.desc && (
                            <div style={{ color: '#cbd5e1', fontSize: `${0.68 * fScale}rem`, lineHeight: lineH }}>
                              {item.desc}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case 'publication':
              case 'publications':
                const pubTitle = typeof secObj === 'string' ? secObj : (secObj.title || 'PUBLICATIONS');
                return (
                  <div key="publication">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {pubTitle.toUpperCase()}
                    </h3>
                    <div style={{ fontSize: `${0.74 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <div style={{ fontWeight: 600 }}>• Published Research Paper / Article</div>
                    </div>
                  </div>
                );

              case 'certifications':
              case 'certificates':
                return (
                  <div key="certifications">
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      CERTIFICATIONS
                    </h3>
                    <div style={{ fontSize: `${0.74 * fScale}rem`, color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {(trainingList && trainingList.length > 0 ? trainingList : ['AWS Certified Developer', 'Scrum Master']).map((item, idx) => (
                        <div key={idx}>
                          <div style={{ fontWeight: 600 }}>• {typeof item === 'object' ? item.title : item}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case 'volunteering':
              case 'awards':
              case 'references':
                const customLabel = typeof secObj === 'string' ? secObj : (secObj.title || secId);
                return (
                  <div key={secId}>
                    <h3 style={{
                      fontSize: `${0.78 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#93c5fd',
                      borderBottom: '1px solid rgba(255,255,255,0.2)',
                      paddingBottom: '0.35rem',
                      margin: '0 0 0.65rem'
                    }}>
                      {customLabel.toUpperCase()}
                    </h3>
                    <div style={{ fontSize: `${0.74 * fScale}rem`, color: '#cbd5e1', lineHeight: lineH }}>
                      • {customLabel} details
                    </div>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>

        {/* RIGHT MAIN COLUMN (White Background) */}
        <div style={{
          flex: 1,
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: spacingGap,
          boxSizing: 'border-box'
        }}>
          {(customSections || [
            { id: 'summary', title: 'Summary', enabled: true },
            { id: 'experience', title: 'Experience', enabled: true },
            { id: 'education', title: 'Education', enabled: true },
            { id: 'projects', title: 'Projects', enabled: true }
          ]).map(secObj => {
            const secId = typeof secObj === 'string' ? secObj.toLowerCase() : secObj.id.toLowerCase();
            const isEnabled = typeof secObj === 'string' ? true : secObj.enabled !== false;
            if (!isEnabled) return null;

            // Determine placement (Sidebar vs Main)
            const SIDEBAR_SECTION_IDS = ['languages', 'skills', 'competencies', 'achievements', 'interests', 'publication', 'publications', 'certifications', 'certificates', 'volunteering', 'awards', 'references'];
            const placement = (typeof secObj === 'object' && secObj.column) ? secObj.column : (SIDEBAR_SECTION_IDS.includes(secId) ? 'sidebar' : 'main');
            if (placement === 'sidebar') return null;

            switch (secId) {
              case 'summary':
                return objective ? (
                  <div key="summary">
                    <h3 style={{
                      fontSize: `${0.84 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#111827',
                      margin: '0 0 0.45rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      SUMMARY
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </h3>
                    <p style={{ margin: 0, fontSize: `${0.82 * fScale}rem`, color: '#374151', lineHeight: lineH }}>
                      {objective}
                    </p>
                  </div>
                ) : null;

              case 'experience':
                return experience && experience.length > 0 ? (
                  <div key="experience">
                    <h3 style={{
                      fontSize: `${0.84 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#111827',
                      margin: '0 0 0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      EXPERIENCE
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                      {experience.map((exp, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <h4 style={{ margin: 0, fontSize: `${0.88 * fScale}rem`, fontWeight: 700,  color: '#111827' }}>
                              {exp.title || exp.role}
                            </h4>
                            <span style={{ fontSize: `${0.76 * fScale}rem`, fontWeight: 500, color: '#64748b' }}>
                              {exp.duration || exp.period}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                            <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 600, color: primaryAccent }}>
                              {exp.company}
                            </span>
                            <span style={{ fontSize: `${0.76 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>
                              {exp.location || ''}
                            </span>
                          </div>
                          {exp.desc && (
                            <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#374151', lineHeight: lineH }}>
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
                      fontSize: `${0.84 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#111827',
                      margin: '0 0 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      EDUCATION
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {education.map((edu, idx) => (
                        <div key={idx}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontSize: `${0.86 * fScale}rem`, fontWeight: 700,  color: '#111827' }}>
                              {edu.degree}
                            </span>
                            <span style={{ fontSize: `${0.76 * fScale}rem`, fontWeight: 500, color: '#64748b' }}>
                              {edu.tenure || edu.year}
                            </span>
                          </div>
                          <div style={{ fontSize: `${0.8 * fScale}rem`, fontWeight: 600, color: primaryAccent }}>
                            {edu.institution || edu.school}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case 'projects':
                return projects && projects.length > 0 ? (
                  <div key="projects">
                    <h3 style={{
                      fontSize: `${0.84 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#111827',
                      margin: '0 0 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      PROJECTS
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {projects.map((p, idx) => (
                        <div key={idx}>
                          <div style={{ fontSize: `${0.84 * fScale}rem`, fontWeight: 700, color: primaryAccent }}>{p.title || p.name}</div>
                          <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569' }}>{p.technology || p.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case 'certificates':
              case 'certifications':
                return trainingList && trainingList.length > 0 ? (
                  <div key="certifications">
                    <h3 style={{
                      fontSize: `${0.84 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#111827',
                      margin: '0 0 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      TRAINING / COURSES
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                      {trainingList.map((item, idx) => (
                        <div key={idx}>
                          <div style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 700, color: primaryAccent }}>
                            {typeof item === 'object' ? item.title : item}
                          </div>
                          {typeof item === 'object' && item.org && (
                            <div style={{ fontSize: `${0.76 * fScale}rem`, color: '#64748b' }}>
                              {item.org} {item.year ? `(${item.year})` : ''}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              default:
                const titleStr = typeof secObj === 'string' ? secObj : (secObj.title || secObj.id);
                return (
                  <div key={secId}>
                    <h3 style={{
                      fontSize: `${0.84 * fScale}rem`,
                      fontWeight: 700,
                      
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#111827',
                      margin: '0 0 0.6rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {titleStr}
                      <span style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
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

      <div style={{ padding: '0 2rem' }}>
        <SignatureBlock signature={data.signature} />
      </div>

      {/* FULL-WIDTH FOOTER WATERMARK ACROSS ENTIRE BOTTOM */}
      <div style={{ padding: '0 2rem 1.25rem', background: 'white', marginTop: 'auto' }}>
        <ResumeFooter />
      </div>
    </div>
  );
};

export default ModernLayout;
