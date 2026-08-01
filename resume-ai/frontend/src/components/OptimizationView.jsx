import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  Zap, 
  BookOpen, 
  Code, 
  TrendingUp, 
  ArrowRight,
  Download,
  Sparkles,
  FileText
} from 'lucide-react';
import ModernResumeTemplate from './ModernResumeTemplate';

const OptimizationView = ({ optimization = {}, role = 'General', onBack }) => {
  const { 
    improvedResume = '', 
    changesMade = [], 
    targetScore = 0, 
    targetMatch = 0,
    skillsToLearn = [],
    suggestedProjects = [],
    beforeAfter = null,
    baseMatch = 0,
    structuredData = null
  } = (optimization || {});

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--text-main)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontWeight: 800, 
            cursor: 'pointer' 
          }}
        >
          <ArrowLeft size={20} /> BACK TO ANALYSIS
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ 
            background: 'var(--grad-main)', 
            padding: '0.5rem 1rem', 
            borderRadius: '10px', 
            color: 'white', 
            fontSize: '0.85rem', 
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Sparkles size={16} /> AI RECONSTRUCTION ACTIVE
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Comparison Card */}
          {beforeAfter && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <TrendingUp size={22} className="gradient-text" /> Expert Reconstruction Analysis (ATS Impact)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {Object.entries(beforeAfter).map(([key, data], i) => (
                  <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{key}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#ef4444', textDecoration: 'line-through', opacity: 0.6, fontStyle: 'italic' }}>{data.before}</div>
                      <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>{data.after}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improved Resume Content */}
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--primary)' }}>
            <div style={{ padding: '1.5rem 2.5rem', background: 'var(--grad-main)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={22} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900 }}>READY-TO-USE {role.toUpperCase()} RESUME</h4>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  className="glass-btn btn-secondary" 
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => {
                    const themes = {
                      'Frontend': { primary: '#0d9488', sidebarBg: '#0d9488', text: '#ffffff' },
                      'Backend': { primary: '#1e40af', sidebarBg: '#ffffff', text: '#1e40af' },
                      'Fullstack': { primary: '#000000', sidebarBg: '#ffffff', text: '#000000' },
                      'BDA': { primary: '#ef4444', sidebarBg: '#ffffff', text: '#ef4444' },
                      'Sales': { primary: '#f59e0b', sidebarBg: '#fff7ed', text: '#92400e' }
                    };
                    const dept = structuredData?.department || 'Fullstack';
                    const theme = themes[dept] || themes['Fullstack'];
                    const isSidebarLeft = ['Frontend', 'Sales'].includes(dept);
                    
                    const html = `
                      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                      <head><meta charset='utf-8'>
                      <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; color: #334155; margin: 0; padding: 0; }
                        table { border-collapse: collapse; width: 100%; }
                        .sidebar { background-color: ${theme.sidebarBg}; padding: 30pt 20pt; width: 30%; }
                        .main { padding: 30pt 30pt; width: 70%; background-color: #ffffff; }
                        h1 { font-size: 28pt; font-weight: 900; margin: 0; color: ${isSidebarLeft ? '#ffffff' : '#0f172a'}; text-transform: uppercase; }
                        .role-badge { display: inline-block; padding: 5pt 10pt; background-color: ${theme.primary}; color: #ffffff; font-size: 10pt; font-weight: 800; margin-top: 10pt; border-radius: 4pt; }
                        h3 { font-size: 11pt; font-weight: 800; color: ${theme.primary}; text-transform: uppercase; border-bottom: 2pt solid #e2e8f0; padding-bottom: 4pt; margin-top: 25pt; margin-bottom: 12pt; }
                        .sidebar-h3 { font-size: 10pt; font-weight: 800; color: ${isSidebarLeft ? '#ffffff' : theme.primary}; text-transform: uppercase; border-bottom: 1pt solid ${isSidebarLeft ? 'rgba(255,255,255,0.3)' : '#e2e8f0'}; padding-bottom: 3pt; margin-bottom: 12pt; margin-top: 20pt; }
                        .sidebar-text { font-size: 9pt; color: ${isSidebarLeft ? '#ffffff' : '#475569'}; margin-bottom: 8pt; }
                        .sidebar-label { font-size: 7.5pt; font-weight: 900; color: ${isSidebarLeft ? 'rgba(255,255,255,0.7)' : '#94a3b8'}; text-transform: uppercase; margin-top: 10pt; }
                        .project-title { font-size: 11pt; font-weight: 800; color: ${theme.primary}; margin-bottom: 4pt; }
                        li { font-size: 10pt; color: #475569; margin-bottom: 5pt; }
                      </style>
                      </head>
                      <body>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            ${isSidebarLeft ? `
                              <td class="sidebar" valign="top">
                                <h1>${structuredData.name.split(' ')[0]}<br/>${structuredData.name.split(' ')[1] || ''}</h1>
                                <div class="role-badge">${role}</div>
                                
                                <div class="sidebar-h3" style="margin-top: 40pt;">Contact</div>
                                <div class="sidebar-label">Email</div>
                                <div class="sidebar-text">${structuredData?.contact?.email || 'N/A'}</div>
                                <div class="sidebar-label">Phone</div>
                                <div class="sidebar-text">${structuredData?.contact?.phone || 'N/A'}</div>
                                <div class="sidebar-label">Location</div>
                                <div class="sidebar-text">${structuredData?.contact?.location || 'N/A'}</div>

                                <div class="sidebar-h3">Technical Stack</div>
                                ${Object.entries(structuredData.skills).map(([k, v]) => `
                                  <div class="sidebar-label">${k}</div>
                                  <div class="sidebar-text" style="font-weight: 600;">${v}</div>
                                `).join('')}

                                <div class="sidebar-h3">Education</div>
                                ${structuredData.education.map(e => `
                                  <div style="margin-bottom: 10pt;">
                                    <div class="sidebar-text" style="font-weight: 800; margin-bottom: 2pt;">${e.degree}</div>
                                    <div class="sidebar-text" style="font-size: 8.5pt; opacity: 0.8;">${e.institution}</div>
                                  </div>
                                `).join('')}
                              </td>
                              <td class="main" valign="top">
                                <h3 style="margin-top: 0;">Professional Summary</h3>
                                <p style="font-size: 10.5pt; color: #334155; line-height: 1.6;">${structuredData.objective}</p>
                                
                                <h3>Experience & Strategic Projects</h3>
                                ${structuredData.projects.map(p => `
                                  <div class="project-title">• ${p.title}</div>
                                  <ul style="margin-top: 5pt;">${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
                                `).join('')}

                                ${structuredData.training ? `
                                  <h3>Certifications & Training</h3>
                                  <ul>${structuredData.training.map(t => `<li>${t}</li>`).join('')}</ul>
                                ` : ''}
                              </td>
                            ` : `
                              <td class="main" valign="top">
                                <div style="margin-bottom: 30pt;">
                                  <h1 style="color: #0f172a; font-size: 36pt;">${structuredData.name}</h1>
                                  <div class="role-badge" style="font-size: 14pt;">${role} EXPERT</div>
                                </div>

                                <h3 style="margin-top: 0;">Professional Summary</h3>
                                <p style="font-size: 11pt; color: #334155; line-height: 1.6;">${structuredData.objective}</p>
                                
                                <h3>Professional Experience</h3>
                                ${structuredData.projects.map(p => `
                                  <div class="project-title" style="font-size: 12pt;">${p.title}</div>
                                  <ul style="margin-top: 8pt; margin-bottom: 20pt;">${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
                                `).join('')}
                              </td>
                              <td class="sidebar" valign="top" style="border-left: 1pt solid #e2e8f0;">
                                <div class="sidebar-h3" style="margin-top: 0;">Connection</div>
                                <div class="sidebar-label">Email</div>
                                <div class="sidebar-text">${structuredData?.contact?.email || 'N/A'}</div>
                                <div class="sidebar-label">Phone</div>
                                <div class="sidebar-text">${structuredData?.contact?.phone || 'N/A'}</div>
                                <div class="sidebar-label">Location</div>
                                <div class="sidebar-text">${structuredData?.contact?.location || 'N/A'}</div>

                                <div class="sidebar-h3" style="margin-top: 30pt;">Expertise</div>
                                ${Object.entries(structuredData.skills).map(([k, v]) => `
                                  <div class="sidebar-label">${k}</div>
                                  <div class="sidebar-text" style="font-weight: 700; color: #0f172a;">${v}</div>
                                `).join('')}

                                <div class="sidebar-h3" style="margin-top: 30pt;">Academic</div>
                                ${structuredData.education.map(e => `
                                  <div style="margin-bottom: 12pt;">
                                    <div class="sidebar-text" style="font-weight: 800; color: #0f172a;">${e.degree}</div>
                                    <div class="sidebar-text" style="font-size: 8.5pt;">${e.institution}</div>
                                    <div class="sidebar-text" style="font-size: 8pt; color: #94a3b8;">${e.tenure}</div>
                                  </div>
                                `).join('')}
                              </td>
                            `}
                          </tr>
                        </table>
                      </body>
                    </html>
                    `;
                    const blob = new Blob([html], { type: 'application/msword' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Resume_${structuredData.name.replace(/\s+/g, '_')}.doc`;
                    a.click();
                  }}
                >
                   DOC 
                </button>
                <button 
                  className="glass-btn btn-primary" 
                  style={{ 
                    padding: '0.5rem 1.25rem', 
                    fontSize: '0.85rem', 
                    background: 'white', 
                    color: 'var(--primary)', 
                    fontWeight: 800,
                    boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                  }}
                  onClick={() => window.print()}
                >
                  <Download size={16} /> DOWNLOAD PDF (PRO)
                </button>
              </div>
            </div>
            <div className="resume-preview-scroll" style={{ 
              backgroundColor: '#f1f5f9',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'center',
              overflowY: 'auto',
              maxHeight: '900px'
            }}>
              {structuredData ? (
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', width: '850px', flexShrink: 0 }}>
                  <ModernResumeTemplate data={structuredData} role={role} />
                </div>
              ) : (
                <div id="printable-resume" style={{ 
                  padding: '4rem 4.5rem', 
                  background: 'white', 
                  width: '100%',
                  whiteSpace: 'pre-wrap',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  color: '#334155'
                }}>
                  {(improvedResume || '').split('\n').map((line, i) => {
                    if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center' }}>{line.replace('# ', '')}</h1>;
                    if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2rem', borderBottom: '1px solid #e2e8f0' }}>{line.replace('### ', '')}</h3>;
                    return <p key={i}>{line}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Match Score Projection */}
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '2.5rem' }}>Match Score Projection</h4>
            <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {/* Progress Bar Track */}
               <div style={{ position: 'absolute', width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px' }} />
               {/* Progress Bar Fill */}
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${targetMatch}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ position: 'absolute', left: 0, height: '8px', background: 'var(--grad-main)', borderRadius: '4px', boxShadow: '0 0 15px var(--primary-glow)' }}
               />
               
               {/* Current Marker */}
               <div style={{ position: 'absolute', left: `${baseMatch}%`, top: '-45px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 900 }}>{baseMatch}%</p>
                  <div style={{ width: '2px', height: '65px', background: 'var(--text-muted)', margin: '0 auto', opacity: 0.2 }} />
               </div>
               
               {/* Target Marker */}
               <div style={{ position: 'absolute', left: `${targetMatch}%`, top: '-45px', transform: 'translateX(-100%)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Target</p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>{targetMatch}%</p>
               </div>
            </div>
            <div style={{ marginTop: '3rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>🚀 +{(targetMatch - baseMatch)}% ATS Optimization</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem' }}>
             <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Zap size={22} className="gradient-text" /> Expert Roadmap
              </h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                   <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Skills to Master</p>
                   {skillsToLearn.map((skill, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                        <CheckCircle2 size={16} color="#10b981" /> {skill}
                      </div>
                   ))}
                </div>
                <div>
                   <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Strategic Projects</p>
                   {suggestedProjects.map((project, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                        <Target size={16} /> {project}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f59e0b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Architecture Note
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.7', color: 'var(--text-main)', fontWeight: 500 }}>
              This resume has been reconstructed from the ground up to pass automated ATS screeners while maintaining high readability for HR experts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationView;
