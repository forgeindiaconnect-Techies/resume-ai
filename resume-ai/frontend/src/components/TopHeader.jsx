import React from 'react';
import { Search, Bell, User as UserIcon, Shield, Sun, Moon, CheckCircle2, AlertCircle, Zap, X, HelpCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopHeader = ({ recruiterMode, user, darkMode, onToggleDark, onLogout }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Fetch real notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/candidates');
      if (response.ok) {
        const candidates = await response.json();
        if (Array.isArray(candidates)) {
          const allNotifications = sortNotifications(candidates);
          setNotifications(allNotifications.slice(0, 15)); // Keep latest 15
          setUnreadCount(allNotifications.length); 
        } else {
          console.error('API did not return an array:', candidates);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    
    // Listen for custom status updates to refresh immediately
    const handleUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener('notificationUpdate', handleUpdate);

    // Poll every 10 seconds for new notifications
    const interval = setInterval(fetchNotifications, 10000);
    return () => {
      window.removeEventListener('notificationUpdate', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Flatten all notifications and sort by date
  const sortNotifications = (candidates) => {
    return (candidates || [])
      .flatMap(c => (c.notifications || []).map(n => ({ ...n, candidateName: c.name || 'Unknown' })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const getIcon = (type) => {
    if (type === 'Selected') return <Zap size={20} />;
    if (type === 'Rejected') return <AlertCircle size={20} />;
    return <CheckCircle2 size={20} />;
  };

  const getIconColor = (type) => {
    if (type === 'Selected') return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981' };
    if (type === 'Rejected') return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' };
    return { bg: 'rgba(37, 99, 235, 0.1)', text: 'var(--primary)' };
  };

  return (
    <header className="header-top" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', boxShadow: 'none', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: 'var(--input-bg)', 
          padding: '0.7rem 1.25rem', 
          borderRadius: '14px', 
          width: '340px',
          border: '1px solid var(--border)'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search resumes, jobs, or insights..." 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              marginLeft: '0.75rem', 
              outline: 'none', 
              fontSize: '0.9rem', 
              width: '100%',
              fontWeight: 500,
              color: 'var(--text-main)'
            }}
          />
        </div>
        
        {recruiterMode && (
          <div className="animate-in" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.6rem 1.25rem', 
            background: 'var(--grad-main)', 
            borderRadius: '14px', 
            color: 'white', 
            fontSize: '0.75rem', 
            fontWeight: 900,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 15px var(--primary-glow)'
          }}>
            <Shield size={16} fill="white" fillOpacity={0.3} />
            RECRUITER PERSPECTIVE ACTIVE
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Dark Mode Toggle */}
        <button onClick={onToggleDark} className="theme-toggle" title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'} style={{ border: 'none', background: 'var(--bg-hover)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '12px' }}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              position: 'relative', 
              cursor: 'pointer', 
              padding: '0.6rem', 
              borderRadius: '12px', 
              background: showNotifications ? 'var(--primary-light)' : 'var(--bg-hover)', 
              border: 'none',
              color: 'var(--primary)',
              transition: 'all 0.2s'
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div style={{ 
                position: 'absolute', 
                top: 6, 
                right: 6, 
                width: 8, 
                height: 8, 
                background: '#ef4444', 
                borderRadius: '50%', 
                border: '2px solid var(--bg-card)' 
              }} />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  onClick={() => setShowNotifications(false)} 
                  style={{ position: 'fixed', inset: 0, zIndex: 90 }} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    right: 0,
                    width: '320px',
                    background: 'var(--bg-card)',
                    borderRadius: '20px',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)'
                  }}
                >
                  <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>Notifications</h4>
                    <span 
                      onClick={handleMarkAllRead}
                      style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Mark all as read
                    </span>
                  </div>
                  
                  <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          style={{ 
                            padding: '1rem', 
                            borderRadius: '14px', 
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '1rem',
                            transition: 'background 0.2s'
                          }}
                          className="notification-item"
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '12px', 
                            background: getIconColor(n.type).bg,
                            color: getIconColor(n.type).text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getIcon(n.type)}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>{n.type || 'Update'}</p>
                              <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.date ? new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</p>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, fontWeight: 500 }}>
                              <strong>{n.candidateName}:</strong> {n.message}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No new notifications
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        
        <div 
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            paddingLeft: '1.5rem', 
            borderLeft: '1px solid var(--border)', 
            cursor: 'pointer',
            height: '40px',
            position: 'relative'
          }}
        >
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{user?.name || 'Alex Rivers'}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{user?.membership || 'Elite Member'}</p>
          </div>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '12px', 
            background: 'var(--bg-hover)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'var(--primary)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <UserIcon size={20} />
          </div>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '1rem',
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '180px',
                  zIndex: 200,
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '0.5rem' }}>
                  <button 
                    onClick={onLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      borderRadius: '12px',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <LogOut size={18} />
                    SIGN OUT
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
