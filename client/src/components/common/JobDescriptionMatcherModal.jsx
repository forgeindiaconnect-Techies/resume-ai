import React, { useState } from 'react';
import { Target, CheckCircle2, AlertCircle, Plus, Sparkles, X, ArrowRight, Zap, Copy, Check, Info } from 'lucide-react';

const COMMON_SKILL_KEYWORDS = [
  'react', 'react.js', 'node.js', 'nodejs', 'typescript', 'javascript', 'python', 'java', 'golang', 'go',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'microservices', 'rest api', 'graphql', 'sql', 'postgresql',
  'mongodb', 'redis', 'kafka', 'ci/cd', 'agile', 'scrum', 'jira', 'confluence', 'pmp', 'system design',
  'spring boot', 'django', 'fastapi', 'next.js', 'vue', 'tailwind', 'redux', 'git', 'linux', 'tableau',
  'power bi', 'data analysis', 'machine learning', 'figma', 'ui/ux', 'wireframing', 'user research',
  'stakeholder management', 'budgeting', 'cross-functional leadership', 'unit testing', 'jest', 'cypress',
  'terraform', 'graphql', 'express', 'html', 'css', 'sass', 'webpack', 'devops', 'ci/cd pipelines',
  'data warehousing', 'snowflake', 'bigquery', 'etl', 'pandas', 'numpy', 'scikit-learn'
];

const STOP_WORDS = new Set([
  'looking', 'must', 'have', 'with', 'years', 'required', 'experience', 'seeking', 'team',
  'candidate', 'strong', 'expertise', 'familiarity', 'preferred', 'highly', 'good', 'work',
  'working', 'ability', 'knowledge', 'responsibilities', 'qualifications', 'requirements',
  'skills', 'role', 'cloud', 'full', 'stack', 'senior', 'junior', 'lead', 'join', 'joiner',
  'overview', 'about', 'apply', 'responsibilities', 'duties', 'engineer', 'developer', 'manager'
]);

const SAMPLE_JDS = [
  {
    role: 'Senior Fullstack Engineer',
    text: 'Looking for a Senior Full Stack Engineer with 5+ years experience. Must have strong expertise in React.js, TypeScript, Node.js, Microservices, and AWS Cloud. Familiarity with Docker, Kubernetes, Kafka, PostgreSQL, and CI/CD pipelines is highly required. Agile/Scrum experience preferred.'
  },
  {
    role: 'Technical Project Manager',
    text: 'Seeking a PMP certified Technical Project Manager to lead cross-functional engineering teams. Must be skilled in Agile Scrum, JIRA, Sprint Planning, Stakeholder Management, and Budget Forecasting. Experience in Fintech, Microservices, and Cloud deployments is a big plus.'
  },
  {
    role: 'Lead Data Analyst',
    text: 'Hiring a Lead Data Analyst with deep expertise in SQL, Python, Tableau, Power BI, and Snowflake. Must have experience building executive KPI dashboards, ETL pipelines, Statistical Modeling, and working with BigQuery.'
  }
];

