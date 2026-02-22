import { useState, useEffect } from "react";
import axios from "axios";
import "./css/ScanPage.css";

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState("url");
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 🔥 Load History FROM DATABASE
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ moved inside
        console.log("TOKEN FOR FETCH:", token);

        if (!token) return;

        const res = await axios.get(
          "http://localhost:5000/api/scans",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Fetched History:", res.data);
        setHistory(res.data);

      } catch (error) {
        console.error("History Fetch Error:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleScan = async () => {
    if (!input) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/analyze",
        { input }
      );

      const data = response.data;

      const calculatedScore = Math.round(
        data.final_risk_score || data.risk_score || 0
      );

      const scanResult = {
        id: Date.now(),
        type: data.type,
        inputValue: input,
        score: calculatedScore,
        threatLevel: data.threat_level,
        status:
          data.threat_level === "HIGH"
            ? "Dangerous"
            : data.threat_level === "MEDIUM"
            ? "Warning"
            : "Safe",
        date: new Date().toLocaleString(),
      };

      setResult(scanResult);

      // 🔥 SAVE TO MONGODB
      const token = localStorage.getItem("token");
      console.log("TOKEN FOR SAVE:", token);

      if (token) {
        const saveRes = await axios.post(
          "http://localhost:5000/api/scans",
          {
            scanType: activeTab,
            inputValue: input,
            result: JSON.stringify(scanResult)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("Save Response:", saveRes.data);

        // 🔥 After save, refetch history
        const historyRes = await axios.get(
          "http://localhost:5000/api/scans",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setHistory(historyRes.data);
      }

      // Local backup (unchanged)
      const updatedHistory = [scanResult, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(
        "scanHistory",
        JSON.stringify(updatedHistory)
      );

    } catch (error) {
      console.error("Scan Error:", error);
    }

    setLoading(false);
  };

  const clearHistory = () => {
    localStorage.removeItem("scanHistory");
    setHistory([]);
  };

  return (
    <div className="scan-wrapper">

      <div className="hero-section">
        <h1>AI Threat Scanner</h1>
        <p>Detect phishing links & scam messages instantly.</p>
      </div>

      <div className="tab-container">
        {["url", "sms"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab.toUpperCase()} Scan
          </button>
        ))}
      </div>

      <div className="scan-card">
        {activeTab === "url" ? (
          <input
            type="text"
            placeholder="Enter suspicious URL"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        ) : (
          <textarea
            placeholder="Paste suspicious message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}

        <button onClick={handleScan}>
          {loading ? "Scanning..." : "Start Scanning"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          <h2
            className={
              result.threatLevel === "HIGH"
                ? "danger"
                : result.threatLevel === "MEDIUM"
                ? "warning"
                : "safe"
            }
          >
            {result.status}
          </h2>

          <p><strong>Threat Level:</strong> {result.threatLevel}</p>
          <p><strong>Risk Score:</strong> {result.score}/100</p>
          <p><strong>Scanned:</strong> {result.inputValue}</p>
          <p><strong>Time:</strong> {result.date}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="history-section">
          <h3>Recent Scans</h3>
          {history.slice(0, 5).map((item, index) => (
            <div key={index} className="history-item">
              <span>{item.scanType || item.type}</span>
              <span>{item.score || ""}/100</span>
              <span>{item.threatLevel || ""}</span>
            </div>
          ))}
          <button onClick={clearHistory}>Clear History</button>
        </div>
      )}

    </div>
  );
}