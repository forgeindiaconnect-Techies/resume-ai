import React from 'react';
import { Mail, Phone, MapPin, Globe, Code2, Link2, Award, Briefcase, GraduationCap } from 'lucide-react';

const ExecutiveLayout = ({ data, customColor, customFont, sectionsOrder, theme }) => {
  if (!data) return null;

  const primaryColor = theme?.primaryColor || customColor || '#0f172a';
  const secondaryColor = theme?.secondaryColor || '#475569';
  const fontFamily = theme?.fontFamily || customFont || "'Inter', sans-serif";
  const fontSize = theme?.fontSize || 13;
  const lineHeight = theme?.lineHeight || 1.6;
  const margin = theme?.margin !== undefined ? theme.margin : 35;

  const { name, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], training = [], languagesList = [], references } = data;

  const SectionHeading = ({ label, icon: Icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '0.35rem', marginBottom: '1rem' }}>
      {Icon && <Icon size={14} color={primaryColor} />}
      <h2 style={{
        fontSize: `${fontSize * 0.95}px`,
        fontWeight: 900,
        letterSpacing: '0.1em',
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
          <section key="Summary" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Executive Summary" />
            <p style={{ margin: 0, color: '#334155', lineHeight: lineHeight, fontSize: `${fontSize}px`, fontWeight: 500 }}>{objective}</p>
          </section>
        );
      case 'Experience':
        return experience && experience.length > 0 && (
          <section key="Experience" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Leadership & Work History" icon={Briefcase} />
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '1.15rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: '#0f172a' }}>{exp.title || exp.role}</h3>
                  <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: primaryColor, background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>{exp.duration || exp.period}</span>
                </div>
                <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 700, color: secondaryColor, margin: '0.15rem 0 0.4rem' }}>{exp.company}</div>
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
            <SectionHeading label="Strategic Initiatives & Projects" />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: `${fontSize * 1.05}px`, fontWeight: 800, color: '#0f172a' }}>{p.title || p.name}</h3>
                  {p.period && <span style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 600, color: '#64748b' }}>{p.period}</span>}
                </div>
                {p.technology && <div style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: primaryColor, marginBottom: '0.25rem' }}>{p.technology}</div>}
                {p.desc && <p style={{ margin: '0.2rem 0 0', color: '#475569', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{p.desc}</p>}
              </div>
            ))}
          </section>
        );
      case 'Education':
        return education && education.length > 0 && (
          <section key="Education" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Education & Credentials" icon={GraduationCap} />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: `${fontSize * 1.02}px`, color: '#0f172a' }}>{e.degree}</div>
                  <div style={{ fontSize: `${fontSize * 0.95}px`, fontWeight: 600, color: secondaryColor }}>{e.institution || e.school} {e.department ? `(${e.department})` : ''}</div>
                </div>
                <div style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: '#64748b' }}>{e.tenure || e.year}</div>
              </div>
            ))}
          </section>
        );
      case 'Skills':
        return skills && (skills.languages || skills.frameworks || skills.tools) && (
          <section key="Skills" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Executive Core Competencies" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: `${fontSize}px` }}>
              {skills.languages && <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', borderLeft: `3px solid ${primaryColor}` }}><strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.1rem' }}>Languages:</strong> <span style={{ color: '#475569' }}>{skills.languages}</span></div>}
              {skills.frameworks && <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', borderLeft: `3px solid ${primaryColor}` }}><strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.1rem' }}>Frameworks:</strong> <span style={{ color: '#475569' }}>{skills.frameworks}</span></div>}
              {skills.tools && <div style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '6px', borderLeft: `3px solid ${primaryColor}` }}><strong style={{ display: 'block', color: '#0f172a', marginBottom: '0.1rem' }}>Tools & Databases:</strong> <span style={{ color: '#475569' }}>{skills.tools}</span></div>}
            </div>
          </section>
        );
      case 'Certificates':
        return training && training.length > 0 && (
          <section key="Certificates" style={{ marginBottom: '1.5rem' }}>
            <SectionHeading label="Certifications & Honors" icon={Award} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {training.map((cert, i) => (
                <span key={i} style={{ fontSize: `${fontSize * 0.9}px`, fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '0.25rem 0.65rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  {cert}
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
        lineHeight: lineHeight
      }}
    >
      {/* EXECUTIVE TOP BAR HEADER */}
      <div style={{ background: primaryColor, color: 'white', padding: `${margin}px ${margin}px ${margin * 0.8}px` }}>
        <h1 style={{ fontSize: `${fontSize * 2.5}px`, fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: 'white' }}>
          {name || 'Your Name'}
        </h1>
        {data.role && (
          <p style={{ fontSize: `${fontSize * 1.1}px`, fontWeight: 700, color: '#93c5fd', margin: '0.35rem 0 0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {data.role}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem 1.5rem', fontSize: `${fontSize * 0.9}px`, color: '#e2e8f0', marginTop: '0.5rem' }}>
          {contact.email && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={12} color="#93c5fd" /> {contact.email}</span>}
          {contact.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={12} color="#93c5fd" /> {contact.phone}</span>}
          {contact.location && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} color="#93c5fd" /> {contact.location}</span>}
          {contact.linkedin && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Link2 size={12} color="#93c5fd" /> {contact.linkedin}</span>}
        </div>
      </div>

      <div style={{ padding: `${margin}px` }}>
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

export default ExecutiveLayout;
