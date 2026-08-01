import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Link, Send, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';

const generateInternalRoomLink = (candidateId) => {
  return `${window.location.origin}/interview-room/${candidateId || 'session-' + Math.random().toString(36).substr(2, 9)}`;
};

const SchedulingModal = ({ candidate, isOpen, onClose, onSchedule, user }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');
  const [meetLink, setMeetLink] = useState(generateInternalRoomLink(candidate?.id));
  const [loadingLink, setLoadingLink] = useState(false);
  const [sent, setSent] = useState(false);


  React.useEffect(() => {
    const fetchSystemLink = async () => {
      if (isOpen && candidate?.id && user?.userRole === 'HR') {
        setLoadingLink(true);
        try {
          const response = await fetch('/api/interviews/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              candidateId: candidate.id,
              userRole: user.userRole 
            })
          });
          if (response.ok) {
            const { token } = await response.json();
            const systemLink = `${window.location.origin}/interview/${token}`;
            setLink(systemLink);
          }
        } catch (err) {
          console.error('Failed to generate secure link:', err);
        } finally {
          setLoadingLink(false);
        }
      } else if (isOpen) {
        // Fallback for non-HR or missing candidate (though logic should prevent this)
        setLink(generateInternalRoomLink(candidate?.id));
      }
    };

    fetchSystemLink();
  }, [isOpen, candidate?.id, user?.userRole]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onSchedule({ date, time, link, meetLink });

      setSent(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '8vh 1rem', overflowY: 'auto', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0 }}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card"
          style={{ 
            width: '100%', 
            maxWidth: '480px', 
            position: 'relative', 
            zIndex: 1001, 
            padding: '2.5rem', 
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(15, 23, 42, 0.95)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Header Row: [Avatar] [Title] [Close] */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '16px', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A1F44', flexShrink: 0, boxShadow: '0 8px 20px rgba(244, 196, 0, 0.3)' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 950 }}>{candidate?.name?.charAt(0) || 'C'}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 950, color: '#ffffff', margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  Schedule <span style={{ color: 'var(--secondary)' }}>Interview</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, margin: '0.25rem 0 0' }}>
                  Candidate: <span style={{ color: '#ffffff' }}>{candidate?.name}</span>
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <X size={22} />
            </button>
          </div>


          {!sent ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em', opacity: 0.9 }}>
                   <Calendar size={16} color="var(--secondary)" /> DATE
                </label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.08)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: '#ffffff', 
                    fontSize: '0.95rem', 
                    fontWeight: 600, 
                    outline: 'none' 
                  }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em', opacity: 0.9 }}>
                   <Clock size={16} color="var(--secondary)" /> TIME
                </label>
                <input 
                  type="time" 
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.08)', 
                    border: '1px solid rgba(255,255,255,0.2)', 
                    color: '#ffffff', 
                    fontSize: '0.95rem', 
                    fontWeight: 600, 
                    outline: 'none' 
                  }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
                   <Link size={16} color="var(--secondary)" /> Destination Meeting (Google Meet/Zoom)
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="url" 
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="Paste the actual meeting link here..."
                    style={{ 
                      width: '100%', 
                      padding: '1rem 3.5rem 1rem 1rem', 
                      borderRadius: '12px', 
                      background: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.1)', 
                      color: '#ffffff', 
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      outline: 'none'
                    }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setMeetLink(generateInternalRoomLink(candidate?.id))}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer' }}
                    title="Generate Random Link"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                   <ShieldCheck size={16} /> Public Secure Link (Candidate View)
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="url" 
                    value={link}
                    readOnly={true}
                    style={{ 
                      width: '100%', 
                      padding: '1rem 3.5rem 1rem 1rem', 
                      borderRadius: '12px', 
                      background: 'rgba(16, 185, 129, 0.15)', 
                      border: '1px solid rgba(16, 185, 129, 0.4)', 
                      color: '#10b981', 
                      outline: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'not-allowed'
                    }} 
                  />
                  {loadingLink && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                       <RefreshCw size={18} className="animate-spin" style={{ color: '#10b981', opacity: 1 }} />
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>✓ Candidate will only see this secure portal link.</p>
              </div>

              <button type="submit" className="gradient-btn" style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', fontSize: '1rem', background: 'var(--grad-main)', color: '#0A1F44', fontWeight: 900, border: 'none', borderRadius: '14px', cursor: 'pointer' }}>
                <Send size={20} /> SEND INVITATION
              </button>
            </form>


          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '3rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
            >
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem' }}>
                <CheckCircle size={32} />
              </div>
              <h4 style={{ fontWeight: 900, color: '#10b981' }}>Invitation Sent!</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                The interview has been scheduled and a notification was sent to {candidate?.name || 'the candidate'}.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SchedulingModal;
