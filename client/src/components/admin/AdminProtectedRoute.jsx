import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const isJwtValid = (token) => {
  if (!token || typeof token !== "string" || token.trim() === "" || token === "null" || token === "undefined") {
    return false;
  }
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.role !== "admin") return false;
    if (payload.exp && Date.now() >= payload.exp * 1000) return false;
    return true;
  } catch (e) {
    return false;
  }
};

const AdminProtectedRoute = () => {
  const location = useLocation();
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("adminToken");
    if (!isJwtValid(token)) {
      if (token) localStorage.removeItem("adminToken");
      return "unauthenticated";
    }
    return "checking";
  });

  useEffect(() => {
    let isMounted = true;
    const verifyTokenWithServer = async () => {
      const token = localStorage.getItem("adminToken");
      if (!isJwtValid(token)) {
        if (token) localStorage.removeItem("adminToken");
        if (isMounted) setAuthState("unauthenticated");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/admin/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          timeout: 5000
        });

        if (response.data && response.data.success) {
          if (isMounted) setAuthState("authenticated");
        } else {
          localStorage.removeItem("adminToken");
          if (isMounted) setAuthState("unauthenticated");
        }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem("adminToken");
          if (isMounted) setAuthState("unauthenticated");
        } else if (isJwtValid(token)) {
          // Network error or offline
          if (isMounted) setAuthState("authenticated");
        } else {
          localStorage.removeItem("adminToken");
          if (isMounted) setAuthState("unauthenticated");
        }
      }
    };

    verifyTokenWithServer();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (authState === "unauthenticated") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (authState === "checking") {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(255, 255, 255, 0.1)",
          borderTopColor: "#06b6d4",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "16px"
        }} />
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, letterSpacing: "0.5px" }}>
          Verifying Admin Access...
        </h3>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
