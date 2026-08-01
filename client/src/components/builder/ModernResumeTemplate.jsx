import React from 'react';
import { Mail, Phone, MapPin, Globe, Code2, Link2, Award } from 'lucide-react';

const ModernResumeTemplate = ({ data, customColor, customFont }) => {
  if (!data) return null;

  // data comes from templatePreviewData in ResumeBuilder
  // Shape: { name, contact: {email, phone, location, linkedin, github, portfolio}, objective,
  //          education: [{degree, institution, department, cgpa, tenure}],
  //          skills: {languages, frameworks, tools},
  //          projects: [{title, technology, points:[]}],
  //          experience: [{title, company, duration, points:[]}],
  //          training: [string], languagesList: [string], references }
  
  const accentColor = customColor || '#2563eb';
  const font = customFont || "'Inter', sans-serif";

  const { name, contact = {}, objective, education = [], skills = {}, projects = [], experience = [], training = [], languagesList = [], references } = data;

  const SectionHeading = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <h2 style={{
        fontSize: '0.7rem',
        fontWeight: 900,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: accentColor,
        margin: 0,
        whiteSpace: 'nowrap'
      }}>{label}</h2>
      <div style={{ flex: 1, height: '1.5px', background: accentColor, opacity: 0.25 }} />
    </div>
  );

  return (
    <div
      id="printable-resume"
      className="resume-print-wrapper"
      style={{
        width: '100%',
        minHeight: '100%',
        background: 'white',
        fontFamily: font,
        color: '#1e293b',
        padding: '2.5rem 2.75rem',
        boxSizing: 'border-box',
        fontSize: '0.82rem',
        lineHeight: 1.6
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @media print {
          @page { margin: 0; size: A4; }
          body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #printable-resume { box-shadow: none !important; padding: 1.5cm 1.5cm !important; }
        }
      `}</style>

      {/* HEADER */}
      <header style={{ marginBottom: '1.5rem', borderBottom: `2.5px solid ${accentColor}`, paddingBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>
          {name || 'Your Name'}
        </h1>
        {data.role && (
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: accentColor, margin: '0.3rem 0 0.75rem' }}>
            {data.role}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem 1.5rem', marginTop: '0.5rem' }}>
          {contact.email && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <Mail size={12} color={accentColor} /> {contact.email}
            </span>
          )}
          {contact.phone && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <Phone size={12} color={accentColor} /> {contact.phone}
            </span>
          )}
          {contact.location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <MapPin size={12} color={accentColor} /> {contact.location}
            </span>
          )}
          {contact.linkedin && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <Link2 size={12} color={accentColor} /> {contact.linkedin}
            </span>
          )}
          {contact.github && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <Code2 size={12} color={accentColor} /> {contact.github}
            </span>
          )}
          {contact.portfolio && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#475569' }}>
              <Globe size={12} color={accentColor} /> {contact.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* SUMMARY */}
      {objective && (
        <section style={{ marginBottom: '1.5rem' }}>
          <SectionHeading label="Professional Summary" />
          <p style={{ margin: 0, color: '#334155', lineHeight: 1.7, fontSize: '0.83rem' }}>{objective}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {experience && experience.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <SectionHeading label="Work Experience" />
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '1.1rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${accentColor}22` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{exp.title || exp.role}</h3>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>{exp.duration || exp.period}</span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: accentColor, marginBottom: '0.4rem' }}>{exp.company}</div>
              {exp.points && exp.points.length > 0 ? (
                <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
                  {exp.points.map((pt, j) => (
                    <li key={j} style={{ color: '#475569', marginBottom: '0.25rem', fontSize: '0.8rem', lineHeight: 1.6 }}>{pt}</li>
                  ))}
                </ul>
              ) : exp.desc ? (
                <p style={{ margin: '0.3rem 0 0', color: '#475569', fontSize: '0.8rem', lineHeight: 1.6 }}>{exp.desc}</p>
              ) : null}
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects && projects.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <SectionHeading label="Projects" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '1.1rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${accentColor}22` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>{p.title || p.name}</h3>
                {p.period && <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b' }}>{p.period}</span>}
              </div>
              {p.technology && (
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: accentColor, marginBottom: '0.3rem' }}>
                  {p.technology}
                </div>
              )}
              {p.points && p.points.length > 0 ? (
                <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.1rem' }}>
                  {p.points.map((pt, j) => (
                    <li key={j} style={{ color: '#475569', marginBottom: '0.2rem', fontSize: '0.8rem', lineHeight: 1.6 }}>{pt}</li>
                  ))}
                </ul>
              ) : p.desc ? (
                <p style={{ margin: '0.3rem 0 0', color: '#475569', fontSize: '0.8rem', lineHeight: 1.6 }}>{p.desc}</p>
              ) : null}
            </div>
          ))}
        </section>
      )}

      {/* TWO COLUMN: EDUCATION + SKILLS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* EDUCATION */}
        {education && education.length > 0 && (
          <section>
            <SectionHeading label="Education" />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '0.85rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.83rem', color: '#0f172a' }}>{e.degree}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: accentColor }}>{e.institution || e.school}</div>
                {e.department && <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{e.department}</div>}
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {e.tenure || e.year}{e.cgpa ? ` • CGPA: ${e.cgpa}` : ''}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* SKILLS */}
        {skills && (
          <section>
            <SectionHeading label="Technical Skills" />
            {skills.languages && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Languages: </span>
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>{skills.languages}</span>
              </div>
            )}
            {skills.frameworks && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Frameworks: </span>
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>{skills.frameworks}</span>
              </div>
            )}
            {skills.tools && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Databases: </span>
                <span style={{ fontSize: '0.8rem', color: '#334155' }}>{skills.tools}</span>
              </div>
            )}
          </section>
        )}
      </div>

      {/* CERTIFICATIONS */}
      {training && training.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <SectionHeading label="Certifications & Awards" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {training.map((cert, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.76rem', fontWeight: 700,
                background: `${accentColor}12`,
                color: accentColor,
                padding: '0.25rem 0.7rem',
                borderRadius: '20px',
                border: `1px solid ${accentColor}30`
              }}>
                <Award size={10} /> {cert}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* LANGUAGES */}
      {languagesList && languagesList.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <SectionHeading label="Languages" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {languagesList.map((lang, i) => (
              <span key={i} style={{
                fontSize: '0.78rem', fontWeight: 700, color: '#475569',
                background: '#f1f5f9', padding: '0.2rem 0.65rem', borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>{lang}</span>
            ))}
          </div>
        </section>
      )}

      {/* REFERENCES */}
      {references && (
        <section>
          <SectionHeading label="References" />
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>{references}</p>
        </section>
      )}
    </div>
  );
};

export default ModernResumeTemplate;
