import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  IndianRupee,
  CreditCard,
  UserCheck,
  CheckCircle,
  XCircle,
  Download
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        "http://localhost:5000/api/admin/reports",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-table-message">Loading reports...</div>
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="admin-page">
        <div className="admin-table-message">Failed to load reports.</div>
      </div>
    );
  }

  const overview = reports.overview || {};

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
                <h2>Reports</h2>
                <p>Monitor users, revenue, payments and subscriptions.</p>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="report-stats-grid">
              <div className="report-stat-card">
                <div className="report-stat-icon">
                  <Users size={20} />
                </div>
                <div>
                  <span>Total Users</span>
                  <strong>{overview.totalUsers || 0}</strong>
                </div>
              </div>

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

              <div className="report-stat-card">
                <div className="report-stat-icon">
                  <UserCheck size={20} />
                </div>
                <div>
                  <span>Paid Users</span>
                  <strong>{overview.paidUsers || 0}</strong>
                </div>
              </div>

              <div className="report-stat-card">
                <div className="report-stat-icon">
                  <CreditCard size={20} />
                </div>
                <div>
                  <span>Active Subscriptions</span>
                  <strong>{overview.activeSubscriptions || 0}</strong>
                </div>
              </div>

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

            {/* Payment Statistics */}
            <div className="report-section-grid">
              <div className="report-card">
                <h3>Payment Statistics</h3>

                <div className="payment-report-row">
                  <div>
                    <CheckCircle size={18} />
                    Successful Payments
                  </div>
                  <strong>{overview.successfulPayments || 0}</strong>
                </div>

                <div className="payment-report-row">
                  <div>
                    <XCircle size={18} />
                    Failed Payments
                  </div>
                  <strong>{overview.failedPayments || 0}</strong>
                </div>

                <div className="payment-report-row">
                  <div>
                    <CreditCard size={18} />
                    Total Transactions
                  </div>
                  <strong>{overview.totalPayments || 0}</strong>
                </div>
              </div>

              {/* Popular Plans */}
              <div className="report-card">
                <h3>Popular Plans</h3>

                {reports.popularPlans?.length === 0 ? (
                  <p className="report-empty">No paid plans yet.</p>
                ) : (
                  reports.popularPlans?.map((plan, index) => (
                    <div className="popular-plan-row" key={index}>
                      <div>
                        <strong>Plan #{index + 1}</strong>
                        <span>{plan.purchases} purchases</span>
                      </div>
                      <strong>
                        ₹{(plan.revenue || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="report-card">
              <h3>Monthly Revenue</h3>

              {reports.monthlyRevenue?.length === 0 ? (
                <div className="report-empty">No revenue data available.</div>
              ) : (
                <div className="monthly-revenue-list">
                  {reports.monthlyRevenue?.map((item, index) => (
                    <div className="monthly-revenue-row" key={index}>
                      <span>
                        {item._id.month}/{item._id.year}
                      </span>
                      <strong>
                        ₹{(item.revenue || 0).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReports;
