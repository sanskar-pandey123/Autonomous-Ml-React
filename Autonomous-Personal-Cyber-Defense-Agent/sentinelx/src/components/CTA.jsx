import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/CTA.css";

export default function CTA() {

  const navigate = useNavigate();

  return (
    <section className="cta">

      <div className="cta-wrapper">

        <div className="cta-content">
          <h2>
            Secure Your Digital Life with <span>Autonomous AI Protection</span>
          </h2>

          <p>
            Deploy intelligent cyber defense that detects, analyzes, and neutralizes
            threats in real time. Stay protected against phishing, scams, and digital fraud 24/7.
          </p>

          <div className="cta-buttons">

            {/* Primary Button */}
            <button
              className="cta-primary"
              onClick={() => navigate("/scan")}
            >
              Activate Protection
            </button>

            {/* Secondary Button */}
            <button
              className="cta-secondary"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </button>

          </div>

        </div>

      </div>

      <div className="cta-glow"></div>

    </section>
  );
}