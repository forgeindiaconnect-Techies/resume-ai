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
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.patch(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user.name || "";
    const email = user.email || "";

    return `${name} ${email}`.toLowerCase().includes(search.toLowerCase());
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
                  <th>User</th>
                  <th>Plan</th>
                  <th>Subscription</th>
                  <th>Payments</th>
                  <th>Downloads</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const subscription = user.subscription;
                  const isActive = user.isActive !== false;

                  return (
                    <tr key={user._id}>
                      {/* User */}
                      <td>
                        <div className="payment-user">
                          <strong
                            className="clickable-user"
                            onClick={() => navigate(`/admin/users/${user._id}`)}
                          >
                            {user.name || "Unknown User"}
                          </strong>
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Plan */}
                      <td>{subscription?.planId?.name || "Free"}</td>

                      {/* Subscription */}
                      <td>
                        {subscription ? (
                          <span className="user-active-status">Active</span>
                        ) : (
                          <span className="user-free-status">No Active Plan</span>
                        )}
                      </td>

                      {/* Payments */}
                      <td>{user.paymentCount || 0}</td>

                      {/* Downloads */}
                      <td>{user.downloadCount || 0}</td>

                      {/* Status */}
                      <td>
                        {isActive ? (
                          <span className="user-active-status">Active</span>
                        ) : (
                          <span className="user-blocked-status">Blocked</span>
                        )}
                      </td>

                      {/* Action */}
                      <td>
                        <button
                          className="user-status-button"
                          onClick={() => toggleUserStatus(user._id)}
                        >
                          {isActive ? (
                            <>
                              <UserX size={15} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck size={15} />
                              Activate
                            </>
                          )}
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
    </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
