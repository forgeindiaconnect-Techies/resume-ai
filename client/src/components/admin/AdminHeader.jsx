import React from "react";
import { Search, Bell, UserCircle } from "lucide-react";

const AdminHeader = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="admin-header">
      <div>
        <h1 style={{ fontSize: "18px", margin: 0, color: "#111827" }}>Welcome back, Administrator!</h1>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>{today}</p>
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
