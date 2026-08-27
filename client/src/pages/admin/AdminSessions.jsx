import React, { useState, useEffect } from "react";
import { 
  Activity, RefreshCw, Eye, Clock, CheckCircle2, 
  X, User, ArrowRight, Compass, Sparkles, FileText, 
  Download, Globe, Layers, MessageSquare, AlertCircle
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchSessions(true);
    // Poll every 5 seconds for real-time live visitor updates
    const interval = setInterval(() => {
      fetchSessions(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/user-sessions`, { headers });
      const data = await response.json();

      if (data.success) {
        setSessions(data.sessions || []);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  // Format time in 12-hour AM/PM format (e.g. "1:00 AM" or "4:25 PM")
  const formatTimeAMPM = (dateStr, includeSeconds = false) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      ...(includeSeconds ? { second: "2-digit" } : {}),
      hour12: true
    });
  };

  // Format Date (e.g. "Aug 27, 2026")
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

  // Check if session is currently active (inside now)
  const isSessionActive = (session) => {
    if (session.status === "exited" || session.exitTime) return false;
    const lastActive = new Date(session.lastActiveTime || session.entryTime || Date.now());
    // Considered active if activity was recorded within the last 2 minutes
    return Date.now() - lastActive.getTime() < 2 * 60 * 1000;
  };

  // Calculate formatted time spent (e.g. "4m 20s" or "Active Now")
  const getTimeSpent = (session) => {
    const active = isSessionActive(session);
    if (!session.entryTime) return "-";

    const start = new Date(session.entryTime);
    const end = (!active && session.exitTime)
      ? new Date(session.exitTime)
      : new Date(session.lastActiveTime || Date.now());

    let diffMs = Math.max(0, end.getTime() - start.getTime());

    // Clamp multi-day sessions to event duration
    if (session.events && session.events.length > 1) {
      const firstEv = new Date(session.events[0].timestamp || session.entryTime);
      const lastEv = new Date(session.events[session.events.length - 1].timestamp || end);
      const evDiff = lastEv.getTime() - firstEv.getTime();
      if (evDiff > 0 && evDiff < diffMs) {
        diffMs = evDiff;
      }
    }

    const totalSeconds = Math.round(diffMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (active) {
      return minutes > 0 ? `Inside (${minutes}m ${seconds}s)` : `Inside (< 1m)`;
    }

    if (minutes === 0) return `${Math.max(1, seconds)}s`;
    if (minutes >= 60) {
      const hrs = Math.floor(minutes / 60);
      const remMins = minutes % 60;
      return `${hrs}h ${remMins}m`;
    }
    return `${minutes}m ${seconds}s`;
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
      if (namePart && namePart.toLowerCase() !== "user" && namePart.toLowerCase() !== "guest") {
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
    }
    return s.guestId
      ? `Guest (${s.guestId.slice(-6)})`
      : s.sessionId
      ? `Guest (${s.sessionId.slice(-6)})`
      : "Guest Visitor";
  };

  const getLatestActionDisplay = (s) => {
    if (s.downloaded || s.downloadType === 'watermarked' || s.downloadType === 'no_watermark') {
      return '📥 Downloaded Resume';
    }
    if (s.events && Array.isArray(s.events) && s.events.length > 0) {
      const meaningful = [...s.events].reverse().find(e => 
        e.action && 
        e.action !== 'Session Started' && 
        e.action !== 'Landing Page Opened' &&
        !e.action.includes('HEARTBEAT')
      );
      if (meaningful) return meaningful.action;
    }
    if (s.resumeCreated) return '📝 Created Resume';
    if (s.currentPage === '/resume-checker') return '📊 ATS Resume Checker';
    if (s.currentPage === '/industry-examples') return '📄 Viewed Resume Examples';
    if (s.currentPage === '/builder') return '🛠️ In Resume Builder';
    return '🌐 Visited Landing Page';
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const active = isSessionActive(s);
    if (filter === "active") return active;
    if (filter === "completed") return !active;
    return true;
  });

  const activeCount = sessions.filter(isSessionActive).length;
  const completedCount = sessions.length - activeCount;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            
            {/* Title & Live Status */}
            <div
              className="admin-page-title"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <h2 style={{ margin: 0 }}>Real-Time User Activity Tracking</h2>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: activeCount > 0 ? "#dcfce7" : "#f1f5f9",
                    color: activeCount > 0 ? "#15803d" : "#64748b",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: 800
                  }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: activeCount > 0 ? "#16a34a" : "#94a3b8",
                      boxShadow: activeCount > 0 ? "0 0 8px #22c55e" : "none",
                      display: "inline-block"
                    }}></span>
                    {activeCount} Inside Now
                  </span>
                </div>
                <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.9rem" }}>
                  Live tracking from starting visit to ending exit with exact start-to-end timestamps.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>
                  Live sync: {formatTimeAMPM(lastUpdated, true)}
                </span>
                <button
                  onClick={() => fetchSessions(true)}
                  style={{
                    padding: "8px 14px",
                    background: "#0284c7",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.2)"
                  }}
                >
                  <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "1.25rem" }}>
              {[
                { id: "all", label: `All Visitors (${sessions.length})` },
                { id: "active", label: `🟢 Inside Now (${activeCount})` },
                { id: "completed", label: `⚪ Completed (${completedCount})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    border: filter === tab.id ? "1.5px solid #0284c7" : "1px solid #e2e8f0",
                    background: filter === tab.id ? "#e0f2fe" : "#ffffff",
                    color: filter === tab.id ? "#0284c7" : "#475569",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sessions Table */}
            <div className="admin-table-card">
              {loading ? (
                <div className="admin-table-message">
                  <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#0284c7", borderRadius: "50%", margin: "0 auto 10px", animation: "spin 0.8s linear infinite" }} />
                  Loading real-time user sessions...
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="admin-table-message">
                  <Activity size={40} style={{ marginBottom: "15px", color: "#9ca3af" }} />
                  <h3>No sessions match filter</h3>
                  <p>Visitor sessions will appear here as users enter the landing page.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Visitor / Name</th>
                        <th>Recent Action</th>
                        <th>Date</th>
                        <th>Starting Time</th>
                        <th>Ending Time</th>
                        <th>Time Spent</th>
                        <th style={{ textAlign: "center" }}>Start-to-End Track</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((session) => {
                        const active = isSessionActive(session);
                        const eventCount = (session.events && Array.isArray(session.events)) ? session.events.length : 1;

                        return (
                          <tr 
                            key={session._id || session.sessionId}
                            style={{ background: active ? "rgba(240, 253, 244, 0.4)" : "transparent" }}
                          >
                            {/* Live Status */}
                            <td>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  padding: "4px 10px",
                                  borderRadius: "20px",
                                  fontSize: "0.75rem",
                                  fontWeight: 800,
                                  background: active ? "#dcfce7" : "#f1f5f9",
                                  color: active ? "#15803d" : "#475569",
                                  border: active ? "1px solid #bbf7d0" : "1px solid #e2e8f0"
                                }}
                              >
                                <span style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  background: active ? "#16a34a" : "#94a3b8",
                                  boxShadow: active ? "0 0 8px #22c55e" : "none"
                                }}></span>
                                {active ? "Inside Now" : "Completed"}
                              </span>
                            </td>

                            {/* User Info */}
                            <td>
                              <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                {getDisplayName(session)}
                              </div>
                              {session.email ? (
                                <div style={{ fontSize: "0.75rem", color: "#0284c7", fontWeight: 600 }}>
                                  {session.email}
                                </div>
                              ) : (
                                <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                                  {session.sessionId ? `ID: ${session.sessionId.slice(0, 16)}...` : "Anonymous"}
                                </div>
                              )}
                            </td>

                            {/* Recent Action */}
                            <td>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "3px 9px",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  background: session.downloaded ? "#ecfdf5" : session.resumeCreated ? "#eff6ff" : "#f8fafc",
                                  color: session.downloaded ? "#059669" : session.resumeCreated ? "#1d4ed8" : "#334155",
                                  border: "1px solid " + (session.downloaded ? "#bbf7d0" : session.resumeCreated ? "#bfdbfe" : "#e2e8f0")
                                }}
                              >
                                {getLatestActionDisplay(session)}
                              </span>
                            </td>

                            {/* Date */}
                            <td>
                              <span style={{ fontWeight: 600, color: "#334155" }}>
                                {formatDate(session.entryTime || session.createdAt)}
                              </span>
                            </td>

                            {/* Starting Time (1:00 AM / PM format) */}
                            <td>
                              <span style={{ color: "#0284c7", fontWeight: 700, fontSize: "0.88rem" }}>
                                {formatTimeAMPM(session.entryTime)}
                              </span>
                            </td>

                            {/* Ending Time (1:00 AM / PM format or Inside) */}
                            <td>
                              {active ? (
                                <span style={{ color: "#16a34a", fontWeight: 800, fontSize: "0.82rem" }}>
                                  🟢 Inside (Live)
                                </span>
                              ) : session.exitTime ? (
                                <span style={{ color: "#475569", fontWeight: 700, fontSize: "0.88rem" }}>
                                  {formatTimeAMPM(session.exitTime)}
                                </span>
                              ) : session.lastActiveTime ? (
                                <span style={{ color: "#64748b", fontWeight: 600, fontSize: "0.85rem" }}>
                                  {formatTimeAMPM(session.lastActiveTime)}
                                </span>
                              ) : "-"}
                            </td>

                            {/* Total Time Spent */}
                            <td>
                              <span
                                style={{
                                  padding: "3px 9px",
                                  borderRadius: "12px",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  background: active ? "#ecfdf5" : "#f1f5f9",
                                  color: active ? "#059669" : "#475569",
                                }}
                              >
                                {getTimeSpent(session)}
                              </span>
                            </td>

                            {/* View Full Timeline Button */}
                            <td style={{ textAlign: "center" }}>
                              <button
                                onClick={() => setSelectedSession(session)}
                                style={{
                                  padding: "5px 12px",
                                  background: "#ffffff",
                                  border: "1.5px solid #0284c7",
                                  color: "#0284c7",
                                  borderRadius: "6px",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  boxShadow: "0 1px 3px rgba(2, 132, 199, 0.1)"
                                }}
                              >
                                <Eye size={13} /> View Trail ({eventCount})
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* START-TO-END JOURNEY AUDIT MODAL */}
            {selectedSession && (
              <div style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.65)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 99999,
                padding: "1rem"
              }}>
                <div style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  maxWidth: "680px",
                  width: "100%",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
                  overflow: "hidden"
                }}>
                  
                  {/* Modal Header */}
                  <div style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "linear-gradient(135deg, #0f172a, #1e293b)",
                    color: "white"
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "white" }}>
                          User Start-to-End Activity Trail
                        </h3>
                        <span style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: "12px",
                          background: isSessionActive(selectedSession) ? "#22c55e" : "rgba(255,255,255,0.2)",
                          color: "white"
                        }}>
                          {isSessionActive(selectedSession) ? "🟢 Inside Now (Active)" : "⚪ Completed"}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>
                        {getDisplayName(selectedSession)} {selectedSession.email ? `• ${selectedSession.email}` : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedSession(null)}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "none",
                        color: "white",
                        padding: "6px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Modal Session Summary Bar */}
                  <div style={{
                    padding: "1rem 1.5rem",
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1rem",
                    textAlign: "center"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Starting Time
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0284c7", marginTop: "2px" }}>
                        {formatTimeAMPM(selectedSession.entryTime, true)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Ending Time
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: isSessionActive(selectedSession) ? "#16a34a" : "#0f172a", marginTop: "2px" }}>
                        {isSessionActive(selectedSession) ? "🟢 Inside (Live)" : formatTimeAMPM(selectedSession.exitTime || selectedSession.lastActiveTime, true)}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                        Total Time Spent
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a", marginTop: "2px" }}>
                        {getTimeSpent(selectedSession)}
                      </div>
                    </div>
                  </div>

                  {/* Modal Step-by-Step Chronological Timeline */}
                  <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>
                      Chronological Action Trail (Start ➔ End)
                    </div>

                    {(!selectedSession.events || selectedSession.events.length === 0) ? (
                      <div style={{ padding: "1.5rem", textAlign: "center", color: "#64748b" }}>
                        No granular step events recorded for this session.
                      </div>
                    ) : (
                      <div style={{ position: "relative", paddingLeft: "1.5rem", borderLeft: "2px solid #e2e8f0", marginLeft: "0.5rem" }}>
                        {selectedSession.events
                          .filter(e => !e.action?.includes("HEARTBEAT"))
                          .map((event, idx) => (
                            <div key={idx} style={{ marginBottom: "1.25rem", position: "relative" }}>
                              {/* Step circle indicator */}
                              <div style={{
                                position: "absolute",
                                left: "-1.95rem",
                                top: "2px",
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: idx === 0 ? "#0284c7" : idx === selectedSession.events.length - 1 ? (isSessionActive(selectedSession) ? "#22c55e" : "#64748b") : "#38bdf8",
                                border: "3px solid #ffffff",
                                boxShadow: "0 0 0 2px #e2e8f0"
                              }} />

                              {/* Step content */}
                              <div style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "0.75rem 1rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "0.5rem"
                              }}>
                                <div>
                                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a" }}>
                                    {event.action}
                                  </div>
                                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500, marginTop: "2px" }}>
                                    Page: <span style={{ color: "#0284c7", fontWeight: 700 }}>{event.page || "/"}</span>
                                  </div>
                                </div>

                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                  <span style={{
                                    display: "inline-block",
                                    fontSize: "0.78rem",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                    background: "#ffffff",
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #cbd5e1"
                                  }}>
                                    {formatTimeAMPM(event.timestamp, true)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => setSelectedSession(null)}
                      style={{
                        padding: "8px 18px",
                        background: "#0f172a",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      Close Trail
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

export default AdminSessions;
