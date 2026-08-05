import React from 'react';
import ResumeFooter from './ResumeFooter';

/**
 * CreativeLayout - Exact replica of Enhancv's flagship Creative / Actor / Product Manager template
 * Reference: Enhancv "Ava Johnson - Actor" & "Jessica Martinez - Product Manager" two-column layout
 */
const CreativeLayout = ({data, customColor, customFont,
  fontSize,
  lineHeight,
  theme
}) => {
  if (!data) return null;

  const fScale = (fontSize || 13) / 13;
  const lineH = lineHeight || 1.6;
  const spacingPadding = theme?.margin ? `${theme.margin}px` : '2rem';

  const sidebarBg = customColor || '#1f5756'; // Dark teal/green like Ava Johnson template
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
    achievements = []
  } = data;

  const skillsList = typeof skills === 'object'
    ? [skills.languages, skills.frameworks, skills.tools].filter(Boolean).join(' - ')
    : (Array.isArray(skills) ? skills.join(' - ') : (skills || ''));

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
      <div style={{ display: 'flex', flex: 1 }}>
        {/* LEFT SIDEBAR (Enhancv Dark Sidebar) */}
        <div style={{
          width: '35%',
          background: sidebarBg,
          color: '#ffffff',
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxSizing: 'border-box'
        }}>
          {/* Name */}
          <div>
            <h1 style={{
              fontSize: `${1.65 * fScale}rem`,
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#ffffff',
              margin: '0 0 0.35rem',
              lineHeight: lineH,
              fontFamily: "'Inter', sans-serif"
            }}>
              {name}
            </h1>
          </div>

          {/* LANGUAGES */}
          <div>
            <h3 style={{
              fontSize: `${0.78 * fScale}rem`,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255,255,255,0.25)',
              paddingBottom: '0.3rem',
              margin: '0 0 0.65rem'
            }}>
              LANGUAGES
            </h3>
            <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>English</span>
                <span style={{ fontSize: `${0.7 * fScale}rem`, color: '#cbd5e1' }}>Native •••••</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Spanish</span>
                <span style={{ fontSize: `${0.7 * fScale}rem`, color: '#cbd5e1' }}>Advanced •••••</span>
              </div>
            </div>
          </div>

          {/* KEY ACHIEVEMENTS (Sidebar Bullet Points with Icons) */}
          <div>
            <h3 style={{
              fontSize: `${0.78 * fScale}rem`,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255,255,255,0.25)',
              paddingBottom: '0.3rem',
              margin: '0 0 0.65rem'
            }}>
              KEY ACHIEVEMENTS
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
                      <div style={{ fontWeight: 800, color: '#ffffff', lineHeight: lineH, marginBottom: '0.15rem' }}>
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

          {/* SKILLS */}
          <div>
            <h3 style={{
              fontSize: `${0.78 * fScale}rem`,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255,255,255,0.25)',
              paddingBottom: '0.3rem',
              margin: '0 0 0.65rem'
            }}>
              SKILLS
            </h3>
            <p style={{ margin: 0, fontSize: `${0.74 * fScale}rem`, color: '#e2e8f0', lineHeight: lineH, fontWeight: 500 }}>
              {skillsList || 'Script Analysis - Character Development - Voice-over Techniques - Improvisational Acting - Film Production'}
            </p>
          </div>

          {/* INTERESTS */}
          <div>
            <h3 style={{
              fontSize: `${0.78 * fScale}rem`,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#ffffff',
              borderBottom: '1px solid rgba(255,255,255,0.25)',
              paddingBottom: '0.3rem',
              margin: '0 0 0.65rem'
            }}>
              INTERESTS
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
        </div>

        {/* RIGHT MAIN COLUMN */}
        <div style={{
          flex: 1,
          padding: spacingPadding,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxSizing: 'border-box'
        }}>
          {/* Header Role & Contact Row */}
          <div>
            <h2 style={{
              fontSize: `${1 * fScale}rem`,
              fontWeight: 800,
              color: accentTeal,
              margin: '0 0 0.4rem'
            }}>
              {role}
            </h2>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              fontSize: `${0.72 * fScale}rem`,
              color: '#64748b',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '0.65rem'
            }}>
              {contact.phone && <span>📞 {contact.phone}</span>}
              {contact.email && <span>✉ {contact.email}</span>}
              {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
              {contact.location && <span>📍 {contact.location}</span>}
            </div>
          </div>

          {/* SUMMARY */}
          {objective && (
            <div>
              <h3 style={{
                fontSize: `${0.78 * fScale}rem`,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#334155',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.25rem',
                margin: '0 0 0.45rem'
              }}>
                SUMMARY
              </h3>
              <p style={{ margin: 0, fontSize: `${0.76 * fScale}rem`, color: '#334155', lineHeight: lineH }}>
                {objective}
              </p>
            </div>
          )}

          {/* EXPERIENCE */}
          {experience && experience.length > 0 && (
            <div>
              <h3 style={{
                fontSize: `${0.78 * fScale}rem`,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#334155',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.25rem',
                margin: '0 0 0.65rem'
              }}>
                EXPERIENCE
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    {/* Row 1: Job Title + Dates */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: `${0.84 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                        {exp.title || exp.role}
                      </span>
                      <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>
                        {exp.duration || exp.period}
                      </span>
                    </div>

                    {/* Row 2: Company + Location */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 800, color: accentTeal }}>
                        {exp.company}
                      </span>
                      <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>
                        {exp.location || ''}
                      </span>
                    </div>

                    {/* Description Bullets */}
                    {exp.desc && (
                      <div style={{ fontSize: `${0.75 * fScale}rem`, color: '#334155', lineHeight: lineH }}>
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

          {/* EDUCATION */}
          {education && education.length > 0 && (
            <div>
              <h3 style={{
                fontSize: `${0.78 * fScale}rem`,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#334155',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.25rem',
                margin: '0 0 0.55rem'
              }}>
                EDUCATION
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: `${0.82 * fScale}rem`, fontWeight: 800, color: '#0f172a' }}>
                        {edu.degree}
                      </span>
                      <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>
                        {edu.tenure || edu.year}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: `${0.78 * fScale}rem`, fontWeight: 700, color: accentTeal }}>
                        {edu.institution || edu.school}
                      </span>
                      <span style={{ fontSize: `${0.72 * fScale}rem`, color: '#64748b', fontWeight: 500 }}>
                        {edu.location || ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRAINING / COURSES */}
          {projects && projects.length > 0 && (
            <div>
              <h3 style={{
                fontSize: `${0.78 * fScale}rem`,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#334155',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '0.25rem',
                margin: '0 0 0.55rem'
              }}>
                TRAINING / COURSES
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
          )}
        </div>
      </div>

      {/* FULL-WIDTH PERMANENT WATERMARK FOOTER */}
      <div style={{ padding: '0 1.8rem 1rem', background: 'white' }}>
        <ResumeFooter />
      </div>
    </div>
  );
};

export default CreativeLayout;
