import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  FileText,
  AlertCircle,
  Calendar,
  BarChart3,
  RefreshCw,
  Mail,
  Database,
  Monitor,
  Globe,
  Cloud,
  Smartphone,
  Atom,
  Server,
  Lock,
  Briefcase,
  MessageSquare,
  Cpu,
  Users,
  User,
  Layout
} from 'lucide-react';

const ROADMAP_DATA = [
  {
    title: "Frontend Developer",
    color: "#2563eb",
    image: "/assets/roadmap/frontend_3d_icon_1774684912545.png",
    steps: [
      { text: "HTML CSS", icon: Monitor },
      { text: "HTML", icon: Globe },
      { text: "JavaScript", icon: Cloud },
      { text: "Responsive Design (Flexbox Grid)", icon: Smartphone },
      { text: "React / Angular", icon: Atom }
    ]
  },
  {
    title: "Backend Developer",
    color: "#10b981",
    image: "/assets/roadmap/backend_3d_icon_1774684938216.png",
    steps: [
      { text: "Programming Language", icon: Cpu },
      { text: "Server (Express / Spring Boot)", icon: Server },
      { text: "Responsive Design", icon: Monitor },
      { text: "React / Angular", icon: Atom },
      { text: "API Integration", icon: Globe }
    ]
  },
  {
    title: "Fullstack Developer",
    color: "#06b6d4",
    image: "/assets/roadmap/fullstack_3d_icon_1774684965425.png",
    steps: [
      { text: "Server (Express / Spring Boot)", icon: Server },
      { text: "Database (MongoDB / MySQL)", icon: Database },
      { text: "Database", icon: Database },
      { text: "Authentication", icon: Lock },
      { text: "API Development", icon: Cpu }
    ]
  },
  {
    title: "Fullstack Developer",
    color: "#f97316",
    image: "/assets/roadmap/fullstack_orange_3d_icon_1774685014473.png",
    steps: [
      { text: "Frontend Basics", icon: Layout },
      { text: "Backend Basics", icon: Server },
      { text: "Database", icon: Database },
      { text: "Authentication", icon: Lock },
      { text: "Full Project", icon: Briefcase }
    ]
  },
  {
    title: "Sales Professional",
    color: "#3b82f6",
    image: "/assets/roadmap/sales_3d_icon_1774684992799.png",
    steps: [
      { text: "Communication Skills", icon: MessageSquare },
      { text: "Product Knowledge", icon: Target },
      { text: "CRM Tools", icon: Users },
      { text: "Full Project", icon: Briefcase },
      { text: "Performance", icon: TrendingUp }
    ]
  }
];

