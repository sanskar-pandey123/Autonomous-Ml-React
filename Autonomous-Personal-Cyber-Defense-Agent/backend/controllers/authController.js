const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");

// ==============================
// Helper: Generate 6-digit OTP
// ==============================
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ==============================
// sIGNUP CONTROLLER
// ==============================
const signupUser = async (req, res) => {
  console.log(" SIGNUP CONTROLLER HIT .............0893409");
  console.log(" SIGNUP API HIT ");

  try {
    const { name, mobile, password } = req.body;

    // 1️ Validation
    if (!name || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // 2️ Check existing user
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ message: "Mobile already registered" });
    }

    // 3️ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️ Save user
    const newUser = new User({
      name,
      mobile,
      password: hashedPassword,
      isVerified: false
    });

    await newUser.save();

    // 5️ Generate OTP
    const otpCode = generateOtp();

    // 6️ OTP expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 7️ Save OTP
    await Otp.create({
      mobile,
      otp: otpCode,
      expiresAt
    });

    //  DEBUG: OTP PRINT
    console.log(" OTP GENERATED ", otpCode);

    return res.status(201).json({
      message: "Signup successful. OTP sent to mobile."
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// TP VERIFY CONTROLLER
// ==============================
const verifyOtp = async (req, res) => {
  console.log(" VERIFY OTP API HIT ");

  try {
    const { mobile, otp } = req.body;

    // 1️ Validation
    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP required" });
    }

    // 2️ Find OTP
    const otpRecord = await Otp.findOne({ mobile, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 3️ Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ mobile });
      return res.status(400).json({ message: "OTP expired" });
    }

    // 4️ Mark user as verified
    await User.updateOne(
      { mobile },
      { $set: { isVerified: true } }
    );

    // 5️ Delete OTP after success
    await Otp.deleteMany({ mobile });

    return res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// ==============================
// LOGIN CONTROLLER (JWT)
// ==============================
const loginUser = async (req, res) => {
  console.log("LOGIN API HIT ");

  try {
    const { mobile, password } = req.body;

    // 1️ validation
    if (!mobile || !password) {
      return res.status(400).json({ message: "Mobile and password required" });
    }

    // 2️ user exist?
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 3️ OTP verified?
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    // 4️ password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("JWT_SECRET CHECK =>", process.env.JWT_SECRET);

    // 5️ JWT token generate
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6️ success response
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// ==============================
// XPORT CONTROLLERS (ONLY ONCE)
// ==============================
module.exports = {
  signupUser,
  verifyOtp,
  loginUser
};