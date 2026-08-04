import React from 'react';
import ResumeFooter from './ResumeFooter';

const ExecutiveLayout = ({ data, customColor, customFont }) => {
  if (!data) return null;

  const fontFamily = customFont || "'Inter', sans-serif";
  const { name, role, contact = {}, objective, education = [], skills = {}, projects = [], experience = [] } = data;

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
      padding: '2.5rem 2.25rem',
      boxSizing: 'border-box',
      lineHeight: 1.5,
      textAlign: 'center',
      margin: '0 auto'
    }}>
      {/* Centered Name Header */}
      <h1 style={{
        fontSize: '1.5rem',
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
        fontSize: '0.85rem',
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
        fontSize: '0.73rem',
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

      {/* Summary Section */}
      {objective && (
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#0f172a',
            margin: '0 0 0.4rem',
            borderBottom: '1px solid #cbd5e1',
            paddingBottom: '0.25rem'
          }}>
            Summary
          </h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', lineHeight: 1.5, textAlign: 'left' }}>
            {objective}
          </p>
        </div>
      )}

      {/* Skills Section */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#0f172a',
          margin: '0 0 0.4rem',
          borderBottom: '1px solid #cbd5e1',
          paddingBottom: '0.25rem'
        }}>
          Skills
        </h3>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#334155', fontWeight: 600, textAlign: 'center' }}>
          {skillsList || 'Project Management · Agile Methodologies · Waterfall · Microsoft Project · JIRA · Risk Management'}
        </p>
      </div>

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
          <h3 style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#0f172a',
            margin: '0 0 0.65rem',
            borderBottom: '1px solid #cbd5e1',
            paddingBottom: '0.25rem',
            textAlign: 'center'
          }}>
            Experience
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                    {exp.company}
                  </h4>
                  <span style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 600 }}>
                    {exp.companyLocation || 'Los Angeles, CA'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', italic: 'true' }}>
                    {exp.title || exp.role}
                  </span>
                  <span style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 600 }}>
                    {exp.duration || exp.period}
                  </span>
                </div>

                {exp.desc && (
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#475569', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {exp.desc}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
          <h3 style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#0f172a',
            margin: '0 0 0.65rem',
            borderBottom: '1px solid #cbd5e1',
            paddingBottom: '0.25rem',
            textAlign: 'center'
          }}>
            Education
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {education.map((edu, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                    {edu.institution || edu.school}
                  </h4>
                  <span style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 600 }}>
                    {edu.location || 'Los Angeles, CA'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.78rem', color: '#334155' }}>
                    {edu.degree}
                  </span>
                  <span style={{ fontSize: '0.73rem', color: '#64748b' }}>
                    {edu.tenure || edu.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Achievements (3 Horizontal Boxes at Bottom - Enhancv Exact) */}
      <div style={{ textAlign: 'left' }}>
        <h3 style={{
          fontSize: '0.82rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#0f172a',
          margin: '0 0 0.65rem',
          borderBottom: '1px solid #cbd5e1',
          paddingBottom: '0.25rem',
          textAlign: 'center'
        }}>
          Key Achievements
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              ✓ Successful Renewable Energy Execution
            </div>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b', lineHeight: 1.35 }}>
              Led $5M project deploying solar panels across state ahead of schedule.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              ✓ Excellence in Team Leadership
            </div>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b', lineHeight: 1.35 }}>
              Recognized for outstanding leadership managing 10 project coordinators.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.2rem' }}>
              ✓ Implemented Cost-Reduction Strategy
            </div>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b', lineHeight: 1.35 }}>
              Executed new supplier contract negotiations resulting in 15% cost reduction.
            </p>
          </div>
        </div>
      </div>

      {/* === FOOTER WATERMARK === */}
      <ResumeFooter />
    </div>
  );
};

export default ExecutiveLayout;
