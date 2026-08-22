import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, IndianRupee, Download, FileText } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalResumes: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    withWatermarkCount: 0,
    withoutWatermarkCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [sessionsRes, downloadsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/user-sessions`, { headers }),
          fetch(`${API_BASE_URL}/downloads`, { headers }),
        ]);

        const sessionsData = await sessionsRes.json();
        const downloadsData = await downloadsRes.json();

        const sessions = sessionsData.success ? sessionsData.sessions || [] : [];
        const downloads = downloadsData.success
          ? downloadsData.downloads || []
          : [];

        const uniqueUsers = new Set(
          sessions.map(item =>
            item.email ||
            item.guestId ||
            item.sessionId
          )
        );

        const totalUsers = Math.max(uniqueUsers.size, downloads.length);

        const totalResumes = Math.max(
          sessions.filter(
            item =>
              item.resumeCreated === true ||
              (item.resumeName && item.resumeName !== "Your Name" && item.resumeName !== "Guest") ||
              item.downloaded === true
          ).length,
          downloads.length
        );

        const totalDownloads = downloads.length;

        const totalRevenue = downloads.reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0
        );

        const withWatermarkCount = downloads.filter(
          item => item.downloadType === "watermarked"
        ).length;

        const withoutWatermarkCount = downloads.filter(
          item => item.downloadType === "no_watermark"
        ).length;

        setDashboardStats({
          totalUsers,
          totalResumes,
          totalDownloads,
          totalRevenue,
          withWatermarkCount,
          withoutWatermarkCount
        });

        console.log("DASHBOARD DATA:", {
          totalUsers,
          totalResumes,
          totalDownloads,
          totalRevenue
        });

      } catch (error) {
        console.error("Dashboard stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();

    const interval = setInterval(fetchDashboardStats, 5000);

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
            <div className="admin-page-title">
              <div>
                <h2>Dashboard</h2>
                <p>Welcome back, Admin. Here's your resume builder overview.</p>
              </div>
            </div>

            {loading ? (
              <div className="admin-table-message">Loading dashboard...</div>
            ) : (
              <div className="report-stats-grid" style={{ marginBottom: "24px" }}>
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