const RoadmapColumn = ({ path, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
  >
    {/* Start Badge */}
    <div style={{ 
      padding: '0.4rem 1.5rem', 
      borderRadius: '20px', 
      background: path.color, 
      color: '#0f172a', 
      fontSize: '0.8rem', 
      fontWeight: 900, 
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      boxShadow: `0 8px 20px ${path.color}40`,
      marginBottom: '1rem'
    }}>
      START
    </div>

    {/* Vertical Steps */}
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      {/* Connector Line */}
      <div style={{ 
        position: 'absolute', 
        top: '15px', 
        bottom: '15px', 
        width: '2px', 
        background: `linear-gradient(180deg, ${path.color}40 0%, ${path.color}10 100%)`,
        zIndex: 0
      }} />

      {path.steps.map((step, si) => (
        <div key={si} style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%', 
            background: path.color, 
            boxShadow: `0 0 15px ${path.color}`,
            border: '2px solid white',
            marginBottom: '0.8rem'
          }} />
          <div className="glass-card" style={{ 
            width: '95%', 
            padding: '1rem', 
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.85rem', 
            fontWeight: 800,
            color: 'var(--text-main)',
            border: `1px solid ${path.color}30`,
            background: `${path.color}05`,
            textAlign: 'left'
          }}>
            <div style={{ color: path.color, display: 'flex' }}>
              <step.icon size={18} />
            </div>
            <span>{step.text}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Specialization Badge */}
    <div className="glass-card" style={{ 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '1.5rem',
      background: `linear-gradient(135deg, ${path.color} 0%, ${path.color}dd 100%)`,
      color: 'white',
      border: 'none',
      boxShadow: `0 15px 35px ${path.color}30`,
      marginTop: 'auto'
    }}>
      {path.image ? (
        <img src={path.image} alt={path.title} style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' }} />
      ) : (
        <Zap size={32} />
      )}
      <span style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>{path.title}</span>
    </div>
  </motion.div>
);

const StatCard = ({ icon: Icon, label, value, color, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    onClick={onClick}
    className="glass-card" 
    style={{ 
      padding: '1.75rem', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '140px',
      cursor: onClick ? 'pointer' : 'default'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ 
        width: '48px',
        height: '48px',
        borderRadius: '14px', 
        background: `${color}10`, 
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 8px 16px ${color}15`,
        border: `1px solid ${color}20`
      }}>
        <Icon size={24} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{value}</h3>
          {onClick && <ChevronRight size={16} color="var(--primary)" style={{ marginLeft: 'auto' }} />}
        </div>
      </div>
    </div>
  </motion.div>
);

const AnalyticsBar = ({ label, value, max, color, delay }) => {
  const heightPercent = (value / max) * 100;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ 
        height: '180px', 
        width: '100%', 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'center', 
        background: 'rgba(0,0,0,0.02)', 
        borderRadius: '16px', 
        padding: '6px',
        border: '1px solid var(--border)'
      }}>
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${heightPercent}%` }}
          transition={{ duration: 1.5, delay, ease: [0.33, 1, 0.68, 1] }}
          style={{ 
            width: '100%', 
            background: `linear-gradient(180deg, ${color} 0%, ${color}aa 100%)`, 
            borderRadius: '10px', 
            position: 'relative',
            boxShadow: `0 10px 20px ${color}20`
          }}
        >
          <div style={{ 
            position: 'absolute', 
            top: '-30px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            color: 'var(--text-main)' 
          }}>
            {value}
          </div>
        </motion.div>
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
};

const DnaBar = ({ label, value, color, delay }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{label}</span>
      <span style={{ fontSize: '0.8rem', fontWeight: 800, color }}>{value}%</span>
    </div>
    <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, delay, ease: "circOut" }}
        style={{ 
          height: '100%', 
          background: color, 
          borderRadius: '10px',
          boxShadow: `0 0 10px ${color}40`
        }}
      />
    </div>
  </div>
);

