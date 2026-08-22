import React, { useEffect, useState } from "react";
import axios from "axios";
import { Settings, Save, AlertCircle } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: "",
    contactEmail: "",
    currency: "INR",
    watermarkEnabled: true,
    watermarkText: "",
    premiumDownloadOnly: true,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/admin/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.settings) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("adminToken");

      const response = await axios.put(
        `${API_BASE_URL}/admin/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(response.data.settings);
      setMessage("Settings saved successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-page">Loading settings...</div>;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
      <div className="admin-page-title">
        <div>
          <h2>Settings</h2>
          <p>Manage your resume builder website settings.</p>
        </div>
        <Settings size={25} />
      </div>

      {/* Website Settings */}
      <div className="settings-card">
        <h3>Website Settings</h3>

        <div className="settings-grid">
          <div className="settings-field">
            <label>Website Name</label>
            <input
              type="text"
              value={settings.websiteName}
              onChange={(e) => handleChange("websiteName", e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label>Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </div>

          <div className="settings-field">
            <label>Currency</label>
            <select
              value="INR"
              disabled
              style={{
                background: "#f8fafc",
                color: "#334155",
                fontWeight: 600,
                cursor: "not-allowed"
              }}
            >
              <option value="INR">INR - Indian Rupee (₹)</option>
            </select>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              🔒 Default currency configured with Razorpay Payment Gateway
            </span>
          </div>
        </div>
      </div>

      {/* Resume Settings */}
      <div className="settings-card">
        <h3>Resume Settings</h3>

        <div className="settings-field">
          <label>Watermark Text</label>
          <input
            type="text"
            value={settings.watermarkText}
            onChange={(e) => handleChange("watermarkText", e.target.value)}
          />
        </div>

        <div className="settings-toggle-row">
          <div>
            <strong>Watermark</strong>
            <span>Show watermark for free users.</span>
          </div>
          <input
            type="checkbox"
            checked={settings.watermarkEnabled}
            onChange={(e) => handleChange("watermarkEnabled", e.target.checked)}
          />
        </div>

        <div className="settings-toggle-row">
          <div>
            <strong>Premium Download Only</strong>
            <span>Allow clean PDF downloads only for premium users.</span>
          </div>
          <input
            type="checkbox"
            checked={settings.premiumDownloadOnly}
            onChange={(e) =>
              handleChange("premiumDownloadOnly", e.target.checked)
            }
          />
        </div>
      </div>

      {/* System Settings */}
      <div className="settings-card">
        <h3>System Settings</h3>

        <div className="settings-toggle-row">
          <div>
            <strong>Maintenance Mode</strong>
            <span>Temporarily disable the user application.</span>
          </div>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
          />
        </div>
      </div>

      {/* Save */}
      <div className="settings-actions">
        {message && <span>{message}</span>}
        <button onClick={saveSettings} disabled={saving}>
          <Save size={17} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
