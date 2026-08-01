import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  FileText, 
  RefreshCw,
  Zap,
  ShieldCheck,
  Target,
  BrainCircuit,
  FileCheck,
  Users,
  MessageSquare,
  Sparkles,
  Globe,
  ChevronRight,
  ChevronLeft,
  Clock,
  Download
} from 'lucide-react';
import CandidateListView from './CandidateListView';
import OptimizationView from './OptimizationView';
import SchedulingModal from './SchedulingModal';
import RankingView from './RankingView';

const RoleCard = ({ role, active, onClick, icon: Icon }) => (
  <div 
    onClick={() => onClick(role)}
    className="glass-card"
    style={{ 
      padding: '1.5rem', 
      cursor: 'pointer', 
      transition: 'all 0.3s ease',
      background: active ? 'var(--primary)' : 'var(--bg-card)',
      color: active ? 'white' : 'var(--text-main)',
      borderColor: active ? 'transparent' : 'var(--border)',
      textAlign: 'center',
      minWidth: '160px',
      boxShadow: active ? '0 10px 20px var(--primary-glow)' : 'none'
    }}
  >
    <div style={{ marginBottom: '1rem', color: active ? 'white' : 'var(--primary)' }}>
      <Icon size={32} />
    </div>
    <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>{role}</h4>
  </div>
);

