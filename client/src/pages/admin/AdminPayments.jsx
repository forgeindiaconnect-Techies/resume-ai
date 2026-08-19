import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/payments/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPayments(response.data.payments || []);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const userName = payment.userId?.name || "";
    const email = payment.userId?.email || "";
    const planName = payment.planId?.name || "";
    const paymentId = payment.razorpayPaymentId || "";

    const searchText = `${userName} ${email} ${planName} ${paymentId}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const getStatusIcon = (status) => {
    if (status === "paid") {
      return <CheckCircle size={16} />;
    }
    if (status === "created") {
      return <Clock size={16} />;
    }
    return <XCircle size={16} />;
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
      <div className="admin-page-title">
        <div>
          <h2>Payments</h2>
          <p>Monitor all Razorpay payments and transactions.</p>
        </div>
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
          <div className="admin-table-message">
            Loading payments...
          </div>
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
                  <th>User Email</th>
                  <th>Resume</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Download Type</th>
                  <th>Downloaded</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id}>
                    <td>
                      <div className="payment-user">
                        <span>
                          {payment.userId?.email || payment.email || "-"}
                        </span>
                      </div>
                    </td>
                    <td>
                      {payment.resumeId?.title || "My Resume"}
                    </td>
                    <td>
                      {payment.plan === 'no_watermark' ? 'No Watermark' : 'Watermarked'}
                    </td>
                    <td>
                      ₹{payment.amount || 0}
                    </td>
                    <td>
                      <span className={`payment-status payment-${payment.status}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status === 'paid' ? 'Paid' : payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.watermarkRemoval ? "Without Watermark" : "With Watermark"}
                    </td>
                    <td>
                      {payment.downloadUsed ? "Yes" : "No"}
                    </td>
                    <td>
                      {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
