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

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/examples", resumeExampleRoutes);
app.use("/api", resumeRoutes);
app.use("/api", industryRoutes);

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
