const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const aiRoutes = require("./routes/aiRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const industryRoutes = require("./routes/industryRoutes");
const templateRoutes = require("./routes/templateRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", resumeRoutes);
app.use("/api", industryRoutes);
app.use("/api", templateRoutes);

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
