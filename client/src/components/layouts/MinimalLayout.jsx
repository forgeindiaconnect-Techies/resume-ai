import React from 'react';

const MinimalLayout = ({ data, customColor, customFont, sectionsOrder, theme }) => {
  if (!data) return null;

  const primaryColor = theme?.primaryColor || customColor || '#334155';
  const secondaryColor = theme?.secondaryColor || '#0f172a';
  const fontFamily = theme?.fontFamily || customFont || "'Inter', sans-serif";
  const fontSize = theme?.fontSize || 13;
  const lineHeight = theme?.lineHeight || 1.65;
  const margin = theme?.margin !== undefined ? theme.margin : 45;

  const { name, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], training = [], languagesList = [], references } = data;

  const SectionHeading = ({ label }) => (
    <div style={{ marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
      <h2 style={{
        fontSize: `${fontSize * 0.88}px`,
        fontWeight: 800,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#64748b',
        margin: 0
      }}>{label}</h2>
    </div>
  );

  const renderSection = (sectionLabel) => {
    switch (sectionLabel) {
      case 'Summary':
        return objective && (
          <section key="Summary" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="About" />
            <p style={{ margin: 0, color: '#334155', lineHeight: lineHeight, fontSize: `${fontSize}px`, fontWeight: 400 }}>{objective}</p>
          </section>
        );
      case 'Experience':
        return experience && experience.length > 0 && (
          <section key="Experience" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="Experience" />
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 700, color: secondaryColor }}>{exp.title || exp.role}</h3>
                  <span style={{ fontSize: `${fontSize * 0.88}px`, color: '#94a3b8' }}>{exp.duration || exp.period}</span>
                </div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, color: primaryColor, fontWeight: 600, marginBottom: '0.35rem' }}>{exp.company}</div>
                {exp.points && exp.points.length > 0 ? (
                  <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1rem', color: '#475569' }}>
                    {exp.points.map((pt, j) => (
                      <li key={j} style={{ marginBottom: '0.25rem', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{pt}</li>
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
          <section key="Projects" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="Selected Work" />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 700, color: secondaryColor }}>{p.title || p.name}</h3>
                  {p.period && <span style={{ fontSize: `${fontSize * 0.88}px`, color: '#94a3b8' }}>{p.period}</span>}
                </div>
                {p.technology && <div style={{ fontSize: `${fontSize * 0.9}px`, color: primaryColor, fontWeight: 500, margin: '0.15rem 0 0.3rem' }}>{p.technology}</div>}
                {p.desc && <p style={{ margin: 0, color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{p.desc}</p>}
              </div>
            ))}
          </section>
        );
      case 'Education':
        return education && education.length > 0 && (
          <section key="Education" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="Education" />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: `${fontSize * 1.02}px`, color: secondaryColor }}>{e.degree}</span>
                  <span style={{ fontSize: `${fontSize * 0.88}px`, color: '#94a3b8' }}>{e.tenure || e.year}</span>
                </div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, color: '#64748b' }}>{e.institution || e.school}</div>
              </div>
            ))}
          </section>
        );
      case 'Skills':
        return skills && (skills.languages || skills.frameworks || skills.tools) && (
          <section key="Skills" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="Skills" />
            <div style={{ fontSize: `${fontSize}px`, color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {skills.languages && <div><span style={{ color: secondaryColor, fontWeight: 600 }}>Languages:</span> {skills.languages}</div>}
              {skills.frameworks && <div><span style={{ color: secondaryColor, fontWeight: 600 }}>Frameworks:</span> {skills.frameworks}</div>}
              {skills.tools && <div><span style={{ color: secondaryColor, fontWeight: 600 }}>Tools:</span> {skills.tools}</div>}
            </div>
          </section>
        );
      case 'Certificates':
        return training && training.length > 0 && (
          <section key="Certificates" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="Certifications" />
            <div style={{ fontSize: `${fontSize}px`, color: '#475569', lineHeight: lineHeight }}>
              {training.join(' • ')}
            </div>
          </section>
        );
      case 'Languages':
        return languagesList && languagesList.length > 0 && (
          <section key="Languages" style={{ marginBottom: '1.75rem' }}>
            <SectionHeading label="Languages" />
            <div style={{ fontSize: `${fontSize}px`, color: '#475569' }}>
              {languagesList.join(', ')}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const orderToUse = sectionsOrder && sectionsOrder.length > 0 
    ? sectionsOrder.filter(s => s !== 'Personal' && s !== 'Preview')
    : ['Summary', 'Experience', 'Projects', 'Education', 'Skills', 'Certificates', 'Languages'];

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
      {/* MINIMALIST HEADER */}
      <header style={{ textAlign: theme?.profilePosition === 'right' ? 'right' : theme?.profilePosition === 'center' ? 'center' : 'left', marginBottom: '2.25rem' }}>
        <h1 style={{ fontSize: `${fontSize * 2.5}px`, fontWeight: 300, letterSpacing: '-0.03em', margin: 0, color: secondaryColor }}>
          {name || 'Your Name'}
        </h1>
        {data.role && (
          <p style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 500, color: primaryColor, margin: '0.2rem 0 0.75rem', letterSpacing: '0.05em' }}>
            {data.role}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: theme?.profilePosition === 'right' ? 'flex-end' : theme?.profilePosition === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap', gap: '0.5rem 1.25rem', fontSize: `${fontSize * 0.9}px`, color: '#64748b', marginTop: '0.5rem' }}>
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </header>

      {/* DYNAMIC SECTIONS */}
      {orderToUse.map(s => renderSection(s))}

      {/* REFERENCES */}
      {references && (
        <section style={{ marginTop: '1.5rem' }}>
          <SectionHeading label="References" />
          <p style={{ margin: 0, color: '#94a3b8', fontSize: `${fontSize * 0.9}px`, fontStyle: 'italic' }}>{references}</p>
        </section>
      )}
    </div>
  );
};

export default MinimalLayout;
