import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Star, Clock, Trash2, ChevronRight, User, CheckCircle2, AlertCircle, Zap, ShieldCheck, RefreshCw } from 'lucide-react';

const InboxView = ({ setActiveView }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const candidates = await response.json();
        if (Array.isArray(candidates)) {
          // Flatten notifications into "Email" objects
          const allMsgs = candidates.flatMap(c => 
            (c.notifications || []).map(n => ({
            id: n.id || Date.now().toString(),
            from: "AI Recruitment Assistant",
            candidate: c.name || 'Unknown Candidate',
            subject: `${n.type || 'Update'}: ${c.name || 'Candidate'} Update`,
            body: n.message || '',
            time: n.date || new Date().toISOString(),
            type: n.type || 'General',
            link: n.link || null,
            avatar: c.avatar || null,
            email: c.email || 'N/A'
          }))
        ).sort((a, b) => {
          const timeA = new Date(a.time).getTime() || 0;
          const timeB = new Date(b.time).getTime() || 0;
          return timeB - timeA;
        });
          
          setMessages(allMsgs);
          if (allMsgs.length > 0 && !selectedMsg) setSelectedMsg(allMsgs[0]);
        } else {
          console.error("API did not return an array:", candidates);
        }
      }
    } catch (err) {
      console.error('Failed to fetch mail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Listen for custom status updates to refresh immediately
    const handleUpdate = () => {
      fetchMessages();
    };
    window.addEventListener('notificationUpdate', handleUpdate);

    return () => {
      window.removeEventListener('notificationUpdate', handleUpdate);
    };
  }, []);

  const getStatusColor = (type) => {
    if (type === 'Selected') return '#10b981';
    if (type === 'Rejected') return '#ef4444';
    return 'var(--primary)';
  };

  return (
    <div className="view-content" style={{ display: 'flex', gap: '1.5rem', height: '100%', padding: '0.5rem' }}>
      {/* Sidebar List */}
      <div style={{ 
        flex: '0 0 380px', 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail color="var(--primary)" /> Mail
            </h2>
            <button 
              onClick={fetchMessages}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}
              title="Refresh Mailbox"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search messages..."
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem 0.75rem 2.8rem', 
                borderRadius: '12px', 
                background: 'var(--bg-sidebar)', 
                border: '1px solid var(--border)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingTop: '0.5rem' }}>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading messages...</div>
          ) : messages.length > 0 ? (
            messages.map(msg => (
              <div 
                key={msg.id}
                onClick={() => setSelectedMsg(msg)}
                style={{
                  padding: '1.25rem',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selectedMsg?.id === msg.id ? 'var(--bg-hover)' : 'transparent',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
              >
                {selectedMsg?.id === msg.id && (
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--grad-main)' }} />
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: getStatusColor(msg.type), letterSpacing: '0.05em' }}>{(msg.type || 'Update').toUpperCase()}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.2rem' }}>{msg.candidate}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.body}
                </p>
              </div>
            ))
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Your inbox is empty.</div>
          )}
        </div>
      </div>

      {/* Message Reader */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg-card)', 
        borderRadius: '24px', 
        border: '1px solid var(--border)',
        padding: '2rem',
        overflowY: 'auto'
      }}>
        <AnimatePresence mode="wait">
          {selectedMsg ? (
            <motion.div
              key={selectedMsg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>{selectedMsg.candidate}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedMsg.email}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button style={{ padding: '0.6rem', borderRadius: '12px', background: 'var(--bg-hover)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Star size={18} /></button>
                  <button style={{ padding: '0.6rem', borderRadius: '12px', background: 'var(--bg-hover)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </div>

              <div style={{ 
                background: 'var(--bg-hover)', 
                borderRadius: '20px', 
                padding: '2rem', 
                border: '1px solid var(--border)',
                minHeight: '300px',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-15px', 
                  right: '25px', 
                  padding: '0.4rem 1rem', 
                  background: getStatusColor(selectedMsg.type), 
                  color: 'white', 
                  borderRadius: '10px', 
                  fontSize: '0.7rem', 
                  fontWeight: 900,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)' 
                }}>
                   OFFICIAL STATUS: {selectedMsg.type.toUpperCase()}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>Sent: {selectedMsg.time}</p>
                   <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '1rem' }}>Regarding your application</h1>
                </div>

                <div style={{ lineHeight: 1.8, fontSize: '1rem', color: 'var(--text-main)', fontWeight: 500 }}>
                  <p>Dear <strong>{selectedMsg.candidate}</strong>,</p>
                  <p>{selectedMsg.body}</p>
                  
                  {selectedMsg.link && (
                    <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
                      <motion.a
                        href={selectedMsg.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          padding: '1.25rem 2.5rem', 
                          background: 'var(--grad-main)', 
                          color: 'white', 
                          textDecoration: 'none', 
                          borderRadius: '16px', 
                          fontWeight: 900, 
                          fontSize: '1rem',
                          boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                         <Zap size={22} fill="currentColor" /> ENTER LIVE INTERVIEW ROOM
                      </motion.a>
                      <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>
                        <ShieldCheck size={14} /> SECURE MEETING LINK VERIFIED
                      </div>
                    </div>
                  )}

                  <p>Our team has carefully reviewed your profile using our AI Analysis engine. This decision was based on your skills, experience, and role alignment.</p>
                  <p>If you have any questions regarding this status, please feel free to reach out to our recruitment helpdesk.</p>
                  <br />
                  <p style={{ margin: 0 }}>Best regards,</p>
                  <p style={{ marginTop: '0.2rem', fontWeight: 900, color: 'var(--primary)' }}>AI Recruitment Suite Team</p>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: getStatusColor(selectedMsg.type) }} />
                   <p style={{ margin: 0, fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                     This is an automated system-generated mail based on AI Verdict.
                   </p>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                 <button 
                  onClick={() => {
                    if (selectedMsg.type === 'Rejected') setActiveView('analyzer');
                    else setActiveView('dashboard');
                  }}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'var(--grad-main)', color: 'white', border: 'none', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                 >
                    <ChevronRight size={18} /> Take Action
                 </button>
                 <button 
                  onClick={() => {
                    setMessages(prev => prev.filter(m => m.id !== selectedMsg.id));
                    setSelectedMsg(null);
                  }}
                  style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)', fontWeight: 800, cursor: 'pointer' }}
                 >
                    Archive
                 </button>
              </div>
            </motion.div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Mail size={48} />
              </div>
              <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>Select a message to read</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InboxView;
