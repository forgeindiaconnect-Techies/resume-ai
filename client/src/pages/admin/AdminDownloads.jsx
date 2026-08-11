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
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${API_BASE_URL}/downloads/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDownloads(response.data.downloads || []);
    } catch (error) {
      console.error("Failed to fetch downloads:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDownloads = downloads.filter((download) => {
    const user = download.userId?.name || "";
    const email = download.email || download.userId?.email || "";
    const resume = download.resumeId?.title || "";
    const plan = download.planId?.name || "";

    const searchText = `${user} ${email} ${resume} ${plan}`.toLowerCase();

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
                  <th>User / Email</th>
                  <th>Resume</th>
                  <th>Watermark</th>
                  <th>Plan</th>
                  <th>Downloaded</th>
                </tr>
              </thead>
              <tbody>
                {filteredDownloads.map((download) => (
                  <tr key={download._id}>
                    <td>
                      <div className="payment-user">
                        <strong>
                          {download.userId?.name || "Anonymous"}
                        </strong>
                        <span>{download.email || download.userId?.email || "-"}</span>
                      </div>
                    </td>
                    <td>{download.resumeId?.title || "Resume"}</td>
                    <td>
                      {download.watermarkApplied ? (
                        <span style={{color: '#64748b', fontWeight: 600}}>Applied</span>
                      ) : (
                        <span style={{color: '#059669', fontWeight: 600}}>Clean</span>
                      )}
                    </td>
                    <td>{download.planId?.name || "-"}</td>
                    <td>
                      {new Date(download.downloadedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
