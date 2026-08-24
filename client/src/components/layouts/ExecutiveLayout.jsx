import React from 'react';

import SignatureBlock from '../common/SignatureBlock';

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
      minHeight: '100%',
      width: '100%',
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
        {name || 'VIKRAMADITYA SINGHANIA'}
      </h1>

      {/* Subheader Role Title */}
      <h2 style={{
        fontSize: `${0.85 * fScale}rem`,
        fontWeight: 700,
        color: '#334155',
        margin: '0 0 0.5rem',
        letterSpacing: '0.02em'
      }}>
        {role || 'Chief Financial Officer (CFO) | M&A & Capital Markets'}
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
        {contact.github && <span>💻 {contact.github}</span>}
        {contact.portfolio && <span>🌐 {contact.portfolio}</span>}
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
                {!hasSkills ? (
                  <p style={{ margin: 0, fontSize: `${0.78 * fScale}rem`, color: '#334155', fontWeight: 600, textAlign: 'center' }}>
                    Project Management · Agile Methodologies · Waterfall · Microsoft Project · JIRA · Risk Management
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'center' }}>
                    {skillsCat.languages.length > 0 && (
                      <div>
                        <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Programming Languages</div>
                        <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155', fontWeight: 600 }}>{skillsCat.languages.join(' • ')}</div>
                      </div>
                    )}
                    {skillsCat.frameworks.length > 0 && (
                      <div>
                        <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Frameworks & Libraries</div>
                        <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155', fontWeight: 600 }}>{skillsCat.frameworks.join(' • ')}</div>
                      </div>
                    )}
                    {skillsCat.tools.length > 0 && (
                      <div>
                        <div style={{ fontSize: `${0.7 * fScale}rem`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Databases & Tools</div>
                        <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155', fontWeight: 600 }}>{skillsCat.tools.join(' • ')}</div>
                      </div>
                    )}
                  </div>
                )}
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
          
          case 'projects':
            return projects && projects.length > 0 ? (
              <div key="projects" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {projects.map((proj, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                          {proj.title || proj.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: `${0.75 * fScale}rem`, fontWeight: 700, color: '#334155' }}>
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
                        <p style={{ margin: 0, fontSize: `${0.76 * fScale}rem`, color: '#475569', lineHeight: lineH, whiteSpace: 'pre-line' }}>
                          {proj.desc}
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
                          {edu.institution || edu.school}{edu.cgpa ? ` (CGPA: ${edu.cgpa})` : ''}
                        </h4>
                        <span style={{ fontSize: `${0.73 * fScale}rem`, color: '#64748b', fontWeight: 600 }}>
                          {edu.location || 'Los Angeles, CA'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155' }}>
                          {edu.degree}{edu.department ? ` in ${edu.department}` : ''}
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

          case 'certifications':
          case 'certificates':
          case 'training':
            const certs = data.certifications || data.certificates || data.training || [];
            return certs.length > 0 ? (
              <div key="certifications" style={{ textAlign: 'center', marginBottom: sectionGap }}>
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
                <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                  {certs.map((cert, idx) => (
                    <div key={idx}>
                      <span style={{ fontWeight: 700 }}>{cert.name || cert.title}</span>
                      {(cert.organization || cert.org) && <span style={{ color: '#4b5563' }}> - {cert.organization || cert.org}</span>}
                      {cert.year && <span style={{ color: '#64748b' }}> ({cert.year})</span>}
                    </div>
                  ))}
                </div>
              </div>
            ) : null;

          case 'languages':
            const langs = data.languagesList || [];
            return langs.length > 0 ? (
              <div key="languages" style={{ textAlign: 'center', marginBottom: sectionGap }}>
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
                <div style={{ fontSize: `${0.78 * fScale}rem`, color: '#334155', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {langs.map((lang, idx) => (
                    <span key={idx} style={{ fontWeight: 600 }}>
                      {typeof lang === 'string' ? lang : lang.name}
                      {typeof lang === 'object' && lang.level ? ` (${lang.level})` : ''}
                      {idx < langs.length - 1 ? '  •' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          
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
      
          
    </div>
  );
};

export default ExecutiveLayout;
