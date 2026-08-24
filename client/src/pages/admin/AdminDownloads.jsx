import React, { useEffect, useState } from "react";
import axios from "axios";
import { Download, Search, FileText } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";

const AdminDownloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `${API_BASE_URL}/downloads`,
        { headers }
      );

      const data = await response.json();

      if (data.success) {
        setDownloads(data.downloads || []);
      } else {
        setDownloads([]);
      }

    } catch (error) {
      console.error("Failed to fetch downloads:", error);
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDownloads = downloads.filter((download) => {
    const user = download.guestId || "";
    const email = download.email || "";
    const resumeName = download.resumeName || "";
    const resume = download.resumeId || "";
    const type = download.downloadType || "";

    const searchText = `${user} ${email} ${resumeName} ${resume} ${type}`.toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
      <div className="admin-page-title">
        <div>
          <h2>Downloads</h2>
          <p>Track resume downloads by users.</p>
        </div>

        <div className="download-count">
          <Download size={18} />
          <strong>{downloads.length}</strong>
          <span>Total Downloads</span>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search user, email, resume or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-table-message">Loading downloads...</div>
        ) : filteredDownloads.length === 0 ? (
          <div className="admin-table-message">
            <Download size={40} />
            <h3>No downloads found</h3>
            <p>
              Downloads will appear here when users download their resumes.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Resume Name</th>
                  <th>Email</th>
                  <th>Download Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredDownloads.map((item) => (
                  <tr key={item._id}>
                    <td>{item.resumeName || "-"}</td>
                    <td>{item.email || "-"}</td>
                    <td>
                      {item.downloadType === "watermarked"
                        ? "With Watermark"
                        : "Without Watermark"}
                    </td>
                    <td>₹{item.amount}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: "#334155" }}>
                        {item.downloadedAt
                          ? new Date(item.downloadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "-"}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#0284c7", fontWeight: 600 }}>
                        {item.downloadedAt
                          ? new Date(item.downloadedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
                          : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
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

export default AdminDownloads;
