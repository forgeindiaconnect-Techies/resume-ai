import React, { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/auth/login`,
        formData
      );

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      navigate("/admin/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-logo">
          <ShieldCheck size={32} />
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-subtitle">
          Sign in to manage your Resume Builder
        </p>

        <form onSubmit={handleSubmit}>

          <div className="admin-form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <div className="admin-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In
          </button>

        </form>

        <p className="admin-login-security">
          🔒 Authorized administrators only
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;
