import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  TrendingUp,
  FileSearch,
  Check,
  Award,
  Zap,
  Tag,
  ArrowUpRight,
  Printer,
  Copy,
  ExternalLink
} from "lucide-react";
import ForgeLogo from "../components/common/ForgeLogo";
import { API_BASE_URL } from "../config/api";
import { startSession, trackEvent } from "../utils/sessionTracker";
import toast from "react-hot-toast";

// Helper for score badge colors
const getScoreTheme = (score) => {
  if (score >= 90) {
    return {
      label: "Excellent",
      bg: "#ecfdf5",
      text: "#065f46",
      border: "#10b981",
      circle: "#059669",
      gradient: "linear-gradient(135deg, #059669, #10b981)",
      badgeBg: "#d1fae5",
      iconBg: "#10b981"
    };
  }
  if (score >= 75) {
    return {
      label: "Good",
      bg: "#f0fdf4",
      text: "#15803d",
      border: "#22c55e",
      circle: "#16a34a",
      gradient: "linear-gradient(135deg, #16a34a, #22c55e)",
      badgeBg: "#dcfce7",
      iconBg: "#22c55e"
    };
  }
  if (score >= 60) {
    return {
      label: "Needs Improvement",
      bg: "#fffbeb",
      text: "#b45309",
      border: "#f59e0b",
      circle: "#d97706",
      gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
      badgeBg: "#fef3c7",
      iconBg: "#f59e0b"
    };
  }
  return {
    label: "Poor",
    bg: "#fef2f2",
    text: "#b91c1c",
    border: "#ef4444",
    circle: "#dc2626",
    gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
    badgeBg: "#fee2e2",
    iconBg: "#ef4444"
  };
};

const CATEGORY_META = {
  parseability: { name: "ATS Parseability", icon: "📐", max: 10 },
  contact: { name: "Contact Information", icon: "👤", max: 10 },
  summary: { name: "Professional Summary", icon: "📝", max: 10 },
  experienceExposure: { name: "Practical Exposure & Work History", icon: "💼", max: 20 },
  experience: { name: "Work Experience", icon: "💼", max: 20 },
  education: { name: "Education & Qualifications", icon: "🎓", max: 10 },
  skills: { name: "Skills Presentation", icon: "⚡", max: 15 },
  projects: { name: "Projects & Practical Impact", icon: "🚀", max: 10 },
  contentQuality: { name: "Content Quality & Action Verbs", icon: "💎", max: 10 },
  formatting: { name: "Formatting & Layout", icon: "📄", max: 5 }
};

