import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, UserCheck, UserX, Users } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();

    const interval = setInterval(fetchUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        "http://localhost:5000/api/sessions/admin/users-summary",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        setUsers([]);
      }

    } catch (error) {
      console.error("Users fetch error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const id = user.userId || user.guestId || "";
    const email = user.email || "";

    return `${id} ${email}`.toLowerCase().includes(search.toLowerCase());
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

        <div className="download-count">
          <Users size={18} />
          <strong>{users.length}</strong>
          <span>Total Users</span>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
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
            <p>Registered users will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User / Guest</th>
                  <th>Resume Name</th>
                  <th>Email</th>
                  <th>First Visit</th>
                  <th>Last Visit</th>
                  <th>Total Sessions</th>
                  <th>Resumes Created</th>
                  <th>Downloads</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item, index) => (
                  <tr key={item.userId || item.guestId || index}>
                    <td>
                      <strong style={{ cursor: "pointer", color: "#0284c7" }}>
                        {item.guestId || item.userId || "User"}
                      </strong>
                    </td>
                    <td>{item.resumeName || "-"}</td>
                    <td>{item.email || "-"}</td>
                    <td>
                      {item.firstVisit
                        ? new Date(item.firstVisit).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {item.lastVisit
                        ? new Date(item.lastVisit).toLocaleString()
                        : "-"}
                    </td>
                    <td>{item.totalSessions || 0}</td>
                    <td>{item.resumesCreated || 0}</td>
                    <td>{item.totalDownloads || 0}</td>
                    <td>
                      <span className="status-badge" style={{ background: "#f1f5f9", color: "#475569" }}>
                        {item.lastActivity || "-"}
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

export default AdminUsers;
