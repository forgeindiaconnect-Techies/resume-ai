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
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `${API_BASE_URL}/user-sessions`,
        { headers }
      );

      const data = await response.json();

      console.log("USERS DATA:", data);

      if (data.success) {
        setUsers(data.sessions || []);
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

                  const displayName =
                    item.resumeName &&
                    item.resumeName.toLowerCase() !== "user" &&
                    item.resumeName !== "Your Name" &&
                    item.resumeName !== "guest_user"
                      ? item.resumeName
                      : item.email
                      ? item.email.split("@")[0].charAt(0).toUpperCase() + item.email.split("@")[0].slice(1)
                      : item.guestId
                      ? `Guest (${item.guestId.slice(-6)})`
                      : "Guest Visitor";

                  return (
                    <tr key={item._id}>
                      <td>{displayName}</td>
                      <td>{item.email || "-"}</td>
                      <td>{hasResume ? "Yes" : "No"}</td>
                      <td>{hasDownloaded ? "Yes" : "No"}</td>
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
