const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const aiRoutes = require("./routes/aiRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const industryRoutes = require("./routes/industryRoutes");
const templateRoutes = require("./routes/templateRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const resumeExampleRoutes = require("./routes/resumeExampleRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminResumeExampleRoutes = require("./routes/adminResumeExampleRoutes");
const adminExampleRoutes = require("./routes/adminExampleRoutes");
const adminPlanRoutes = require("./routes/adminPlanRoutes");
const exampleRoutes = require("./routes/exampleRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const adminReportRoutes = require("./routes/adminReportRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminTemplateRoutes = require("./routes/adminTemplateRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const downloadPlanRoutes = require("./routes/downloadPlanRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/examples", exampleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/resume-examples", adminResumeExampleRoutes);
app.use("/api/admin/examples", adminExampleRoutes);
app.use("/api/admin/plans", adminPlanRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/templates", adminTemplateRoutes);
app.use("/api/downloads", downloadRoutes);
app.use("/api/download-plans", downloadPlanRoutes);
app.use("/api", resumeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", userRoutes);
app.use("/api", industryRoutes);
app.use("/api/sessions", sessionRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("🎉 AI Resume Builder Backend is Running!");
});

// Health API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running successfully",
  });
});

module.exports = app;
