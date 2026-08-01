import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search,
  Briefcase,
  ArrowRight
} from 'lucide-react';

const JobMatcherView = ({ resumeText, resumeName, setActiveView }) => {
  const [jd, setJd] = useState('');
  const [matching, setMatching] = useState(false);
  const [result, setResult] = useState(null);

  const runMatch = async () => {
    if (!resumeText || resumeText.length < 20) {
      alert("No valid resume text found. Please ensure you have analyzed a text-based PDF first.");
      return;
    }
    
    setMatching(true);
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: resumeText,
          jobDescription: jd
        }),
      });

      if (!response.ok) {
        throw new Error('Matching failed');
      }

      const data = await response.json();
      
      setResult({
        score: data.percentage,
        matchLevel: data.percentage > 80 ? 'Strong Match' : data.percentage > 60 ? 'Good Match' : 'Potential Match',
        recommendation: data.recommendation,
        missingSkills: data.missingSkills,
        matchedSkills: data.matchedSkills
      });
    } catch (error) {
      console.error('Match error:', error);
      alert('Failed to calculate match. Please try again.');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="animate-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
          <Target size={24} className="gradient-text" /> 
          AI Job Description Matcher
        </h2>

        {!resumeText && (
          <div style={{ marginBottom: '2rem', padding: '1.25rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontWeight: 700 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={20} />
              <span>No active resume data found. Please analyze a resume first.</span>
             </div>
             <button 
              onClick={() => setActiveView('analyzer')}
              style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: '#ef4444', color: 'white', border: 'none', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 900 }}
             >
               Go to AI Analyzer
             </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Resume Selected */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)' }}>
                <FileText size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Active Resume</h3>
            </div>
            <div style={{ padding: '1.5rem', border: `2px dashed ${resumeText?.length > 20 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`, borderRadius: '16px', textAlign: 'center', background: resumeText?.length > 20 ? 'rgba(16, 185, 129, 0.02)' : 'rgba(239, 68, 68, 0.02)' }}>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{resumeName || 'No Resume Selected'}</p>
              <p style={{ fontSize: '0.75rem', color: resumeText?.length > 20 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {resumeText?.length > 20 ? 'Ready for Matching' : resumeName ? 'Partial Extraction / Scanned PDF Error' : 'Select a candidate in Dashboard/Pipeline'}
              </p>
            </div>
          </div>

          {/* JD Input */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                <Briefcase size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Target Job Description</h3>
            </div>
            <textarea 
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the job description here..."
              style={{ 
                width: '100%', 
                height: '110px', 
                padding: '1rem', 
                borderRadius: '16px', 
                background: 'rgba(0,0,0,0.02)', 
                border: '1px solid var(--border)', 
                outline: 'none', 
                fontSize: '0.9rem', 
                resize: 'none',
                fontWeight: 500,
                color: 'var(--text-main)'
              }}
            />
          </div>
        </div>

        <button 
          onClick={runMatch}
          disabled={!jd || matching || !resumeText}
          className="gradient-btn" 
          style={{ 
            width: '100%', 
            marginTop: '2rem', 
            justifyContent: 'center', 
            opacity: (!jd || matching || !resumeText) ? 0.6 : 1,
            cursor: (!jd || matching || !resumeText) ? 'not-allowed' : 'pointer'
          }}
        >
          {matching ? 'Analyzing Role Fit...' : 'CALCULATE MATCH %'}
        </button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '2.5rem', background: 'var(--grad-light)', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, auto) 1fr', gap: '3rem', alignItems: 'center', width: '100%' }}>
             <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1 }} className="gradient-text">{result.score}%</div>
              <p style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem', marginTop: '0.5rem' }}>{result.matchLevel.toUpperCase()}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontWeight: 900, fontSize: '1.1rem' }}>Expert Alignment Insight</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, fontWeight: 500 }}>{result.recommendation}</p>
              
              <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={14} /> MISSING KEY SKILLS
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignContent: 'flex-start' }}>
                    {result.missingSkills?.map((s, i) => (
                      <span key={i} style={{ padding: '0.45rem 0.9rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.1)' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                   <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={14} /> MATCHING STACK
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {result.matchedSkills?.map((s, i) => (
                      <span key={i} style={{ padding: '0.4rem 0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default JobMatcherView;
