import React from "react";
import "./css/Features.css";

export default function Features() {

  const features = [
    {
      title: "Scam SMS Detection",
      desc: "Detects fraudulent SMS using AI pattern recognition and risk scoring.",
      icon: "📩"
    },
    {
      title: "Phishing URL Analyzer",
      desc: "Analyzes suspicious links and identifies malicious domains instantly.",
      icon: "🔗"
    },
    {
      title: "Risk Score Timeline",
      desc: "Tracks your digital threat exposure and shows real-time risk trends.",
      icon: "📊"
    },
    {
      title: "AI Threat Explanation",
      desc: "Explains threats in simple human language with actionable advice.",
      icon: "🤖"
    }
  ];

  return (
    <section className="features">

      <div className="features-header">
        <h2>Powerful AI Capabilities</h2>
        <p>
          Advanced machine learning models continuously monitor and defend your digital ecosystem.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">

            <div className="feature-icon">{feature.icon}</div>

            <h3>{feature.title}</h3>

            <p>{feature.desc}</p>

          </div>
        ))}
      </div>

    </section>
  );
}
