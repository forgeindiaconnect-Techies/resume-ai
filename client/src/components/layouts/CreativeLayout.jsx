import React from 'react';
import { Mail, Phone, MapPin, Globe, Code2, Link2, Award, Sparkles } from 'lucide-react';

const CreativeLayout = ({ data, customColor, customFont, sectionsOrder, theme }) => {
  if (!data) return null;

  const primaryColor = theme?.primaryColor || customColor || '#7c3aed';
  const secondaryColor = theme?.secondaryColor || '#0f172a';
  const fontFamily = theme?.fontFamily || customFont || "'Inter', sans-serif";
  const fontSize = theme?.fontSize || 13;
  const lineHeight = theme?.lineHeight || 1.6;
  const margin = theme?.margin !== undefined ? theme.margin : 35;

  const { name, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], training = [], languagesList = [], references } = data;

  const SectionHeading = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
      <span style={{ width: '8px', height: '18px', background: primaryColor, borderRadius: '3px' }} />
      <h2 style={{
        fontSize: `${fontSize * 0.95}px`,
        fontWeight: 900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: secondaryColor,
        margin: 0
      }}>{label}</h2>
    </div>
  );

  const renderSection = (sectionLabel) => {
    switch (sectionLabel) {
      case 'Summary':
        return objective && (
          <section key="Summary" style={{ marginBottom: '1.5rem', background: '#faf5ff', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: `4px solid ${primaryColor}` }}>
            <p style={{ margin: 0, color: '#3b0764', lineHeight: lineHeight, fontSize: `${fontSize}px`, fontWeight: 500 }}>{objective}</p>
          </section>
        );
      case 'Experience':
        return experience && experience.length > 0 && (
          <section key="Experience" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Experience" />
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1.2rem', padding: '0.85rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: secondaryColor }}>{exp.title || exp.role}</h3>
                  <span style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 800, color: primaryColor, background: '#f3e8ff', padding: '0.15rem 0.55rem', borderRadius: '20px' }}>{exp.duration || exp.period}</span>
                </div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 700, color: primaryColor, margin: '0.2rem 0 0.4rem' }}>{exp.company}</div>
                {exp.points && exp.points.length > 0 ? (
                  <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
                    {exp.points.map((pt, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '0.2rem', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{pt}</li>
                    ))}
                  </ul>
                ) : exp.desc ? (
                  <p style={{ margin: '0.3rem 0 0', color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{exp.desc}</p>
                ) : null}
              </div>
            ))}
          </section>
        );
      case 'Projects':
        return projects && projects.length > 0 && (
          <section key="Projects" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Projects" />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '1rem', padding: '0.85rem 1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: secondaryColor }}>{p.title || p.name}</h3>
                  {p.period && <span style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 600, color: '#64748b' }}>{p.period}</span>}
                </div>
                {p.technology && <div style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: primaryColor, margin: '0.2rem 0' }}>{p.technology}</div>}
                {p.desc && <p style={{ margin: '0.2rem 0 0', color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{p.desc}</p>}
              </div>
            ))}
          </section>
        );
      case 'Education':
        return education && education.length > 0 && (
          <section key="Education" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Education" />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 800, fontSize: `${fontSize * 1.02}px`, color: secondaryColor }}>{e.degree}</div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 700, color: primaryColor }}>{e.institution || e.school}</div>
                <div style={{ fontSize: `${fontSize * 0.9}px`, color: '#64748b' }}>{e.tenure || e.year}{e.cgpa ? ` • CGPA: ${e.cgpa}` : ''}</div>
              </div>
            ))}
          </section>
        );
      case 'Skills':
        return skills && (skills.languages || skills.frameworks || skills.tools) && (
          <section key="Skills" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Skills Stack" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: `${fontSize}px` }}>
              {skills.languages && (
                <div>
                  <span style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Languages</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {skills.languages.split(',').map((item, idx) => (
                      <span key={idx} style={{ background: '#f3e8ff', color: '#6b21a8', padding: '0.15rem 0.6rem', borderRadius: '12px', fontSize: `${fontSize * 0.9}px`, fontWeight: 700 }}>{item.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.frameworks && (
                <div>
                  <span style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>Frameworks & Libs</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {skills.frameworks.split(',').map((item, idx) => (
                      <span key={idx} style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.15rem 0.6rem', borderRadius: '12px', fontSize: `${fontSize * 0.9}px`, fontWeight: 700 }}>{item.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        );
      case 'Certificates':
        return training && training.length > 0 && (
          <section key="Certificates" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Certifications" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {training.map((cert, i) => (
                <span key={i} style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: secondaryColor, background: '#faf5ff', border: `1px solid ${primaryColor}40`, padding: '0.25rem 0.75rem', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={10} color={primaryColor} /> {cert}
                </span>
              ))}
            </div>
          </section>
        );
      case 'Languages':
        return languagesList && languagesList.length > 0 && (
          <section key="Languages" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Languages" />
            <p style={{ margin: 0, fontSize: `${fontSize}px`, color: '#475569' }}>{languagesList.join(' • ')}</p>
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
        boxSizing: 'border-box',
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        display: 'flex'
      }}
    >
      {/* CREATIVE SIDE STRIPE */}
      <div style={{ width: '16px', background: primaryColor, flexShrink: 0 }} />

      <div style={{ flex: 1, padding: `${margin}px` }}>
        {/* HEADER */}
        <header style={{ textAlign: theme?.profilePosition === 'right' ? 'right' : theme?.profilePosition === 'center' ? 'center' : 'left', marginBottom: '1.75rem', borderBottom: `2px solid #f1f5f9`, paddingBottom: '1.25rem' }}>
          <h1 style={{ fontSize: `${fontSize * 2.5}px`, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: secondaryColor }}>
            {name || 'Your Name'}
          </h1>
          {data.role && (
            <p style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: primaryColor, margin: '0.25rem 0 0.75rem' }}>
              {data.role}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: theme?.profilePosition === 'right' ? 'flex-end' : theme?.profilePosition === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap', gap: '0.6rem 1.25rem', fontSize: `${fontSize * 0.9}px`, color: '#64748b', marginTop: '0.4rem' }}>
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
            <p style={{ margin: 0, color: '#64748b', fontSize: `${fontSize * 0.9}px`, fontStyle: 'italic' }}>{references}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default CreativeLayout;
