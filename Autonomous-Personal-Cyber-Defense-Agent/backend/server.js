require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const aiRoutes = require("./routes/aiRoutes");   //  NEW AI ROUTE
const scanRoutes = require("./routes/scanRoutes");
const app = express();

// ==============================
// Middlewares
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// Database Connection
// ==============================
connectDB();

// ==============================
// Base Route (Health Check)
// ==============================
app.get("/", (req, res) => {
  res.send(" Backend running fine");
});

// ==============================
// Auth Routes
// ==============================
app.use("/api/auth", authRoutes);

// ==============================
// Contact Routes 
// ==============================
app.use("/api/contact", contactRoutes);

// ==============================
// 🔥 AI Threat Analysis Route
// ==============================
app.use("/api/ai", aiRoutes);
app.use("/api/scans", scanRoutes);
// ==============================
// Global Error Handler (optional but pro)
// ==============================
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

// ==============================
// Server Start
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});