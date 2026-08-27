import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, User, CreditCard, Download, FileText } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="admin-page">Loading user details...</div>;
  }

  if (!data?.user) {
    return <div className="admin-page">User not found.</div>;
  }

  const { user, subscription, payments, downloads, resumeCount } = data;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
      {/* Back */}
      <button className="admin-back-button" onClick={() => navigate("/admin/users")}>
        <ArrowLeft size={17} />
        Back to Users
      </button>

      {/* Profile */}
      <div className="user-details-header">
        <div className="user-profile-icon">
          <User size={28} />
        </div>

        <div>
          <h2>{user.name || "Unknown User"}</h2>
          <p>{user.email}</p>
        </div>

        <span
          className={
            user.isActive ? "user-active-status" : "user-blocked-status"
          }
        >
          {user.isActive ? "Active" : "Blocked"}
        </span>
      </div>

      {/* Statistics */}
      <div className="report-stats-grid">
        <div className="report-stat-card">
          <div className="report-stat-icon">
            <FileText size={20} />
          </div>
          <div>
            <span>Resumes</span>
            <strong>{resumeCount || 0}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <CreditCard size={20} />
          </div>
          <div>
            <span>Payments</span>
            <strong>{payments?.length || 0}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <Download size={20} />
          </div>
          <div>
            <span>Downloads</span>
            <strong>{downloads?.length || 0}</strong>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-icon">
            <User size={20} />
          </div>
          <div>
            <span>Joined</span>
            <strong>
              {new Date(user.createdAt).toLocaleDateString("en-IN")}
            </strong>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="report-card">
        <h3>Current Subscription</h3>

        {subscription ? (
          <div className="subscription-details">
            <div>
              <span>Plan</span>
              <strong>{subscription.planId?.name || "Unknown Plan"}</strong>
            </div>

            <div>
              <span>Price</span>
              <strong>₹{subscription.planId?.price || 0}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{subscription.status}</strong>
            </div>

            <div>
              <span>Start Date</span>
              <strong>
                {subscription.startDate
                  ? new Date(subscription.startDate).toLocaleDateString("en-IN")
                  : "-"}
              </strong>
            </div>

            <div>
              <span>End Date</span>
              <strong>
                {subscription.endDate
                  ? new Date(subscription.endDate).toLocaleDateString("en-IN")
                  : "-"}
              </strong>
            </div>
          </div>
        ) : (
          <p className="report-empty">No subscription found.</p>
        )}
      </div>

      {/* Payments */}
      <div className="report-card">
        <h3>Payment History</h3>

        {payments?.length === 0 ? (
          <p className="report-empty">No payments found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.planId?.name || "-"}</td>
                    <td>
                      ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className="payment-id">
                        {payment.razorpayPaymentId ||
                          payment.razorpayOrderId ||
                          "-"}
                      </span>
                    </td>
                    <td>{payment.status}</td>
                    <td>
                      {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Downloads */}
      <div className="report-card">
        <h3>Download History</h3>

        {downloads?.length === 0 ? (
          <p className="report-empty">No downloads found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Resume</th>
                  <th>Downloaded At</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((download) => (
                  <tr key={download._id}>
                    <td>{download.resumeId?.title || "Resume"}</td>
                    <td>
                      {download.downloadedAt ? new Date(download.downloadedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                      }) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUserDetails;
