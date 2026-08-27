import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, IndianRupee, Download, FileText, RefreshCw, Trash2, 
  FileCheck, Activity, ArrowRight, Clock, CreditCard, Sparkles, 
  Wallet, Palette, Settings, CheckCircle2
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalATSAnalyses: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    activeUsersCount: 0,
    withWatermarkCount: 0,
    withoutWatermarkCount: 0,
    averageScore: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [recentDownloads, setRecentDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const handleClearAllData = async () => {
    if (!window.confirm("⚠️ Are you sure you want to clear ALL platform data (users, activity, payments, downloads, and resumes)?\n\nThis will reset all dashboard metrics to 0 while keeping your templates and admin access intact.")) {
      return;
    }
    try {
      setClearing(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        await fetch(`${API_BASE_URL}/admin/clear-all-data`, {
          method: "POST",
          headers: { ...headers, Accept: "application/json" }
        });
      } catch (e) {}

      try {
        await fetch(`${API_BASE_URL}/admin/clear-dummy-data`, { headers });
      } catch (e) {}

      try {
        await fetch(`${API_BASE_URL}/payments/clear`, { method: "DELETE", headers });
      } catch (e) {}

      try {
        await fetch(`${API_BASE_URL}/user-sessions/clear-test-data`, { method: "DELETE", headers });
      } catch (e) {}

      setDashboardStats({
        totalUsers: 0,
        totalResumes: 0,
        totalATSAnalyses: 0,
        totalDownloads: 0,
        totalRevenue: 0,
        activeUsersCount: 0,
        withWatermarkCount: 0,
        withoutWatermarkCount: 0,
        averageScore: 0
      });
      setRecentSessions([]);
      setRecentDownloads([]);

      setTimeout(() => {
        fetchDashboardStats(false);
      }, 600);

      alert("✅ All platform data (users, payments, downloads, and activity) has been cleared successfully!");
    } catch (e) {
      console.error("Failed to clear data:", e);
      alert("Failed to clear data: " + e.message);
    } finally {
      setClearing(false);
    }
  };

  const fetchDashboardStats = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [sessionsRes, downloadsRes, atsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/user-sessions`, { headers }),
        fetch(`${API_BASE_URL}/downloads`, { headers }),
        fetch(`${API_BASE_URL}/resume-analysis/admin/stats`, { headers }).catch(() => null),
      ]);

      const sessionsData = await sessionsRes.json();
      const downloadsData = await downloadsRes.json();
      const atsData = atsRes && atsRes.ok ? await atsRes.json() : null;

      const sessions = sessionsData.success ? sessionsData.sessions || [] : [];
      const downloads = downloadsData.success ? downloadsData.downloads || [] : [];

      const totalATSAnalyses = atsData?.data?.totalAnalyses || 0;
      const averageScore = atsData?.data?.averageScore || 0;

      const uniqueUsers = new Set(
        sessions.map(item =>
          item.email ||
          item.guestId ||
          item.sessionId
        )
      );

      const totalUsers = uniqueUsers.size;

      const totalResumes = sessions.filter(
        item => item.resumeCreated === true
      ).length;

      const totalDownloads = downloads.length;

      const totalRevenue = downloads.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
      );

      const activeUsersCount = sessions.filter(item => {
        if (item.status === "exited" || item.exitTime) return false;
        const lastActive = new Date(item.lastActiveTime || item.entryTime || Date.now());
        return Date.now() - lastActive.getTime() < 2 * 60 * 1000;
      }).length;

      const withWatermarkCount = downloads.filter(
        item =>
          item.downloadType === "watermarked" ||
          item.downloadType === "with_watermark"
      ).length;

      const withoutWatermarkCount = downloads.filter(
        item =>
          item.downloadType === "no_watermark" ||
          item.downloadType === "without_watermark"
      ).length;

      setDashboardStats({
        totalUsers,
        totalResumes,
        totalATSAnalyses,
        totalDownloads,
        totalRevenue,
        activeUsersCount,
        withWatermarkCount,
        withoutWatermarkCount,
        averageScore
      });

      setRecentSessions(sessions.slice(0, 6));
      setRecentDownloads(downloads.slice(0, 5));

    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardStats(true);
    // Auto-sync every 5 seconds for real-time live visitor updates
    const interval = setInterval(() => fetchDashboardStats(false), 5000);
    return () => clearInterval(interval);
  }, []);

  // Format 12-hour AM/PM time
  const formatTimeAMPM = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  const isSessionActive = (session) => {
    if (session.status === "exited" || session.exitTime) return false;
    const lastActive = new Date(session.lastActiveTime || session.entryTime || Date.now());
    return Date.now() - lastActive.getTime() < 2 * 60 * 1000;
  };

  const getTimeSpent = (session) => {
    const active = isSessionActive(session);
    if (!session.entryTime) return "-";

    const start = new Date(session.entryTime);
    const end = (!active && session.exitTime)
      ? new Date(session.exitTime)
      : new Date(session.lastActiveTime || Date.now());

    let diffMs = Math.max(0, end.getTime() - start.getTime());
    const totalSeconds = Math.round(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (active) {
      return minutes > 0 ? `Inside (${minutes}m)` : `Inside (< 1m)`;
    }
    if (minutes === 0) return `${Math.max(1, seconds)}s`;
    return `${minutes}m ${seconds}s`;
  };

  const getDisplayName = (s) => {
    if (
      s.resumeName &&
      s.resumeName.toLowerCase() !== "user" &&
      s.resumeName !== "Your Name" &&
      s.resumeName !== "guest_user" &&
      s.resumeName !== "Guest"
    ) {
      return s.resumeName;
    }
    if (s.email) {
      const namePart = s.email.split("@")[0];
      if (namePart && namePart.toLowerCase() !== "user" && namePart.toLowerCase() !== "guest") {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
    }
    return "Guest Visitor";
  };

  const getCleanUserId = (s) => {
    const raw = String(s.guestId || s.sessionId || s._id || '');
    const clean = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const tag = s.email ? 'USR' : 'GST';
    const idSnippet = clean.slice(-6) || '000000';
    return `${tag}-${idSnippet}`;
  };

  const getShortAction = (s) => {
    if (s.downloaded || s.downloadType === 'watermarked' || s.downloadType === 'no_watermark') {
      return '📥 Downloaded';
    }
    if (s.events && Array.isArray(s.events) && s.events.length > 0) {
      const meaningful = [...s.events].reverse().find(e => 
        e.action && 
        e.action !== 'Session Started' && 
        e.action !== 'Landing Page Opened' &&
        !e.action.includes('HEARTBEAT')
      );
      if (meaningful) {
        const raw = meaningful.action.toLowerCase();
        if (raw.includes('ats')) return '📊 ATS Analysis';
        if (raw.includes('ai')) return '🤖 AI Resume';
        if (raw.includes('advisor')) return '💬 Advisor';
        if (raw.includes('builder')) return '🛠️ Builder';
        if (raw.includes('auto-saved')) return '💾 Saved';
      }
    }
    if (s.resumeCreated) return '📝 Resume Created';
    if (s.currentPage === '/resume-checker') return '📊 ATS Checker';
    if (s.currentPage === '/industry-examples') return '📄 Examples';
    if (s.currentPage === '/builder') return '🛠️ Builder';
    return '🌐 Landing Page';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            
            {/* Header */}
            <div className="admin-page-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>Dashboard</h2>
                <p>Welcome back, Admin. Here's your resume builder overview.</p>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={() => fetchDashboardStats(true)}
                  style={{
                    padding: "8px 14px",
                    background: "#0284c7",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
                </button>
                <button
                  onClick={handleClearAllData}
                  disabled={clearing}
                  style={{
                    padding: "8px 14px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: clearing ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    opacity: clearing ? 0.7 : 1
                  }}
                >
                  <Trash2 size={14} /> {clearing ? "Clearing..." : "Clear All Data"}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="admin-table-message">Loading dashboard metrics...</div>
            ) : (
              <>
                {/* ── 8 KPI Stat Cards ── */}
                <div className="report-stats-grid" style={{ marginBottom: "28px" }}>
                  {/* 1. Live Active Users (Inside Now) Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/activity')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: '4px solid #16a34a' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(22,163,74,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view Real-Time Live Sessions"
                  >
                    <div className="report-stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                        Inside Now (Live)
                      </span>
                      <h2 style={{ margin: 0, color: '#15803d' }}>{dashboardStats.activeUsersCount}</h2>
                    </div>
                  </div>

                  {/* 2. Total Users Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/users')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view all registered Users"
                  >
                    <div className="report-stat-icon">
                      <Users size={20} />
                    </div>
                    <div>
                      <span>Total Users</span>
                      <h2 style={{ margin: 0 }}>{dashboardStats.totalUsers}</h2>
                    </div>
                  </div>

                  {/* 3. Resumes Created Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/users')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view created Resumes & Users"
                  >
                    <div className="report-stat-icon">
                      <FileText size={20} />
                    </div>
                    <div>
                      <span>Resumes Created</span>
                      <h2 style={{ margin: 0 }}>{dashboardStats.totalResumes}</h2>
                    </div>
                  </div>

                  {/* 4. ATS Resume Analyses Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/ats-analyses')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: '4px solid #0284c7' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view ATS Resume Analyses"
                  >
                    <div className="report-stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                      <FileCheck size={20} />
                    </div>
                    <div>
                      <span>ATS Analyses</span>
                      <h2 style={{ margin: 0 }}>{dashboardStats.totalATSAnalyses}</h2>
                    </div>
                  </div>

                  {/* 5. Total Downloads Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/downloads')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view Download logs"
                  >
                    <div className="report-stat-icon">
                      <Download size={20} />
                    </div>
                    <div>
                      <span>Total Downloads</span>
                      <h2 style={{ margin: 0 }}>{dashboardStats.totalDownloads}</h2>
                    </div>
                  </div>

                  {/* 6. Total Revenue Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/payments')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view Payments & Revenue"
                  >
                    <div className="report-stat-icon">
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <span>Total Revenue</span>
                      <h2 style={{ margin: 0 }}>₹{dashboardStats.totalRevenue}</h2>
                    </div>
                  </div>

                  {/* 7. With Watermark Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/downloads')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view Watermarked Downloads"
                  >
                    <div className="report-stat-icon">
                      <Download size={20} />
                    </div>
                    <div>
                      <span>With Watermark</span>
                      <h2 style={{ margin: 0 }}>{dashboardStats.withWatermarkCount}</h2>
                    </div>
                  </div>

                  {/* 8. Without Watermark Card */}
                  <div 
                    className="report-stat-card" 
                    onClick={() => navigate('/admin/downloads')}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                    title="Click to view Premium Downloads without Watermark"
                  >
                    <div className="report-stat-icon">
                      <Download size={20} />
                    </div>
                    <div>
                      <span>Without Watermark</span>
                      <h2 style={{ margin: 0 }}>{dashboardStats.withoutWatermarkCount}</h2>
                    </div>
                  </div>
                </div>

                {/* ── Section 1: Live Visitor Activity Table ── */}
                <div className="admin-table-card" style={{ marginBottom: "28px" }}>
                  <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Activity size={18} style={{ color: "#0284c7" }} />
                      <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>Recent Visitor Activity</h3>
                      {dashboardStats.activeUsersCount > 0 && (
                        <span style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "0.72rem",
                          fontWeight: 800
                        }}>
                          🟢 {dashboardStats.activeUsersCount} Online Now
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate('/admin/activity')}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#0284c7",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      View All Activity <ArrowRight size={14} />
                    </button>
                  </div>

                  {recentSessions.length === 0 ? (
                    <div className="admin-table-message" style={{ padding: "2rem" }}>
                      <Activity size={32} style={{ marginBottom: "10px", color: "#9ca3af" }} />
                      <p>No recent user activity recorded yet.</p>
                    </div>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Visitor / Name</th>
                            <th>Action</th>
                            <th>Starting Time</th>
                            <th>Time Spent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentSessions.map((session) => {
                            const active = isSessionActive(session);
                            return (
                              <tr key={session._id || session.sessionId}>
                                <td>
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      padding: "3px 8px",
                                      borderRadius: "12px",
                                      fontSize: "0.72rem",
                                      fontWeight: 800,
                                      background: active ? "#dcfce7" : "#f1f5f9",
                                      color: active ? "#15803d" : "#64748b",
                                    }}
                                  >
                                    <span style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: active ? "#16a34a" : "#94a3b8",
                                    }} />
                                    {active ? "Inside Now" : "Completed"}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.88rem" }}>
                                    {getDisplayName(session)}
                                  </div>
                                  {session.email ? (
                                    <div style={{ fontSize: "0.72rem", color: "#0284c7" }}>
                                      {session.email}
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700 }}>
                                      ID: <span style={{ color: "#0284c7" }}>{getCleanUserId(session)}</span>
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <span style={{
                                    display: "inline-block",
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    fontSize: "0.76rem",
                                    fontWeight: 700,
                                    background: "#f8fafc",
                                    color: "#334155",
                                    border: "1px solid #e2e8f0"
                                  }}>
                                    {getShortAction(session)}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ color: "#0284c7", fontWeight: 700, fontSize: "0.84rem" }}>
                                    {formatTimeAMPM(session.entryTime)}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#64748b" }}>
                                    {getTimeSpent(session)}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ── Section 2: Two-Column Analytics & Quick Hub ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
                  
                  {/* Left Column: Recent Downloads */}
                  <div className="admin-table-card">
                    <div style={{ padding: "1.2rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Download size={18} style={{ color: "#16a34a" }} />
                        <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>Recent Downloads</h3>
                      </div>
                      <button
                        onClick={() => navigate('/admin/downloads')}
                        style={{ background: "none", border: "none", color: "#0284c7", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        View All <ArrowRight size={13} />
                      </button>
                    </div>

                    {recentDownloads.length === 0 ? (
                      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: "0.88rem" }}>
                        No downloads recorded yet.
                      </div>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Resume / User</th>
                              <th>Type</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentDownloads.map((dl, idx) => (
                              <tr key={dl._id || idx}>
                                <td>
                                  <div style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.85rem" }}>
                                    {dl.resumeName || dl.resumeId?.title || "Resume Export"}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                    {dl.email || "Guest"}
                                  </div>
                                </td>
                                <td>
                                  <span style={{
                                    padding: "2px 7px",
                                    borderRadius: "6px",
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    background: dl.downloadType === "no_watermark" ? "#ecfdf5" : "#f1f5f9",
                                    color: dl.downloadType === "no_watermark" ? "#059669" : "#475569",
                                    border: dl.downloadType === "no_watermark" ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
                                  }}>
                                    {dl.downloadType === "no_watermark" ? "Premium Clean" : "Watermarked"}
                                  </span>
                                </td>
                                <td>
                                  <span style={{ fontWeight: 800, color: dl.amount > 0 ? "#16a34a" : "#64748b", fontSize: "0.85rem" }}>
                                    {dl.amount > 0 ? `₹${dl.amount}` : "Free"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Quick Admin Tools & Shortcuts */}
                  <div className="admin-table-card" style={{ padding: "1.5rem" }}>
                    <h3 style={{ margin: "0 0 1rem", fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>
                      ⚡ Quick Admin Shortcuts
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      {[
                        { title: "Manage Users", subtitle: "Profiles & credentials", icon: Users, path: "/admin/users", color: "#0284c7", bg: "#e0f2fe" },
                        { title: "ATS Analyses", subtitle: "View AI score logs", icon: FileCheck, path: "/admin/ats-analyses", color: "#7c3aed", bg: "#f5f3ff" },
                        { title: "Download Plans", subtitle: "Pricing & tiers", icon: Wallet, path: "/admin/plans", color: "#16a34a", bg: "#dcfce7" },
                        { title: "Payments", subtitle: "Orders & transactions", icon: CreditCard, path: "/admin/payments", color: "#ea580c", bg: "#ffedd5" },
                        { title: "Templates", subtitle: "Layouts & design", icon: Palette, path: "/admin/templates", color: "#db2777", bg: "#fdf2f8" },
                        { title: "Site Settings", subtitle: "Brand & watermark", icon: Settings, path: "/admin/settings", color: "#475569", bg: "#f1f5f9" }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            onClick={() => navigate(item.path)}
                            style={{
                              padding: "0.85rem 1rem",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0",
                              background: "#ffffff",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = item.color;
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = "#e2e8f0";
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <div style={{ width: 34, height: 34, borderRadius: "8px", background: item.bg, color: item.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>{item.title}</div>
                              <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{item.subtitle}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
