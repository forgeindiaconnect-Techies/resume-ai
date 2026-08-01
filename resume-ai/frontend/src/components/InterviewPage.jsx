import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Calendar, Clock, Link as LinkIcon, AlertTriangle, CheckCircle, Video, ArrowRight, ShieldAlert } from 'lucide-react';

import ForgeLogo from './ForgeLogo';

const InterviewPage = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setInterviewData] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/interviews/validate/${token}`);
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Invalid Link');
        }
        const data = await response.json();
        setInterviewData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grad-blue)', color: 'white' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}
          >
            <ShieldCheck size={48} />
          </motion.div>
          <p style={{ fontWeight: 800, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)' }}>VALIDATING PORTAL STATUS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--grad-blue)', color: 'white' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card" 
          style={{ padding: '4rem', maxWidth: '600px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)', position: 'relative' }}
        >
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'rgba(239, 68, 68, 0.4)', fontSize: '0.7rem', fontWeight: 900 }}>ERR_SEC_LINK_INVALID</div>
          
          <div style={{ width: 80, height: 80, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 2.5rem', boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)' }}>
            <ShieldAlert size={44} />
          </div>
  
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Security Validation Failed</h2>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            This interview link is either <span style={{ color: '#ef4444' }}>expired, revoked, or non-existent</span> in our global recruitment database. 
            For security reasons, access is strictly prohibited.
          </p>
  
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              onClick={() => window.location.href = '/'}
              className="gradient-btn-outline" 
              style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '1rem 2rem' }}
            >
              Return to Homepage
            </button>
            <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 800 }}>
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    );

  }

  const { candidateName, role, interview } = interviewData;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--grad-blue)', color: 'white', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Decorative Element */}
      <div style={{ 
        position: 'absolute', top: '-10%', right: '-10%', 
        width: '500px', height: '500px', 
        background: 'radial-gradient(circle, rgba(244, 196, 0, 0.05) 0%, transparent 70%)', 
        zIndex: 0, pointerEvents: 'none' 
      }} />

      <nav style={{ maxWidth: '800px', margin: '0 auto 4rem', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
        <ForgeLogo size={50} variant="sidebar" />
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <div style={{ 
            display: 'inline-flex', padding: '0.6rem 1.5rem', background: 'rgba(244, 196, 0, 0.1)', 
            color: 'var(--secondary)', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 900, 
            border: '1px solid rgba(244, 196, 0, 0.2)', marginBottom: '2rem', letterSpacing: '0.05em'
          }}>
            <ShieldCheck size={18} style={{ marginRight: '0.5rem' }} /> SECURE INTERVIEW PORTAL
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>
            Welcome, <span className="gradient-text">{candidateName}</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            You have been invited for the <span style={{ color: 'white', fontWeight: 800 }}>{role}</span> position.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '3.5rem' }}>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="glass-card" 
             style={{ 
               padding: '3rem', 
               background: 'rgba(255, 255, 255, 0.03)',
               border: '1px solid rgba(255, 255, 255, 0.08)',
               backdropFilter: 'blur(30px)'
             }}
           >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
                 <Calendar size={22} /> SCHEDULE DETAILS
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Interview Date</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.5rem', textTransform: 'uppercase' }}>{new Date(interview.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 </div>
                 <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Reporting Time</label>
                    <p style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.5rem' }}>{interview.time} (IST)</p>
                 </div>
              </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="glass-card" 
             style={{ 
               padding: '3rem', 
               display: 'flex', 
               flexDirection: 'column', 
               justifyContent: 'center', 
               alignItems: 'center', 
               textAlign: 'center',
               background: 'rgba(255, 255, 255, 0.01)',
               border: '1px solid rgba(255, 255, 255, 0.05)',
               position: 'relative',
               overflow: 'hidden'
             }}
           >
              {/* Subtle inner glow for the join card */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(244, 196, 0, 0.05) 0%, transparent 70%)', zIndex: 0 }} />
              
              <div style={{ 
                width: 90, height: 90, 
                background: 'var(--grad-main)', 
                borderRadius: '28px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'var(--accent)', marginBottom: '2rem', 
                boxShadow: '0 15px 40px rgba(244, 196, 0, 0.4)',
                position: 'relative', zIndex: 1
              }}>
                 <Video size={44} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>Join Meeting</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>Connection is encrypted & secure.</p>
              
              <a 
                href={interview.meetLink || `/interview-room/${interview.token || 'session'}`} 
                className="gradient-btn" 
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  padding: '1.2rem', 
                  textDecoration: 'none', 
                  fontSize: '1rem', 
                  letterSpacing: '0.1em',
                  position: 'relative',
                  zIndex: 1 
                }}
              >
                JOIN SESSION <ArrowRight size={20} />
              </a>
           </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', marginBottom: '1.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CheckCircle size={16} style={{ color: 'var(--secondary)' }} /> AI VERIFIED LINK</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CheckCircle size={16} style={{ color: 'var(--secondary)' }} /> IDENTITY PROTECTION</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><CheckCircle size={16} style={{ color: 'var(--secondary)' }} /> DATA ENCRYPTED</div>
          </div>
          <p style={{ letterSpacing: '0.1em', fontSize: '0.7rem', opacity: 0.6 }}>© 2026 FORGE AI RECRUITMENT SYSTEM. INSTITUTIONAL GRADE SECURITY.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default InterviewPage;
