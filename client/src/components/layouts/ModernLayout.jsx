import React from 'react';
import { Mail, Phone, MapPin, Globe, Code2, Link2, Award } from 'lucide-react';

const ModernLayout = ({ data, customColor, customFont, sectionsOrder, theme }) => {
  if (!data) return null;

  const primaryColor = theme?.primaryColor || customColor || '#2563eb';
  const secondaryColor = theme?.secondaryColor || '#111827';
  const fontFamily = theme?.fontFamily || customFont || "'Inter', sans-serif";
  const fontSize = theme?.fontSize || 13;
  const lineHeight = theme?.lineHeight || 1.6;
  const margin = theme?.margin !== undefined ? theme.margin : 35;

  const { name, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], training = [], languagesList = [], references } = data;

  const SectionHeading = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <h2 style={{
        fontSize: `${fontSize * 0.9}px`,
        fontWeight: 900,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: primaryColor,
        margin: 0,
        whiteSpace: 'nowrap'
      }}>{label}</h2>
      <div style={{ flex: 1, height: '1.5px', background: primaryColor, opacity: 0.25 }} />
    </div>
  );

  const renderMainSection = (sectionLabel) => {
    switch (sectionLabel) {
      case 'Summary':
        return objective && (
          <section key="Summary" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Professional Summary" />
            <p style={{ margin: 0, color: '#334155', lineHeight: lineHeight, fontSize: `${fontSize}px` }}>{objective}</p>
          </section>
        );
      case 'Experience':
        return experience && experience.length > 0 && (
          <section key="Experience" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Work Experience" />
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1.1rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${primaryColor}22` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: secondaryColor }}>{exp.title || exp.role}</h3>
                  <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>{exp.duration || exp.period}</span>
                </div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 700, color: primaryColor, marginBottom: '0.4rem' }}>{exp.company}</div>
                {exp.points && exp.points.length > 0 ? (
                  <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
                    {exp.points.map((pt, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '0.25rem', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{pt}</li>
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
              <div key={i} style={{ marginBottom: '1.1rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${primaryColor}22` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: secondaryColor }}>{p.title || p.name}</h3>
                  {p.period && <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 600, color: '#64748b' }}>{p.period}</span>}
                </div>
                {p.technology && (
                  <div style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: primaryColor, marginBottom: '0.3rem' }}>
                    {p.technology}
                  </div>
                )}
                {p.points && p.points.length > 0 ? (
                  <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
                    {p.points.map((pt, j) => (
                      <li key={j} style={{ color: '#475569', marginBottom: '0.2rem', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{pt}</li>
                    ))}
                  </ul>
                ) : p.desc ? (
                  <p style={{ margin: '0.3rem 0 0', color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{p.desc}</p>
                ) : null}
              </div>
            ))}
          </section>
        );
      case 'Education':
        return education && education.length > 0 && (
          <section key="Education" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Education" />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontWeight: 800, fontSize: `${fontSize * 1.02}px`, color: secondaryColor }}>{e.degree}</div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 600, color: primaryColor }}>{e.institution || e.school}</div>
                {e.department && <div style={{ fontSize: `${fontSize * 0.9}px`, color: '#64748b' }}>{e.department}</div>}
                <div style={{ fontSize: `${fontSize * 0.9}px`, color: '#64748b' }}>
                  {e.tenure || e.year}{e.cgpa ? ` • CGPA: ${e.cgpa}` : ''}
                </div>
              </div>
            ))}
          </section>
        );
      case 'Skills':
        return skills && (skills.languages || skills.frameworks || skills.tools) && (
          <section key="Skills" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Technical Skills" />
            {skills.languages && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Languages: </span>
                <span style={{ fontSize: `${fontSize}px`, color: '#334155' }}>{skills.languages}</span>
              </div>
            )}
            {skills.frameworks && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Frameworks: </span>
                <span style={{ fontSize: `${fontSize}px`, color: '#334155' }}>{skills.frameworks}</span>
              </div>
            )}
            {skills.tools && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Databases: </span>
                <span style={{ fontSize: `${fontSize}px`, color: '#334155' }}>{skills.tools}</span>
              </div>
            )}
          </section>
        );
      case 'Certificates':
        return training && training.length > 0 && (
          <section key="Certificates" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Certifications & Awards" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {training.map((cert, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  fontSize: `${fontSize * 0.9}px`, fontWeight: 700,
                  background: `${primaryColor}12`,
                  color: primaryColor,
                  padding: '0.25rem 0.7rem',
                  borderRadius: '20px',
                  border: `1px solid ${primaryColor}30`
                }}>
                  <Award size={10} /> {cert}
                </span>
              ))}
            </div>
          </section>
        );
      case 'Languages':
        return languagesList && languagesList.length > 0 && (
          <section key="Languages" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Languages" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {languagesList.map((lang, i) => (
                <span key={i} style={{
                  fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: '#475569',
                  background: '#f1f5f9', padding: '0.2rem 0.65rem', borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>{lang}</span>
              ))}
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
      {/* HEADER */}
      <header style={{ textAlign: theme?.profilePosition === 'right' ? 'right' : theme?.profilePosition === 'center' ? 'center' : 'left', marginBottom: '1.5rem', borderBottom: `2.5px solid ${primaryColor}`, paddingBottom: '1.25rem' }}>
        <h1 style={{ fontSize: `${fontSize * 2.3}px`, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: secondaryColor }}>
          {name || 'Your Name'}
        </h1>
        {data.role && (
          <p style={{ fontSize: `${fontSize * 1.05}px`, fontWeight: 700, color: primaryColor, margin: '0.3rem 0 0.75rem' }}>
            {data.role}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: theme?.profilePosition === 'right' ? 'flex-end' : theme?.profilePosition === 'center' ? 'center' : 'flex-start', flexWrap: 'wrap', gap: '0.85rem 1.5rem', marginTop: '0.5rem' }}>
          {contact.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: `${fontSize * 0.9}px`, color: '#475569' }}>
              <Mail size={12} color={primaryColor} /> {contact.email}
            </span>
          )}
          {contact.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: `${fontSize * 0.9}px`, color: '#475569' }}>
              <Phone size={12} color={primaryColor} /> {contact.phone}
            </span>
          )}
          {contact.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: `${fontSize * 0.9}px`, color: '#475569' }}>
              <MapPin size={12} color={primaryColor} /> {contact.location}
            </span>
          )}
          {contact.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: `${fontSize * 0.9}px`, color: '#475569' }}>
              <Link2 size={12} color={primaryColor} /> {contact.linkedin}
            </span>
          )}
          {contact.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: `${fontSize * 0.9}px`, color: '#475569' }}>
              <Code2 size={12} color={primaryColor} /> {contact.github}
            </span>
          )}
        </div>
      </header>

      {/* DYNAMIC SECTIONS */}
      {orderToUse.map(s => renderMainSection(s))}

      {/* REFERENCES */}
      {references && (
        <section style={{ marginTop: '1.5rem' }}>
          <SectionHeading label="References" />
          <p style={{ margin: 0, color: '#64748b', fontSize: `${fontSize * 0.9}px`, fontStyle: 'italic' }}>{references}</p>
        </section>
      )}
    </div>
  );
};

export default ModernLayout;
