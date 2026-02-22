const express = require("express");
const router = express.Router();

// ==============================
// IMPORTS
// ==============================

// Auth controller (signup, otp, login)
const authController = require("../controllers/authController");

// JWT middleware (protected routes ke liye)
const protect = require("../middleware/authMiddleware");

// User model (profile ke liye)
const User = require("../models/User");

console.log(" AUTH ROUTES FILE LOADED ");

// ==============================
// PUBLIC ROUTES (Token NOT required)
// ==============================

// Signup
router.post("/signup", authController.signupUser);

// OTP Verify
router.post("/verify-otp", authController.verifyOtp);

// Login (JWT token milta hai)
router.post("/login", authController.loginUser);

// ==============================
// PROTECTED ROUTES (Token REQUIRED)
// ==============================

// 📌 PROFILE ROUTE
// Header required:
// Authorization: Bearer <TOKEN>
router.get("/profile", protect, async (req, res) => {
  try {
    // JWT se aaya userId → DB se user lao
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Success response
    res.json({
      message: "Profile fetched successfully",
      user
    });

  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
