import React from "react";
import { Search, Bell, UserCircle } from "lucide-react";

const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Manage your Resume Builder platform</p>
      </div>

      <div className="admin-header-right">
        <div className="admin-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button className="admin-notification">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">
          <UserCircle size={36} />
          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
