import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./css/Dashboard.css";

export default function Dashboard() {

  const [history, setHistory] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scanHistory")) || [];
    setHistory(saved);
  }, []);

  const total = history.length;
  const threats = history.filter(item => item.score > 60).length;
  const safe = history.filter(item => item.score <= 60).length;
  const avgRisk = total
    ? Math.floor(history.reduce((a, b) => a + b.score, 0) / total)
    : 0;

  return (
    <div className="dashboard-wrapper">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">CYBER AI</h2>
        <ul>
          <li className={activePage === "dashboard" ? "active" : ""}
              onClick={() => setActivePage("dashboard")}>
            Dashboard
          </li>

          <li>
            <Link to="/scan">Scan</Link>
          </li>

          <li className={activePage === "history" ? "active" : ""}
              onClick={() => setActivePage("history")}>
            History
          </li>

          <li className={activePage === "reports" ? "active" : ""}
              onClick={() => setActivePage("reports")}>
            Reports
          </li>

          <li className={activePage === "settings" ? "active" : ""}
              onClick={() => setActivePage("settings")}>
            Settings
          </li>
        </ul>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">

        {/* DASHBOARD PAGE */}
        {activePage === "dashboard" && (
          <>
            <h1 className="dashboard-title">Security Dashboard</h1>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Scans</h3>
                <p>{total}</p>
              </div>

              <div className="stat-card danger-card">
                <h3>Threats Detected</h3>
                <p>{threats}</p>
              </div>

              <div className="stat-card safe-card">
                <h3>Safe Reports</h3>
                <p>{safe}</p>
              </div>

              <div className="stat-card">
                <h3>Average Risk</h3>
                <p>{avgRisk}%</p>
              </div>
            </div>
          </>
        )}

        {/* HISTORY PAGE */}
        {activePage === "history" && (
          <div className="table-section">
            <h2>Scan History</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Input</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((scan) => (
                  <tr key={scan.id}>
                    <td>{scan.type.toUpperCase()}</td>
                    <td>{scan.inputValue}</td>
                    <td>{scan.score}%</td>
                    <td className={scan.score > 60 ? "danger-text" : "safe-text"}>
                      {scan.status}
                    </td>
                    <td>{scan.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORTS PAGE */}
        {activePage === "reports" && (
          <div className="ai-section">
            <h2>📄 Detailed Reports</h2>
            {history.length === 0 && <p>No reports available.</p>}
            {history.map((scan) => (
              <div key={scan.id} className="alert-box">
                {scan.type.toUpperCase()} → {scan.status} ({scan.score}%)
                <br />
                Confidence: {scan.confidence || 90}%
              </div>
            ))}
          </div>
        )}

        {/* SETTINGS PAGE WITH VIDEO */}
        {activePage === "settings" && (
          <div className="settings-video-wrapper">


            {/* Dark Overlay */}
            {/* <div className="video-overlay"></div> */}

            {/* SETTINGS CONTENT */}
            <div className="settings-section">

              <h2 className="settings-title">⚙ System Settings</h2>

              {/* Profile */}
              <div className="settings-card">
                <h3>Profile Information</h3>
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email Address" />
                <button className="save-btn">Update Profile</button>
              </div>

              {/* Security */}
              <div className="settings-card">
                <h3>Security Preferences</h3>

                <label>
                  <input type="checkbox" defaultChecked />
                  Enable Real-Time Protection
                </label>

                <label>
                  <input type="checkbox" />
                  Auto Block High-Risk Threats
                </label>

                <label>
                  <input type="checkbox" />
                  Enable Behavioral AI Monitoring
                </label>
              </div>

              {/* Notifications */}
              <div className="settings-card">
                <h3>Notifications</h3>

                <label>
                  <input type="checkbox" defaultChecked />
                  Email Alerts
                </label>

                <label>
                  <input type="checkbox" />
                  SMS Alerts
                </label>

                <label>
                  <input type="checkbox" />
                  Weekly Security Reports
                </label>
              </div>

              {/* AI Sensitivity */}
              <div className="settings-card">
                <h3>AI Sensitivity Level</h3>
                <select className="dropdown">
                  <option>Low (Minimal Alerts)</option>
                  <option>Medium (Balanced Protection)</option>
                  <option>High (Strict Monitoring)</option>
                </select>
              </div>

              {/* Danger Zone */}
              <div className="settings-card danger-zone">
                <h3>⚠ Danger Zone</h3>

                <button
                  className="clear-btn"
                  onClick={() => {
                    localStorage.removeItem("scanHistory");
                    setHistory([]);
                  }}
                >
                  Clear Scan History
                </button>

                <button className="reset-btn">
                  Reset System Configuration
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}