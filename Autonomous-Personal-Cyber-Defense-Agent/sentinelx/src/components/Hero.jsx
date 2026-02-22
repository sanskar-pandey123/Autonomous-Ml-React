import React from "react";
import bgVideo from "../assets/videos/main-background-video.mp4";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./css/Hero.css";

export default function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero">

      <video
      autoPlay
      loop
      muted
      playsInline
      className="hero-video"
>
  <source src={bgVideo} type="video/mp4" />
</video>

      <div className="hero-overlay"></div>

      <div className="hero-content">

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Autonomous Personal <span>Cyber Defense</span> Agent
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Real-time AI protection against scam SMS, phishing websites,
          suspicious transactions and digital fraud.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hero-buttons"
        >
          <button
            className="primary-btn"
            onClick={() => navigate("/scan")}
          >
            Start Scanning
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/dashboard")}
          >
            View Dashboard
          </button>
        </motion.div>

      </div>

    </section>
  );
}