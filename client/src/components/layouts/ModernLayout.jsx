import React from 'react';
import ResumeFooter from './ResumeFooter';

/**
 * ModernLayout - Exact Replica of Enhancv Business Analyst & Data Scientist Template
 * Typography: Rubik (Headers) & Source Sans 3 (Body)
 */
const ModernLayout = ({ data, customColor }) => {
  if (!data) return null;

  const sidebarBg = customColor || '#0b2545'; // Dark Navy
  const primaryAccent = '#0284c7';

  const { name = 'Violet Rodriguez', role = 'Business Analyst | Data Insights & Visualization', contact = {}, objective, education = [], skills = {}, projects = [], experience = [], achievements = [] } = data;

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

  const interestsList = data.interests || [
    { title: 'Data-Driven Decision Making', desc: 'Passion for using data analytics to drive informed strategic business decisions.' },
    { title: 'Travel', desc: 'Enjoy exploring different cultures and perspectives, which fosters a global mindset.' },
    { title: 'Photography', desc: 'Capturing moments and experiences through creative visual storytelling and composition.' }
  ];

  const trainingList = data.training || data.certifications || [
    { title: 'Certified Business Analysis Professional (CBAP)', org: 'International Institute of Business Analysis', year: '2021' },
    { title: 'Advanced Data Visualization with Tableau', org: 'Coursera', year: '2020' }
  ];

  const languagesList = data.languagesList || [
    { name: 'English', level: 'Native •••••' },
    { name: 'Spanish', level: 'Advanced ••••' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '297mm',
      width: '210mm',
      fontFamily: "'Source Sans 3', sans-serif",
      background: 'white',
      color: '#374151',
      boxSizing: 'border-box',
      lineHeight: 1.5,
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
        borderBottom: '3px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Name Header in Uppercase Rubik Font */}
        <h1 style={{
          fontSize: '1.95rem',
          fontWeight: 700,
          fontFamily: "'Rubik', sans-serif",
          color: '#ffffff',
          margin: '0 0 0.35rem',
          lineHeight: 1.15,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {formattedName}
        </h1>

        {/* Role Subtitle in Light Blue Accent */}
        <div style={{
          fontSize: '0.92rem',
          fontWeight: 600,
          color: '#93c5fd',
          marginBottom: '0.85rem',
          fontFamily: "'Rubik', sans-serif",
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
          fontSize: '0.78rem',
          color: '#bfdbfe',
          fontWeight: 500
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
      <div style={{ display: 'flex', flex: 1 }}>
        {/* LEFT SIDEBAR (Dark Navy Background - Exact Enhancv Width 34%) */}
        <div style={{
          width: '34%',
          background: sidebarBg,
          color: '#ffffff',
          padding: '1.75rem 1.35rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.6rem',
          boxSizing: 'border-box'
        }}>
          {/* Languages Section */}
          <div>
            <h3 style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: "'Rubik', sans-serif",
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#93c5fd',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '0.35rem',
              margin: '0 0 0.65rem'
            }}>
              LANGUAGES
            </h3>
            <div style={{ fontSize: '0.76rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {languagesList.map((lang, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500 }}>{typeof lang === 'object' ? lang.name : lang}</span>
                  <span style={{ fontSize: '0.7rem', color: '#93c5fd' }}>{typeof lang === 'object' ? lang.level : 'Native •••••'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Achievements */}
          <div>
            <h3 style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: "'Rubik', sans-serif",
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#93c5fd',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              paddingBottom: '0.35rem',
              margin: '0 0 0.65rem'
            }}>
              KEY ACHIEVEMENTS
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {(achievements.length > 0 ? achievements : [
                { title: 'Boosted Client Revenue by 15%', desc: 'Through comprehensive data analysis and insights, contributed to significant revenue increase.' },
                { title: 'Improved Reporting Accuracy by 35%', desc: 'Led a team initiative that enhanced reporting accuracy, streamlining decision-making.' },
                { title: 'Reduced Reporting Time by 40%', desc: 'Implemented new dashboards, significantly decreasing reporting generation time.' }
              ]).map((ach, idx) => {
                const icons = ['✓', '💡', '⏱'];
                return (
                  <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.82rem', color: '#93c5fd', marginTop: '1px' }}>{icons[idx % 3]}</span>
                    <div>
                      <div style={{ fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#ffffff', lineHeight: 1.25, marginBottom: '0.15rem' }}>
                        {ach.title}
                      </div>
                      <div style={{ color: '#cbd5e1', fontSize: '0.7rem', lineHeight: 1.35 }}>
                        {ach.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Skills (Pill Tags) */}
          <div>
            <h3 style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              fontFamily: "'Rubik', sans-serif",
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
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Interests Section (Enhancv Sidebar Feature) */}
          {interestsList && interestsList.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                fontFamily: "'Rubik', sans-serif",
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#93c5fd',
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                paddingBottom: '0.35rem',
                margin: '0 0 0.65rem'
              }}>
                INTERESTS
              </h3>
              <div style={{ fontSize: '0.72rem', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {interestsList.map((item, idx) => (
                  <div key={idx}>
                    <div style={{ fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#ffffff', marginBottom: '0.1rem' }}>
                      {typeof item === 'object' ? item.title : item}
                    </div>
                    {typeof item === 'object' && item.desc && (
                      <div style={{ color: '#cbd5e1', fontSize: '0.68rem', lineHeight: 1.3 }}>
                        {item.desc}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT MAIN COLUMN (White Background) */}
        <div style={{
          flex: 1,
          padding: '1.75rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.4rem',
          boxSizing: 'border-box'
        }}>
          {/* Objective / Summary */}
          {objective && (
            <div>
              <h3 style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                fontFamily: "'Rubik', sans-serif",
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
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#374151', lineHeight: 1.55 }}>
                {objective}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                fontFamily: "'Rubik', sans-serif",
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
                      <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#111827' }}>
                        {exp.title || exp.role}
                      </h4>
                      <span style={{ fontSize: '0.76rem', fontWeight: 500, color: '#64748b' }}>
                        {exp.duration || exp.period}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: primaryAccent }}>
                        {exp.company}
                      </span>
                      <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 500 }}>
                        {exp.location || ''}
                      </span>
                    </div>
                    {exp.desc && (
                      <div style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.5 }}>
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
                fontSize: '0.84rem',
                fontWeight: 700,
                fontFamily: "'Rubik', sans-serif",
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
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, fontFamily: "'Rubik', sans-serif", color: '#111827' }}>
                        {edu.degree}
                      </span>
                      <span style={{ fontSize: '0.76rem', fontWeight: 500, color: '#64748b' }}>
                        {edu.tenure || edu.year}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: primaryAccent }}>
                      {edu.institution || edu.school}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Training / Courses (Enhancv Specification) */}
          {trainingList && trainingList.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                fontFamily: "'Rubik', sans-serif",
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
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: primaryAccent }}>
                      {typeof item === 'object' ? item.title : item}
                    </div>
                    {typeof item === 'object' && item.org && (
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        {item.org} {item.year ? `(${item.year})` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL-WIDTH FOOTER WATERMARK ACROSS ENTIRE BOTTOM */}
      <div style={{ padding: '0 2rem 1.25rem', background: 'white' }}>
        <ResumeFooter />
      </div>
    </div>
  );
};

export default ModernLayout;
