import React from 'react';
import ResumeFooter from './ResumeFooter';

const ProfessionalLayout = ({ data, customColor, customFont }) => {
  if (!data) return null;

  const sidebarBg = customColor || '#14532d';
  const fontFamily = customFont || "'Inter', sans-serif";

  const { name, role, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;

  const skillsList = typeof skills === 'object' 
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
      lineHeight: 1.5,
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* LEFT SIDEBAR (Dark Forest Green Background) */}
        <div style={{
          width: '34%',
          background: sidebarBg,
          color: '#ffffff',
          padding: '2.2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          boxSizing: 'border-box'
        }}>
          {/* Name */}
          <div>
            <h1 style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 0.35rem',
              lineHeight: 1.2
            }}>
              {name || 'CARLOS MENDOZA'}
            </h1>
          </div>

          {/* Languages */}
          <div>
            <h3 style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#86efac',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '0.35rem',
              margin: '0 0 0.65rem'
            }}>
              LANGUAGES
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>English</span>
                <span style={{ fontSize: '0.7rem', color: '#86efac' }}>Native •••••</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Spanish</span>
                <span style={{ fontSize: '0.7rem', color: '#86efac' }}>Bilingual •••••</span>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div>
            <h3 style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#86efac',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '0.35rem',
              margin: '0 0 0.65rem'
            }}>
              KEY ACHIEVEMENTS
            </h3>
            <div style={{ fontSize: '0.75rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(achievements.length > 0 ? achievements : [
                { title: '35% Defect Reduction', desc: 'Led redesign of EV battery housing assembly.' },
                { title: '$4M Capital Project', desc: 'Delivered new stamping line 6 weeks ahead of schedule.' },
                { title: '18% Material Waste Cut', desc: 'Implemented lean manufacturing process improvements.' }
              ]).map((ach, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.45rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.8rem', color: '#86efac', marginTop: '1px' }}>✓</span>
                  <div>
                    <div style={{ fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.15rem' }}>
                      {ach.title}
                    </div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.7rem', lineHeight: 1.35 }}>
                      {ach.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering Skills */}
          <div>
            <h3 style={{
              fontSize: '0.78rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#86efac',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '0.35rem',
              margin: '0 0 0.65rem'
            }}>
              ENGINEERING SKILLS
            </h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.6, fontWeight: 500 }}>
              {skillsList || 'AutoCAD · SolidWorks · CATIA · ANSYS · Six Sigma · Lean Manufacturing · Root Cause Analysis'}
            </p>
          </div>
        </div>

        {/* RIGHT MAIN COLUMN */}
        <div style={{
          flex: 1,
          padding: '2.2rem 1.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxSizing: 'border-box'
        }}>
          {/* Role Header */}
          <div>
            <h2 style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#047857',
              margin: '0 0 0.4rem'
            }}>
              {role || 'Senior Mechanical Engineer | Automotive & Manufacturing'}
            </h2>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.85rem',
              fontSize: '0.75rem',
              color: '#64748b',
              borderBottom: '2px solid #047857',
              paddingBottom: '0.75rem'
            }}>
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
              {contact.location && <span>📍 {contact.location}</span>}
            </div>
          </div>

          {/* Objective */}
          {objective && (
            <div>
              <h3 style={{
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#047857',
                margin: '0 0 0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                SUMMARY
                <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.55 }}>
                {objective}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#047857',
                margin: '0 0 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                EXPERIENCE
                <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                        {exp.title || exp.role}
                      </h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        {exp.duration || exp.period}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857' }}>
                        {exp.company}
                      </span>
                      <span style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 500 }}>
                        {exp.location || ''}
                      </span>
                    </div>
                    {exp.desc && (
                      <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
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
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '0.8rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#047857',
                margin: '0 0 0.65rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                EDUCATION
                <span style={{ flex: 1, height: '1px', background: '#d1fae5' }} />
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                        {edu.degree}
                      </h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        {edu.tenure || edu.year}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#047857' }}>
                      {edu.institution || edu.school}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL-WIDTH FOOTER WATERMARK ACROSS ENTIRE BOTTOM */}
      <div style={{ padding: '0 1.8rem 1rem', background: 'white' }}>
        <ResumeFooter />
      </div>
    </div>
  );
};

export default ProfessionalLayout;
