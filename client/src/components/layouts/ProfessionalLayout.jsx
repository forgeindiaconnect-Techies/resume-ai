import React from 'react';

const ProfessionalLayout = ({ data, customColor, customFont, sectionsOrder, theme }) => {
  if (!data) return null;

  const primaryColor = theme?.primaryColor || customColor || '#1e3a8a';
  const secondaryColor = theme?.secondaryColor || '#475569';
  const fontFamily = theme?.fontFamily || customFont || "'Inter', sans-serif";
  const fontSize = theme?.fontSize || 13;
  const lineHeight = theme?.lineHeight || 1.6;
  const margin = theme?.margin !== undefined ? theme.margin : 40;

  const { name, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], training = [], languagesList = [], references } = data;

  const SectionHeading = ({ label }) => (
    <div style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: '0.3rem', marginBottom: '0.85rem' }}>
      <h2 style={{
        fontSize: `${fontSize * 0.95}px`,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: primaryColor,
        margin: 0
      }}>{label}</h2>
    </div>
  );

  const renderSection = (sectionLabel) => {
    switch (sectionLabel) {
      case 'Summary':
        return objective && (
          <section key="Summary" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Professional Summary" />
            <p style={{ margin: 0, color: '#334155', lineHeight: lineHeight, fontSize: `${fontSize}px`, textAlign: 'justify' }}>{objective}</p>
          </section>
        );
      case 'Experience':
        return experience && experience.length > 0 && (
          <section key="Experience" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Work Experience" />
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: '#0f172a' }}>{exp.title || exp.role}</h3>
                  <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 600, color: '#64748b' }}>{exp.duration || exp.period}</span>
                </div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 700, color: primaryColor, marginBottom: '0.35rem' }}>{exp.company}</div>
                {exp.points && exp.points.length > 0 ? (
                  <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
                    {exp.points.map((pt, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '0.2rem', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{pt}</li>
                    ))}
                  </ul>
                ) : exp.desc ? (
                  <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{exp.desc}</p>
                ) : null}
              </div>
            ))}
          </section>
        );
      case 'Projects':
        return projects && projects.length > 0 && (
          <section key="Projects" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Key Projects" />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: '#0f172a' }}>{p.title || p.name}</h3>
                  {p.period && <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 600, color: '#64748b' }}>{p.period}</span>}
                </div>
                {p.technology && (
                  <div style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 600, color: primaryColor, marginBottom: '0.25rem' }}>
                    Tech Stack: {p.technology}
                  </div>
                )}
                {p.points && p.points.length > 0 ? (
                  <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.1rem' }}>
                    {p.points.map((pt, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '0.2rem', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{pt}</li>
                    ))}
                  </ul>
                ) : p.desc ? (
                  <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{p.desc}</p>
                ) : null}
              </div>
            ))}
          </section>
        );
      case 'Education':
        return education && education.length > 0 && (
          <section key="Education" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Education" />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: `${fontSize * 1.02}px`, color: '#0f172a' }}>{e.degree}</div>
                  <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 600, color: primaryColor }}>{e.institution || e.school} {e.department ? `• ${e.department}` : ''}</div>
                </div>
                <div style={{ fontSize: `${fontSize * 0.9}px`, color: '#64748b', textAlign: 'right' }}>
                  {e.tenure || e.year}{e.cgpa ? ` (CGPA: ${e.cgpa})` : ''}
                </div>
              </div>
            ))}
          </section>
        );
      case 'Skills':
        return skills && (skills.languages || skills.frameworks || skills.tools) && (
          <section key="Skills" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Skills & Competencies" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: `${fontSize}px` }}>
              {skills.languages && (
                <div><strong style={{ color: secondaryColor }}>Languages:</strong> <span style={{ color: '#475569' }}>{skills.languages}</span></div>
              )}
              {skills.frameworks && (
                <div><strong style={{ color: secondaryColor }}>Frameworks:</strong> <span style={{ color: '#475569' }}>{skills.frameworks}</span></div>
              )}
              {skills.tools && (
                <div><strong style={{ color: secondaryColor }}>Tools & DB:</strong> <span style={{ color: '#475569' }}>{skills.tools}</span></div>
              )}
            </div>
          </section>
        );
      case 'Certificates':
        return training && training.length > 0 && (
          <section key="Certificates" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Certifications & Training" />
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: `${fontSize}px`, color: '#475569', lineHeight: lineHeight }}>
              {training.map((cert, i) => (
                <li key={i} style={{ marginBottom: '0.2rem' }}>{cert}</li>
              ))}
            </ul>
          </section>
        );
      case 'Languages':
        return languagesList && languagesList.length > 0 && (
          <section key="Languages" style={{ marginBottom: '1.25rem' }}>
            <SectionHeading label="Languages Spoken" />
            <p style={{ margin: 0, fontSize: `${fontSize}px`, color: '#475569', lineHeight: lineHeight }}>{languagesList.join(' • ')}</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="printable-resume"
      className="resume-print-wrapper"
      style={{
        width: '100%',
        minHeight: '100%',
        background: 'white',
        fontFamily: fontFamily,
        color: secondaryColor,
        padding: `${margin}px`,
        boxSizing: 'border-box',
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight
      }}
    >
      {/* HEADER */}
      <header style={{ textAlign: theme?.profilePosition === 'left' ? 'left' : theme?.profilePosition === 'right' ? 'right' : 'center', marginBottom: '1.75rem', borderBottom: `1px solid #cbd5e1`, paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: `${fontSize * 2.4}px`, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: primaryColor, textTransform: 'uppercase' }}>
          {name || 'Your Name'}
        </h1>
        {data.role && (
          <p style={{ fontSize: `${fontSize * 1.1}px`, fontWeight: 700, color: secondaryColor, margin: '0.25rem 0 0.6rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {data.role}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: theme?.profilePosition === 'left' ? 'flex-start' : theme?.profilePosition === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap', gap: '0.6rem 1.25rem', fontSize: `${fontSize * 0.9}px`, color: '#475569', marginTop: '0.4rem' }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.location && <span>• {contact.location}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {contact.github && <span>• {contact.github}</span>}
        </div>
      </header>

      {/* DYNAMIC SECTIONS ORDER */}
      {sectionsOrder && sectionsOrder.length > 0 ? (
        sectionsOrder.filter(s => s !== 'Personal' && s !== 'Preview').map(s => renderSection(s))
      ) : (
        ['Summary', 'Experience', 'Projects', 'Education', 'Skills', 'Certificates', 'Languages']
          .map(s => renderSection(s))
      )}

      {/* REFERENCES */}
      {references && (
        <section style={{ marginTop: '1.25rem' }}>
          <SectionHeading label="References" />
          <p style={{ margin: 0, color: '#64748b', fontSize: `${fontSize * 0.9}px`, fontStyle: 'italic' }}>{references}</p>
        </section>
      )}
    </div>
  );
};

export default ProfessionalLayout;
