import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Copy, FileText, Check } from 'lucide-react';

const CoverLetterView = () => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);
    setProgress(0);
    setCoverLetter('');

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setGenerating(false);
            setCoverLetter(`Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${role || 'Software Engineer'} position at ${company || 'your esteemed company'}. With a proven track record of designing scalable applications and optimizing user journeys, I am confident in my ability to make a meaningful impact on your engineering division.

In my previous projects, I specialized in engineering highly responsive systems and streamlining backend architectures. I look forward to bringing this expertise to your team, collaborating on modern stacks, and driving product scalability.

Thank you for your time and consideration.

Sincerely,
[Your Name]`);
          }, 600);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'left' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 950, letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          AI Cover Letter <span className="gradient-text">Generator</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 600 }}>
          Generate a tailored cover letter optimized for your target job description.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Job Title</label>
                <input required type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Senior Frontend Developer" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
              </div>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Company Name</label>
                <input required type="text" value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google India" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600 }} />
              </div>
            </div>

            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Job Description (or requirements)</label>
              <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Paste the target job description requirements here..." style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontWeight: 600, resize: 'none' }} />
            </div>

            <button 
              type="submit" 
              disabled={generating}
              className="glass-btn btn-primary"
              style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 8px 16px var(--primary-glow)', cursor: 'pointer' }}
            >
              <Sparkles size={16} /> {generating ? 'Generating Letter...' : 'Generate Cover Letter'}
            </button>

          </form>
        </div>

        <AnimatePresence>
          {generating && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>AI is analyzing job requirements...</span>
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--grad-main)', transition: 'width 0.15s ease-out' }} />
              </div>
            </motion.div>
          )}

          {coverLetter && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '2.5rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={18} color="var(--primary)" /> Generated Document</h4>
                <button 
                  onClick={handleCopy}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.85rem', background: copied ? '#e2fbe9' : 'rgba(0,0,0,0.02)', border: `1px solid ${copied ? '#10b981' : 'var(--border)'}`, color: copied ? '#10b981' : 'var(--text-main)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)', padding: '1rem', background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border)', borderRadius: '12px', textAlign: 'left' }}>
                {coverLetter}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default CoverLetterView;
