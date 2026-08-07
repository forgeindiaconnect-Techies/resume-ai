import React from 'react';

import SignatureBlock from '../common/SignatureBlock';
import ResumeFooter from './ResumeFooter';

const ExecutiveLayout = ({data, customColor, customFont,
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
  const sectionGap = spacing === 'compact' ? '1rem' : spacing === 'comfortable' ? '2.2rem' : '1.5rem';
  const fontFamily = customFont || "'Inter', sans-serif";
  const { name, role, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], profilePhoto, photoData } = data;

  const photoObj = profilePhoto || photoData || (typeof data?.profilePhoto === 'object' ? data.profilePhoto : null);
  const photoUrl = photoObj?.url || (typeof data?.profilePhoto === 'string' ? data.profilePhoto : null);
  const accentColor = customColor || '#1e293b';

  const getPhotoBorder = () => {
    if (photoObj?.border === 'white') return '3px solid #ffffff';
    if (photoObj?.border === 'black') return '3px solid #0f172a';
    if (photoObj?.border === 'theme') return `3px solid ${accentColor}`;
    return 'none';
  };

  const getPhotoShadow = () => {
    return photoObj?.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none';
  };

  const skillsList = typeof skills === 'object' 
    ? [skills.languages, skills.frameworks, skills.tools].filter(Boolean).join(' • ')
    : (Array.isArray(skills) ? skills.join(' • ') : (skills || ''));

  return (
    <div style={{
      minHeight: '297mm',
      width: '100%',
      maxWidth: '210mm',
      fontFamily: fontFamily,
      background: '#ffffff',
      color: '#1e293b',
      padding: spacingPadding,
      boxSizing: 'border-box',
      lineHeight: lineH,
      textAlign: 'center',
      margin: '0 auto'
    }}>
      {/* Profile Photo */}
      {photoUrl && (
        <div style={{ display: 'flex', justifyContent: photoObj?.position === 'left' ? 'flex-start' : photoObj?.position === 'right' ? 'flex-end' : 'center', marginBottom: '1rem' }}>
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
        </div>
      )}

      {/* Centered Name Header */}
      <h1 style={{
        fontSize: `${1.5 * fScale}rem`,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#0f172a',
        margin: '0 0 0.35rem'
      }}>
        {name || 'JOSHUA NELSON'}
      </h1>

      {/* Subheader Role Title */}
      <h2 style={{
        fontSize: `${0.85 * fScale}rem`,
        fontWeight: 700,
        color: '#334155',
        margin: '0 0 0.5rem',
        letterSpacing: '0.02em'
      }}>
        {role || 'Project Manager | Renewable Energy | Agile | PMP'}
      </h2>

      {/* Centered Contact Info Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: `${0.73 * fScale}rem`,
        color: '#64748b',
        marginBottom: '1.25rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.75rem'
      }}>
        {contact.phone && <span>📞 {contact.phone}</span>}
        {contact.email && <span>✉ {contact.email}</span>}
        {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
        {contact.location && <span>📍 {contact.location}</span>}
      </div>

      {(customSections || [
        { id: 'summary', title: 'Summary', enabled: true },
        { id: 'skills', title: 'Skills', enabled: true },
        { id: 'experience', title: 'Experience', enabled: true },
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
              <div key="summary" style={{ textAlign: 'center', marginBottom: sectionGap }}>
                <h3 style={{
                  fontSize: `${0.82 * fScale}rem`,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  margin: '0 0 0.4rem',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.25rem'
                }}>
                  {titleStr}
                </h3>
                <p style={{ margin: 0, fontSize: `${0.78 * fScale}rem`, color: '#334155', lineHeight: lineH, textAlign: 'left' }}>
                  {objective}
                </p>
              </div>
            ) : null;
          
          case 'skills':
          case 'competencies':
            return (
              <div key="skills" style={{ textAlign: 'center', marginBottom: sectionGap }}>
                <h3 style={{
                  fontSize: `${0.82 * fScale}rem`,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  margin: '0 0 0.4rem',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.25rem'
                }}>
                  {titleStr}
                </h3>
                <p style={{ margin: 0, fontSize: `${0.78 * fScale}rem`, color: '#334155', fontWeight: 600, textAlign: 'center' }}>
                  {skillsList || 'Project Management · Agile Methodologies · Waterfall · Microsoft Project · JIRA · Risk Management'}
                </p>
              </div>
            );
          
          case 'experience':
            return experience && experience.length > 0 ? (
              <div key="experience" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                <h3 style={{
                  fontSize: `${0.82 * fScale}rem`,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  margin: '0 0 0.65rem',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.25rem',
                  textAlign: 'center'
                }}>
                  {titleStr}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                  {experience.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ margin: 0, fontSize: `${0.85 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                          {exp.company}
                        </h4>
                        <span style={{ fontSize: `${0.73 * fScale}rem`, color: '#64748b', fontWeight: 600 }}>
                          {exp.companyLocation || 'Los Angeles, CA'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: `${0.8 * fScale}rem`, fontWeight: 700, color: '#334155', italic: 'true' }}>
                          {exp.title || exp.role}
                        </span>
                        <span style={{ fontSize: `${0.73 * fScale}rem`, color: '#64748b', fontWeight: 600 }}>
                          {exp.duration || exp.period}
                        </span>
                      </div>

                      {exp.desc && (
                        <p style={{ margin: 0, fontSize: `${0.76 * fScale}rem`, color: '#475569', lineHeight: lineH, whiteSpace: 'pre-line' }}>
                          {exp.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          
          case 'education':
            return education && education.length > 0 ? (
              <div key="education" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                <h3 style={{
                  fontSize: `${0.82 * fScale}rem`,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  margin: '0 0 0.65rem',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.25rem',
                  textAlign: 'center'
                }}>
                  {titleStr}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h4 style={{ margin: 0, fontSize: `${0.82 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                          {edu.institution || edu.school}
                        </h4>
                        <span style={{ fontSize: `${0.73 * fScale}rem`, color: '#64748b', fontWeight: 600 }}>
                          {edu.location || 'Los Angeles, CA'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155' }}>
                          {edu.degree}
                        </span>
                        <span style={{ fontSize: `${0.73 * fScale}rem`, color: '#64748b' }}>
                          {edu.tenure || edu.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null;
          
          case 'achievements':
            return (
              <div key="achievements" style={{ textAlign: 'left' }}>
                <h3 style={{
                  fontSize: `${0.82 * fScale}rem`,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  margin: '0 0 0.65rem',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.25rem',
                  textAlign: 'center'
                }}>
                  {titleStr}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: `${0.73 * fScale}rem`, fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                      ✓ Successful Renewable Energy Execution
                    </div>
                    <p style={{ margin: 0, fontSize: `${0.68 * fScale}rem`, color: '#64748b', lineHeight: lineH }}>
                      Led $5M project deploying solar panels across state ahead of schedule.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: `${0.73 * fScale}rem`, fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                      ✓ Excellence in Team Leadership
                    </div>
                    <p style={{ margin: 0, fontSize: `${0.68 * fScale}rem`, color: '#64748b', lineHeight: lineH }}>
                      Recognized for outstanding leadership managing 10 project coordinators.
                    </p>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: `${0.73 * fScale}rem`, fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
                      ✓ Implemented Cost-Reduction Strategy
                    </div>
                    <p style={{ margin: 0, fontSize: `${0.68 * fScale}rem`, color: '#64748b', lineHeight: lineH }}>
                      Executed new supplier contract negotiations resulting in 15% cost reduction.
                    </p>
                  </div>
                </div>
              </div>
            );
          
          default:
            return (
              <div key={secId} style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                <h3 style={{
                  fontSize: `${0.82 * fScale}rem`,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0f172a',
                  margin: '0 0 0.65rem',
                  borderBottom: '1px solid #cbd5e1',
                  paddingBottom: '0.25rem',
                  textAlign: 'center'
                }}>
                  {titleStr}
                </h3>
                <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#475569', lineHeight: lineH }}>
                  • Added custom content for {titleStr}
                </div>
              </div>
            );
        }
      })}

      {/* === SIGNATURE === */}
      <SignatureBlock signature={data.signature} />

      {/* === FOOTER WATERMARK === */}
      <ResumeFooter />
          
    </div>
  );
};

export default ExecutiveLayout;
