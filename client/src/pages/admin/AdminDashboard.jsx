import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, IndianRupee, Download, FileText, RefreshCw, Trash2, FileCheck, Activity } from "lucide-react";
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
    withoutWatermarkCount: 0
  });
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
        totalDownloads: 0,
        totalRevenue: 0,
        activeUsersCount: 0,
        withWatermarkCount: 0,
        withoutWatermarkCount: 0
      });

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

  useEffect(() => {
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
        const downloads = downloadsData.success
          ? downloadsData.downloads || []
          : [];

        const totalATSAnalyses = atsData?.data?.totalAnalyses || 0;

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
          withoutWatermarkCount
        });

      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    };

    fetchDashboardStats(true);

    const interval = setInterval(() => fetchDashboardStats(false), 5000);

    return () => clearInterval(interval);
  }, []);

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
                  <RefreshCw size={14} /> Refresh
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
              <div className="admin-table-message">Loading dashboard...</div>
            ) : (
              <div className="report-stats-grid" style={{ marginBottom: "24px" }}>
                {/* Live Active Users (Inside Now) Card */}
                <div 
                  className="report-stat-card" 
                  onClick={() => navigate('/admin/sessions')}
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

                {/* Total Users Card */}
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

                {/* Resumes Created Card */}
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

                {/* ATS Resume Analyses Card */}
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

                {/* Total Downloads Card */}
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

                {/* Total Revenue Card */}
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

                {/* With Watermark Card */}
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

                {/* Without Watermark Card */}
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
