import React, { useState, useEffect } from "react";
import "./css/Navbar.css";
import { Link } from "react-router-dom";

export default function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>

      <div className="logo">
        <span className="logo-red">DarkTrace</span>
        <span className="logo-white">X</span>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/scan">Scan</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/how-it-works">How It Works</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/login" className="login-btn">Login</Link></li>
      </ul>

    </nav>
  );
}