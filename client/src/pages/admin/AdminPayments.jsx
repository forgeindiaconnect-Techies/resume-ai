import React, { useEffect, useState } from "react";
import { Search, CreditCard, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/payments`, { headers });
      const data = await response.json();

      console.log("PAYMENTS API:", data);

      if (data.success) {
        setPayments(data.payments || []);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Payments fetch error:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to remove all payment records?")) return;
    try {
      setClearing(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/payments/clear`, {
        method: "DELETE",
        headers
      });
      const data = await response.json();
      if (data.success) {
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to clear payments:", error);
    } finally {
      setClearing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getDisplayName = (item) => {
    if (
      item.resumeName &&
      item.resumeName.toLowerCase() !== "user" &&
      item.resumeName !== "Your Name" &&
      item.resumeName !== "guest_user" &&
      item.resumeName !== "Guest" &&
      item.resumeName !== "-" &&
      item.resumeName !== "My Resume"
    ) {
      return item.resumeName;
    }
    if (item.userId?.name) {
      return item.userId.name;
    }
    if (item.name) {
      return item.name;
    }
    if (item.resumeId?.title && item.resumeId.title !== "My Resume") {
      return item.resumeId.title;
    }
    const email = item.email || item.userId?.email;
    if (email) {
      const namePart = email.split("@")[0].replace(/[._0-9]/g, " ").trim();
      if (namePart && namePart.toLowerCase() !== "user" && namePart.toLowerCase() !== "guest") {
        return namePart
          .split(" ")
          .filter(Boolean)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      }
    }
    return "Customer";
  };

  const filteredPayments = payments.filter((payment) => {
    const displayName = getDisplayName(payment);
    const resumeName = payment.resumeName || "";
    const email = payment.email || payment.userId?.email || "";
    const planName = payment.plan || "";
    const status = payment.status || "";

    const searchText = `${displayName} ${resumeName} ${email} ${planName} ${status}`.toLowerCase();
    return searchText.includes(search.toLowerCase());
  });

  const getStatusIcon = (status) => {
    if (status === "paid") return <CheckCircle size={16} />;
    if (status === "created") return <Clock size={16} />;
    return <XCircle size={16} />;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2>Payments</h2>
                <p>Monitor all Razorpay payments and transactions.</p>
              </div>
              {payments.length > 0 && (
                <button
                  onClick={handleClearAll}
                  disabled={clearing}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "14px"
                  }}
                >
                  <Trash2 size={16} />
                  {clearing ? "Clearing..." : "Clear All Payments"}
                </button>
              )}
            </div>

            {/* Search */}
            <div className="admin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search user, email, plan or payment ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="admin-table-card">
              {loading ? (
                <div className="admin-table-message">Loading payments...</div>
              ) : filteredPayments.length === 0 ? (
                <div className="admin-table-message">
                  <CreditCard size={40} />
                  <h3>No payments found</h3>
                  <p>Payments will appear here after users make purchases.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer / Name</th>
                        <th>Email</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              {getDisplayName(item)}
                            </div>
                          </td>
                          <td>{item.email || item.userId?.email || "-"}</td>
                          <td>
                            {item.plan === "watermarked"
                              ? "With Watermark"
                              : "Without Watermark"}
                          </td>
                          <td>₹{item.amount || 0}</td>
                          <td>
                            <span className={`payment-status payment-${item.status}`}>
                              {getStatusIcon(item.status)}
                              {item.status === "paid" ? "Paid/Test" : item.status}
                            </span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: "#334155" }}>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                : "-"}
                            </span>
                          </td>
                          <td>
                            <span style={{ color: "#0284c7", fontWeight: 600 }}>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
                                : "-"}
                            </span>
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

export default AdminPayments;
