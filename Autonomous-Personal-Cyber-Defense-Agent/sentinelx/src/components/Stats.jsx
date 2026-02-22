import React, { useEffect, useState, useRef } from "react";
import "./css/Stats.css";

function Counter({ target, suffix, start }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let current = 0;
    const duration = 2000;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, start]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  // Trigger counter when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className="stats" ref={sectionRef}>
      <div className="stats-header">
        <h2>Digital Threat Landscape</h2>
        <p>
          Cybercrime is evolving rapidly. Autonomous AI-driven defense systems
          are no longer optional — they are essential.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">
            <Counter target={300} suffix="%" start={visible} />
          </div>
          <p>Increase in global phishing attacks over recent years</p>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            <Counter target={70} suffix="%" start={visible} />
          </div>
          <p>Users unable to identify malicious URLs effectively</p>
        </div>

        <div className="stat-card">
          <div className="stat-number">
            <Counter target={24} suffix="/7" start={visible} />
          </div>
          <p>Continuous AI-powered autonomous monitoring & protection</p>
        </div>
      </div>
    </section>
  );
}