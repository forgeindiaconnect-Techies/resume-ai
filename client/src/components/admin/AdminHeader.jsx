import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  UserCircle, 
  X, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Wallet, 
  Download, 
  BarChart3, 
  Settings, 
  Palette, 
  FileText, 
  Activity 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ADMIN_SEARCH_ROUTES = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, keywords: ["home", "overview", "analytics", "stats", "revenue"] },
  { name: "Users", path: "/admin/users", icon: Users, keywords: ["customers", "profiles", "accounts", "emails"] },
  { name: "Activity", path: "/admin/activity", icon: Activity, keywords: ["sessions", "live", "tracking", "logs", "visitors"] },
  { name: "Payments", path: "/admin/payments", icon: CreditCard, keywords: ["transactions", "orders", "razorpay", "money", "revenue"] },
  { name: "Plans", path: "/admin/plans", icon: Wallet, keywords: ["pricing", "subscription", "download plans", "packages"] },
  { name: "Downloads", path: "/admin/downloads", icon: Download, keywords: ["pdf", "watermark", "files", "exported"] },
  { name: "Reports", path: "/admin/reports", icon: BarChart3, keywords: ["charts", "analytics", "financials", "conversion"] },
  { name: "Templates", path: "/admin/templates", icon: Palette, keywords: ["resume layouts", "designs", "editor templates"] },
  { name: "Resume Examples", path: "/admin/resume-examples", icon: FileText, keywords: ["samples", "industries", "job roles"] },
  { name: "Settings", path: "/admin/settings", icon: Settings, keywords: ["configuration", "website", "watermark", "currency"] },
];

const AdminHeader = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter search items
  const filteredRoutes = searchTerm.trim() === "" ? [] : ADMIN_SEARCH_ROUTES.filter(item => {
    const q = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q))
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (path) => {
    navigate(path);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredRoutes.length > 0) {
      handleSelect(filteredRoutes[0].path);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <header className="admin-header">
      <div>
        <h1 style={{ fontSize: "18px", margin: 0, color: "#111827", fontWeight: 700 }}>
          Welcome back, Administrator!
        </h1>
        <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "13px" }}>{today}</p>
      </div>

      <div className="admin-header-right">
        {/* Functional Search Bar */}
        <div 
          ref={searchRef} 
          className="admin-search" 
          style={{ position: "relative", width: "260px" }}
        >
          <Search size={17} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search pages or tools..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setIsOpen(false);
              }}
              style={{
                border: "none",
                background: "transparent",
                color: "#9ca3af",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={14} />
            </button>
          )}

          {/* Search Dropdown Results */}
          {isOpen && searchTerm.trim() !== "" && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              overflow: "hidden",
              maxHeight: "320px",
              overflowY: "auto"
            }}>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <div
                      key={route.path}
                      onClick={() => handleSelect(route.path)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f8fafc",
                        transition: "background 0.15s ease",
                        color: "#1e293b",
                        fontSize: "13px",
                        fontWeight: 500
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
                    >
                      <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        background: "#eff6ff",
                        color: "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <Icon size={16} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600, color: "#0f172a" }}>{route.name}</span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>{route.path}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: "14px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                  No pages found for "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Avatar & Badge */}
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