const RecruitmentTimeline = ({ notifications = [] }) => (
  <div className="glass-card" style={{ padding: '2rem' }}>
    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
       <Clock size={20} color="var(--primary)" /> Activity Timeline
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'var(--border)', zIndex: 0 }} />
      {notifications.length > 0 ? [...notifications].reverse().map((note, i) => (
        <div key={note.id || i} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-card)', 
            border: `2px solid ${note.type === 'Selected' ? '#10b981' : note.type === 'Rejected' ? '#ef4444' : 'var(--primary)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: note.type === 'Selected' ? '#10b981' : note.type === 'Rejected' ? '#ef4444' : 'var(--primary)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>{note.type}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{note.date}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', fontWeight: 500 }}>{note.message}</p>
          </div>
        </div>
      )) : (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>No recent activity.</p>
      )}
    </div>
  </div>
);

const ResultDashboard = ({ analysis = {}, onReset, recruiterMode, onOptimize, optimizing, user, onUpgradeRedirect }) => {
  const { 
    score = 0, 
    verdict: status = 'Consider', 
    reasons = [], 
    weaknesses = [],
    missingSkills = [], 
    suggestions = [],
    strengths = [],
    matchedSkills = [],
    skills = [],
    communicationScore = 0,
    communicationAnalysis = [],
    role = 'General',
    detailedMatch = { score: 0, highlights: [], gaps: [] },
    interviewPrep = { technical: [], behavioural: [] }
  } = (analysis || {});

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'interview'

  const isSelected = status === 'Selected' || analysis.status === 'Selected';
  const isRejected = status === 'Rejected' || analysis.status === 'Rejected';
  const isInterview = status === 'Interview' || analysis.status === 'Interview';

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>AI Analysis Report</h2>
          {recruiterMode && (
             <div style={{ 
               padding: '0.5rem 1rem', borderRadius: '20px', 
               background: isSelected ? 'rgba(16, 185, 129, 0.1)' : isRejected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
               border: `1px solid ${isSelected ? '#10b981' : isRejected ? '#ef4444' : 'var(--glass-border)'}`,
               fontSize: '0.8rem', fontWeight: 800, color: isSelected ? '#10b981' : isRejected ? '#ef4444' : 'var(--text-muted)'
             }}>
               CURRENT STATUS: { (analysis.status || status).toUpperCase() }
             </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {recruiterMode && !isSelected && !isRejected && user?.userRole === 'HR' && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
               <button 
                 onClick={() => onOptimize('Rejected')}
                 className="gradient-btn-outline" 
                 style={{ border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1.5rem', background: 'transparent' }}
               >
                 <XCircle size={18} /> REJECT CANDIDATE
               </button>
               <button 
                 onClick={() => onOptimize('Selected')}
                 className="gradient-btn" 
                 style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
               >
                 <CheckCircle2 size={18} /> SHORTLIST CANDIDATE
               </button>
            </div>
          )}
          {!isSelected && !recruiterMode && (
            <button 
              onClick={onOptimize} 
              disabled={optimizing}
              className="gradient-btn" 
              style={{ padding: '0.75rem 1.5rem' }}
            >
              <Sparkles size={18} /> {optimizing ? 'OPTIMIZING...' : `IMPROVE & TAILOR FOR ${role.toUpperCase()}`}
            </button>
          )}
          <button 
            onClick={() => {
              if (user?.subscription !== 'Premium' && !recruiterMode) {
                if (onUpgradeRedirect) onUpgradeRedirect();
                return;
              }
              const content = `
AI RESUME ANALYSIS REPORT
Candidate: ${analysis.name || 'N/A'}
Target Role: ${analysis.role || 'General'}
Overall Score: ${analysis.score || 0}/100
Verdict: ${analysis.status || analysis.verdict || 'N/A'}

STRENGTHS:
${(analysis.strengths || []).map(s => `- ${s}`).join('\n')}

WEAKNESSES:
${(analysis.weaknesses || []).map(w => `- ${w}`).join('\n')}

SKILLS IDENTIFIED:
${(analysis.skills || []).join(', ')}

MATCHED KEYWORDS:
${(analysis.matchedSkills || []).join(', ')}

MISSING KEYWORDS:
${(analysis.missingSkills || []).join(', ')}
`;
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `AI_Analysis_${analysis.name || 'Report'}.txt`;
              a.click();
            }}
            className="gradient-btn-outline" 
            style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--primary)', color: 'var(--primary)' }}
          >
            <Download size={18} /> DOWNLOAD REPORT
          </button>
          <button onClick={onReset} className="gradient-btn" style={{ border: '1px solid var(--border)', background: 'var(--bg-hover)', padding: '0.75rem 1.5rem', color: 'var(--text-main)' }}>
            <RefreshCw size={18} /> {recruiterMode ? 'BACK TO RECRUITER VIEW' : 'NEW ANALYSIS'}
          </button>
        </div>
      </div>

      {/* Top Row: Expert Verdict Score & Resume Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: recruiterMode ? '1fr 1fr' : '1.2fr 0.8fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Expert Verdict Card */}
        <div className="glass-card" style={{ padding: '2rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>Expert Verdict</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <div style={{ color: isSelected ? '#10b981' : isRejected ? '#ef4444' : 'var(--primary)' }}>
                  {isSelected ? <CheckCircle2 size={30} /> : isRejected ? <XCircle size={30} /> : <AlertTriangle size={30} />}
                </div>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)' }}>{score}/100 Score</span>
              </div>
              <h3 style={{ 
                fontSize: '1.15rem', 
                fontWeight: 900, 
                color: isSelected ? '#10b981' : isRejected ? '#ef4444' : 'var(--primary)',
                marginTop: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                {status}
              </h3>
            </div>
          </div>
          <div style={{ position: 'absolute', right: -30, bottom: -30, opacity: 0.1, transform: 'rotate(-10deg)', pointerEvents: 'none' }}>
            {isSelected ? <CheckCircle2 size={180} color="#10b981" /> : isRejected ? <XCircle size={180} color="#ef4444" /> : <AlertTriangle size={180} color="var(--primary)" />}
          </div>
        </div>

        {/* Basic Metadata Snapshot Card */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Resume Snapshot</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: '0.1rem' }}>Candidate Name</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)' }}>{analysis.name || 'N/A'}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, marginBottom: '0.1rem' }}>Target Job Role</span>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{role || analysis.role || 'General'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Section (Conditional Paywall) */}
      <div style={{ position: 'relative' }}>
        
        {/* Free Plan Paywall Overlay */}
        {user?.subscription !== 'Premium' && !recruiterMode && (
          <div style={{
            position: 'absolute',
            inset: '-12px',
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            borderRadius: '24px'
          }}>
            <div className="glass-card" style={{ padding: '3rem 2.5rem', textAlign: 'center', maxWidth: '440px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '2px solid var(--primary)', background: 'var(--bg-card)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif" }}>
                Unlock Full Report
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.5 }}>
                Get detailed keyword matches, identified skills gap analysis, communication analysis, and detailed strengths & weaknesses.
              </p>
              <div style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-main)', marginBottom: '1.75rem' }}>
                ₹299<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/month</span>
              </div>
              <button
                onClick={onUpgradeRedirect}
                className="glass-btn btn-primary"
                style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontWeight: 900, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 8px 20px var(--primary-glow)' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        )}

        {/* Detailed Analysis Content */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          filter: (user?.subscription !== 'Premium' && !recruiterMode) ? 'blur(6px)' : 'none',
          pointerEvents: (user?.subscription !== 'Premium' && !recruiterMode) ? 'none' : 'auto'
        }}>
          {detailedMatch && detailedMatch.score > 0 && activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                padding: '1.25rem 2rem', background: 'var(--bg-card)', borderRadius: '18px', 
                border: '1px solid var(--primary)', display: 'flex', justifyContent: 'space-between', 
                alignItems: 'center', boxShadow: '0 8px 25px var(--primary-glow)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                  {detailedMatch.score}%
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900 }}>JOB DESCRIPTION MATCH SCORE</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Based on technical keywords and role-specific requirements.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>Highlights</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {detailedMatch.highlights.map((h, i) => <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700 }}>#{h}</span>)}
                  </div>
                </div>
                <div style={{ width: '1px', background: 'var(--glass-border)' }} />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>Missing Essentials</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    {detailedMatch.gaps.map((g, i) => <span key={i} style={{ fontSize: '0.75rem', fontWeight: 700 }}>#{g}</span>)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* AI Score Matrix Card */}
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <PieChart size={20} color="var(--primary)" /> AI Analysis Metrics
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { label: 'ATS Score', value: analysis.score || 86, color: 'var(--primary)' },
                    { label: 'Grammar', value: 95, color: '#10b981' },
                    { label: 'Formatting', value: 80, color: '#f59e0b' },
                    { label: 'Keywords', value: 74, color: '#a855f7' },
                    { label: 'Action Verbs', value: 88, color: '#06b6d4' }
                  ].map((metric, idx) => (
                    <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 650 }}>{metric.label}</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: metric.color }}>{metric.value}%</span>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${metric.value}%`, height: '100%', background: metric.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Suggestions Card */}
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Lightbulb size={20} color="#f59e0b" /> AI Tailoring Suggestions
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Missing Skills</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['Communication', 'Leadership', 'React', 'Node.js'].map(skill => (
                        <span key={skill} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ color: 'var(--primary)', marginTop: '0.1rem' }}><Sparkles size={14} /></div>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Summary Focus</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Improve Professional Summary details to emphasize leadership.</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ color: 'var(--primary)', marginTop: '0.1rem' }}><Sparkles size={14} /></div>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Experience Achievements</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add measurable metrics and achievements to work history.</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ color: 'var(--primary)', marginTop: '0.1rem' }}><Sparkles size={14} /></div>
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Academic Details</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add cumulative CGPA metrics to university credentials.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Strengths Card */}
              <div className="glass-card" style={{ padding: '2rem', height: '100%', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={20} className="gradient-text" /> Top Strengths
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(strengths.length > 0 ? strengths : ["No notable strengths identified"]).map((item, i) => (
                    <div key={i} style={{ 
                      display: 'flex', gap: '1rem', padding: '1.25rem', 
                      background: 'rgba(16, 185, 129, 0.1)', borderRadius: '14px', 
                      border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', 
                      fontSize: '0.9rem', fontWeight: 600 
                    }}>
                      <div style={{ marginTop: '0.2rem' }}><CheckCircle2 size={16} /></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Analysis Card */}
              <div className="glass-card" style={{ padding: '2rem', height: '100%', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MessageSquare size={22} color="var(--primary)" /> Communication Analysis
                  </div>
                  <div style={{ background: 'var(--grad-main)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                    {communicationScore}/100 Score
                  </div>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(communicationAnalysis.length > 0 ? communicationAnalysis : ["Analyzing communication style..."]).map((item, i) => (
                    <div key={i} style={{ 
                      display: 'flex', gap: '1rem', padding: '1rem', 
                      background: 'rgba(255, 255, 255, 0.05)', borderRadius: '14px', 
                      color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 500 
                    }}>
                      <div style={{ marginTop: '0.1rem', color: 'var(--primary)' }}><Lightbulb size={16} /></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {recruiterMode && (
                <RecruitmentTimeline notifications={analysis.notifications || []} />
              )}

              {(isRejected || weaknesses.length > 0) && (
                <div className="glass-card" style={{ padding: '2rem', height: '100%', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} color="#ef4444" /> 
                    {isRejected ? 'Critical Rejection Reasons' : 'Identified Weaknesses'}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(isRejected ? reasons : weaknesses).map((item, i) => (
                      <div key={i} style={{ 
                        display: 'flex', gap: '1rem', padding: '1.25rem', 
                        background: 'rgba(239, 68, 68, 0.1)', borderRadius: '14px', 
                        border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', 
                        fontSize: '0.9rem', fontWeight: 600 
                      }}>
                        <div style={{ marginTop: '0.2rem' }}><XCircle size={16} /></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="glass-card" style={{ padding: '2rem', height: '100%', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileCheck size={22} color="var(--primary)" /> Skills Identified
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {(skills.length > 0 ? skills : ['No key skills identified']).map((skill, i) => (
                    <div key={i} style={{ 
                      padding: '0.5rem 1rem', borderRadius: '12px', 
                      background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontSize: '0.85rem', fontWeight: 700, color: '#10b981'
                    }}>
                      {typeof skill === 'object' ? skill.name : skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '2rem', height: '100%', textAlign: 'left' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <BrainCircuit size={22} color="var(--primary)" /> Skill Gap Analysis
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {(missingSkills.length > 0 ? missingSkills.slice(0, 10) : ['No critical gaps identified']).map((skill, i) => (
                    <div key={i} style={{ 
                      padding: '1.25rem', borderRadius: '16px', 
                      background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)',
                      fontSize: '0.9rem', fontWeight: 800, color: 'var(--primary)', textAlign: 'left'
                    }}>
                      {typeof skill === 'object' ? skill.name : skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const roleExpertise = {
  'Frontend': {
    title: 'Frontend Development Suite',
    desc: 'Focuses on visual fidelity, responsive design, and modern interactive web technologies.',
    stack: 'HTML, CSS, JavaScript, React, UI/UX'
  },
  'Backend': {
    title: 'Server-Side Engineering',
    desc: 'Targets scalable architectures, efficient APIs, and robust data management.',
    stack: 'Node.js, Python, Java, SQL/NoSQL, Microservices'
  },
  'Fullstack': {
    title: 'End-to-End Development',
    desc: 'Bridges the gap between elegant UI design and robust server logic.',
    stack: 'MERN, MEAN, SQL/NoSQL, TypeScript, Cloud, DevOps'
  },
  'BDA': {
    title: 'Business Data Analytics',
    desc: 'Transforms raw data into actionable insights through statistics and visualization.',
    stack: 'SQL/NoSQL, Python, ETL, Tableau, Power BI'
  },
  'Sales': {
    title: 'Growth & Revenue Strategy',
    desc: 'Prioritizes GTM strategies, relationship management, and lead generation.',
    stack: 'CRM, Negotiation, Strategy, Lead Gen'
  },
  // Sub-roles ... (Rest of the list)
  'UI Developer': {
    title: 'UI Developer & CSS Expert',
    desc: 'Focuses on visual fidelity, responsive design, and modern CSS frameworks like Tailwind and Bootstrap.',
    stack: 'HTML, CSS, Tailwind, Bootstrap, Responsive Design'
  },
  'React Developer': {
    title: 'React.js Specialist',
    desc: 'Focuses on building component-based architectures with React, Hooks, and API integration.',
    stack: 'React.js, Hooks, JavaScript, API Integration'
  },
  'UX Developer': {
    title: 'UX Design & Prototyping',
    desc: 'Bridges the gap between design and development with a focus on Figma and UX principles.',
    stack: 'Figma, UX Principles, Wireframing'
  },
  'Frontend Engineer': {
    title: 'Advanced Frontend Architecture',
    desc: 'Handles performance optimization, modular architectures, and advanced JS patterns.',
    stack: 'Advanced JS, Performance Optimization, Architecture'
  },
  'Frontend Developer': {
    title: 'Core Frontend Specialist',
    desc: 'Solid foundation in the core web stack with React for building modern interfaces.',
    stack: 'HTML, CSS, JavaScript, React'
  },
  // Backend Family
  'Node.js Developer': {
    title: 'Node.js Backend Engineer',
    desc: 'Specializes in scalable server-side logic, RESTful APIs, and microservices using Node.js.',
    stack: 'Node.js, Express, JWT, Auth, MongoDB, PostgreSQL, SQL/NoSQL'
  },
  'Python Developer': {
    title: 'Python & Django Expert',
    desc: 'Focuses on high-level Python development for backend systems and data processing.',
    stack: 'Python, Django, FastAPI, Celery, PostgreSQL, SQL/NoSQL'
  },
  'Java Developer': {
    title: 'Enterprise Java Specialist',
    desc: 'Expert in building robust enterprise applications with Spring Boot and JEE patterns.',
    stack: 'Java, Spring Boot, Hibernate, Microservices, SQL/NoSQL, Maven'
  },
  'Database Engineer': {
    title: 'Database & ETL Architect',
    desc: 'Focuses on data modeling, query optimization, and enterprise ETL pipelines.',
    stack: 'SQL/NoSQL, Oracle, ETL, Data Warehousing, Airflow'
  },
  // Fullstack Family
  'MERN Developer': {
    title: 'MERN Stack Developer',
    desc: 'Skilled in building complete applications using MongoDB, Express, React, and Node.js.',
    stack: 'MongoDB, Express, React, Node.js, SQL/NoSQL, Redux'
  },
  'Fullstack Engineer': {
    title: 'Systems & Cloud Engineer',
    desc: 'Combines fullstack development with systems architecture and cloud infrastructure (AWS/Azure).',
    stack: 'TypeScript, React, Node.js, SQL/NoSQL, AWS, Docker, CI/CD'
  },
  // BDA Family
  'Data Analyst': {
    title: 'Business Intelligence Analyst',
    desc: 'Transforms raw data into actionable insights through visualization and reporting.',
    stack: 'SQL, Tableau, Power BI, Excel, Statistics'
  },
  'Data Scientist': {
    title: 'AI & Data Scientist',
    desc: 'Builds predictive models and machine learning algorithms to solve business problems.',
    stack: 'Python, Sklearn, PyTorch, ML Modeling, Statistics, BigQuery'
  },
  'Business Analyst': {
    title: 'Strategy & Requirements Analyst',
    desc: 'Bridges technical and business teams with clear requirements and GTM strategies.',
    stack: 'JIRA, Confluence, GTM, Requirement Gathering, Agile'
  },
  // Sales Family
  'Business Development': {
    title: 'BD & Growth Strategist',
    desc: 'Drives organizational growth through lead generation and strategic partnerships.',
    stack: 'Lead Generation, Partnerships, Strategy, Cold Outreach'
  },
  'Sales Executive': {
    title: 'B2B Sales Leader',
    desc: 'Focuses on deal closing, high-level negotiation, and enterprise client relationships.',
    stack: 'Negotiation, Closing, B2B Sales, Target Management'
  },
  'Marketing Specialist': {
    title: 'Digital Marketing Specialist',
    desc: 'Expert in driving brand awareness through SEO, campaigns, and content strategy.',
    stack: 'SEO, Google Analytics, Content Strategy, Social ADS'
  }
};

const subRolesMap = {
  'Frontend': ['UI Developer', 'React Developer', 'UX Developer', 'Frontend Engineer', 'Frontend Developer'],
  'Backend': ['Node.js Developer', 'Python Developer', 'Java Developer', 'Database Engineer'],
  'Fullstack': ['MERN Developer', 'Fullstack Engineer'],
  'BDA': ['Data Analyst', 'Data Scientist', 'Business Analyst'],
  'Sales': ['Business Development', 'Sales Executive', 'Marketing Specialist']
};

const AnalyzerView = ({ results, analyzing, setAnalyzing, onAnalysisComplete, onBatchComplete, onReset, clearResults, recruiterMode, setRecruiterMode, onUpdateUser, initialFile, initialRole, onSetRole, uploadedResumes, setUploadedResumes, setShowDuplicateModal, user, setResults, setResumeText, setResumeName, refreshKey, onUpgradeRedirect }) => {
  // If user is HR and recruiterMode is active, start at Step 3 (Results/Pipeline)
  const [step, setStep] = useState(results || (recruiterMode && user?.userRole === 'HR') ? 3 : 1);

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [role, setRole] = useState(initialRole || '');
  const [jdText, setJdText] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [progress, setProgress] = useState(0);
  const [optimization, setOptimization] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [selectedCandidateForSchedule, setSelectedCandidateForSchedule] = useState(null);
  const [recruiterTab, setRecruiterTab] = useState('pipeline'); // 'pipeline' or 'ranking'
  const [selectedCandidateEntry, setSelectedCandidateEntry] = useState(null);
  const [fileEmails, setFileEmails] = useState({}); // { fileName: email }

  // Auto-scroll to configuration panel when entering Step 2
  React.useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        const panel = document.getElementById('config-panel');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [step]);

  // Fetch candidates from DB on mount AND whenever refreshKey changes (new upload happened)
  React.useEffect(() => {
    if (recruiterMode) {
      fetch('/api/candidates')
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch API data');
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) setCandidates(data);
          else console.error('API did not return an array:', data);
        })
        .catch(err => console.error('Error fetching candidates:', err));
    }
  }, [recruiterMode, refreshKey]);

  // Process files passed from Landing Page
  React.useEffect(() => {
    if (initialFile) {
      const selectedFiles = Array.isArray(initialFile) ? initialFile : [initialFile];
      if (selectedFiles.length > 1) {
        if (!recruiterMode && setRecruiterMode) {
          // Wrap in setTimeout to prevent React state update warning during render/mount phase of parent
          setTimeout(() => setRecruiterMode(true), 0);
        }
        setFiles(selectedFiles);
        setStep(2);
      } else { // This implies selectedFiles.length === 1
        setFile(selectedFiles[0]);
        // Let the user confirm or select role and manually run the analysis
        setStep(2);
      }
    }
  }, [initialFile, recruiterMode, setRecruiterMode, initialRole]);

  // Update internal role if prop changes
  React.useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  // Reset steps when mode changes
  const [isInitialMount, setIsInitialMount] = useState(true);
  
  React.useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    setStep(1);
    setFile(null);
    setFiles([]);
    setRole('');
    setJdText('');
  }, [recruiterMode]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    if (onSetRole) onSetRole(selectedRole);
    if (onUpdateUser) {
      onUpdateUser({ role: selectedRole + (selectedRole.includes('/') ? '' : ' Developer') });
    }
  };

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Duplicate Detection Logic
    const isDuplicate = selectedFiles.some(newFile => 
      uploadedResumes.some(existing => 
        existing.name === newFile.name && existing.size === newFile.size
      )
    );

    if (isDuplicate) {
      if (setShowDuplicateModal) setShowDuplicateModal(true);
      return;
    }

    // Add to historical list if not duplicate
    if (setUploadedResumes) {
      const newEntries = selectedFiles.map(f => ({ name: f.name, size: f.size }));
      setUploadedResumes(prev => [...prev, ...newEntries]);
    }

    // Reset previous session data
    if (clearResults) clearResults();
    setOptimization(null);

    // Initialize emails
    const initialEmails = {};
    selectedFiles.forEach(f => {
      initialEmails[f.name] = '';
    });
    setFileEmails(initialEmails);

    if (selectedFiles.length > 1) {
      if (!recruiterMode && setRecruiterMode) {
        setRecruiterMode(true);
      }
      setFiles(selectedFiles);
      setStep(2);
    } else {
      if (recruiterMode) {
        setFiles(selectedFiles);
        setStep(2);
      } else {
        setFile(selectedFiles[0]);
        setFiles(selectedFiles);
        setStep(2);
      }
    }
  };

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jd', jdText || '');
      formData.append('role', role || 'General');
      formData.append('email', fileEmails[file.name] || 'candidate@example.com');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Server error during analysis';
        try {
          const errorData = await response.json();
          errorMsg = errorData.details || errorData.error || errorMsg;
        } catch (jsonErr) {
          // If not JSON, get raw text (could be Vercel error page)
          const rawText = await response.text().catch(() => '');
          if (rawText) errorMsg = `Server Error: ${rawText.slice(0, 100)}...`;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      onAnalysisComplete(result, file.name);
      setStep(3);
    } catch (error) {
      console.error('Analysis error:', error);
      const detailMsg = error.message || 'Unknown error';
      alert(`Failed to analyze resume: ${detailMsg}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleOptimize = async () => {
    if (!results || !role) return;
    setOptimizing(true);
    
    try {
      const response = await fetch('/api/analyze/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: results, role: role, jd: jdText })
      });

      if (!response.ok) throw new Error('Optimization failed');

      const data = await response.json();
      setOptimization({ ...data, baseMatch: results.matchPercentage || 0 });
      setStep(4);
    } catch (error) {
      console.error('Optimization error:', error);
      alert('Failed to optimize resume.');
    } finally {
      setOptimizing(false);
    }
  };

  const runRecruiterAnalysis = async () => {
    if (files.length === 0 || !jdText) return;
    setAnalyzing(true);
    setProgress(0);
    
    let processedCount = 0;
    const totalFiles = files.length;

    try {
      console.log(`Starting batch analysis for ${totalFiles} files...`);
      const resultsArray = await Promise.all(
        files.map(async (f) => {
          try {
            console.log(`Analyzing: ${f.name}...`);
            const formData = new FormData();
            formData.append('resume', f);
            formData.append('jd', jdText);
            formData.append('role', role || 'General');
            formData.append('email', fileEmails[f.name] || 'candidate@example.com');
    
            const response = await fetch('/api/analyze', {
              method: 'POST',
              body: formData,
            });
    
            if (!response.ok) {
              let errorMsg = 'Server internal error';
              try {
                const errorData = await response.json();
                errorMsg = errorData.details || errorData.error || errorMsg;
              } catch (jsonErr) {
                const rawText = await response.text().catch(() => '');
                if (rawText) errorMsg = `Server Response: ${rawText.slice(0, 100)}...`;
              }
              throw new Error(`Failed to analyze ${f.name}: ${errorMsg}`);
            }
    
            const result = await response.json();
            processedCount++;
            setProgress(Math.round((processedCount / totalFiles) * 100));
            console.log(`DONE: ${f.name}`);
              
            return {
              name: result.name || f.name.split('.')[0],
              email: result.email || fileEmails[f.name] || 'candidate@example.com',
              fileName: f.name,
              score: result.score || 0,
              matchPercentage: result.matchPercentage || 0,
              matchedSkills: result.matchedSkills || [],
              skills: result.skills || [],
              missingSkills: result.missingSkills || [],
              strengths: result.strengths || [],
              weaknesses: result.weaknesses || [],
              reasons: result.reasons || [],
              suggestedRoles: result.suggestedRoles || [],
              improvementSkills: result.improvementSkills || [],
              status: 'Applied',
              role: role || 'General',
              extractedText: result.extractedText || '',
              timestamp: new Date().toLocaleString(),
              remarks: result.reasons?.[0] || result.suggestions?.[0] || "Profile review complete"
            };
          } catch (error) {
            console.error(`FAILED: ${f.name}:`, error.message);
            processedCount++;
            setProgress(Math.round((processedCount / totalFiles) * 100));
            return {
              name: f.name.split('.')[0],
              fileName: f.name,
              score: 0,
              matchedSkills: [],
              suggestedRoles: [],
              improvementSkills: [],
              status: 'error',
              error: error.message
            };
          }
        })
      );
      
      console.log('Batch analysis complete! Saving to database...');
      
      const persistedCandidates = [];
      for (const [index, cand] of resultsArray.entries()) {
        try {
          const response = await fetch('/api/candidates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cand)
          });
          
          if (response.ok) {
            const savedCandidate = await response.json();
            persistedCandidates.push(savedCandidate);
            console.log(`Saved candidate ${index + 1}/${totalFiles}: ${savedCandidate.name}`);
          } else {
            console.error(`Failed to save candidate ${index + 1}:`, cand.name);
            persistedCandidates.push(cand); // Fallback to local if save fails
          }
        } catch (saveErr) {
          console.error(`Error saving candidate ${index + 1}:`, saveErr);
          persistedCandidates.push(cand);
        }
      }

      setCandidates(persistedCandidates);
      if (onBatchComplete) await onBatchComplete(persistedCandidates);
      console.log('Batch analysis fully persisted and synced.');
      setStep(3);
    } catch (err) {
      console.error('Batch error:', err);
      alert(`Batch analysis encountered an error: ${err.message || 'Check console for details'}`);
    } finally {
      setProgress(100);
      setAnalyzing(false);
    }
  };

  const handleUpdateStatus = async (indexOrCandidate, newStatus) => {
    let candidate;
    let targetIndex;

    if (typeof indexOrCandidate === 'number') {
      candidate = candidates[indexOrCandidate];
      targetIndex = indexOrCandidate;
    } else {
      candidate = indexOrCandidate;
      targetIndex = candidates.findIndex(c => (c.id || c._id) === (candidate.id || candidate._id));
    }

    if (!candidate) return;

    try {
      const candidateId = candidate.id || candidate._id;
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updated = await response.json();
        
        // Update main list
        if (targetIndex !== -1) {
          const newCandidates = [...candidates];
          newCandidates[targetIndex] = updated;
          setCandidates(newCandidates);
        }

        // Update selected candidate if it's the one we're viewing
        if (selectedCandidateEntry && (selectedCandidateEntry.id || selectedCandidateEntry._id) === (updated.id || updated._id)) {
          setSelectedCandidateEntry(updated);
        }

        // Trigger immediate notification refresh across the app
        window.dispatchEvent(new CustomEvent('notificationUpdate'));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSelectCandidate = (cand) => {
    setSelectedCandidateEntry(cand);
    
    // Synchronize with global active resume for Job Matcher
    if (setResults) setResults(cand);
    if (setResumeText) setResumeText(cand.extractedText || '');
    if (setResumeName) setResumeName(cand.fileName || cand.name);

    // Smooth scroll to top of view container
    setTimeout(() => {
      const viewContainer = document.querySelector('.view-container');
      if (viewContainer) {
        viewContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackToPipeline = () => {
    setSelectedCandidateEntry(null);
  };

  const handleScheduleInterview = (candidate) => {
    setSelectedCandidateForSchedule(candidate);
    setShowSchedulingModal(true);
  };

  const onScheduleConfirm = async (schedulingData) => {
    try {
      const candidateId = selectedCandidateForSchedule.id || selectedCandidateForSchedule._id;
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          interview: schedulingData, 
          status: 'Interview' 
        })
      });
      if (response.ok) {
        const updated = await response.json();
        
        // Refresh candidates list
        const updatedRes = await fetch('/api/candidates');
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          if (Array.isArray(updatedData)) {
            setCandidates(updatedData);
          }
        }

        // Update selected entry if we are viewing it
        if (selectedCandidateEntry && (selectedCandidateEntry.id || selectedCandidateEntry._id) === (updated.id || updated._id)) {
          setSelectedCandidateEntry(updated);
        }
      }
    } catch (err) {
      console.error('Error scheduling:', err);
    }
  };

  const handleShortlist = (index) => {
    const newCandidates = [...candidates];
    newCandidates[index].status = 'shortlisted';
    setCandidates(newCandidates);
  };

  const handleReject = (index) => {
    const newCandidates = [...candidates];
    newCandidates[index].status = 'rejected';
    setCandidates(newCandidates);
  };

  const resetAll = () => {
    setFile(null);
    setFiles([]);
    setRole('');
    setJdText('');
    setCandidates([]);
    setStep(1);
    onReset();
  };

  return (
    <div style={{ height: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {step === 1 && user?.userRole === 'HR' && recruiterMode && (
          <motion.div 
            key="step1-hr" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}
          >
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                 <ShieldCheck size={40} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Recruiter Dashboard</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600, maxWidth: '500px', margin: '0 auto' }}>
                Welcome back! Resume uploading is managed by the AI Recruitment Team. Please proceed to the <span className="gradient-text">Candidate Pipeline</span> to manage results.
              </p>
              <button 
                onClick={() => setStep(3)}
                className="gradient-btn"
                style={{ marginTop: '2.5rem', padding: '1rem 2.5rem' }}
              >
                 GO TO PIPELINE <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && !(user?.userRole === 'HR' && recruiterMode) && (
          <motion.div 
            key="step1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-main)' }}>
                AI Analysis <span className="gradient-text">Report</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>
                {recruiterMode ? 'Batch process resumes against custom job descriptions.' : 'Institutional-grade insights into your resume performance.'}
              </p>
            </div>

            <div 
              onClick={() => document.getElementById('resumeUpload').click()}
              className="glass-card"
              style={{ padding: '6rem 4rem', width: '100%', maxWidth: '600px', cursor: 'pointer', textAlign: 'center' }}
            >
              <input id="resumeUpload" type="file" hidden accept=".pdf,.docx" multiple={true} onChange={handleUpload} />
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ width: 80, height: 80, borderRadius: '24px', background: 'var(--grad-main)', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px var(--primary-glow)' }}
              >
                <Upload size={40} />
              </motion.div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                {recruiterMode ? `Upload Resumes (${files.length || 'Multi-select'})` : 'Upload Resume(s)'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                {recruiterMode ? 'Select all candidate resumes to analyze' : 'Drag and drop or click to select one or multiple (PDF, DOCX)'}
              </p>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}
          >
             <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Analysis <span className="gradient-text">Configuration</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
                {recruiterMode ? 'Specify exactly what you are looking for in this hire.' : 'Our AI analysis adapts its strictness based on the chosen job family.'}
              </p>
            </div>

            <div style={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              flex: 1,
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '920px', 
                maxHeight: '500px', 
                overflowY: 'auto', 
                padding: '1.5rem', 
                paddingTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                {recruiterMode ? (
                  <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div id="config-panel">
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-muted)' }}>1. TARGET JOB ROLE</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                        <RoleCard role="Frontend" icon={Zap} active={role === 'Frontend'} onClick={handleRoleSelect} />
                        <RoleCard role="Backend" icon={BrainCircuit} active={role === 'Backend'} onClick={handleRoleSelect} />
                        <RoleCard role="Fullstack" icon={Target} active={role === 'Fullstack'} onClick={handleRoleSelect} />
                        <RoleCard role="BDA" icon={Globe} active={role === 'BDA'} onClick={handleRoleSelect} />
                        <RoleCard role="Sales" icon={FileText} active={role === 'Sales'} onClick={handleRoleSelect} />
                      </div>

                      {role && roleExpertise && roleExpertise[role] && (
                        <motion.div 
                          key={role}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ 
                            width: '100%', maxWidth: '850px', 
                            padding: '1.25rem 1.5rem', 
                            borderRadius: '24px', 
                            background: 'var(--glass)', 
                            border: '1px solid var(--glass-border)',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.4rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={16} className="gradient-text" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                              {roleExpertise[role].title || role} Perspective
                            </span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                            {roleExpertise[role].desc}
                          </p>
                          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', fontStyle: 'italic' }}>
                            Core Radar: <span style={{ color: 'var(--text-main)' }}>{roleExpertise[role].stack}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-muted)' }}>2. JOB DESCRIPTION & REQUIREMENTS</h3>
                      <textarea 
                        placeholder="Paste the full job description here..."
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      style={{ 
                        width: '100%', 
                        height: '240px', 
                        padding: '1.5rem', 
                        borderRadius: '24px', 
                        border: '2px solid var(--glass-border)', 
                        background: 'var(--glass)',
                        backdropFilter: 'blur(10px)',
                        fontSize: '1rem',
                        fontWeight: 500,
                        outline: 'none',
                        resize: 'none',
                        marginBottom: '1rem'
                      }}
                    />
                  </div>

                    {/* File Preview List */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>3. CANDIDATE EMAILS (REQUIRED FOR NOTIFICATIONS)</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {files.map((f, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            style={{ 
                              padding: '1.25rem', 
                              borderRadius: '20px', 
                              background: 'var(--glass)', 
                              border: '1px solid var(--glass-border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.75rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <FileText size={16} className="gradient-text" />
                              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {f.name}
                              </span>
                            </div>
                            <input 
                              type="email" 
                              placeholder="candidate@example.com"
                              value={fileEmails[f.name] || ''}
                              onChange={(e) => setFileEmails(prev => ({ ...prev, [f.name]: e.target.value }))}
                              style={{
                                width: '100%',
                                padding: '0.6rem 1rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)',
                                fontSize: '0.85rem',
                                fontWeight: 500,
                                outline: 'none'
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>

                      {analyzing && (
                        <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto 2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700 }}>
                            <span className="gradient-text">Analyzing Batch...</span>
                            <span>{Math.round(progress || 0)}%</span>
                          </div>
                          <div style={{ height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              style={{ height: '100%', background: 'var(--grad-main)' }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', width: '100%', maxWidth: '850px', marginBottom: '1.5rem' }}>
                        <RoleCard role="Frontend" icon={Zap} active={role === 'Frontend' || subRolesMap['Frontend'].includes(role)} onClick={handleRoleSelect} />
                        <RoleCard role="Backend" icon={BrainCircuit} active={role === 'Backend' || subRolesMap['Backend'].includes(role)} onClick={handleRoleSelect} />
                        <RoleCard role="Fullstack" icon={Target} active={role === 'Fullstack' || subRolesMap['Fullstack'].includes(role)} onClick={handleRoleSelect} />
                        <RoleCard role="BDA" icon={Globe} active={role === 'BDA' || subRolesMap['BDA'].includes(role)} onClick={handleRoleSelect} />
                        <RoleCard role="Sales" icon={FileText} active={role === 'Sales' || subRolesMap['Sales'].includes(role)} onClick={handleRoleSelect} />
                      </div>

                      {/* Sub-Role Selector for Active Department */}
                      {Object.keys(subRolesMap).map(dept => (role === dept || subRolesMap[dept].includes(role)) && (
                        <motion.div 
                          key={dept}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{ width: '100%', maxWidth: '850px', marginBottom: '2rem', textAlign: 'center' }}
                        >
                          <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Select {dept} Specialization (Strict Skills Mode)
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                            {subRolesMap[dept].map((sub) => (
                              <button
                                key={sub}
                                onClick={() => handleRoleSelect(sub)}
                                style={{
                                  padding: '0.6rem 1.25rem',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  background: role === sub ? 'var(--grad-main)' : 'rgba(255,255,255,0.05)',
                                  color: role === sub ? 'white' : 'var(--text-main)',
                                  border: role === sub ? 'none' : '1px solid var(--glass-border)',
                                  boxShadow: role === sub ? '0 4px 12px var(--primary-glow)' : 'none'
                                }}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))}

                      {role && roleExpertise[role] && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ 
                            width: '100%', maxWidth: '850px', 
                            padding: '1.5rem', 
                            borderRadius: '24px', 
                            background: 'var(--glass)', 
                            border: '1px solid var(--glass-border)',
                            marginBottom: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles size={16} className="gradient-text" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                              {roleExpertise[role].title}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, fontWeight: 500 }}>
                            {roleExpertise[role].desc}
                          </p>
                          <div style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', fontStyle: 'italic' }}>
                            Tech Stack: <span style={{ color: 'var(--text-main)' }}>{roleExpertise[role].stack}</span>
                          </div>
                        </motion.div>
                      )}

                      <div style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-muted)' }}>Paste Job Description (Recommended for Match %)</h3>
                        <textarea 
                          placeholder="Optional: Paste the JD to get a match score..."
                          value={jdText}
                          onChange={(e) => setJdText(e.target.value)}
                          style={{ 
                            width: '100%', 
                            height: '140px', 
                            padding: '1.25rem', 
                            borderRadius: '20px', 
                            border: '2px solid var(--glass-border)', 
                            background: 'var(--glass)',
                            fontSize: '0.95rem',
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                      </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                onClick={recruiterMode ? runRecruiterAnalysis : runAnalysis}
                disabled={!role || (recruiterMode && !jdText) || analyzing}
                className="gradient-btn"
                style={{ 
                  padding: '1.25rem 3rem', 
                  fontSize: '1.1rem',
                  opacity: (!role || (recruiterMode && !jdText) || analyzing) ? 0.5 : 1,
                  cursor: (!role || (recruiterMode && !jdText) || analyzing) ? 'not-allowed' : 'pointer'
                }}
              >
                {analyzing ? 'Processing AI Magic...' : (recruiterMode ? `START BATCH ANALYSIS (${files.length})` : 'RUN AI ANALYSIS')} <ArrowRight size={20} />
              </button>
              {(!role || (recruiterMode && !jdText)) && !analyzing && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', fontWeight: 600 }}>
                  Please {recruiterMode ? 'select a role and paste the job description' : 'select a role'} to continue.
                </p>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          recruiterMode ? (
            selectedCandidateEntry ? (
              <motion.div 
                key="candidate-detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <button 
                    onClick={handleBackToPipeline}
                    className="gradient-btn-outline"
                    style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ChevronLeft size={16} /> BACK TO RECRUITER VIEW
                  </button>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Profile Analysis: <span className="gradient-text">{selectedCandidateEntry.name}</span></h3>
                </div>
                
                <ResultDashboard 
                  analysis={selectedCandidateEntry} 
                  onReset={handleBackToPipeline}
                  recruiterMode={true}
                  user={user}
                  onOptimize={(status) => handleUpdateStatus(selectedCandidateEntry, status)}
                  onUpgradeRedirect={onUpgradeRedirect}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="step3-recruiter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
              >
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', padding: '0.25rem', borderRadius: '12px', gap: '0.25rem' }}>
                      <button 
                        onClick={() => { setRecruiterTab('pipeline'); setSelectedCandidateEntry(null); }}
                        style={{ 
                          padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', 
                          background: recruiterTab === 'pipeline' ? 'white' : 'transparent',
                          color: recruiterTab === 'pipeline' ? 'var(--primary)' : 'var(--text-muted)',
                          fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        CANDIDATE PIPELINE
                      </button>
                      <button 
                        onClick={() => { setRecruiterTab('ranking'); setSelectedCandidateEntry(null); }}
                        style={{ 
                          padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', 
                          background: recruiterTab === 'ranking' ? 'white' : 'transparent',
                          color: recruiterTab === 'ranking' ? 'var(--primary)' : 'var(--text-muted)',
                          fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        AI RANKING
                      </button>
                    </div>
                    {user?.userRole !== 'HR' && (
                      <button onClick={resetAll} className="gradient-btn-outline" style={{ padding: '0.6rem 1.25rem' }}>
                         <RefreshCw size={16} /> NEW BATCH
                      </button>
                    )}
                 </div>


                 {recruiterTab === 'pipeline' ? (
                    <CandidateListView 
                      candidates={candidates} 
                      onShortlist={handleShortlist} 
                      onReject={handleReject}
                      onReset={resetAll}
                      onUpdateStatus={handleUpdateStatus}
                      onScheduleInterview={handleScheduleInterview}
                      onSelectCandidate={handleSelectCandidate}
                      user={user}
                    />
                 ) : (
                    <RankingView 
                      candidates={candidates} 
                      onSelectCandidate={handleSelectCandidate}
                    />
                 )}
              </motion.div>
            )
          ) : (
            results && <ResultDashboard analysis={results} onReset={resetAll} recruiterMode={recruiterMode} onOptimize={handleOptimize} optimizing={optimizing} user={user} onUpgradeRedirect={onUpgradeRedirect} />
          )
        )}

        {showSchedulingModal && (
          <SchedulingModal 
            isOpen={showSchedulingModal}
            onClose={() => setShowSchedulingModal(false)}
            candidate={selectedCandidateForSchedule}
            onSchedule={onScheduleConfirm}
            user={user}
          />
        )}

        {step === 4 && optimization && (
          <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <OptimizationView optimization={optimization} role={role} onBack={() => setStep(3)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyzerView;
