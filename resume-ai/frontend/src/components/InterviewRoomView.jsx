import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, Settings, Users, MessageSquare, 
  ShieldCheck, Share, Monitor, Maximize2, MoreVertical, Layout, Hand
} from 'lucide-react';

const InterviewRoomView = ({ roomId, user, onExit }) => {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ 
      height: '100vh', width: '100%', background: '#000', color: '#fff', 
      display: 'flex', flexDirection: 'column', position: 'fixed', inset: 0, zIndex: 2000,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Top Bar */}
      <div style={{ 
        height: '60px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--grad-main)', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 900 }}>LIVE</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.05em' }}>ROOM: {roomId || 'SECURE_SESSION_A1'}</div>
          <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{formatTime(sessionTime)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 800 }}>
            <ShieldCheck size={16} /> END-TO-END ENCRYPTED
          </div>
          <Settings size={20} style={{ cursor: 'pointer', opacity: 0.7 }} />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', padding: '1rem', gap: '1rem', overflow: 'hidden' }}>
        {/* Video Grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', position: 'relative' }}>
          
          {/* Candidate View (Mock Video) */}
          <div style={{ 
            background: '#1a1a1a', borderRadius: '24px', position: 'relative', overflow: 'hidden', 
            border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {videoActive ? (
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Candidate" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900 }}>JD</div>
            )}
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '0.85rem', fontWeight: 700 }}>
              CANDIDATE: John Doe
            </div>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
               {!micActive && <div style={{ background: '#ef4444', padding: '0.4rem', borderRadius: '50%' }}><MicOff size={16} /></div>}
            </div>
          </div>

          {/* Interviewer View (Mock Video) */}
          <div style={{ 
            background: '#1a1a1a', borderRadius: '24px', position: 'relative', overflow: 'hidden', 
            border: '2px solid var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
             <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                alt="Interviewer" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
            <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '12px', backdropFilter: 'blur(10px)', fontSize: '0.85rem', fontWeight: 700 }}>
              INTERVIEWER (YOU): {user?.name || 'Recruiter'}
            </div>
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
               <div style={{ background: 'var(--secondary)', color: '#000', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 900 }}>HOST</div>
            </div>
          </div>
        </div>

        {/* Sidebar (Chat / Info) */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              style={{ width: '350px', background: '#111', borderRadius: '24px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Meeting Chat</h3>
                <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
              </div>
              <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '0.3rem' }}>SYSTEM</p>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>Welcome to the Forge AI Interview portal. The candidate has joined the room.</p>
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', background: '#222', padding: '0.75rem', borderRadius: '12px' }}>
                  <input type="text" placeholder="Type a message..." style={{ flex: 1, background: 'none', border: 'none', color: '#fff', outline: 'none' }} />
                  <div style={{ color: 'var(--secondary)', cursor: 'pointer' }}><Share size={18} /></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div style={{ 
        height: '90px', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', position: 'relative'
      }}>
        {/* Left Side Controls */}
        <div style={{ position: 'absolute', left: '2rem', display: 'flex', gap: '1rem' }}>
           <div className="room-control-btn" style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}><Users size={20} /></div>
           <div 
             onClick={() => setShowChat(!showChat)}
             className="room-control-btn" 
             style={{ padding: '0.75rem', borderRadius: '14px', background: showChat ? 'var(--secondary)' : 'rgba(255,255,255,0.05)', color: showChat ? '#000' : '#fff', cursor: 'pointer' }}
           >
             <MessageSquare size={20} />
           </div>
        </div>

        {/* Center Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            onClick={() => setMicActive(!micActive)}
            style={{ width: 56, height: 56, borderRadius: '50%', background: micActive ? '#333' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {micActive ? <Mic size={24} /> : <MicOff size={24} />}
          </div>
          <div 
            onClick={() => setVideoActive(!videoActive)}
            style={{ width: 56, height: 56, borderRadius: '50%', background: videoActive ? '#333' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            {videoActive ? <Video size={24} /> : <VideoOff size={24} />}
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Monitor size={24} />
          </div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Hand size={24} />
          </div>
          <div 
            onClick={onExit}
            style={{ width: 64, height: 56, borderRadius: '28px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginLeft: '1rem' }}
          >
            <PhoneOff size={24} strokeWidth={3} />
          </div>
        </div>

        {/* Right Side Layout Controls */}
        <div style={{ position: 'absolute', right: '2rem', display: 'flex', gap: '1rem' }}>
           <div className="room-control-btn" style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}><Layout size={20} /></div>
           <div className="room-control-btn" style={{ padding: '0.75rem', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}><Maximize2 size={20} /></div>
        </div>
      </div>

      <style>{`
        .room-control-btn:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        .room-control-btn { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
};

export default InterviewRoomView;
