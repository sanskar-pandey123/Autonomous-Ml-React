import { useState, useEffect } from "react";
import "./css/Login1.css";
import api from "../api/axios";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showManage, setShowManage] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // ================= LOGIN =================
const handleLogin = async () => {
  try {
    const res = await api.post("/auth/login", {
      mobile,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data); // 🔥 DEBUG

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    console.log("TOKEN AFTER SAVE:", localStorage.getItem("token")); // 🔥 DEBUG

    setIsLoggedIn(true);
    alert("Login successful");

    //  IMPORTANT FIX (Redirect + Reload)
    window.location.href = "/scan";

  } catch (err: any) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  // ================= SIGNUP =================
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/auth/signup", {
        name,
        mobile,
        password,
      });

      alert(res.data.message);
      setShowOtpBox(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-otp", {
        mobile,
        otp,
      });

      alert(res.data.message);
      setIsSignup(false);
      setShowOtpBox(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
     window.location.href = "/";
  };

  return (
    <div className="auth-page">
      <div className={`auth-box ${isSignup ? "signup" : "login"}`}>

        {/* LEFT PANEL */}
        <div className="auth-info">
          <h1>{isSignup ? "Welcome Back" : "Hello, Explorer"}</h1>
          <p>
            {isSignup
              ? "Already have an account? Login and continue your journey."
              : "Real-time AI security for a safer digital world. Smart protection. Zero compromise."}
          </p>

          {!isLoggedIn && (
            <button onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Login" : "Sign Up"}
            </button>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-form">

          {isLoggedIn ? (
            <>
              <div className="google-auth-container">

                <div className="google-header">
                  <span>{user?.mobile}@gmail.com</span>
                  <button className="close-btn">✕</button>
                </div>

                <div className="google-profile-section">
                  <div className="google-avatar-wrapper">
                    <img
                      src={
                        localStorage.getItem("profileImage") ||
                        "https://via.placeholder.com/120"
                      }
                      alt="profile"
                      className="google-avatar"
                    />

                    <label className="camera-icon">
                      📷
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              localStorage.setItem(
                                "profileImage",
                                reader.result as string
                              );
                              window.location.reload();
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <h2>Hi, {user?.name}!</h2>

                  <button
                    className="manage-btn"
                    onClick={() => setShowManage(true)}
                  >
                    Manage your Account
                  </button>
                </div>
              </div>

              {/* SLIDE PANEL */}
              <div className={`slide-panel ${showManage ? "open" : ""}`}>
                <div className="slide-header">
                  <h3>Google Account</h3>
                  <button onClick={() => setShowManage(false)}>✕</button>
                </div>

                <div className="slide-menu">
                  {[
                    { name: "Home", icon: "🏠" },
                    { name: "Personal info", icon: "📋" },
                    { name: "Security & sign-in", icon: "🔒" },
                    { name: "update your password", icon: "🔑" },
                    { name: "Data & privacy", icon: "🛡" },
                    { name: "People & sharing", icon: "👥" },
                    { name: "Payments & subscriptions", icon: "💳" }
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`slide-item ${
                        activeTab === item.name ? "active-slide" : ""
                      }`}
                      onClick={() => setActiveTab(item.name)}
                    >
                      <span className="slide-icon">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="slide-footer">
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>Help</span>
                  <span>About</span>
                </div>
              </div>

              {showManage && (
                <div
                  className="overlay"
                  onClick={() => setShowManage(false)}
                />
              )}

              <div className="google-footer">
                <button
                  className="submit-btn-12"
                  onClick={() => (window.location.href = "/")}
                >
                  ⬅ Back to Home
                </button>

                <button
                  className="signout-btn"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>{isSignup ? "Create Account" : "Login"}</h2>

              {isSignup && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <input
                type="text"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {isSignup && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              {showOtpBox && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="submit-btn"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {!showOtpBox && (
                <button
                  className="submit-btn"
                  onClick={isSignup ? handleSignup : handleLogin}
                >
                  {isSignup ? "Sign Up" : "Login"}
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;
