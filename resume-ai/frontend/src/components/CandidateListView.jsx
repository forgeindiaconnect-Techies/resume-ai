import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Briefcase, 
  ChevronRight, 
  Lightbulb, 
  ArrowRight, 
  Download, 
  Zap, 
  AlertTriangle, 
  Target,
  Calendar,
  Clock,
  MoreVertical,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';

const STAGES = [
  'Applied',
  'Screening',
  'Technical Round',
  'HR Round',
  'Interview',
  'Offer Sent',
  'Selected',
  'Rejected',
  'Consider'
];

const CandidateListView = ({ candidates, onShortlist, onReject, onReset, onUpdateStatus, onScheduleInterview, onSelectCandidate, user }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCandidates = Array.isArray(candidates) ? candidates.filter(can => {
    const normalize = (str) => str?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
    const searchLower = normalize(searchTerm);
    if (!searchLower) {
      return activeFilter === 'All' || can.status === activeFilter;
    }
    
    const matchesSearch = normalize(can.name).includes(searchLower) || 
                          normalize(can.fileName).includes(searchLower) ||
                          normalize(can.role).includes(searchLower);
                          
    const matchesFilter = activeFilter === 'All' || can.status === activeFilter;
    return matchesSearch && matchesFilter;
  }) : [];

  const downloadCSV = () => {
    const headers = ["DATE", "CANDIDATE NAME", "SCORE", "MATCH %", "STATUS", "SKILLS"];
    const rows = (Array.isArray(candidates) ? candidates : []).map(c => {
      const displaySkills = (c.matchedSkills && c.matchedSkills.length > 0) 
        ? c.matchedSkills 
        : (c.skills || []);
      const skillString = displaySkills.map(s => typeof s === 'object' ? (s.name || s.skill || 'Skill') : s).join(', ');

      return [
        `"${c.timestamp || new Date().toLocaleString()}"`,
        `"${c.name || ''}"`,
        c.score,
        `"${c.matchPercentage || 0}%"`,
        `"${c.status || ''}"`,
        `"${skillString}"`
      ];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ForgeIndia_RecruiterReport_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Candidate <span className="gradient-text">Matching</span></h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => window.location.reload()} 
            className="gradient-btn" 
            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.5rem 1rem', fontSize: '0.8rem', color: '#60a5fa' }}
          >
            <RefreshCw size={16} /> SYNC PIPELINE
          </button>
          <button onClick={downloadCSV} className="gradient-btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            <Download size={16} /> DOWNLOAD REPORT
          </button>
          <div style={{ background: 'var(--grad-main)', padding: '0.4rem 1rem', borderRadius: '10px', color: 'white', fontSize: '0.85rem', fontWeight: 800 }}>
            {filteredCandidates.length} {filteredCandidates.length === 1 ? 'CANDIDATE' : 'CANDIDATES'} FOUND
          </div>
          <button onClick={onReset} className="gradient-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            NEW BATCH
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'var(--glass)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search candidates by name or file..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.6rem 1rem 0.6rem 2.5rem', 
              borderRadius: '10px', 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--glass-border)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.5rem' }}>Status:</span>
          {['All', 'Applied', 'Selected', 'Rejected', 'Consider'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '0.4rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeFilter === filter ? 'var(--grad-main)' : 'rgba(255,255,255,0.05)',
                color: activeFilter === filter ? '#0f172a' : 'var(--text-muted)',
                border: '1px solid ' + (activeFilter === filter ? 'transparent' : 'var(--glass-border)'),
                boxShadow: activeFilter === filter ? '0 4px 12px var(--primary-glow)' : 'none'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>CANDIDATE</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>SCORE</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem' }}>MATCH</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map((can, i) => (
                <React.Fragment key={can.id || i}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ 
                      borderBottom: '1px solid rgba(0,0,0,0.05)', 
                      background: can.status === 'Selected' ? 'rgba(16, 185, 129, 0.03)' : 
                                 can.status === 'Rejected' ? 'rgba(239, 68, 68, 0.03)' : 
                                 can.status === 'Consider' ? 'rgba(59, 130, 246, 0.03)' : 'transparent', 
                      cursor: 'pointer' 
                    }}
                    onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                  >
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '10px', background: can.status === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--grad-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: can.status === 'error' ? '#ef4444' : 'var(--primary)' }}>
                        <User size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{can.name}</p>
                          {can.status === 'error' && <span style={{ fontSize: '0.6rem', background: '#ef4444', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 900 }}>ERROR</span>}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{can.fileName}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 700, opacity: 0.9 }}>{can.email || 'candidate@example.com'}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      color: can.score > 70 ? '#10b981' : can.score > 40 ? '#f59e0b' : '#ef4444'
                    }}>
                      {can.score}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.4rem', 
                        background: 'var(--grad-main)', 
                        color: 'white', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 900,
                        width: 'fit-content'
                      }}>
                        <Target size={12} /> {can.matchPercentage || 0}%
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {(can.matchedSkills && can.matchedSkills.length > 0 ? can.matchedSkills.slice(0, 3) : ['No keywords matched']).map((skill, si) => (
                          <span key={si} style={{ padding: '0.2rem 0.4rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 600, border: '1px solid var(--glass-border)' }}>
                            {typeof skill === 'object' ? skill.name : skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user?.userRole === 'HR' ? (
                          <>
                            <select 
                             value={can.status || 'Applied'}
                             onChange={(e) => { e.stopPropagation(); onUpdateStatus(can, e.target.value); }}
                             style={{
                               background: 'var(--glass)',
                               border: '1px solid var(--glass-border)',
                               borderRadius: '8px',
                               padding: '0.4rem 0.6rem',
                               fontSize: '0.75rem',
                               fontWeight: 700,
                               color: can.status === 'Selected' ? '#10b981' : 
                                      can.status === 'Rejected' ? '#ef4444' : 
                                      can.status === 'Consider' ? '#3b82f6' : 'var(--text-main)',
                                outline: 'none',
                                cursor: 'pointer'
                             }}
                            >
                             {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            
                            <button
                             onClick={(e) => { e.stopPropagation(); onScheduleInterview(can); }}
                             style={{ 
                               background: 'var(--grad-main)', 
                               border: 'none', 
                               color: 'white', 
                               padding: '0.5rem', 
                               borderRadius: '10px', 
                               cursor: 'pointer', 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center' 
                             }}
                             title="Schedule Interview"
                            >
                             <Calendar size={16} />
                            </button>

                            <button
                             onClick={(e) => { e.stopPropagation(); onReject(i); }}
                             style={{ background: 'none', border: '1px solid #fecaca', color: '#ef4444', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', opacity: can.status === 'rejected' || can.status === 'Rejected' ? 1 : 0.6 }}
                             title="Reject"
                            >
                             <XCircle size={18} fill={can.status === 'rejected' || can.status === 'Rejected' ? 'currentColor' : 'none'} color={can.status === 'rejected' || can.status === 'Rejected' ? 'white' : 'currentColor'} />
                            </button>
                          </>
                        ) : (
                          <div style={{ 
                            padding: '0.4rem 0.75rem', 
                            borderRadius: '10px', 
                            background: can.status === 'Selected' ? 'rgba(16, 185, 129, 0.1)' : can.status === 'Rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            border: `1px solid ${can.status === 'Selected' ? '#10b981' : can.status === 'Rejected' ? '#ef4444' : '#f59e0b'}`,
                            color: can.status === 'Selected' ? '#10b981' : can.status === 'Rejected' ? '#ef4444' : '#f59e0b',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                            letterSpacing: '0.05em'
                          }}>
                            {(can.status || 'APPLIED').toUpperCase()}
                          </div>
                        )}
                        
                        <motion.div animate={{ rotate: expandedIndex === i ? 90 : 0 }}>
                          <ChevronRight size={18} color="var(--text-muted)" />
                        </motion.div>
                      </div>
                  </td>
                </motion.tr>
                <AnimatePresence>
                  {expandedIndex === i && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ background: 'rgba(0,0,0,0.01)' }}
                    >
                      <td colSpan="4" style={{ padding: '2rem' }}>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                           <div>
                              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Zap size={14} color="#10b981" /> Strengths
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(can.strengths && can.strengths.length > 0 ? can.strengths : ['No major strengths noted']).map((s, si) => (
                                  <div key={si} style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500, display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ marginTop: '0.1rem', color: '#10b981' }}><CheckCircle2 size={12} /></div>
                                    <span>{s}</span>
                                  </div>
                                ))}
                              </div>
                           </div>

                           <div>
                              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertTriangle size={14} color="#f59e0b" /> Weaknesses
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(can.weaknesses && can.weaknesses.length > 0 ? can.weaknesses : ['No major weaknesses noted']).map((w, si) => (
                                  <div key={si} style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500, display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ marginTop: '0.1rem', color: '#f59e0b' }}><AlertTriangle size={12} /></div>
                                    <span>{w}</span>
                                  </div>
                                ))}
                              </div>
                           </div>

                           <div>
                              <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <XCircle size={14} color="#ef4444" /> Rejection Reasons
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {(can.reasons && can.reasons.length > 0 ? can.reasons : ['N/A']).map((r, ri) => (
                                  <div key={ri} style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500, display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ marginTop: '0.1rem', color: '#ef4444' }}><XCircle size={12} /></div>
                                    <span>{r}</span>
                                  </div>
                                ))}
                              </div>
                           </div>
                         </div>

                          {can.interview && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              style={{ 
                                marginTop: '2rem', padding: '1.5rem', 
                                background: 'rgba(59, 130, 246, 0.05)', borderRadius: '20px', 
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                  <Calendar size={24} />
                                </div>
                                <div>
                                  <h5 style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>INTERVIEW SCHEDULED</h5>
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                    {new Date(can.interview.date).toLocaleDateString()} at {can.interview.time}
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={can.interview.link} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="gradient-btn-outline" 
                                style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem', textDecoration: 'none' }}
                              >
                                JOIN MEETING
                              </a>
                            </motion.div>
                          )}

                          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                             <button 
                               onClick={() => {
                                 const report = `
AI CANDIDATE REPORT: ${can.name}
Status: ${can.status}
Score: ${can.score}/100
Match: ${can.matchPercentage}%
---
Strengths: ${can.strengths?.join(', ')}
Weaknesses: ${can.weaknesses?.join(', ')}
Key Skills: ${can.matchedSkills?.map(s => typeof s === 'object' ? s.name : s).join(', ')}
`;
                                 const blob = new Blob([report], { type: 'text/plain' });
                                 const url = URL.createObjectURL(blob);
                                 const a = document.createElement('a');
                                 a.href = url;
                                 a.download = `${can.name}_AI_Report.txt`;
                                 a.click();
                               }}
                               className="gradient-btn"
                               style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem' }}
                             >
                               <Download size={16} /> DOWNLOAD AI REPORT
                             </button>

                             <button 
                               onClick={() => onSelectCandidate(can)}
                               className="gradient-btn-outline button-pulse"
                               style={{ padding: '0.75rem 2rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                             >
                               VIEW FULL AI PROFILE <ArrowRight size={16} />
                             </button>
                          </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: '6rem 4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                  <Search size={64} style={{ opacity: 0.1, color: 'var(--primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                      No candidates found matching "{searchTerm || activeFilter}"
                    </h3>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '2rem' }}>
                      Try searching for a different name, role, or switch to the <strong>"All"</strong> view.
                    </p>
                    <button 
                      onClick={() => { setActiveFilter('All'); setSearchTerm(''); }}
                      className="glass-btn btn-primary"
                      style={{ padding: '0.8rem 2rem', fontWeight: 800 }}
                    >
                      Show All Candidates
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default CandidateListView;