const ResumeChecker = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'ats' | 'proofreading' | 'jobMatch' | 'rewrites'
  const [proofreadFilter, setProofreadFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  const theme = getScoreTheme(result?.resumeQualityScore || result?.overallScore || 0);

  useEffect(() => {
    try {
      startSession("/resume-checker");
      trackEvent("Opened ATS Resume Checker", "/resume-checker");
    } catch (e) {}
  }, []);

  // File Dropzone configuration
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0];
      if (err.code === "file-too-large") {
        toast.error("File is larger than 5 MB limit.");
      } else {
        toast.error(err.message || "Invalid file format. Please upload a PDF or DOCX.");
      }
      return;
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      toast.success(`Selected ${acceptedFiles[0].name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  // Multi-step loading messages
  useEffect(() => {
    let timer;
    if (analyzing) {
      setAnalysisStep(1);
      timer = setInterval(() => {
        setAnalysisStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 700);
    } else {
      setAnalysisStep(0);
    }
    return () => clearInterval(timer);
  }, [analyzing]);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please choose a PDF or DOCX resume to analyze.");
      return;
    }

    try {
      setAnalyzing(true);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", selectedFile);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      // Attach user / guest / session tracking info
      const guestId = localStorage.getItem("guestId") || localStorage.getItem("guestSessionId");
      if (guestId) formData.append("guestId", guestId);

      const sessionId = sessionStorage.getItem("sessionId") || localStorage.getItem("sessionId");
      if (sessionId) formData.append("sessionId", sessionId);

      try {
        const storedUser = localStorage.getItem("user") || localStorage.getItem("userData");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (userObj.email) formData.append("email", userObj.email);
          if (userObj.name) formData.append("userName", userObj.name);
          if (userObj._id || userObj.id) formData.append("userId", userObj._id || userObj.id);
        }
      } catch (e) {}

      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const headers = {
        "Content-Type": "multipart/form-data"
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.post(`${API_BASE_URL}/resume-analysis/analyze`, formData, {
        headers
      });

      if (response.data.success) {
        const raw = response.data;
        const analysisData = {
          ...(raw.analysis || {}),

          resumeProfile:
            raw.resumeProfile || null,

          jobRequirements:
            raw.jobRequirements || null,

          jobMatchAnalysis:
            raw.jobMatchAnalysis || null,

          jobMatchError:
            raw.jobMatchError || null,

          aiAnalysis:
            raw.aiAnalysis || null,

          aiAnalysisError:
            raw.aiAnalysisError || null,

          languageAnalysis:
            raw.languageAnalysis || raw.analysis?.languageAnalysis || null,

          languageAnalysisError:
            raw.languageAnalysisError || null,

          recommendations:
            raw.aiAnalysis?.priorityActions ||
            raw.analysis?.recommendations ||
            [],

          originalFileName:
            raw.file?.originalName ||
            raw.originalFileName ||
            selectedFile?.name,

          wordCount:
            raw.wordCount || 0,

          characterCount:
            raw.characterCount || 0,
        };
        setResult(analysisData);
        toast.success("Resume analysis complete!");

        try {
          trackEvent(`ATS Resume Analysis: ${selectedFile.name} (Score: ${analysisData.resumeQualityScore || analysisData.overallScore || 0}%)`, "/resume-checker", {
            resumeName: selectedFile.name,
            email: analysisData.contact?.email || null,
            resumeCreated: false
          });
        } catch (e) {}
        // Scroll to results smoothly
        setTimeout(() => {
          const resultsEl = document.getElementById("analysis-results-section");
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      } else {
        toast.error(response.data.message || "Analysis failed");
      }
    } catch (err) {
      console.error("Resume analysis error:", err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to analyze resume. Please ensure the file is valid and readable.";
      toast.error(errMsg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    const textReport = `UNIVERSAL RESUME AUDIT REPORT
=========================================
File: ${result.originalFileName}
Candidate Level: ${result.candidateLevel || "Fresher"}

1. RESUME QUALITY SCORE: ${result.resumeQualityScore || result.overallScore}/100 (${result.qualityLevel || result.scoreLevel})
2. LANGUAGE QUALITY SCORE: ${result.languageQualityScore || 100}/100 (${result.languageQualityLevel || "Good Quality"})
${result.jobMatchScore !== null && result.jobMatchScore !== undefined ? `3. JOB MATCH SCORE: ${result.jobMatchScore}/100 (${result.jobMatchLevel})\n` : ""}
CATEGORY BREAKDOWN:
${Object.entries(result.categoryScores || {})
  .map(([k, v]) => `• ${CATEGORY_META[k]?.name || k}: ${v.score}/${v.maximum}`)
  .join("\n")}

PROOFREADING AUDIT ISSUES (${(result.proofreadingIssues || []).length} Detected):
${(result.proofreadingIssues || []).map((iss, i) => `${i + 1}. [Line ${iss.lineNumber || "?"}] [${iss.issueType?.toUpperCase()}] "${iss.originalText}" → "${iss.suggestedText}" (${iss.explanation})`).join("\n")}

RECOMMENDATIONS:
${(result.recommendations || []).map((r, i) => `${i + 1}. ${typeof r === "string" ? r : (r.action || r.message || "")}`).join("\n")}
=========================================
Generated via Forge Resume AI Universal ATS
`;

    navigator.clipboard.writeText(textReport);
    setCopied(true);
    toast.success("Complete Audit Report copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const languageScore = Number(
    result?.languageAnalysis?.languageScore ?? 0
  );

  const langTheme =
    languageScore >= 80
      ? {
          primary: "#15803d",
          text: "#166534",
          background: "#f0fdf4",
          border: "#bbf7d0",
          badgeBg: "#dcfce7",
          circle: "#16a34a",
          gradient: "linear-gradient(135deg, #16a34a, #22c55e)",
        }
      : languageScore >= 60
        ? {
            primary: "#d97706",
            text: "#92400e",
            background: "#fffbeb",
            border: "#fde68a",
            badgeBg: "#fef3c7",
            circle: "#d97706",
            gradient: "linear-gradient(135deg, #d97706, #f59e0b)",
          }
        : {
            primary: "#dc2626",
            text: "#991b1b",
            background: "#fef2f2",
            border: "#fecaca",
            badgeBg: "#fee2e2",
            circle: "#dc2626",
            gradient: "linear-gradient(135deg, #dc2626, #ef4444)",
          };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f9fc",
        color: "#0f172a",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Top Navigation */}
      <nav
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0.75rem 1.5rem"
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <ForgeLogo size={52} showText={true} variant="light" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                padding: "0.4rem 0.8rem"
              }}
            >
              Home
            </button>
            <button
              onClick={() => navigate("/builder")}
              style={{
                background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
                color: "white",
                border: "none",
                padding: "0.5rem 1.25rem",
                borderRadius: "20px",
                fontWeight: 700,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 2px 8px rgba(2, 132, 199, 0.25)"
              }}
            >
              <Sparkles size={14} /> Resume Builder
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>
        
        {/* Header Title Section */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#e0f2fe",
              color: "#0284c7",
              padding: "0.35rem 1rem",
              borderRadius: "50px",
              fontSize: "0.85rem",
              fontWeight: 800,
              marginBottom: "1rem"
            }}
          >
            <ShieldCheck size={16} /> 100-Point Fixed ATS Scoring Rubric
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.02em",
              margin: "0 0 0.75rem"
            }}
          >
            Check Your <span style={{ color: "#0284c7" }}>Resume Score</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "#475569",
              maxWidth: "680px",
              margin: "0 auto",
              lineHeight: 1.6
            }}
          >
            Upload your resume to measure ATS compatibility, content quality and job relevance with our objective 100-point evaluator.
          </p>
        </div>

        {/* Upload Card */}
        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "24px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            marginBottom: "2.5rem"
          }}
        >
          {/* Dropzone Area */}
          <div
            {...getRootProps()}
            style={{
              border: isDragActive
                ? "2.5px dashed #0284c7"
                : isDragReject
                ? "2.5px dashed #ef4444"
                : selectedFile
                ? "2px solid #10b981"
                : "2px dashed #cbd5e1",
              background: isDragActive
                ? "#f0f9ff"
                : selectedFile
                ? "#f0fdf4"
                : "#f8fafc",
              borderRadius: "18px",
              padding: "3rem 1.5rem",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
          >
            <input {...getInputProps()} />

            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: selectedFile ? "#dcfce7" : "#e0f2fe",
                color: selectedFile ? "#15803d" : "#0284c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
                boxShadow: "0 4px 12px rgba(2, 132, 199, 0.1)"
              }}
            >
              {selectedFile ? <Check size={32} /> : <UploadCloud size={32} />}
            </div>

            {selectedFile ? (
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#166534", margin: "0 0 0.35rem" }}>
                  {selectedFile.name}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#475569", margin: "0 0 1rem" }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze
                </p>
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#0284c7",
                    background: "#ffffff",
                    border: "1px solid #bae6fd",
                    padding: "0.35rem 0.9rem",
                    borderRadius: "20px"
                  }}
                >
                  Click or drag to replace file
                </span>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>
                  {isDragActive ? "Drop your resume file here" : "Drag & Drop your resume here"}
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#64748b", margin: "0 0 1rem" }}>
                  or <span style={{ color: "#0284c7", fontWeight: 700, textDecoration: "underline" }}>browse from your computer</span>
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.75rem", background: "#e2e8f0", color: "#334155", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: 700 }}>
                    PDF (.pdf)
                  </span>
                  <span style={{ fontSize: "0.75rem", background: "#e2e8f0", color: "#334155", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: 700 }}>
                    Word (.docx)
                  </span>
                  <span style={{ fontSize: "0.75rem", background: "#e2e8f0", color: "#334155", padding: "0.25rem 0.65rem", borderRadius: "6px", fontWeight: 700 }}>
                    Max 5 MB
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Job Description Accordion */}
          <div style={{ marginTop: "1.5rem" }}>
            <button
              onClick={() => setShowJdInput(!showJdInput)}
              style={{
                background: "transparent",
                border: "none",
                color: "#0284c7",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.3rem 0"
              }}
            >
              <Briefcase size={16} />
              {showJdInput ? "Hide Job Description (Optional)" : "+ Compare with a Job Description (Optional for Keyword Matching)"}
              {showJdInput ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showJdInput && (
              <div style={{ marginTop: "0.75rem" }}>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description or required skills here to check keyword match, missing skills, and role alignment..."
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: "12px",
                    fontFamily: "inherit",
                    fontSize: "0.9rem",
                    color: "#1e293b",
                    outline: "none",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Button & Loading Progress */}
          <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !selectedFile}
              style={{
                background: analyzing || !selectedFile
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #0284c7, #0369a1)",
                color: "white",
                border: "none",
                padding: "0.9rem 2.5rem",
                borderRadius: "14px",
                fontSize: "1.05rem",
                fontWeight: 800,
                cursor: analyzing || !selectedFile ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                boxShadow: analyzing || !selectedFile ? "none" : "0 4px 18px rgba(2, 132, 199, 0.35)",
                transition: "all 0.2s ease"
              }}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume
                </>
              )}
            </button>

            {/* Step-by-step scanner indicator */}
            {analyzing && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "#166534"
                }}
              >
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a", animation: "pulse 1s infinite" }} />
                {analysisStep === 1 && "1/4: Reading document and parsing text..."}
                {analysisStep === 2 && "2/4: Evaluating 100-point fixed ATS rubric..."}
                {analysisStep === 3 && "3/4: Auditing action verbs, metrics & formatting..."}
                {analysisStep >= 4 && "4/4: Generating exact points-lost breakdown & tips..."}
              </div>
            )}
          </div>
        </div>

        {/* RESULTS DASHBOARD SECTION */}
        {result && (
          <div id="analysis-results-section" style={{ animation: "fadeIn 0.4s ease" }}>
            
            {/* Header: Candidate Level & Target Roles */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    background: "#0284c7",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    padding: "0.35rem 0.9rem",
                    borderRadius: "50px",
                    letterSpacing: "0.02em"
                  }}
                >
                  Candidate Level: {result.candidateLevel || "Fresher"}
                </span>
                {result.targetRoles && result.targetRoles.length > 0 && (
                  <span style={{ background: "#f1f5f9", color: "#334155", fontWeight: 700, fontSize: "0.85rem", padding: "0.35rem 0.85rem", borderRadius: "50px" }}>
                    🎯 {result.targetRoles.join(", ")}
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                File: {result.originalFileName}
              </span>
            </div>

            {/* 3-Scorecards Hero Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: result.jobMatchAnalysis ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr 1fr",
                gap: "1.25rem",
                marginBottom: "1.75rem"
              }}
            >
              {/* Card 1: Resume Quality Score */}
              <div
                style={{
                  background: "#ffffff",
                  border: `2px solid ${theme.border}`,
                  borderRadius: "20px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: theme.gradient }} />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div>
                    <span style={{ background: theme.badgeBg, color: theme.text, fontWeight: 800, fontSize: "0.75rem", padding: "0.2rem 0.65rem", borderRadius: "50px", textTransform: "uppercase" }}>
                      {result.qualityLevel || result.scoreLevel}
                    </span>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: "0.4rem 0 0.2rem" }}>
                      Resume Quality Score
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                      Universal ATS structure, sections & formatting.
                    </p>
                  </div>

                  <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="9" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={theme.circle}
                        strokeWidth="9"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (result.resumeQualityScore || result.overallScore) / 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: 900, color: theme.circle, lineHeight: 1 }}>
                        {result.resumeQualityScore || result.overallScore}
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 700 }}>/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Language & Proofreading Score */}
              <div
                style={{
                  background: "#ffffff",
                  border: `2px solid ${langTheme.border}`,
                  borderRadius: "20px",
                  padding: "1.5rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "5px", background: langTheme.gradient }} />
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div>
                    <span style={{ background: langTheme.badgeBg, color: langTheme.text, fontWeight: 800, fontSize: "0.75rem", padding: "0.2rem 0.65rem", borderRadius: "50px", textTransform: "uppercase" }}>
                      {result.languageQualityLevel || "Good"}
                    </span>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: "0.4rem 0 0.2rem" }}>
                      Spelling & Grammar Score
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                      {result.languageAnalysis?.totalIssues !== undefined ? `${result.languageAnalysis.totalIssues} correction${result.languageAnalysis.totalIssues === 1 ? "" : "s"} identified` : "Proofreading check complete."}
                    </p>
                  </div>

                  <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="9" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={langTheme.circle}
                        strokeWidth="9"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (result.languageQualityScore ?? 100) / 100)}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: 900, color: langTheme.circle, lineHeight: 1 }}>
                        {result.languageQualityScore ?? 100}
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 700 }}>/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Job Match Score (if JD provided) */}
              {result.jobMatchAnalysis && (
                <div
                  style={{
                    background: "#ffffff",
                    border: `2px solid ${result.jobMatchAnalysis.jobMatchScore >= 70 ? "#10b981" : result.jobMatchAnalysis.jobMatchScore >= 50 ? "#f59e0b" : "#ef4444"}`,
                    borderRadius: "20px",
                    padding: "1.5rem",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      background: result.jobMatchAnalysis.jobMatchScore >= 70 ? "linear-gradient(135deg, #10b981, #059669)" : result.jobMatchAnalysis.jobMatchScore >= 50 ? "linear-gradient(135deg, #f59e0b, #d97706)" : "linear-gradient(135deg, #ef4444, #dc2626)"
                    }}
                  />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                    <div>
                      <span
                        style={{
                          background: result.jobMatchAnalysis.jobMatchScore >= 70 ? "#d1fae5" : result.jobMatchAnalysis.jobMatchScore >= 50 ? "#fef3c7" : "#fee2e2",
                          color: result.jobMatchAnalysis.jobMatchScore >= 70 ? "#065f46" : result.jobMatchAnalysis.jobMatchScore >= 50 ? "#92400e" : "#991b1b",
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.65rem",
                          borderRadius: "50px",
                          textTransform: "uppercase"
                        }}
                      >
                        {result.jobMatchAnalysis.matchLevel || "Job Match"}
                      </span>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#0f172a", margin: "0.4rem 0 0.2rem" }}>
                        Job Match Score
                      </h3>
                      <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0, lineHeight: 1.4 }}>
                        Target job skills & mandatory qualifications.
                      </p>
                    </div>

                    <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                      <svg width="80" height="80" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#e2e8f0" strokeWidth="9" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={result.jobMatchAnalysis.jobMatchScore >= 70 ? "#10b981" : result.jobMatchAnalysis.jobMatchScore >= 50 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="9"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - result.jobMatchAnalysis.jobMatchScore / 100)}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "1.3rem", fontWeight: 900, color: result.jobMatchAnalysis.jobMatchScore >= 70 ? "#10b981" : result.jobMatchAnalysis.jobMatchScore >= 50 ? "#f59e0b" : "#ef4444", lineHeight: 1 }}>
                          {result.jobMatchAnalysis.jobMatchScore}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 700 }}>/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Tabs Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #e2e8f0", marginBottom: "1.75rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {[
                  { id: "overview", label: "Overview", icon: "📋" },
                  { id: "ats", label: "ATS Quality Score", icon: "📐" },
                  {
                    id: "proofreading",
                    label: `Spelling & Grammar`,
                    icon: "✍️",
                    badge: (result.proofreadingIssues || []).length
                  },
                  ...(result.jobMatchAnalysis ? [{ id: "jobMatch", label: "Job Match", icon: "🎯" }] : []),
                  ...(result.aiAnalysis ? [{ id: "rewrites", label: "AI Rewrites", icon: "✨" }] : [])
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        background: isActive ? "#0284c7" : "transparent",
                        color: isActive ? "#ffffff" : "#475569",
                        border: "none",
                        padding: "0.6rem 1.1rem",
                        borderRadius: "10px 10px 0 0",
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span
                          style={{
                            background: isActive ? "rgba(255,255,255,0.3)" : "#fee2e2",
                            color: isActive ? "#ffffff" : "#dc2626",
                            fontSize: "0.72rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "50px",
                            fontWeight: 900
                          }}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <button
                  onClick={handleCopyReport}
                  title="Copy Full Analysis Report"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Report"}
                </button>
                <button
                  onClick={handlePrint}
                  title="Print Report"
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <Printer size={14} /> Print
                </button>
              </div>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Summary Quick Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ background: "white", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", fontWeight: 700 }}>WORD COUNT</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0f172a" }}>{result.wordCount || "450"} words</span>
                  </div>
                  <div style={{ background: "white", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", fontWeight: 700 }}>PROOFREADING ISSUES</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#dc2626" }}>{(result.proofreadingIssues || []).length} errors</span>
                  </div>
                  <div style={{ background: "white", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", fontWeight: 700 }}>ATS POINT DEDUCTIONS</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#b45309" }}>{(result.issues || []).length} sections</span>
                  </div>
                  <div style={{ background: "white", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", fontWeight: 700 }}>STRENGTHS IDENTIFIED</span>
                    <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "#16a34a" }}>{(result.strengths || []).length} highlights</span>
                  </div>
                </div>

                {/* Priority Next Steps */}
                <div style={{ background: "#ffffff", border: "1px solid #bae6fd", borderRadius: "18px", padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0369a1", margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Lightbulb size={18} color="#0284c7" /> Priority Next Steps
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {(result.recommendations || []).slice(0, 4).map((rec, idx) => {
                      const recText = typeof rec === "string" ? rec : (rec.message || rec.action || JSON.stringify(rec));
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem 1rem", background: "#f0f9ff", borderRadius: "10px", border: "1px solid #e0f2fe" }}>
                          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#0284c7", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0 }}>
                            {idx + 1}
                          </span>
                          <p style={{ fontSize: "0.9rem", color: "#0c4a6e", margin: 0, fontWeight: 600, lineHeight: 1.45 }}>{recText}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Disclaimer */}
                {result.disclaimer && (
                  <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "0.85rem 1.25rem", color: "#475569", fontSize: "0.82rem", lineHeight: 1.45 }}>
                    💡 <strong>Important ATS Verification Note:</strong> {result.disclaimer}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ATS SCORE & CATEGORIES */}
            {activeTab === "ats" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Category Breakdown */}
                <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "1.75rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Layers size={18} color="#0284c7" /> Universal 100-Point ATS Rubric
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                    {Object.entries(result.categoryScores || {}).map(([key, data]) => {
                      const meta = CATEGORY_META[key] || { name: key, icon: "📌", max: data.maximum || 10 };
                      const percentage = Math.round((data.score / meta.max) * 100);
                      const isPerfect = data.score >= meta.max;
                      const isWarning = data.score < meta.max * 0.6;

                      return (
                        <div key={key} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <span>{meta.icon}</span>
                              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1e293b" }}>{meta.name}</span>
                            </div>
                            <span style={{ fontSize: "0.88rem", fontWeight: 800, color: isPerfect ? "#16a34a" : isWarning ? "#dc2626" : "#0284c7" }}>
                              {data.score} / {meta.max}
                            </span>
                          </div>

                          <div style={{ height: "8px", background: "#e2e8f0", borderRadius: "50px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${percentage}%`, background: isPerfect ? "#16a34a" : isWarning ? "#ef4444" : "#0284c7", borderRadius: "50px", transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Point Deductions */}
                <div style={{ background: "#ffffff", border: "1px solid #fee2e2", borderRadius: "20px", padding: "1.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#991b1b", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <AlertTriangle size={20} color="#dc2626" /> ATS Point Deductions
                    </h3>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "0.25rem 0.75rem", borderRadius: "50px" }}>
                      Lost: -{100 - (result.resumeQualityScore || result.overallScore)} pts
                    </span>
                  </div>

                  {result.issues && result.issues.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      {result.issues.map((issue, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", padding: "0.9rem 1.1rem", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "12px" }}>
                          <span style={{ background: "#ef4444", color: "white", fontSize: "0.78rem", fontWeight: 900, padding: "0.2rem 0.6rem", borderRadius: "6px", flexShrink: 0, marginTop: "2px" }}>
                            -{issue.pointsLost} pts
                          </span>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#991b1b", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>
                              {issue.category}
                            </span>
                            <p style={{ fontSize: "0.92rem", color: "#450a0a", margin: 0, fontWeight: 500, lineHeight: 1.45 }}>
                              {issue.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#166534", fontWeight: 600, margin: 0 }}>🎉 No structural point deductions detected!</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: PROOFREADING AUDIT (Complete Character-by-Character Inspection) */}
            {activeTab === "proofreading" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Complete Language and Proofreading Audit */}
                {result.languageAnalysis && (
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #ddd6fe",
                      borderRadius: "20px",
                      padding: "1.75rem",
                      marginBottom: "2rem",
                      boxShadow: "0 4px 15px rgba(124, 58, 237, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 800,
                        color: "#5b21b6",
                        margin: "0 0 1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FileSearch size={20} />
                      Complete Spelling, Grammar and Formatting Audit
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div
                        style={{
                          background: "#f5f3ff",
                          border: "1px solid #ddd6fe",
                          borderRadius: "12px",
                          padding: "1rem",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "#6d28d9",
                            fontWeight: 800,
                          }}
                        >
                          LANGUAGE SCORE
                        </span>

                        <strong
                          style={{
                            fontSize: "1.5rem",
                            color: "#4c1d95",
                          }}
                        >
                          {result.languageAnalysis.languageScore}/100
                        </strong>
                      </div>

                      <div
                        style={{
                          background: "#fff7ed",
                          border: "1px solid #fed7aa",
                          borderRadius: "12px",
                          padding: "1rem",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "#c2410c",
                            fontWeight: 800,
                          }}
                        >
                          TOTAL ISSUES
                        </span>

                        <strong
                          style={{
                            fontSize: "1.5rem",
                            color: "#9a3412",
                          }}
                        >
                          {result.languageAnalysis.totalIssues}
                        </strong>
                      </div>

                      <div
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "12px",
                          padding: "1rem",
                        }}
                      >
                        <span
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "#15803d",
                            fontWeight: 800,
                          }}
                        >
                          STATUS
                        </span>

                        <strong
                          style={{
                            fontSize: "1.1rem",
                            color: "#166534",
                          }}
                        >
                          {result.languageAnalysis.scoreLevel}
                        </strong>
                      </div>
                    </div>

                    {result.languageAnalysis.overallAssessment && (
                      <p
                        style={{
                          background: "#f8fafc",
                          padding: "0.9rem 1rem",
                          borderRadius: "10px",
                          color: "#334155",
                          fontSize: "0.9rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {result.languageAnalysis.overallAssessment}
                      </p>
                    )}

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.85rem",
                        marginTop: "1.25rem",
                      }}
                    >
                      {(result.languageAnalysis.issues || []).map((issue) => (
                        <div
                          key={issue.id}
                          style={{
                            background: "#fafafa",
                            border: "1px solid #e2e8f0",
                            borderLeft:
                              issue.severity === "high"
                                ? "4px solid #dc2626"
                                : issue.severity === "medium"
                                ? "4px solid #f59e0b"
                                : "4px solid #3b82f6",
                            borderRadius: "10px",
                            padding: "1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "1rem",
                              flexWrap: "wrap",
                              marginBottom: "0.65rem",
                            }}
                          >
                            <span
                              style={{
                                color: "#475569",
                                fontSize: "0.78rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                              }}
                            >
                              {issue.section} · Line {issue.lineNumber}
                            </span>

                            <span
                              style={{
                                color: "#7c3aed",
                                fontSize: "0.75rem",
                                fontWeight: 800,
                                textTransform: "uppercase",
                              }}
                            >
                              {issue.issueType} · {issue.severity}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                              gap: "0.75rem",
                            }}
                          >
                            <div
                              style={{
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                padding: "0.75rem",
                                borderRadius: "8px",
                              }}
                            >
                              <strong
                                style={{
                                  display: "block",
                                  color: "#991b1b",
                                  fontSize: "0.75rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                ORIGINAL
                              </strong>

                              <span
                                style={{
                                  color: "#7f1d1d",
                                  fontSize: "0.88rem",
                                }}
                              >
                                {issue.originalText}
                              </span>
                            </div>

                            <div
                              style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                padding: "0.75rem",
                                borderRadius: "8px",
                              }}
                            >
                              <strong
                                style={{
                                  display: "block",
                                  color: "#166534",
                                  fontSize: "0.75rem",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                SUGGESTED CORRECTION
                              </strong>

                              <span
                                style={{
                                  color: "#14532d",
                                  fontSize: "0.88rem",
                                }}
                              >
                                {issue.suggestedText}
                              </span>
                            </div>
                          </div>

                          <p
                            style={{
                              color: "#475569",
                              fontSize: "0.85rem",
                              lineHeight: 1.45,
                              margin: "0.7rem 0 0",
                            }}
                          >
                            {issue.explanation}
                          </p>

                          <span
                            style={{
                              display: "block",
                              color: "#94a3b8",
                              fontSize: "0.72rem",
                              marginTop: "0.4rem",
                            }}
                          >
                            Confidence: {Math.round((issue.confidence || 0) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {result.languageAnalysis.totalIssues === 0 && (
                      <div
                        style={{
                          background: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          color: "#166534",
                          borderRadius: "10px",
                          padding: "1rem",
                          fontWeight: 700,
                          marginTop: "1rem",
                        }}
                      >
                        No spelling, grammar or formatting issues were detected.
                      </div>
                    )}

                    {result.languageAnalysis.disclaimer && (
                      <p
                        style={{
                          color: "#64748b",
                          fontSize: "0.78rem",
                          margin: "1rem 0 0",
                        }}
                      >
                        {result.languageAnalysis.disclaimer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: JOB MATCH */}
            {activeTab === "jobMatch" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {result.jobMatchError && (
                  <div className="analysis-error" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontWeight: 600 }}>
                    {result.jobMatchError}
                  </div>
                )}

                {result.jobMatchAnalysis && (
                  <section className="job-match-report" style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "1.75rem", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1rem" }}>Job Description Match</h2>

                    <div className="job-match-score" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                      <strong style={{ fontSize: "1.75rem", fontWeight: 900, color: result.jobMatchAnalysis.jobMatchScore >= 80 ? "#16a34a" : result.jobMatchAnalysis.jobMatchScore >= 60 ? "#d97706" : "#dc2626" }}>
                        {result.jobMatchAnalysis.jobMatchScore}/100
                      </strong>

                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0284c7", background: "#e0f2fe", padding: "0.25rem 0.75rem", borderRadius: "50px" }}>
                        {result.jobMatchAnalysis.matchLevel}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#166534", margin: "1rem 0 0.5rem" }}>Matched Mandatory Requirements</h3>

                    {result.jobMatchAnalysis.matchedMandatoryRequirements?.length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {result.jobMatchAnalysis.matchedMandatoryRequirements.map(
                          (requirement) => (
                            <li key={requirement} style={{ background: "#f0fdf4", border: "1px solid #dcfce7", padding: "0.5rem 0.85rem", borderRadius: "8px", color: "#166534", fontWeight: 600, fontSize: "0.9rem" }}>
                              ✅ {requirement}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p style={{ color: "#64748b", fontSize: "0.9rem", margin: "0 0 1rem" }}>No mandatory requirements were matched.</p>
                    )}

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#991b1b", margin: "1rem 0 0.5rem" }}>Missing Mandatory Requirements</h3>

                    {result.jobMatchAnalysis.missingMandatoryRequirements?.length > 0 ? (
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {result.jobMatchAnalysis.missingMandatoryRequirements.map(
                          (requirement) => (
                            <li key={requirement} style={{ background: "#fef2f2", border: "1px solid #fee2e2", padding: "0.5rem 0.85rem", borderRadius: "8px", color: "#991b1b", fontWeight: 600, fontSize: "0.9rem" }}>
                              ❌ {requirement}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p style={{ color: "#16a34a", fontSize: "0.9rem", margin: "0 0 1rem" }}>No mandatory requirements are missing.</p>
                    )}

                    <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", margin: "1rem 0 0.5rem" }}>Score Breakdown</h3>

                    <div className="job-match-breakdown" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1.25rem" }}>
                      {result.jobMatchAnalysis.categoryBreakdown?.map(
                        (category) => (
                          <div key={category.category} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.75rem 1rem", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>{category.category}</span>

                            <strong style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0284c7" }}>
                              {category.score}/{category.maximum}
                            </strong>
                          </div>
                        )
                      )}
                    </div>

                    <p className="score-disclaimer" style={{ fontSize: "0.82rem", color: "#64748b", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid #cbd5e1", margin: 0 }}>
                      {result.jobMatchAnalysis.disclaimer}
                    </p>
                  </section>
                )}
              </div>
            )}

            {/* TAB 5: AI REWRITES */}
            {activeTab === "rewrites" && result.aiAnalysis && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ background: "linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)", border: "1.5px solid #7dd3fc", borderRadius: "20px", padding: "1.75rem", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "#0369a1", margin: "0 0 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Sparkles size={20} color="#0284c7" /> Gemini AI Explanations & Section Improvements
                  </h3>

                  {result.aiAnalysis.professionalSummary && typeof result.aiAnalysis.professionalSummary === "string" && (
                    <div style={{ background: "white", padding: "1rem 1.25rem", borderRadius: "12px", border: "1px solid #e0f2fe", marginBottom: "1.25rem" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", display: "block", marginBottom: "0.3rem" }}>
                        AI Executive Assessment
                      </span>
                      <p style={{ margin: 0, fontSize: "0.92rem", color: "#1e293b", lineHeight: 1.5, fontWeight: 500 }}>
                        {result.aiAnalysis.professionalSummary}
                      </p>
                    </div>
                  )}

                  {/* Section Improvements */}
                  {result.aiAnalysis.sectionImprovements && Array.isArray(result.aiAnalysis.sectionImprovements) && result.aiAnalysis.sectionImprovements.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      {result.aiAnalysis.sectionImprovements.map((sec, idx) => {
                        const secName = typeof sec === "object" ? String(sec.section || "Section") : "Section";
                        const prob = typeof sec === "object" ? String(sec.currentProblem || sec.problem || "") : String(sec);
                        const imp = typeof sec === "object" ? String(sec.improvedExample || sec.suggestion || "") : "";
                        return (
                          <div key={idx} style={{ background: "white", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "1.1rem" }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "#0284c7", textTransform: "uppercase" }}>
                              {secName}
                            </span>
                            {prob && (
                              <p style={{ fontSize: "0.88rem", color: "#64748b", margin: "0.3rem 0 0.6rem" }}>
                                <strong style={{ color: "#b91c1c" }}>Issue:</strong> {prob}
                              </p>
                            )}
                            {imp && (
                              <div style={{ background: "#f8fafc", borderLeft: "3px solid #10b981", padding: "0.6rem 0.85rem", borderRadius: "0 8px 8px 0" }}>
                                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#166534", display: "block", marginBottom: "0.2rem" }}>
                                  ✓ RECOMMENDED REWRITE:
                                </span>
                                <p style={{ margin: 0, fontSize: "0.9rem", color: "#0f172a", fontStyle: "italic", lineHeight: 1.45 }}>
                                  "{imp}"
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Call to Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
                marginTop: "1rem"
              }}
            >
              <button
                onClick={() => {
                  localStorage.setItem("builder_mode", "manual");
                  navigate("/builder");
                }}
                style={{
                  background: "linear-gradient(135deg, #0284c7, #0369a1)",
                  color: "white",
                  border: "none",
                  padding: "0.9rem 2.25rem",
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 18px rgba(2, 132, 199, 0.35)"
                }}
              >
                <Sparkles size={18} /> Improve Resume in Builder
              </button>

              <button
                onClick={() => {
                  setResult(null);
                  setSelectedFile(null);
                  setJobDescription("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{
                  background: "#ffffff",
                  color: "#334155",
                  border: "1.5px solid #cbd5e1",
                  padding: "0.9rem 2rem",
                  borderRadius: "14px",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <RefreshCw size={16} /> Analyze Another Resume
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

class ResumeCheckerBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ResumeChecker render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "2rem", fontFamily: "'Inter', sans-serif" }}>
          <div style={{ background: "white", padding: "2.5rem", borderRadius: "20px", border: "1px solid #e2e8f0", maxWidth: "500px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>Unable to Render Analysis</h2>
            <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "0 0 1.5rem", lineHeight: 1.5 }}>
              A temporary display error occurred while rendering the report.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                background: "#0284c7",
                color: "white",
                border: "none",
                padding: "0.75rem 1.75rem",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer"
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return <ResumeChecker {...this.props} />;
  }
}

export default ResumeCheckerBoundary;
