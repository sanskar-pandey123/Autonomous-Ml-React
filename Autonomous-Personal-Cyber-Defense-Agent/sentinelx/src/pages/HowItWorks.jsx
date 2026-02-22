import React from "react";
import "./css/HowItWorks.css";

export default function HowItWorks() {
  return (
    <div className="how-container">

      {/* Header */}
      <div className="how-header">
        <h1>🛡 HOW OUR AI CYBER DEFENCE WORKS</h1>
        <p>Smart Detection • Real-Time Analysis • Intelligent Protection</p>
      </div>

      {/* Flow Section */}
      <div className="flow-section">
        {[
          {
            number: "1",
            title: "User Input",
            desc: "User submits suspicious SMS, Email or URL."
          },
          {
            number: "2",
            title: "AI Threat Analysis",
            desc: "Machine learning scans patterns, keywords and behaviour."
          },
          {
            number: "3",
            title: "Risk Scoring",
            desc: "System generates a smart security risk percentage."
          },
          {
            number: "4",
            title: "Protection Advice",
            desc: "AI explains the threat & suggests safe actions."
          }
        ].map((step, index) => (
          <div className="step-card" key={index}>
            <div className="step-circle">{step.number}</div>
            <h2>{step.title}</h2>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>

      {/* NEW: AI Engine Section */}
      <div className="ai-section">
        <h2>⚡ OUR AI ENGINE</h2>
        <div className="ai-grid">
          <div className="ai-box">
            <h3>🔍 Pattern Recognition</h3>
            <p>Detects phishing patterns and malicious signatures instantly.</p>
          </div>
          <div className="ai-box">
            <h3>🧠 Behaviour Analysis</h3>
            <p>Analyzes suspicious domain behaviour and traffic anomalies.</p>
          </div>
          <div className="ai-box">
            <h3>⚙ Real-Time Monitoring</h3>
            <p>24/7 monitoring for zero-delay protection response.</p>
          </div>
        </div>
      </div>

      {/* Risk Levels Section */}
      <div className="risk-section">
        <h2>CYBERSECURITY RISK LEVELS</h2>

        <div className="risk-container">
          <div className="risk critical">
            <div className="outer-ring">
              <div className="inner-circle">CRITICAL</div>
            </div>
            <p>High Probability • Severe Damage</p>
          </div>

          <div className="risk high">
            <div className="outer-ring">
              <div className="inner-circle">HIGH</div>
            </div>
            <p>High Probability • Major Risk</p>
          </div>

          <div className="risk medium">
            <div className="outer-ring">
              <div className="inner-circle">MEDIUM</div>
            </div>
            <p>Moderate Probability • Controlled Risk</p>
          </div>

          <div className="risk low">
            <div className="outer-ring">
              <div className="inner-circle">LOW</div>
            </div>
            <p>Low Probability • Minor Impact</p>
          </div>
        </div>
      </div>

      {/* NEW: Protection Guarantee Section */}
      <div className="protection-section">
        <h2>🚀 WHY TRUST SENTINEL X?</h2>
        <div className="protection-grid">
          <div className="protect-card">
            <h3>99.9% Detection Accuracy</h3>
            <p>Advanced AI models trained on millions of cyber threats.</p>
          </div>
          <div className="protect-card">
            <h3>Instant Threat Alerts</h3>
            <p>Get notified instantly when risk level increases.</p>
          </div>
          <div className="protect-card">
            <h3>Data Privacy First</h3>
            <p>Your data is encrypted and never stored permanently.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
