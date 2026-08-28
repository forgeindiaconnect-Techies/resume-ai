import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editWatermarkRemoval, setEditWatermarkRemoval] = useState(false);
  const [editStatus, setEditStatus] = useState(true);
  const [editKey, setEditKey] = useState("");

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

  const handleSyncOfficialPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${API_BASE_URL}/download-plans/sync-official-plans`, {
        method: "POST",
        headers
      });
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans || []);
        alert("✅ Official pricing updated: With Watermark (FREE) and Without Watermark (₹199)");
      }
    } catch (e) {
      console.error(e);
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
    plans.find(plan => plan.key === "watermarked" || plan.key === "free_watermark" || !plan.watermarkRemoval)?.downloadCount || 0;

  const noWatermarkDownloads =
    plans.find(plan => plan.key === "no_watermark" || plan.watermarkRemoval)?.downloadCount || 0;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2>Plans</h2>
                <p>Manage your Resume Builder subscription plans.</p>
              </div>
              <button
                onClick={handleSyncOfficialPlans}
                style={{
                  background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                  color: "white",
                  border: "none",
                  padding: "0.6rem 1.25rem",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 10px rgba(2, 132, 199, 0.25)"
                }}
              >
                ⚡ Set Official Pricing (FREE & ₹199)
              </button>
            </div>

            <div className="admin-stats-grid" style={{ marginBottom: "24px" }}>
              <div style={{ background: "white", padding: "18px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Total Revenue</h4>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#0f172a" }}>₹{totalRevenue}</h2>
              </div>

              <div style={{ background: "white", padding: "18px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Total Downloads</h4>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#0f172a" }}>{totalDownloads}</h2>
              </div>

              <div style={{ background: "white", padding: "18px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>With Watermark</h4>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#0ea5e9" }}>{watermarkDownloads}</h2>
              </div>

              <div style={{ background: "white", padding: "18px 20px", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h4 style={{ margin: "0 0 8px 0", color: "#64748b", fontSize: "13px", fontWeight: "600" }}>Without Watermark</h4>
                <h2 style={{ margin: 0, fontSize: "24px", color: "#0ea5e9" }}>{noWatermarkDownloads}</h2>
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
              <div className="admin-table-container admin-table-card" style={{ width: "100%", overflowX: "auto" }}>
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
                        <td><strong>{plan.name}</strong></td>
                        <td>
                          {Number(plan.price) === 0 ? (
                            <span style={{ color: "#16a34a", fontWeight: 700 }}>₹0 or FREE</span>
                          ) : (
                            `₹${plan.price}`
                          )}
                        </td>
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
                              setEditName(plan.name || "");
                              setEditPrice(plan.price !== undefined ? plan.price : 0);
                              setEditWatermarkRemoval(Boolean(plan.watermarkRemoval));
                              setEditStatus(plan.isActive ?? true);
                              setEditKey(plan.key || "");
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

            {/* EDIT PLAN MODAL */}
            {editingPlan && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                padding: "20px"
              }}>
                <div style={{
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  width: "100%",
                  maxWidth: "520px",
                  padding: "24px",
                  boxSizing: "border-box"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
                      Edit Plan: {editingPlan.name}
                    </h3>
                    <button
                      onClick={() => setEditingPlan(null)}
                      style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748b" }}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Plan Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Price (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Status</label>
                        <select
                          value={editStatus ? "active" : "inactive"}
                          onChange={(e) => setEditStatus(e.target.value === "active")}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Download Type</label>
                      <select
                        value={editWatermarkRemoval ? "no_watermark" : "watermarked"}
                        onChange={(e) => setEditWatermarkRemoval(e.target.value === "no_watermark")}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }}
                      >
                        <option value="watermarked">With Watermark</option>
                        <option value="no_watermark">Without Watermark</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "600", color: "#334155" }}>Plan Code (Key)</label>
                      <input
                        type="text"
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                        placeholder="e.g. free_watermark or no_watermark"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", boxSizing: "border-box", fontSize: "14px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <button
                      style={{ padding: "10px 18px", border: "1px solid #cbd5e1", borderRadius: "8px", background: "white", cursor: "pointer", fontWeight: "600", color: "#475569" }}
                      onClick={() => setEditingPlan(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="admin-primary-button"
                      style={{ background: "#0ea5e9", color: "white", padding: "10px 22px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
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
                                name: editName,
                                price: Number(editPrice),
                                watermarkRemoval: editWatermarkRemoval,
                                isActive: editStatus,
                                key: editKey || editingPlan.key
                              }),
                            }
                          );

                          const data = await response.json();

                          if (data.success) {
                            alert("Plan updated successfully!");
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
                      Save or Update Plan
                    </button>
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

export default AdminPlans;