const JobDescriptionMatcherModal = ({ isOpen, onClose, formData, onUpdateSkills }) => {
  const [jobDescription, setJobDescription] = useState(SAMPLE_JDS[0].text);
  const [targetRole, setTargetRole] = useState(SAMPLE_JDS[0].role);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  // Extract all text from current resume to match against
  const resumeText = [
    formData?.personalInfo?.name || '',
    formData?.personalInfo?.role || '',
    formData?.personalInfo?.summary || '',
    formData?.summary || '',
    Array.isArray(formData?.skills?.languages) ? formData.skills.languages.join(' ') : '',
    Array.isArray(formData?.skills?.frameworks) ? formData.skills.frameworks.join(' ') : '',
    Array.isArray(formData?.skills?.tools) ? formData.skills.tools.join(' ') : '',
    Array.isArray(formData?.skills) ? formData.skills.join(' ') : '',
    Array.isArray(formData?.competencies) ? formData.competencies.join(' ') : '',
    (formData?.experience || []).map(e => `${e.role || e.title || ''} ${e.company || ''} ${e.desc || ''}`).join(' '),
    (formData?.projects || []).map(p => `${p.name || p.title || ''} ${p.technology || ''} ${p.desc || ''}`).join(' '),
    (formData?.certificates || []).map(c => `${c.name || c.title || ''} ${c.organization || c.org || ''}`).join(' ')
  ].join(' ').toLowerCase();

  // Extract keywords from JD
  const extractKeywords = () => {
    if (!jobDescription.trim()) return { matched: [], missing: [], score: 0 };

    const jdLower = jobDescription.toLowerCase();
    
    // 1. Match known common technical/business keywords
    const foundKeywords = COMMON_SKILL_KEYWORDS.filter(kw => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(jdLower);
    });

    // 2. Extract clean capitalized words/phrases without trailing punctuation
    const customWords = (jobDescription.match(/[A-Z][A-Za-z0-9+#.-]+/g) || [])
      .map(w => w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim())
      .filter(w => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));

    const allJdKeywords = Array.from(new Set([...foundKeywords, ...customWords.map(w => w.toLowerCase())]));

    const matched = [];
    const missing = [];

    allJdKeywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(resumeText)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const total = matched.length + missing.length;
    const score = total > 0 ? Math.round((matched.length / total) * 100) : 0;

    return { matched, missing, score };
  };

  const { matched, missing, score } = extractKeywords();

  const handleAddSingleSkill = (skill) => {
    const formatted = skill.charAt(0).toUpperCase() + skill.slice(1);
    if (onUpdateSkills) {
      onUpdateSkills(formatted);
    }
  };

  const handleAddAllMissing = () => {
    if (missing.length === 0) return;
    missing.forEach(m => {
      const formatted = m.charAt(0).toUpperCase() + m.slice(1);
      if (onUpdateSkills) onUpdateSkills(formatted);
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  const handleUseSample = (sample) => {
    setJobDescription(sample.text);
    setTargetRole(sample.role);
    setAddedSuccess(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '1rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '840px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.2rem 1.75rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc, #eff6ff)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              borderRadius: '10px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
            }}>
              <Target size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Job Description (JD) Keyword Matcher
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0' }}>
                Compare your resume against any LinkedIn / Naukri job posting & auto-add missing skills
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#475569',
              cursor: 'pointer',
              padding: '0.45rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* 3-Step Simple Guide Banner */}
          <div style={{
            background: '#f0fdf4',
            border: '1.5px solid #86efac',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            fontSize: '0.78rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.1rem' }}>💡</span>
              <div>
                <span style={{ fontWeight: 800, color: '#166534', display: 'block' }}>
                  How to use this tool:
                </span>
                <span style={{ color: '#15803d', fontSize: '0.74rem' }}>
                  <strong>1.</strong> Paste any job requirements below ➔ <strong>2.</strong> See missing keywords ➔ <strong>3.</strong> Click the green button to auto-add them!
                </span>
              </div>
            </div>
          </div>

          {/* Quick Try Sample Roles */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Try with a Sample Role:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
              {SAMPLE_JDS.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleUseSample(sample)}
                  style={{
                    background: targetRole === sample.role ? '#eff6ff' : '#f8fafc',
                    border: targetRole === sample.role ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    color: targetRole === sample.role ? '#1d4ed8' : '#475569',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ⚡ {sample.role}
                </button>
              ))}
            </div>
          </div>

          {/* JD Input Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.35rem' }}>
              Paste Job Description from LinkedIn, Naukri, or Indeed:
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job requirements, responsibilities, or required skills list here..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                lineHeight: 1.45
              }}
            />
          </div>

          {/* Analysis & Match Results */}
          {jobDescription.trim() && (
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}>
              {/* Score Header & Auto-Add Action */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    fontSize: '2.2rem',
                    fontWeight: 950,
                    color: score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626',
                    lineHeight: 1
                  }}>
                    {score}%
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0f172a' }}>
                      {score >= 80 ? '🎉 Excellent ATS Match!' : score >= 50 ? '⚡ Good Match (Add missing keywords)' : '⚠️ Low Keyword Match'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Found {matched.length} matching keywords out of {matched.length + missing.length} JD requirements
                    </div>
                  </div>
                </div>

                {missing.length > 0 && (
                  <button
                    type="button"
                    onClick={handleAddAllMissing}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      background: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.65rem 1.15rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <Zap size={16} /> Auto-Add All {missing.length} Missing Keywords
                  </button>
                )}
              </div>

              {/* Success Notification */}
              {addedSuccess && (
                <div style={{
                  padding: '0.5rem 0.8rem',
                  background: '#ecfdf5',
                  border: '1px solid #6ee7b7',
                  borderRadius: '6px',
                  color: '#065f46',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <CheckCircle2 size={16} color="#059669" />
                  Keywords added to your resume skills! Match score updated.
                </div>
              )}

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${score}%`,
                  height: '100%',
                  background: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Missing Keywords List */}
              {missing.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                    <AlertCircle size={13} /> Missing Keywords in Your Resume ({missing.length}) — Click any to add:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {missing.map((kw, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSingleSkill(kw)}
                        title={`Click to add ${kw} to skills`}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#b91c1c',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{kw}</span>
                        <Plus size={11} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Keywords List */}
              {matched.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={13} /> Already Matched in Your Resume ({matched.length}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {matched.map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#ecfdf5',
                          border: '1px solid #a7f3d0',
                          color: '#047857',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.75rem',
          borderTop: '1px solid #e2e8f0',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
            Tip: Modern ATS platforms filter resumes by matching keywords before recruiters view them.
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '0.45rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionMatcherModal;
