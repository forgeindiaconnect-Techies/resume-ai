import React from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Palette,
  FileText,
  Wallet,
  Download,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Payments",
      icon: CreditCard,
      path: "/admin/payments",
    },

    {
      name: "Plans",
      icon: Wallet,
      path: "/admin/plans",
    },
    {
      name: "Downloads",
      icon: Download,
      path: "/admin/downloads",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Logo */}
      <div className="admin-logo">
        <div className="admin-logo-mark">F</div>

        <div>
          <h2>FORGE INDIA</h2>
          <span>Connect</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="admin-menu">
        <p className="admin-menu-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`admin-menu-item ${
                location.pathname.startsWith(item.path) ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="admin-sidebar-bottom">
        <button className="admin-menu-item logout">
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