const DashboardView = ({ user, recentAnalyses, setActiveView, setRecruiterMode, recruiterMode, onRefresh, onUploadNew, onSelectCandidate, isLoading, dbError, onEditResume }) => {
  const [analyticsPeriod, setAnalyticsPeriod] = React.useState('Weekly');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [resumes, setResumes] = React.useState([]);
  const [loadingResumes, setLoadingResumes] = React.useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Fetch Candidate Resumes
  const fetchResumes = React.useCallback(async () => {
    if (user?.role !== 'HR') {
      setLoadingResumes(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/resumes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResumes(data.resumes || []);
        }
      } catch (e) {
        console.error('Failed to fetch resumes:', e);
      } finally {
        setLoadingResumes(false);
      }
    }
  }, [user]);

  React.useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this resume?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResumes(prev => prev.filter(r => r._id !== id));
      } else {
        alert(data.message || 'Failed to delete resume');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to database');
    }
  };

  if (dbError) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <AlertCircle size={64} style={{ color: '#ef4444', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Connectivity Error</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          {dbError}
        </p>
        <button onClick={handleRefresh} className="glass-btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          <RefreshCw size={18} style={{ marginRight: '0.5rem' }} /> Retry Connection
        </button>
      </div>
    );
  }

  // Recruiter Calculations
  const stats = {
    total: recentAnalyses?.length || 0,
    selected: recentAnalyses?.filter(a => a.status === 'Selected').length || 0,
    rejected: recentAnalyses?.filter(a => a.status === 'Rejected').length || 0,
    consider: recentAnalyses?.filter(a => a.status === 'Consider').length || 0,
    avgScore: recentAnalyses?.length > 0 
      ? Math.round(recentAnalyses.reduce((acc, curr) => acc + (curr.score || 0), 0) / recentAnalyses.length)
      : 0
  };

  // Render Candidate (Employee) View
  if (user?.role !== 'HR') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ 
                width: 72, 
                height: 72, 
                borderRadius: '20px', 
                background: 'var(--grad-main)',
                boxShadow: '0 8px 25px var(--secondary-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <User size={32} color="white" />
            </motion.div>
            <div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--text-main)', marginBottom: '0.1rem' }}>
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'User'}</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                Build and polish your industry-grade resumes with AI assistant tools.
              </p>
            </div>
          </div>
          <button
            onClick={() => onEditResume(null)}
            className="glass-btn btn-primary"
            style={{ 
              padding: '0.75rem 1.75rem',
              borderRadius: '14px',
              fontSize: '0.9rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              boxShadow: '0 10px 25px var(--primary-glow)',
              whiteSpace: 'nowrap'
            }}
          >
            <Zap size={18} /> Create New Resume
          </button>
        </div>

        {/* Candidate Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <StatCard icon={FileText} label="Saved Resumes" value={resumes.length} color="var(--primary)" delay={0.1} />
          <StatCard icon={Zap} label="Account Plan" value={user?.subscription === 'Premium' ? 'Premium Pro' : 'Basic Free'} color="#10b981" delay={0.2} />
          <StatCard icon={TrendingUp} label="Profile Completeness" value="90%" color="var(--primary)" delay={0.3} />
          <StatCard icon={Target} label="AI Recommendations" value="Unlimited" color="#f59e0b" delay={0.4} />
        </div>

        {/* Resumes Workspace Gallery */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '2rem' }}>My Resumes Gallery</h3>
          
          {loadingResumes ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <RefreshCw size={40} style={{ color: 'var(--primary)', opacity: 0.5 }} />
              </motion.div>
              <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Retrieving your workspace resumes...</p>
            </div>
          ) : resumes.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.75rem' }}>
              {resumes.map((resume, i) => (
                <motion.div 
                  key={resume._id || i}
                  whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.06)' }}
                  onClick={() => onEditResume(resume._id)}
                  style={{ 
                    padding: '1.5rem', 
                    borderRadius: '20px', 
                    background: 'rgba(0,0,0,0.01)', 
                    border: '1px solid var(--border)', 
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '200px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a' }}>
                        <FileText size={20} />
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 900, padding: '0.25rem 0.6rem', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {resume.department || 'General'}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.4rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {resume.title || 'Untitled Resume'}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Last updated: {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEditResume(resume._id); }}
                      style={{ flex: 1, padding: '0.5rem', background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={(e) => handleDeleteResume(resume._id, e)}
                      style={{ padding: '0.5rem 0.75rem', background: 'none', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      DELETE
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '2px dashed var(--border)', borderRadius: '24px' }}>
              <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No resumes created yet</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, maxWidth: '400px', margin: '0 auto 2rem' }}>
                Launch our live-updating split-pane builder to design your first ATS-optimized career resume!
              </p>
              <button 
                onClick={() => onEditResume(null)} 
                className="glass-btn btn-primary" 
                style={{ padding: '0.75rem 2rem', fontWeight: 900, borderRadius: '12px' }}
              >
                Create Your First Resume
              </button>
            </div>
          )}
        </div>

      </div>
    );
  }

  // Render Recruiter (HR) View
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: 0 }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '24px', 
              background: 'var(--grad-main)',
              boxShadow: '0 10px 30px var(--secondary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <User size={36} color="white" />
          </motion.div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 950, letterSpacing: '-0.04em', color: 'var(--text-main)', marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'HR Manager'}</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 600, margin: 0, whiteSpace: 'nowrap', opacity: 0.9 }}>
              Managing {stats.total} candidate profiles.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUploadNew}
            className="glass-btn btn-primary"
            style={{ 
              padding: '0.75rem 1.75rem',
              borderRadius: '14px',
              fontSize: '0.9rem',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              boxShadow: '0 10px 25px var(--primary-glow)',
              whiteSpace: 'nowrap'
            }}
          >
            <Zap size={18} /> Upload New Resume
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '1.5rem' 
      }}>
        <StatCard icon={FileText} label="Total Resumes" value={stats.total} color="var(--primary)" delay={0.1} />
        <StatCard icon={Target} label="Avg. Score" value={stats.avgScore} color="var(--secondary)" delay={0.2} />
        <StatCard icon={TrendingUp} label="Selected" value={stats.selected} color="#10b981" delay={0.3} />
        <StatCard icon={AlertCircle} label="Consider" value={stats.consider} color="var(--primary)" delay={0.4} />
      </div>

      {/* Recruitment Analytics */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ background: 'var(--grad-main)', padding: '0.75rem', borderRadius: '14px', color: '#0f172a' }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Performance Metrics</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Real-time recruitment processing stats</p>
            </div>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-hover)', padding: '0.4rem', borderRadius: '14px', gap: '0.4rem', border: '1px solid var(--border)' }}>
            {['Daily', 'Weekly', 'Monthly'].map(p => (
              <button 
                key={p} 
                onClick={() => setAnalyticsPeriod(p)}
                style={{ 
                  padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', 
                  background: analyticsPeriod === p ? 'var(--bg-card)' : 'transparent',
                  color: analyticsPeriod === p ? 'var(--primary)' : 'var(--text-muted)',
                  fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: analyticsPeriod === p ? '0 4px 10px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', minHeight: '220px' }}>
          {analyticsPeriod === 'Daily' && ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((l, i) => (
            <AnalyticsBar key={l} label={l} value={[12, 28, 15, 34, 22, 8, 14][i]} max={40} color="var(--primary)" delay={i * 0.1} />
          ))}
          {analyticsPeriod === 'Weekly' && ["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((l, i) => (
            <AnalyticsBar key={l} label={l} value={[85, 142, 110, 195][i]} max={200} color="#a855f7" delay={i * 0.1} />
          ))}
          {analyticsPeriod === 'Monthly' && ["Jan", "Feb", "Mar", "Apr"].map((l, i) => (
            <AnalyticsBar key={l} label={l} value={[450, 620, 780, 540][i]} max={800} color="#6366f1" delay={i * 0.1} />
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>Recent Activity</h3>
              <button onClick={() => setActiveView('reports')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                View Full Log <ChevronRight size={16} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCw size={40} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                  </motion.div>
                  <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Syncing with Database...</p>
                </div>
              ) : recentAnalyses?.length > 0 ? recentAnalyses.map((item, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} onClick={() => onSelectCandidate(item)} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderRadius: '20px', background: 'rgba(0,0,0,0.01)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--grad-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', marginRight: '1.25rem', boxShadow: '0 8px 16px var(--secondary-glow)' }}>
                    <FileText size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>{item.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.role} • {item.date}</span>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)' }}>{item.score}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>/100</span>
                    </div>
                    <div style={{ 
                      padding: '0.6rem 1.25rem', borderRadius: '12px', minWidth: '100px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase',
                      background: item.status === 'Selected' ? '#10b98115' : 
                                  item.status === 'Rejected' ? '#ef444415' : 
                                  item.status === 'Applied' ? '#3b82f615' : '#f59e0b15',
                      color: item.status === 'Selected' ? '#10b981' : 
                             item.status === 'Rejected' ? '#ef4444' : 
                             item.status === 'Applied' ? '#3b82f6' : '#f59e0b'
                    }}>
                      {item.status}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                   <Clock size={48} style={{ margin: '0 auto 1.5rem' }} />
                   <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No activity records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2.5rem' }}>Candidate Fit Score</h3>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
              <svg width="200" height="200" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--bg-hover)" strokeWidth="6" />
                <motion.circle cx="50" cy="50" r="46" fill="none" stroke="var(--grad-main)" strokeWidth="8" strokeDasharray="289" initial={{ strokeDashoffset: 289 }} animate={{ strokeDashoffset: 289 - (289 * 0.85) }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round" />
                <circle cx="50" cy="50" r="46" fill="none" stroke="var(--secondary)" strokeWidth="2" opacity="0.3" />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '3.2rem', fontWeight: 900, lineHeight: 1 }} className="gradient-text">85%</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.25rem' }}>VERDICT</span>
              </div>
            </div>
            <p style={{ marginTop: '2rem', fontSize: '1rem', fontWeight: 900, color: '#10b981', letterSpacing: '0.1em' }}>HIGH MARKET FIT</p>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ color: 'var(--secondary)' }}><TrendingUp size={24} /></div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Talent DNA</h3>
            </div>
            <DnaBar label="Strategic Depth" value={92} color="var(--primary)" delay={0.5} />
            <DnaBar label="Technical Skill" value={85} color="#10b981" delay={0.6} />
            <DnaBar label="Structure & Clarity" value={78} color="#6366f1" delay={0.7} />
            <DnaBar label="Innovation Quotient" value={65} color="var(--secondary)" delay={0.8} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
