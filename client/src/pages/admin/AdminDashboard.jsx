import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, IndianRupee, UserCheck, Download, CreditCard } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const [planStats, setPlanStats] = useState({
    totalRevenue: 0,
    totalDownloads: 0,
    watermarkDownloads: 0,
    noWatermarkDownloads: 0
  });

  const [activeSessions, setActiveSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    activeUsers: 0,
    exitedUsers: 0,
    resumesCreated: 0
  });

  useEffect(() => {
    const cleanupInactiveUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        await fetch(
          "http://localhost:5000/api/sessions/admin/cleanup-inactive",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (error) {
        console.error("Inactive cleanup error:", error);
      }
    };

    cleanupInactiveUsers();
    const interval = setInterval(cleanupInactiveUsers, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          "http://localhost:5000/api/sessions/admin/all",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await response.json();

        if (!data.success) return;

        const sessions = data.sessions || [];

        const totalSessions = sessions.length;

        const activeUsers = sessions.filter(
          session => session.status === "active"
        ).length;

        const exitedUsers = sessions.filter(
          session => session.status === "exited"
        ).length;

        const resumesCreated = sessions.filter(
          session => session.resumeCreated === true
        ).length;

        setUserStats({
          totalSessions,
          activeUsers,
          exitedUsers,
          resumesCreated
        });

        const activities = sessions
          .flatMap(session =>
            (session.events || [])
              .filter(event => event.action !== "HEARTBEAT")
              .map(event => ({
                guestId: session.guestId,
                email: session.email,
                action: event.action,
                page: event.page,
                timestamp: event.timestamp
              }))
          )
          .sort(
            (a, b) =>
              new Date(b.timestamp) - new Date(a.timestamp)
          )
          .slice(0, 10);

        setRecentActivity(activities);

        const active = sessions
          .filter(session => session.status === "active")
          .sort(
            (a, b) =>
              new Date(b.lastActiveTime) -
              new Date(a.lastActiveTime)
          );

        setActiveSessions(active);

      } catch (error) {
        console.error("User stats error:", error);
      }
    };

    // Load immediately
    fetchUserStats();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      fetchUserStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlanStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/download-plans"
        );

        const data = await response.json();

        if (!data.success) return;

        const plans = data.plans || [];

        const totalRevenue = plans.reduce(
          (sum, plan) => sum + Number(plan.revenue || 0),
          0
        );

        const totalDownloads = plans.reduce(
          (sum, plan) => sum + Number(plan.downloadCount || 0),
          0
        );

        const watermarkDownloads =
          plans.find(plan => plan.key === "watermarked")
            ?.downloadCount || 0;

        const noWatermarkDownloads =
          plans.find(plan => plan.key === "no_watermark")
            ?.downloadCount || 0;

        setPlanStats({
          totalRevenue,
          totalDownloads,
          watermarkDownloads,
          noWatermarkDownloads
        });

      } catch (error) {
        console.error("Dashboard stats error:", error);
      }
    };

    fetchPlanStats();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-table-message">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="admin-page">
        <div className="admin-table-message">Failed to load dashboard.</div>
      </div>
    );
  }

  const overview = dashboard.overview || {};

  const getDisplayName = (user) => {
    if (!user) return "Unknown User";
    if (user.isGuest || (user.email && user.email.includes("@guest.local"))) return "Guest User";
    if (user.name && user.name.trim() !== "" && user.name !== "Unknown User") return user.name;
    if (user.email) return user.email.split("@")[0];
    return "Unknown User";
  };

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

      {/* Statistics */}
      <div className="report-stats-grid" style={{ marginBottom: "24px" }}>
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Users size={20} />
          </div>
          <div>
            <span>Total Visitors</span>
            <h2 style={{margin: 0}}>{userStats.totalSessions}</h2>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <UserCheck size={20} />
          </div>
          <div>
            <span>Active Users</span>
            <h2 style={{margin: 0}}>{userStats.activeUsers}</h2>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Users size={20} />
          </div>
          <div>
            <span>Exited Users</span>
            <h2 style={{margin: 0}}>{userStats.exitedUsers}</h2>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <CreditCard size={20} />
          </div>
          <div>
            <span>Resumes Created</span>
            <h2 style={{margin: 0}}>{userStats.resumesCreated}</h2>
          </div>
        </div>
      </div>

      <div className="report-stats-grid">
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <IndianRupee size={20} />
          </div>
          <div>
            <span>Total Revenue</span>
            <h2 style={{margin: 0}}>₹{planStats.totalRevenue}</h2>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Download size={20} />
          </div>
          <div>
            <span>Total Downloads</span>
            <h2 style={{margin: 0}}>{planStats.totalDownloads}</h2>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Download size={20} />
          </div>
          <div>
            <span>With Watermark</span>
            <h2 style={{margin: 0}}>{planStats.watermarkDownloads}</h2>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Download size={20} />
          </div>
          <div>
            <span>Without Watermark</span>
            <h2 style={{margin: 0}}>{planStats.noWatermarkDownloads}</h2>
          </div>
        </div>
      </div>

      {/* Recent Data */}
      <div className="report-section-grid">
        {/* Recent Payments */}
        <div className="report-card">
          <h3>Recent Payments</h3>
          {dashboard.recentPayments?.length === 0 ? (
            <p className="report-empty">No payments yet.</p>
          ) : (
            dashboard.recentPayments?.map((payment) => (
              <div className="monthly-revenue-row" key={payment._id}>
                <div>
                  <strong>{getDisplayName(payment.userId)}</strong>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {payment.planId?.name || "Plan"}
                  </div>
                </div>
                <strong>
                  ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            ))
          )}
        </div>

        {/* Recent Users */}
        <div className="report-card">
          <h3>Recent Users</h3>
          {dashboard.recentUsers?.length === 0 ? (
            <p className="report-empty">No users yet.</p>
          ) : (
            dashboard.recentUsers?.map((user) => (
              <div className="monthly-revenue-row" key={user._id}>
                <div>
                  <strong>{getDisplayName(user)}</strong>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {user.email}
                  </div>
                </div>
                <span>
                  {new Date(user.createdAt).toLocaleDateString("en-IN")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="report-card" style={{ marginTop: "24px" }}>
        <h3>Recent Activity</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Guest</th>
                <th>Email</th>
                <th>Activity</th>
                <th>Page</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((item, index) => (
                <tr key={index}>
                  <td>{item.guestId || "User"}</td>
                  <td>{item.email || "-"}</td>
                  <td>
                    <span className="status-badge active" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                      {item.action}
                    </span>
                  </td>
                  <td>{item.page || "-"}</td>
                  <td>
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-card" style={{ marginTop: "24px" }}>
        <h3>Active Users</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User / Guest</th>
                <th>Email</th>
                <th>Current Page</th>
                <th>Last Active</th>
                <th>Resume</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {activeSessions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#64748b" }}>
                    No active users currently on the site.
                  </td>
                </tr>
              ) : activeSessions.map(session => (
                <tr key={session._id}>
                  <td>
                    {session.user?.name ||
                      session.guestId ||
                      "Guest"}
                  </td>
                  <td>
                    {session.email ||
                      session.user?.email ||
                      "-"}
                  </td>
                  <td>
                    {session.currentPage || "-"}
                  </td>
                  <td>
                    {session.lastActiveTime
                      ? new Date(
                          session.lastActiveTime
                        ).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {session.resumeCreated
                      ? <span className="status-badge active" style={{ background: "#dcfce7", color: "#166534" }}>Created</span>
                      : <span className="status-badge inactive" style={{ background: "#f1f5f9", color: "#64748b" }}>Not Created</span>}
                  </td>
                  <td>
                    {session.downloaded
                      ? session.downloadType === "watermarked"
                        ? <span className="status-badge active" style={{ background: "#fef3c7", color: "#92400e" }}>With Watermark</span>
                        : <span className="status-badge active" style={{ background: "#e0e7ff", color: "#3730a3" }}>Without Watermark</span>
                      : <span className="status-badge inactive" style={{ background: "#f1f5f9", color: "#64748b" }}>Not Downloaded</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
