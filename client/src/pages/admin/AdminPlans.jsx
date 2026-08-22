import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStatus, setEditStatus] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `${API_BASE_URL}/download-plans`,
        { headers }
      );

      const data = await response.json();

      console.log("PLANS API:", data);

      if (data.success) {
        setPlans(data.plans || []);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const totalRevenue = plans.reduce(
    (sum, plan) => sum + Number(plan.revenue || 0),
    0
  );

  const totalDownloads = plans.reduce(
    (sum, plan) => sum + Number(plan.downloadCount || 0),
    0
  );

  const watermarkDownloads =
    plans.find(plan => plan.key === "watermarked")?.downloadCount || 0;

  const noWatermarkDownloads =
    plans.find(plan => plan.key === "no_watermark")?.downloadCount || 0;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title">
              <div>
                <h2>Plans</h2>
                <p>Manage your Resume Builder subscription plans.</p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: "24px"
              }}
            >
              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Total Revenue</h4>
                <h2 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>₹{totalRevenue}</h2>
              </div>

              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Total Downloads</h4>
                <h2 style={{ margin: 0, fontSize: "28px", color: "#0f172a" }}>{totalDownloads}</h2>
              </div>

              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "14px", fontWeight: "600" }}>With Watermark</h4>
                <h2 style={{ margin: 0, fontSize: "28px", color: "#0ea5e9" }}>{watermarkDownloads}</h2>
              </div>

              <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "14px", fontWeight: "600" }}>Without Watermark</h4>
                <h2 style={{ margin: 0, fontSize: "28px", color: "#0ea5e9" }}>{noWatermarkDownloads}</h2>
              </div>
            </div>

            {loading ? (
              <div className="admin-table-message">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="admin-empty-template">
                <h3>No plans available</h3>
                <p>Create your first subscription plan.</p>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      <th>Price</th>
                      <th>Download Type</th>
                      <th>Status</th>
                      <th>Downloads</th>
                      <th>Revenue</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan._id}>
                        <td>{plan.name}</td>
                        <td>₹{plan.price}</td>
                        <td>
                          {plan.watermarkRemoval
                            ? "Without Watermark"
                            : "With Watermark"}
                        </td>
                        <td>
                          <span className={plan.isActive ? "status-badge active" : "status-badge inactive"}>
                            {plan.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>{plan.downloadCount || 0}</td>
                        <td>₹{plan.revenue || 0}</td>
                        <td>
                          <button 
                            className="admin-action-btn"
                            onClick={() => {
                              setEditingPlan(plan);
                              setEditPrice(plan.price);
                              setEditStatus(plan.isActive);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {editingPlan && (
              <div style={{ marginTop: "20px", padding: "20px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Edit Plan: {editingPlan.name}</h3>
                
                <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Price (₹)</label>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "100px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Status</label>
                    <select
                      value={editStatus ? "active" : "inactive"}
                      onChange={(e) => setEditStatus(e.target.value === "active")}
                      style={{ padding: "8px", borderRadius: "6px", border: "1px solid #cbd5e1", width: "120px" }}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="admin-primary-button"
                    style={{ background: "#0ea5e9", color: "white", padding: "8px 16px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("adminToken");
                        const response = await fetch(
                          `${API_BASE_URL}/download-plans/${editingPlan._id}`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              ...(token ? { Authorization: `Bearer ${token}` } : {})
                            },
                            body: JSON.stringify({
                              price: Number(editPrice),
                              isActive: editStatus,
                            }),
                          }
                        );

                        const data = await response.json();

                        if (data.success) {
                          alert("Plan updated successfully");
                          setEditingPlan(null);
                          fetchPlans();
                        } else {
                          alert(data.message || "Failed to update plan");
                        }
                      } catch (error) {
                        console.error(error);
                        alert("Failed to update plan");
                      }
                    }}
                  >
                    Save Changes
                  </button>
                  <button
                    style={{ padding: "8px 16px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => setEditingPlan(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPlans;
