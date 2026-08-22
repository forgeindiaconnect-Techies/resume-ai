import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `${API_BASE_URL}/user-sessions`,
        { headers }
      );

      const data = await response.json();

      console.log("ACTIVITY DATA:", data);

      if (data.success) {
        setSessions(data.sessions || []);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
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
                onClick={fetchSessions}
                style={{
                  padding: "10px 16px",
                  background: "#0284c7",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Refresh Data
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
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Time Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((session) => {
                        const getTimeSpent = (session) => {
                          if (!session.entryTime) return "-";

                          const start = new Date(session.entryTime);
                          const end = session.exitTime
                            ? new Date(session.exitTime)
                            : new Date(session.lastActiveTime || Date.now());

                          const minutes = Math.max(
                            0,
                            Math.round((end - start) / 60000)
                          );

                          return session.exitTime
                            ? `${minutes} min`
                            : "Active";
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
                            : "Guest Visitor";
                        };

                        return (
                          <tr key={session._id}>
                            <td>
                              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                                {getDisplayName(session)}
                              </div>
                              {session.email && (
                                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                  {session.email}
                                </div>
                              )}
                            </td>
                            <td>
                              {session.entryTime
                                ? new Date(session.entryTime).toLocaleString()
                                : "-"}
                            </td>
                            <td>
                              {session.exitTime
                                ? new Date(session.exitTime).toLocaleString()
                                : "Active"}
                            </td>
                            <td>
                              {getTimeSpent(session)}
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
