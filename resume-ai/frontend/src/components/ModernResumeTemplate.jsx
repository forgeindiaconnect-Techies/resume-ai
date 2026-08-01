import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Code2, 
  Lightbulb, Award, User, CheckCircle2, Zap, Target, PieChart,
  Layout as LayoutIcon, Database, Server, Rocket, ListChecks, Users
} from 'lucide-react';
import ForgeLogo from './ForgeLogo';

const ModernResumeTemplate = ({ data, role, customColor, customFont }) => {
  if (!data) return null;

  const { 
    name = "CANDIDATE NAME", 
    contact = {}, 
    objective = "Professional summary not available.", 
    education = [], 
    skills = {}, 
    projects = [], 
    training = [], 
    personalDetails = {}, 
    department = 'Fullstack',
    languagesList = [],
    references = ''
  } = (data || {});

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@700;800;900&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;700&display=swap');
    .resume-print-wrapper * { font-family: ${customFont || "'Inter', sans-serif"} !important; }
    h1, h2, .impact-header { font-family: ${customFont || "'Montserrat', sans-serif"} !important; }
  `;

  // Department-Specific Themes
  const themes = {
    'Frontend': { primary: '#0d9488', secondary: '#f0fdfa', accent: '#14b8a6', text: '#134e4a', sidebarBg: '#0d9488' },
    'Backend': { primary: '#1e40af', secondary: '#eff6ff', accent: '#3b82f6', text: '#1e3a8a', sidebarBg: '#ffffff' },
    'Fullstack': { primary: '#000000', secondary: '#f8fafc', accent: '#334155', text: '#000000', sidebarBg: '#ffffff' },
    'BDA': { primary: '#ef4444', secondary: '#fef2f2', accent: '#dc2626', text: '#991b1b', sidebarBg: '#ffffff' },
    'Sales': { primary: '#f59e0b', secondary: '#fffbeb', accent: '#d97706', text: '#92400e', sidebarBg: '#fff7ed' }
  };

  const theme = {
    ...(themes[department] || themes['Fullstack']),
    ...(customColor ? { primary: customColor, accent: customColor } : {})
  };

  // Global Print & Alignment Fixes
  const printStyles = `
    @media print {
      @page { margin: 0; size: A4; }
      body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .resume-print-wrapper { width: 210mm !important; height: 297mm !important; box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
      section { break-inside: avoid; page-break-inside: avoid; }
      .sidebar-item { break-inside: avoid; page-break-inside: avoid; }
      h1, h2, h3, h4 { break-after: avoid; }
    }
  `;

  // Template 1: Frontend (Teal Sidebar Layout)
  const FrontendLayout = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '1100px', background: 'white' }}>
      <div style={{ background: theme.sidebarBg, color: 'white', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}><ForgeLogo size={28} showText={false} /></div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase' }}>{(name || "CANDIDATE").split(' ')[0]}<br/>{(name || "").split(' ')[1] || ''}</h1>
        </div>
        
        <section className="sidebar-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>CERTIFICATION</h3>
          {(training || []).map((t, i) => <p key={i} style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.5rem' }}>{t}</p>)}
        </section>

        <section className="sidebar-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>INDUSTRY SKILLS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(skills || {}).map(([cat, val], i) => (
              <div key={i}>
                <p style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{cat}</p>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{val}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sidebar-item">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>STRENGTHS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}><Users size={14} style={{ marginRight: '0.5rem' }}/> Collaborative</div>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}><Target size={14} style={{ marginRight: '0.5rem' }}/> Result-oriented</div>
            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}><CheckCircle2 size={14} style={{ marginRight: '0.5rem' }}/> Detail-oriented</div>
          </div>
        </section>

        {languagesList && languagesList.length > 0 && (
          <section className="sidebar-item">
            <h3 style={{ fontSize: '1rem', fontWeight: 800, borderBottom: '2px solid rgba(255,255,255,0.3)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>LANGUAGES</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {languagesList.map((lang, i) => (
                <div key={i} style={{ fontSize: '0.85rem', fontWeight: 650 }}>• {lang}</div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div style={{ padding: '4rem 3.5rem' }}>
        <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '2.5rem', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: '#f0fdfa', color: theme.primary, borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, marginBottom: '1rem', border: `1px solid ${theme.primary}` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.primary }}></div> TOP RATED EXPERT
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{role} Specialist</h2>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16}/> {contact?.email || 'N/A'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16}/> {contact?.phone || 'N/A'}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16}/> {contact?.location || 'N/A'}</span>
          </div>
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', textTransform: 'uppercase' }}>Summary</h3>
          <p style={{ lineHeight: 1.7, color: '#475569', fontSize: '1rem', margin: 0 }}>{objective}</p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Experience & Projects</h3>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: theme.primary, marginBottom: '0.5rem' }}>{p.title}</h4>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem', margin: 0 }}>
                {p.points.map((pt, j) => <li key={j} style={{ color: '#475569', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{pt}</li>)}
              </ul>
            </div>
          ))}
        </section>

        {references && (
          <section style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', textTransform: 'uppercase' }}>References</h3>
            <p style={{ lineHeight: 1.6, color: '#475569', fontSize: '0.95rem' }}>{references}</p>
          </section>
        )}
      </div>
    </div>
  );

  // Template 2: Backend (Badge Header Layout)
  const BackendLayout = () => (
    <div style={{ padding: '4rem', minHeight: '1100px', background: 'white', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}><ForgeLogo size={32} showText={false} /></div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: '#111827', margin: 0 }}>{name}</h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: theme.primary, marginTop: '0.5rem' }}>{role}</h2>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', color: '#6b7280', fontSize: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16}/> {contact?.email || 'N/A'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16}/> {contact?.phone || 'N/A'}</span>
            </div>
          </div>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: theme.primary, display: 'flex', alignItems: 'center', 
            justifyContent: 'center', color: 'white', fontSize: '2.5rem', fontWeight: 900,
            boxShadow: '0 10px 25px rgba(30, 64, 175, 0.25)'
          }}>
             {name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '4rem' }}>
          <div>
            <section style={{ marginBottom: '3.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '3px solid #111827', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={20}/> Executive Summary
              </h3>
              <p style={{ lineHeight: 1.7, color: '#374151', fontSize: '1.05rem', fontWeight: 500 }}>{objective}</p>
            </section>

            <section>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '3px solid #111827', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Professional Experience</h3>
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: theme.primary }}>{p.title}</h4>
                  <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem' }}>
                    {p.points.map((pt, j) => <li key={j} style={{ color: '#4b5563', marginBottom: '0.6rem', lineHeight: 1.6 }}>{pt}</li>)}
                  </ul>
                </div>
              ))}
            </section>
            {references && (
              <section style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '3px solid #111827', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>References</h3>
                <p style={{ lineHeight: 1.6, color: '#4b5563', fontSize: '0.95rem' }}>{references}</p>
              </section>
            )}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <section className="sidebar-item">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '3px solid #111827', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Strengths</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {['Problem Solving', 'System Optimization', 'Agile Delivery', 'Tech Leadership'].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: theme.primary, fontWeight: 700 }}>
                    <div style={{ color: theme.primary }}><Zap size={18}/></div> {s}
                  </div>
                ))}
              </div>
            </section>

            <section className="sidebar-item">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '3px solid #111827', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Technical Stack</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(skills || {}).map(([cat, val], i) => (
                  <div key={i}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{cat}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>{val}</p>
                  </div>
                ))}
              </div>
            </section>

            {languagesList && languagesList.length > 0 && (
              <section className="sidebar-item" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', color: '#111827', borderBottom: '3px solid #111827', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Languages</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {languagesList.map((lang, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', color: '#374151', fontWeight: 650 }}>• {lang}</div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
    </div>
  );

  // Template 3: Fullstack (Minimal Professional Layout)
  const FullstackLayout = () => (
    <div style={{ padding: '5rem', minHeight: '1100px', background: 'white' }}>
      <header style={{ textAlign: 'left', marginBottom: '4rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}><ForgeLogo size={36} /></div>
        <h1 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.03em', margin: 0, color: '#0f172a' }}>{name.toUpperCase()}</h1>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 600, color: '#3b82f6', marginTop: '0.5rem' }}>{role}</h2>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', color: '#64748b', fontSize: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18}/> {contact?.email || 'N/A'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={18}/> {contact?.phone || 'N/A'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18}/> {contact?.location || 'N/A'}</span>
        </div>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>Career Objective</h3>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#334155', maxWidth: '90%' }}>{objective}</p>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>Engineering Experience</h3>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>{p.title}</h4>
            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {p.points.map((pt, j) => <li key={j} style={{ fontSize: '1.05rem', color: '#475569', marginBottom: '0.6rem', listStyleType: 'square', lineHeight: 1.5 }}>{pt}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
        <section>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>Education</h3>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>{e.degree}</p>
              <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1rem' }}>{e.institution}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>{e.tenure}</p>
            </div>
          ))}
        </section>
        <section className="sidebar-item">
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>Core Technical Stack</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(skills).map(([cat, s], i) => (
              <div key={i}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{cat}:</span>
                <span style={{ fontSize: '1.05rem', color: '#475569', marginLeft: '0.5rem' }}>{s}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {languagesList && languagesList.length > 0 && (
        <section style={{ marginTop: '3.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>Languages Spoken</h3>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {languagesList.map((lang, i) => (
              <span key={i} style={{ fontSize: '1.05rem', color: '#475569', fontWeight: 650 }}>{lang}</span>
            ))}
          </div>
        </section>
      )}

      {references && (
        <section style={{ marginTop: '3.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.5rem' }}>References</h3>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>{references}</p>
        </section>
      )}
    </div>
  );

  // Template 4: BDA (Emerald Split Layout - Based on Image 4)
  const BDALayout = () => (
    <div style={{ padding: '4rem', minHeight: '1100px', background: 'white' }}>
      <header style={{ marginBottom: '4rem' }}>
        <div style={{ marginBottom: '1.5rem' }}><ForgeLogo size={32} /></div>
        <h1 style={{ fontSize: '4.2rem', fontWeight: 900, color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>{name}</h1>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: theme.primary, textTransform: 'uppercase', marginTop: '0.25rem' }}>{role}</h2>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', fontSize: '1rem', color: '#4b5563' }}>
          <span>{contact?.email || 'N/A'}</span> • <span>{contact?.phone || 'N/A'}</span> • <span>{contact?.location || 'N/A'}</span>
        </div>
        <p style={{ fontSize: '1.15rem', color: '#4b5563', marginTop: '1.5rem', lineHeight: 1.6, maxWidth: '85%' }}>{objective}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '5rem' }}>
        <section>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', color: theme.primary, borderBottom: '2px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '2rem' }}>Experience</h3>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>{p.title}</h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {p.points.map((pt, j) => <li key={j} style={{ color: '#374151', marginBottom: '0.8rem', fontSize: '1rem', display: 'flex', gap: '1rem', lineHeight: 1.5 }}><span style={{ color: theme.primary, fontWeight: 900 }}>•</span> {pt}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          <section className="sidebar-item">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: theme.primary, borderBottom: '2px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>Skills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {Object.entries(skills).map(([cat, val], i) => (
                <div key={i}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{cat}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>{val}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: theme.primary, borderBottom: '2px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>Education</h3>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '1.25rem' }}>
                <p style={{ fontWeight: 800, fontSize: '1rem', color: '#111827' }}>{e.degree}</p>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.15rem' }}>{e.institution}</p>
              </div>
            ))}
          </section>

          <section>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', color: theme.primary, borderBottom: '2px solid #e5e7eb', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>Strengths</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {['Data Storytelling', 'Statistical Insight', 'Strategic GTM'].map(s => (
                <div key={s} style={{ padding: '0.4rem 0.8rem', background: theme.secondary, color: theme.primary, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>{s}</div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );

  // Template 5: Sales (Peach Iconic Layout - Based on Image 5)
  const SalesLayout = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '1100px', background: 'white' }}>
      <div style={{ background: theme.sidebarBg, padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem', borderRight: '1px solid #fed7aa' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}><ForgeLogo size={44} showText={false} /></div>
          <div style={{ 
            width: '100px', height: '100px', borderRadius: '50%', background: theme.primary, 
            margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '2.5rem', fontWeight: 900
          }}>
             {name.split(' ').map(n => n[0]).join('')}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: theme.text, lineHeight: 1.2 }}>{name.toUpperCase()}</h1>
          <div style={{ padding: '0.6rem 1rem', background: theme.primary, color: 'white', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, marginTop: '1.25rem', display: 'inline-block' }}>{role}</div>
        </div>

        <section className="sidebar-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
             <div style={{ width: 34, height: 34, background: 'white', borderRadius: '50%', border: '2px solid ' + theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={16} color={theme.primary}/></div>
             <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: theme.text, letterSpacing: '0.1em' }}>CONTACT</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: theme.text, fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Globe size={14}/> {contact?.location || 'N/A'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Phone size={14}/> {contact?.phone || 'N/A'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', wordBreak: 'break-all' }}><Mail size={14}/> {contact?.email || 'N/A'}</div>
          </div>
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
             <div style={{ width: 34, height: 34, background: 'white', borderRadius: '50%', border: '2px solid ' + theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><GraduationCap size={16} color={theme.primary}/></div>
             <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: theme.text, letterSpacing: '0.1em' }}>EDUCATION</h3>
          </div>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: theme.text }}>{e.degree}</div>
              <div style={{ fontSize: '0.85rem', color: theme.text, opacity: 0.8, marginTop: '0.25rem' }}>{e.institution}</div>
            </div>
          ))}
        </section>

        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.75rem' }}>
             <div style={{ width: 34, height: 34, background: 'white', borderRadius: '50%', border: '2px solid ' + theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={16} color={theme.primary}/></div>
             <h3 style={{ fontSize: '0.95rem', fontWeight: 900, color: theme.text, letterSpacing: '0.1em' }}>CORE SKILLS</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
             {Object.values(skills).map((s, i) => <span key={i} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', border: '1.5px solid ' + theme.primary, borderRadius: '10px', fontWeight: 700, color: theme.text }}>{s}</span>)}
          </div>
        </section>
      </div>

      <div style={{ padding: '4.5rem 3.5rem' }}>
        <section style={{ marginBottom: '4.5rem' }}>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: theme.text, display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
             <Rocket size={28} color={theme.primary}/> CAREER OBJECTIVE
          </h3>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.75, color: '#374151', fontWeight: 500 }}>{objective}</p>
        </section>

        <section>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: theme.text, display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
             <Briefcase size={28} color={theme.primary}/> WORK EXPERIENCE
          </h3>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3.5rem', position: 'relative', paddingLeft: '2rem', borderLeft: '3px solid #fde68a' }}>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: theme.primary, marginBottom: '1.25rem' }}>{p.title}</h4>
              <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                {p.points.map((pt, j) => <li key={j} style={{ color: '#4b5563', marginBottom: '0.85rem', lineHeight: 1.6, fontSize: '1.05rem', display: 'flex', gap: '0.75rem' }}><span style={{ color: theme.primary, fontWeight: 900 }}>✓</span> {pt}</li>)}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );

  const renderTemplate = () => {
    const activeLayout = data.templateId || 'modern';
    if (activeLayout === 'modern') return <FrontendLayout />;
    if (activeLayout === 'minimalist') return <FullstackLayout />;
    if (activeLayout === 'executive') return <BackendLayout />;

    switch(department) {
      case 'Frontend': return <FrontendLayout />;
      case 'Backend': return <BackendLayout />;
      case 'Fullstack': return <FullstackLayout />;
      case 'BDA': return <BDALayout />;
      case 'Sales': return <SalesLayout />;
      default: return <FullstackLayout />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      id="printable-resume"
      className="resume-print-wrapper"
      style={{ width: '100%', minHeight: '100%', background: 'white' }}
    >
      <style>{globalStyles}</style>
      <style>{printStyles}</style>
      {renderTemplate()}
    </motion.div>
  );
};

export default ModernResumeTemplate;
