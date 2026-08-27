import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  Calendar,
  Users,
  UserCheck,
  Globe,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
  FileText,
  Eye,
  Trash2,
  X,
  Tag,
  Check,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { API_BASE_URL } from "../../config/api";
import toast from "react-hot-toast";

const getScoreColor = (score) => {
  if (score >= 90) return { bg: "#dcfce7", text: "#15803d", label: "Excellent" };
  if (score >= 75) return { bg: "#f0fdf4", text: "#16a34a", label: "Good" };
  if (score >= 60) return { bg: "#fef3c7", text: "#b45309", label: "Needs Improvement" };
  return { bg: "#fee2e2", text: "#dc2626", label: "Poor" };
};

const AdminATSAnalyses = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    analysesToday: 0,
    uniqueUsers: 0,
    registeredUsers: 0,
    guestUsers: 0,
    averageScore: 0,
    successfulAnalyses: 0,
    failedAnalyses: 0,
    highestScore: 0,
    lowestScore: 0,
    scoreLevels: { Excellent: 0, Good: 0, "Needs Improvement": 0, Poor: 0 },
    commonMissingSections: [],
    frequentlyMissingSkills: []
  });
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchStatsAndAnalyses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, listRes] = await Promise.all([
        fetch(`${API_BASE_URL}/resume-analysis/admin/stats`, { headers }),
        fetch(`${API_BASE_URL}/resume-analysis/admin/all?search=${encodeURIComponent(search)}`, { headers })
      ]);

      if (statsRes.status === 401 || listRes.status === 401) {
        localStorage.removeItem("adminToken");
        toast.error("Session expired. Please sign in again.");
        navigate("/admin/login");
        return;
      }

      const statsData = statsRes.ok ? await statsRes.json() : null;
      const listData = listRes.ok ? await listRes.json() : null;

      if (statsData && statsData.success && statsData.data) {
        const s = statsData.data;
        setStats({
          totalAnalyses: s.totalAnalyses || 0,
          analysesToday: s.analysesToday || 0,
          uniqueUsers: s.uniqueUsers || 0,
          registeredUsers: s.registeredUsers || 0,
          guestUsers: s.guestUsers || 0,
          averageScore: s.averageScore || 0,
          successfulAnalyses: s.successfulAnalyses !== undefined ? s.successfulAnalyses : (s.totalAnalyses || 0),
          failedAnalyses: s.failedAnalyses || 0,
          highestScore: s.highestScore || 0,
          lowestScore: s.lowestScore || 0,
          scoreLevels: s.scoreLevels || { Excellent: 0, Good: 0, "Needs Improvement": 0, Poor: 0 },
          commonMissingSections: s.commonMissingSections || [],
          frequentlyMissingSkills: s.frequentlyMissingSkills || []
        });
      }

      if (listData && listData.success && (listData.data || listData.analyses)) {
        setAnalyses(listData.data || listData.analyses || []);
      }
    } catch (err) {
      console.error("Failed to load ATS analyses:", err);
      toast.error("Failed to fetch ATS data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndAnalyses();
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this analysis record?")) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/resume-analysis/admin/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Analysis deleted");
        setAnalyses((prev) => prev.filter((a) => a._id !== id));
        if (selectedAnalysis?._id === id) setSelectedAnalysis(null);
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">
          <div className="admin-page">
            
            {/* Page Action Toolbar */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "1.25rem" }}>
              <button
                onClick={fetchStatsAndAnalyses}
                style={{
                  padding: "8px 14px",
                  background: "#0284c7",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh Data
              </button>
            </div>
          
            {/* Top 8 Metric Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
              marginBottom: "2rem"
            }}
          >
            {/* 1. Total Analyses */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>TOTAL ANALYSES</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>All resumes analyzed</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#0f172a" }}>{stats.totalAnalyses}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#e0e7ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileCheck size={22} />
                </div>
              </div>
            </div>

            {/* 2. Analyses Today */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>ANALYSES TODAY</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Today's resume count</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#0284c7" }}>{stats.analysesToday}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={22} />
                </div>
              </div>
            </div>

            {/* 3. Unique Users */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>UNIQUE USERS</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Total distinct users</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#7c3aed" }}>{stats.uniqueUsers}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#f5f3ff", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={22} />
                </div>
              </div>
            </div>

            {/* 4. Registered Users */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>REGISTERED USERS</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Logged-in users</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#16a34a" }}>{stats.registeredUsers}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#dcfce7", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <UserCheck size={22} />
                </div>
              </div>
            </div>

            {/* 5. Guest Users */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>GUEST USERS</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Public guest users</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#ea580c" }}>{stats.guestUsers}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#ffedd5", color: "#ea580c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={22} />
                </div>
              </div>
            </div>

            {/* 6. Average ATS Score */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>AVERAGE ATS SCORE</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Overall average score</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#0891b2" }}>{stats.averageScore} / 100</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#cffafe", color: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <TrendingUp size={22} />
                </div>
              </div>
            </div>

            {/* 7. Successful Analyses */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>SUCCESSFUL ANALYSES</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Completed successfully</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#16a34a" }}>{stats.successfulAnalyses}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#f0fdf4", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </div>

            {/* 8. Failed Analyses */}
            <div style={{ background: "white", padding: "1.4rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>FAILED ANALYSES</span>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "0.15rem 0 0" }}>Upload, parsing or AI failures</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 900, color: "#dc2626" }}>{stats.failedAnalyses}</span>
                <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div style={{ background: "white", padding: "1.25rem 1.5rem", borderRadius: "16px", border: "1px solid #e2e8f0", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                type="text"
                placeholder="Search by user, email, file name, or score level..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem 0.7rem 2.6rem",
                  borderRadius: "12px",
                  border: "1.5px solid #e2e8f0",
                  fontSize: "0.9rem",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc"
                }}
              />
            </div>

            <button
              onClick={fetchStatsAndAnalyses}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                padding: "0.7rem 1.25rem",
                borderRadius: "12px",
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "#334155",
                cursor: "pointer"
              }}
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          {/* Recent Analyses Table */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Recent Analyses</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.2rem 0 0" }}>Live tracking of public and registered candidate ATS resume evaluations</p>
              </div>
              <span style={{ fontSize: "0.82rem", background: "#f1f5f9", color: "#475569", fontWeight: 800, padding: "0.3rem 0.75rem", borderRadius: "50px" }}>
                {analyses.length} Records
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 700, fontSize: "0.78rem", textTransform: "uppercase" }}>
                    <th style={{ padding: "1rem 1.25rem" }}>User</th>
                    <th style={{ padding: "1rem 1.25rem" }}>Resume</th>
                    <th style={{ padding: "1rem 1.25rem" }}>ATS Score</th>
                    <th style={{ padding: "1rem 1.25rem" }}>Job Match</th>
                    <th style={{ padding: "1rem 1.25rem" }}>Language Score</th>
                    <th style={{ padding: "1rem 1.25rem" }}>Status</th>
                    <th style={{ padding: "1rem 1.25rem" }}>Date</th>
                    <th style={{ padding: "1rem 1.25rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                        <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 0.5rem" }} />
                        Loading ATS analyses...
                      </td>
                    </tr>
                  ) : analyses.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: "3rem 1.5rem", textAlign: "center", color: "#64748b" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                          <FileCheck size={32} color="#94a3b8" />
                          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#334155" }}>No ATS resume analyses recorded yet</span>
                          <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>New analyses from candidate and employee uploads will appear here automatically.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    analyses.map((item) => {
                      const atsScore = item.resumeQualityScore || item.overallScore || 0;
                      const atsColor = getScoreColor(atsScore);
                      const langScore = item.languageQualityScore ?? 100;
                      const langColor = getScoreColor(langScore);
                      const displayName = item.candidateName || (item.email ? item.email.split("@")[0] : "Guest Candidate");
                      const jobMatch = item.jobMatchScore !== undefined && item.jobMatchScore !== null ? `${item.jobMatchScore}/100` : "-";

                      return (
                        <tr
                          key={item._id}
                          style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {/* 1. User */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <span style={{ fontWeight: 700, color: "#0f172a" }}>{displayName}</span>
                                {item.candidateLevel && (
                                  <span style={{ fontSize: "0.68rem", background: "#e0f2fe", color: "#0369a1", padding: "0.1rem 0.45rem", borderRadius: "4px", fontWeight: 800 }}>
                                    {item.candidateLevel}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{item.email || "No email detected"}</span>
                            </div>
                          </td>

                          {/* 2. Resume */}
                          <td style={{ padding: "1rem 1.25rem", color: "#475569" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <FileText size={16} color="#0284c7" />
                              <span style={{ fontWeight: 600, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.originalFileName || "Resume"}
                              </span>
                            </div>
                          </td>

                          {/* 3. ATS Score */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span style={{ fontSize: "1rem", fontWeight: 900, color: atsColor.text }}>
                              {atsScore} / 100
                            </span>
                          </td>

                          {/* 4. Job Match */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span style={{ fontWeight: 700, color: jobMatch === "-" ? "#94a3b8" : "#0284c7" }}>
                              {jobMatch}
                            </span>
                          </td>

                          {/* 5. Language Score */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span style={{ fontWeight: 800, color: langColor.text }}>
                              {langScore} / 100
                            </span>
                          </td>

                          {/* 6. Status */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span
                              style={{
                                background: atsColor.bg,
                                color: atsColor.text,
                                padding: "0.25rem 0.7rem",
                                borderRadius: "50px",
                                fontSize: "0.78rem",
                                fontWeight: 800
                              }}
                            >
                              {item.scoreLevel || atsColor.label}
                            </span>
                          </td>

                          {/* 7. Date */}
                          <td style={{ padding: "1rem 1.25rem", color: "#64748b", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                            {new Date(item.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem" }}>
                              <button
                                onClick={() => setSelectedAnalysis(item)}
                                title="View Full Report"
                                style={{
                                  background: "#f0f9ff",
                                  border: "1px solid #bae6fd",
                                  color: "#0284c7",
                                  padding: "0.4rem 0.75rem",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.3rem",
                                  fontSize: "0.8rem",
                                  fontWeight: 700
                                }}
                              >
                                <Eye size={14} /> View
                              </button>

                              <button
                                onClick={() => handleDelete(item._id)}
                                disabled={deletingId === item._id}
                                title="Delete record"
                                style={{
                                  background: "#fee2e2",
                                  border: "1px solid #fecaca",
                                  color: "#dc2626",
                                  padding: "0.4rem 0.6rem",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick View Modal */}
          {selectedAnalysis && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "1rem"
              }}
              onClick={() => setSelectedAnalysis(null)}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: "20px",
                  maxWidth: "750px",
                  width: "100%",
                  maxHeight: "88vh",
                  overflowY: "auto",
                  padding: "2rem",
                  position: "relative",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedAnalysis(null)}
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    background: "#f1f5f9",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#64748b"
                  }}
                >
                  <X size={20} />
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "12px", background: "#e0f2fe", color: "#0284c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      {selectedAnalysis.candidateName || "Candidate Analysis"}
                    </h3>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                      {selectedAnalysis.originalFileName} · {selectedAnalysis.email || "No email"}
                    </span>
                  </div>
                </div>

                {/* 3-Score Pill Gauges */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.85rem", marginBottom: "1.5rem" }}>
                  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", padding: "1rem", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0284c7", display: "block" }}>ATS QUALITY</span>
                    <strong style={{ fontSize: "1.4rem", color: "#0369a1" }}>{selectedAnalysis.resumeQualityScore || selectedAnalysis.overallScore || 0}/100</strong>
                  </div>

                  <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "1rem", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#7c3aed", display: "block" }}>LANGUAGE SCORE</span>
                    <strong style={{ fontSize: "1.4rem", color: "#5b21b6" }}>{selectedAnalysis.languageQualityScore ?? 100}/100</strong>
                  </div>

                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: "12px" }}>
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#16a34a", display: "block" }}>JOB MATCH</span>
                    <strong style={{ fontSize: "1.4rem", color: "#15803d" }}>
                      {selectedAnalysis.jobMatchScore !== undefined && selectedAnalysis.jobMatchScore !== null ? `${selectedAnalysis.jobMatchScore}/100` : "N/A"}
                    </strong>
                  </div>
                </div>

                {/* Strengths & Recommendations */}
                {selectedAnalysis.strengths && selectedAnalysis.strengths.length > 0 && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#166534", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Check size={16} /> Verified Strengths
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.88rem", color: "#334155" }}>
                      {selectedAnalysis.strengths.map((s, i) => (
                        <li key={i} style={{ marginBottom: "0.25rem" }}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAnalysis.recommendations && selectedAnalysis.recommendations.length > 0 && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0284c7", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Sparkles size={16} /> Priority Actions
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.88rem", color: "#334155" }}>
                      {selectedAnalysis.recommendations.map((r, i) => (
                        <li key={i} style={{ marginBottom: "0.25rem" }}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAnalysis.proofreadingIssues && selectedAnalysis.proofreadingIssues.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#5b21b6", margin: "0 0 0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <ShieldCheck size={16} /> Proofreading Issues Detected ({selectedAnalysis.proofreadingIssues.length})
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
                      {selectedAnalysis.proofreadingIssues.map((iss, i) => (
                        <div key={i} style={{ background: "#fafafa", border: "1px solid #e2e8f0", padding: "0.6rem 0.8rem", borderRadius: "8px", fontSize: "0.82rem" }}>
                          <span style={{ fontWeight: 800, color: "#475569" }}>Line {iss.lineNumber}:</span>{" "}
                          <span style={{ textDecoration: "line-through", color: "#dc2626" }}>{iss.originalText}</span> →{" "}
                          <span style={{ fontWeight: 700, color: "#16a34a" }}>{iss.suggestedText}</span> ({iss.issueType})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminATSAnalyses;
