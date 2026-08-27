import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, RefreshCw } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers(true);
    const interval = setInterval(() => fetchUsers(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/user-sessions`, { headers });
      const data = await response.json();

      if (data.success) {
        setUsers(data.sessions || []);
      }
    } catch (error) {
      console.error("Users fetch error:", error);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  // Group sessions into unique user records
  const uniqueUserMap = new Map();

  users.forEach((item) => {
    const key = (item.email && item.email.toLowerCase()) || item.userId || item.guestId || item.sessionId;
    if (!key) return;

    const hasResume =
      item.resumeCreated === true ||
      (item.resumeName &&
        item.resumeName !== "Your Name" &&
        item.resumeName !== "Guest" &&
        item.resumeName.toLowerCase() !== "user") ||
      item.downloaded === true;
    const hasDownloaded = item.downloaded === true || (item.totalDownloads && item.totalDownloads > 0);

    const existing = uniqueUserMap.get(key);
    if (!existing) {
      uniqueUserMap.set(key, {
        ...item,
        resumeCreated: hasResume,
        downloaded: hasDownloaded,
        totalSessions: 1,
        latestActivity: item.lastActiveTime || item.entryTime || new Date()
      });
    } else {
      if (item.resumeName && (!existing.resumeName || existing.resumeName === "Customer" || existing.resumeName === "Guest Visitor")) {
        existing.resumeName = item.resumeName;
      }
      if (item.email && !existing.email) existing.email = item.email;
      if (hasResume) existing.resumeCreated = true;
      if (hasDownloaded) existing.downloaded = true;
      existing.totalSessions = (existing.totalSessions || 1) + 1;
      if (new Date(item.lastActiveTime || item.entryTime || 0) > new Date(existing.latestActivity || 0)) {
        existing.latestActivity = item.lastActiveTime || item.entryTime;
      }
    }
  });

  const uniqueUsersList = Array.from(uniqueUserMap.values());

  const filteredUsers = uniqueUsersList.filter((user) => {
    const id = user.userId || user.guestId || user.sessionId || "";
    const email = user.email || "";
    const resumeName = user.resumeName || "";

    return `${id} ${email} ${resumeName}`.toLowerCase().includes(search.toLowerCase());
  });

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
                <h2>Users</h2>
                <p>Manage your resume builder users.</p>
              </div>

              <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => fetchUsers(true)}
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
                  <RefreshCw size={14} /> Refresh
                </button>
                <div className="download-count">
                  <Users size={18} />
                  <strong>{uniqueUsersList.length}</strong>
                  <span>Total Users</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="admin-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or guest ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Users Table */}
            <div className="admin-table-card">
              {loading ? (
                <div className="admin-table-message">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="admin-table-message">
                  <Users size={40} />
                  <h3>No users found</h3>
                  <p>Registered users and visitor activities will appear here.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Resume Name</th>
                        <th>Email</th>
                        <th>Resume Created</th>
                        <th>Downloaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((item) => {
                        const hasResume =
                          item.resumeCreated === true ||
                          (item.resumeName &&
                            item.resumeName !== "Your Name" &&
                            item.resumeName !== "Guest" &&
                            item.resumeName.toLowerCase() !== "user") ||
                          item.downloaded === true;
                        const hasDownloaded = item.downloaded === true || item.totalDownloads > 0;

                        const getDisplayName = (u) => {
                          if (
                            u.resumeName &&
                            u.resumeName.toLowerCase() !== "user" &&
                            u.resumeName !== "Your Name" &&
                            u.resumeName !== "guest_user" &&
                            u.resumeName !== "Guest"
                          ) {
                            return u.resumeName;
                          }
                          if (u.email) {
                            const namePart = u.email.split("@")[0];
                            if (namePart && namePart.toLowerCase() !== "user" && namePart.toLowerCase() !== "guest") {
                              return namePart.charAt(0).toUpperCase() + namePart.slice(1);
                            }
                          }
                          return "Guest Visitor";
                        };

                        const getCleanUserId = (u) => {
                          const raw = String(u.guestId || u.sessionId || u._id || '');
                          const clean = raw.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
                          const tag = u.email ? 'USR' : 'GST';
                          const idSnippet = clean.slice(-6) || '000000';
                          return `${tag}-${idSnippet}`;
                        };

                        return (
                          <tr key={item._id || item.sessionId}>
                            <td>
                              <div style={{ fontWeight: 600, color: "#0f172a" }}>
                                {getDisplayName(item)}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, marginTop: "2px", letterSpacing: "0.03em" }}>
                                ID: <span style={{ color: "#0284c7" }}>{getCleanUserId(item)}</span>
                              </div>
                            </td>
                            <td>
                              {item.email ? (
                                <span style={{ color: "#0f172a", fontWeight: 500 }}>
                                  {item.email}
                                </span>
                              ) : (
                                <span style={{ color: "#94a3b8" }}>-</span>
                              )}
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  background: hasResume ? "#ecfdf5" : "#f1f5f9",
                                  color: hasResume ? "#059669" : "#64748b",
                                }}
                              >
                                {hasResume ? "Yes" : "No"}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "3px 8px",
                                  borderRadius: "12px",
                                  fontSize: "0.78rem",
                                  fontWeight: 700,
                                  background: hasDownloaded ? "#eff6ff" : "#f1f5f9",
                                  color: hasDownloaded ? "#2563eb" : "#64748b",
                                }}
                              >
                                {hasDownloaded ? "Yes" : "No"}
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

export default AdminUsers;
