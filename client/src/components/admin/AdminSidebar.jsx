import React, { useState, useEffect } from "react";
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
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import ForgeLogo from "../common/ForgeLogo";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleClose = () => setIsOpen(false);

    window.addEventListener('toggle-admin-sidebar', handleToggle);
    window.addEventListener('close-admin-sidebar', handleClose);
    return () => {
      window.removeEventListener('toggle-admin-sidebar', handleToggle);
      window.removeEventListener('close-admin-sidebar', handleClose);
    };
  }, []);

  // Automatically close mobile sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
      name: "Activity",
      icon: FileText,
      path: "/admin/activity",
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="admin-sidebar-overlay no-print"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo and Mobile Close Button */}
        <div className="admin-logo" style={{ padding: "8px 8px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <ForgeLogo variant="light" size={38} />
          <button 
            className="admin-sidebar-close-btn no-print"
            onClick={() => setIsOpen(false)}
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
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
          <button className="admin-menu-item logout" onClick={handleLogout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
