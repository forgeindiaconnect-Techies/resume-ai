import React from 'react';
import ResumeFooter from './ResumeFooter';
import SignatureBlock from '../common/SignatureBlock';
import ResumeQRCode from '../common/ResumeQRCode';
import RecruiterBadges from '../common/RecruiterBadges';

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

  const { name = 'Pooja Verma', role = 'Lead Business Analyst | Data Science & Analytics', contact = {}, objective, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;
  
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
      height: '100%',
      flex: 1,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexDirection: pos === 'right' ? 'row-reverse' : 'row' }}>
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
              size={46}
              accentColor="#0284c7"
            />
          )}
        </div>

        {/* Role Subtitle in Light Blue Accent */}
        <div style={{
          fontSize: `${0.92 * fScale}rem`,
          fontWeight: 600,
          color: '#93c5fd',
          marginBottom: '0.45rem',
          letterSpacing: '0.02em'
        }}>
          {role}
        </div>

        {/* Optional Recruiter Quick-Info Badges */}
        {(data?.showRecruiterBadges || contact?.showRecruiterBadges) && (
          <div style={{ marginBottom: '0.6rem' }}>
            <RecruiterBadges 
              theme="dark"
              noticePeriod={data.noticePeriod || contact.noticePeriod || 'Immediate Joiner'}
              totalExp={data.totalExp || contact.totalExp || '5+ Years'}
              workPreference={data.workPreference || contact.workPreference || 'Hybrid'}
              location={contact.location}
            />
          </div>
        )}

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
          {contact.github && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#93c5fd' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              {contact.github}
            </span>
          )}
          {contact.portfolio && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#93c5fd' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {contact.portfolio}
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
                    {!hasSkills ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
                        {['Power BI', 'Tableau', 'SQL', 'Data Modeling', 'Dashboard Development', 'JIRA', 'Confluence', 'Python', 'Advanced Excel'].map((skill, idx) => (
                          <span key={idx} style={{
                            background: 'rgba(255,255,255,0.15)',
                            color: '#ffffff',
                            fontSize: `${0.72 * fScale}rem`,
                            fontWeight: 500,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '16px',
                            display: 'inline-block',
                            lineHeight: 1
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {skillsCat.languages.length > 0 && (
                          <div>
                            <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 700, color: '#93c5fd', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Programming Languages</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
                              {skillsCat.languages.map((skill, idx) => (
                                <span key={idx} style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: `${0.72 * fScale}rem`, fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: '16px', display: 'inline-block', lineHeight: 1 }}>{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {skillsCat.frameworks.length > 0 && (
                          <div>
                            <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 700, color: '#93c5fd', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Frameworks & Libraries</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
                              {skillsCat.frameworks.map((skill, idx) => (
                                <span key={idx} style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: `${0.72 * fScale}rem`, fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: '16px', display: 'inline-block', lineHeight: 1 }}>{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {skillsCat.tools.length > 0 && (
                          <div>
                            <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 700, color: '#93c5fd', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Databases & Tools</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
                              {skillsCat.tools.map((skill, idx) => (
                                <span key={idx} style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: `${0.72 * fScale}rem`, fontWeight: 500, padding: '0.2rem 0.6rem', borderRadius: '16px', display: 'inline-block', lineHeight: 1 }}>{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
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
                              {edu.degree}{edu.department ? ` in ${edu.department}` : ''}
                            </span>
                            <span style={{ fontSize: `${0.76 * fScale}rem`, fontWeight: 500, color: '#64748b' }}>
                              {edu.tenure || edu.year}
                            </span>
                          </div>
                          <div style={{ fontSize: `${0.8 * fScale}rem`, fontWeight: 600, color: primaryAccent }}>
                            {edu.institution || edu.school}{edu.cgpa ? ` (CGPA: ${edu.cgpa})` : ''}
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
                          {(p.github || p.liveDemo) && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                              {p.github && (
                                <a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', background: 'rgba(240,253,244,0.15)', color: '#86efac', border: '1px solid rgba(134,239,172,0.4)', padding: '0.18rem 0.55rem', borderRadius: '99px', fontSize: `${0.72 * fScale}rem`, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                                  GitHub
                                </a>
                              )}
                              {p.liveDemo && (
                                <a href={p.liveDemo.startsWith('http') ? p.liveDemo : `https://${p.liveDemo}`} target="_blank" rel="noreferrer"
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.28rem', background: 'rgba(239,246,255,0.15)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.4)', padding: '0.18rem 0.55rem', borderRadius: '99px', fontSize: `${0.72 * fScale}rem`, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                  Live Demo
                                </a>
                              )}
                            </div>
                          )}
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

      {/* FOOTER PADDING REMOVED SO COLUMNS CAN STRETCH TO BOTTOM */}

    </div>
  );
};

export default ModernLayout;
