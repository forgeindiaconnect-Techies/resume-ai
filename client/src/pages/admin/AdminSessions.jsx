import React, { useState, useEffect } from "react";
import { Activity, Clock, LogOut, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/sessions/admin/all`);
      if (res.data.success) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start, end) => {
    if (!start) return "0 min";
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const diffMins = Math.round((endTime - startTime) / 60000);
    return `${diffMins} min`;
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayName = (session) => {
    if (session.email) return session.email;
    if (session.userId) return "Registered User";
    return session.guestId || "Guest User";
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            <div className="admin-page-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  fontWeight: "500"
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
                  <th>User/Guest</th>
                  <th>Entered</th>
                  <th>Last Active</th>
                  <th>Time Spent</th>
                  <th>Resume</th>
                  <th>Download</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <React.Fragment key={session._id}>
                    <tr>
                      <td>
                      <strong>{getDisplayName(session)}</strong>
                      <br />
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>
                        {session.sessionId.substring(0, 16)}...
                      </span>
                    </td>
                    <td>{formatTime(session.entryTime)}</td>
                    <td>{formatTime(session.lastActiveTime)}</td>
                    <td>{calculateDuration(session.entryTime, session.lastActiveTime)}</td>
                    <td>
                      {session.resumeCreated ? (
                        <span style={{ color: "#10b981", display: "flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={14} /> Created
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>Not Created</span>
                      )}
                    </td>
                    <td>
                      {session.downloaded ? (
                        <span style={{ color: "#3b82f6" }}>
                          {session.downloadType === "watermarked" ? "With Watermark" : "Without Watermark"}
                        </span>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>No Download</span>
                      )}
                    </td>
                    <td>
                      {session.status === "active" ? (
                        <span className="status-badge status-active">
                          <Activity size={12} /> Active
                        </span>
                      ) : (
                        <span className="status-badge" style={{ background: "#f3f4f6", color: "#4b5563" }}>
                          <LogOut size={12} /> Exited
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        style={{ 
                          padding: "6px 12px", 
                          fontSize: "12px",
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "4px",
                          cursor: "pointer",
                          color: "#475569"
                        }}
                        onClick={() => setExpandedSession(expandedSession === session._id ? null : session._id)}
                      >
                        {expandedSession === session._id ? "Hide Journey" : "View Journey"}
                      </button>
                    </td>
                  </tr>
                  {expandedSession === session._id && (
                    <tr style={{ background: "#f9fafb" }}>
                      <td colSpan="8" style={{ padding: "20px" }}>
                        <div style={{ marginLeft: "20px", borderLeft: "2px solid #e5e7eb", paddingLeft: "15px" }}>
                          <h4 style={{ margin: "0 0 15px 0", color: "#374151" }}>User Journey Timeline</h4>
                          {session.events?.map((evt, idx) => (
                            <div key={idx} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ color: "#6b7280", fontSize: "12px", minWidth: "70px" }}>
                                {formatTime(evt.timestamp)}
                              </span>
                              <div style={{ width: "8px", height: "8px", background: "#3b82f6", borderRadius: "50%", marginLeft: "-21px", border: "2px solid #fff" }}></div>
                              <span style={{ fontWeight: "500", color: "#111827", fontSize: "13px" }}>
                                {evt.action}
                              </span>
                              <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                                ({evt.page})
                              </span>
                            </div>
                          ))}
                          {(!session.events || session.events.length === 0) && (
                            <p style={{ fontSize: "13px", color: "#6b7280" }}>No events recorded for this session.</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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

export default AdminSessions;
