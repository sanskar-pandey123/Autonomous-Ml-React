import React from "react";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Stats from "../components/Stats";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}