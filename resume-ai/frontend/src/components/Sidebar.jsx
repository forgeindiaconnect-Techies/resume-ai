import React from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  Target, 
  MessageSquare, 
  User, 
  Zap, 
  Settings,
  ShieldCheck,
  BarChart3,
  Mail,
  LogOut,
  Vault,
  FileText
} from 'lucide-react';

import ForgeLogo from './ForgeLogo';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`nav-item ${active ? 'active' : ''}`}
    style={{ 
      color: active ? 'white' : 'var(--text-muted)',
      background: active ? 'var(--primary)' : 'transparent',
      boxShadow: active ? '0 8px 16px var(--primary-glow)' : 'none'
    }}
  >
    <Icon size={20} color={active ? 'white' : 'var(--text-muted)'} />
    <span style={{ fontWeight: 700 }}>{label}</span>
  </div>
);

const Sidebar = ({ activeView, setActiveView, recruiterMode, setRecruiterMode, user, onLogout }) => {
  return (
    <aside className="sidebar-nav" style={{ width: 'var(--sidebar-w)', borderRight: '1px solid var(--border)' }}>
      <div style={{ paddingBottom: '2rem', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <ForgeLogo size={36} variant="sidebar" />
      </div>

      <div className="sidebar-nav-body">
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <NavItem 
            icon={FileText} 
            label="Resume Builder" 
            active={activeView === 'builder'} 
            onClick={() => setActiveView('builder')} 
          />
          <NavItem 
            icon={BarChart3} 
            label="AI Reports" 
            active={activeView === 'reports'} 
            onClick={() => setActiveView('reports')} 
          />
          <NavItem 
            icon={MessageSquare} 
            label="AI Matcher & Chat" 
            active={activeView === 'matcher'} 
            onClick={() => setActiveView('matcher')} 
          />
          <NavItem 
            icon={Mail} 
            label="Cover Letters" 
            active={activeView === 'cover-letters'} 
            onClick={() => setActiveView('cover-letters')} 
          />
          <NavItem 
            icon={Zap} 
            label="Subscription" 
            active={activeView === 'subscription'} 
            onClick={() => setActiveView('subscription')} 
          />
          {/* Admin Panel / Vault — shown to HR/Recruiters/Admins */}
          {(user?.userRole === 'HR' || user?.role === 'HR') && (
            <NavItem 
              icon={ShieldCheck} 
              label="Admin Panel" 
              active={activeView === 'admin'} 
              onClick={() => setActiveView('admin')} 
            />
          )}
          <NavItem 
            icon={User} 
            label="My Profile" 
            active={activeView === 'profile'} 
            onClick={() => setActiveView('profile')} 
          />
        </nav>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>


        <button 
          onClick={onLogout}
          style={{ 
            padding: '1rem', 
            borderRadius: '16px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#ef4444', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            fontWeight: 800, 
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
        >
          <LogOut size={18} />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
