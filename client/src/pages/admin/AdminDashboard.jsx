import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, IndianRupee, UserCheck, Download, CreditCard } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="report-stats-grid">
        {/* Users */}
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Users size={20} />
          </div>
          <div>
            <span>Total Users</span>
            <strong>{overview.totalUsers || 0}</strong>
          </div>
        </div>

        {/* Revenue */}
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <IndianRupee size={20} />
          </div>
          <div>
            <span>Total Revenue</span>
            <strong>
              ₹{(overview.totalRevenue || 0).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <UserCheck size={20} />
          </div>
          <div>
            <span>Active Subscriptions</span>
            <strong>{overview.activeSubscriptions || 0}</strong>
          </div>
        </div>

        {/* Downloads */}
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Download size={20} />
          </div>
          <div>
            <span>Total Downloads</span>
            <strong>{overview.totalDownloads || 0}</strong>
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
                  <strong>{payment.userId?.name || "Unknown User"}</strong>
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
                  <strong>{user.name || "Unknown"}</strong>
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
    </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
