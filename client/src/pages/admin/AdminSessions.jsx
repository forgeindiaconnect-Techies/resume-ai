import React, { useState, useEffect } from "react";
import { Activity, RefreshCw } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions(true);
    const interval = setInterval(() => fetchSessions(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/user-sessions`, { headers });
      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div
              className="admin-page-title"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <div>
                <h2>User Activity Tracking</h2>
                <p>Track visitor sessions from landing page to download.</p>
              </div>
              <button
                onClick={() => fetchSessions(true)}
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
                <RefreshCw size={14} /> Refresh Data
              </button>
            </div>

            <div className="admin-table-card">
              {loading ? (
                <div className="admin-table-message">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="admin-table-message">
                  <Activity size={40} style={{ marginBottom: "15px", color: "#9ca3af" }} />
                  <h3>No user activity found</h3>
                  <p>Visitor sessions will appear here.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Resume Name / Guest</th>
                        <th>Date</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Time Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => {
                        const isSessionActive = () => {
                          if (session.status === "exited" || session.exitTime) return false;
                          const lastActive = new Date(session.lastActiveTime || session.entryTime || Date.now());
                          return Date.now() - lastActive.getTime() < 5 * 60 * 1000;
                        };

                        const active = isSessionActive();

                        const formatDate = (dateStr) => {
                          if (!dateStr) return "-";
                          const d = new Date(dateStr);
                          if (isNaN(d.getTime())) return "-";
                          return d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          });
                        };

                        const formatTime = (dateStr) => {
                          if (!dateStr) return "-";
                          const d = new Date(dateStr);
                          if (isNaN(d.getTime())) return "-";
                          return d.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true
                          });
                        };

                        const getTimeSpent = () => {
                          if (!session.entryTime) return "-";
                          const start = new Date(session.entryTime);
                          const end = session.exitTime
                            ? new Date(session.exitTime)
                            : new Date(session.lastActiveTime || Date.now());

                          const minutes = Math.max(
                            0,
                            Math.round((end - start) / 60000)
                          );

                          if (active) return "Active";
                          if (minutes === 0) return "< 1 min";
                          return `${minutes} min`;
                        };

                        const getDisplayName = (s) => {
                          if (
                            s.resumeName &&
                            s.resumeName.toLowerCase() !== "user" &&
                            s.resumeName !== "Your Name" &&
                            s.resumeName !== "guest_user"
                          ) {
                            return s.resumeName;
                          }
                          if (s.email) {
                            const namePart = s.email.split("@")[0];
                            if (
                              namePart &&
                              namePart.toLowerCase() !== "user" &&
                              namePart.toLowerCase() !== "guest"
                            ) {
                              return namePart.charAt(0).toUpperCase() + namePart.slice(1);
                            }
                          }
                          return s.guestId
                            ? `Guest (${s.guestId.slice(-6)})`
                            : s.sessionId
                            ? `Guest (${s.sessionId.slice(-6)})`
                            : "Guest Visitor";
                        };

                        const getExitTimeDisplay = () => {
                          if (session.exitTime) {
                            return (
                              <span style={{ color: "#475569", fontWeight: 600 }}>
                                {formatTime(session.exitTime)}
                              </span>
                            );
                          }
                          if (active) {
                            return (
                              <span style={{ color: "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
                                Active
                              </span>
                            );
                          }
                          return session.lastActiveTime ? (
                            <span style={{ color: "#64748b", fontWeight: 500 }}>
                              {formatTime(session.lastActiveTime)}
                            </span>
                          ) : "-";
                        };

                        return (
                          <tr key={session._id || session.sessionId}>
                            <td>
                              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                                {getDisplayName(session)}
                              </div>
                              {session.email && (
                                <div style={{ fontSize: "0.75rem", color: "#0284c7", fontWeight: 500 }}>
                                  {session.email}
                                </div>
                              )}
                            </td>
                            <td>
                              <span style={{ fontWeight: 600, color: "#334155" }}>
                                {formatDate(session.entryTime || session.createdAt)}
                              </span>
                            </td>
                            <td>
                              <span style={{ color: "#0284c7", fontWeight: 600 }}>
                                {formatTime(session.entryTime)}
                              </span>
                            </td>
                            <td>
                              {getExitTimeDisplay()}
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  background: active ? "#ecfdf5" : "#f1f5f9",
                                  color: active ? "#059669" : "#475569",
                                }}
                              >
                                {getTimeSpent()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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

export default AdminSessions;
