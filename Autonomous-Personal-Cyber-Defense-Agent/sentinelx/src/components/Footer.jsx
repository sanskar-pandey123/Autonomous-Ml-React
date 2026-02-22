import React from "react";
import "./css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        {/* Brand Section */}
        <div className="footer-brand">
          <h2>SentinelX</h2>
          <p>
            Autonomous AI-powered cyber defense system protecting users from
            scams, phishing attacks, and digital fraud in real-time.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Scan</li>
            <li>Dashboard</li>
            <li>How It Works</li>
            <li>Login</li>
          </ul>
        </div>

        {/* Features */}
        <div className="footer-links">
          <h3>Core Features</h3>
          <ul>
            <li>Scam SMS Detection</li>
            <li>Phishing URL Analyzer</li>
            <li>Risk Score Timeline</li>
            <li>AI Threat Explanation</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Get security alerts & product updates.</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© 2026 SentinelX | Autonomous Cyber Defense System</p>
        <div className="social-icons">
          <span>⚫</span>
          <span>🔴</span>
          <span>⚫</span>
        </div>
      </div>

    </footer>
  );
}
