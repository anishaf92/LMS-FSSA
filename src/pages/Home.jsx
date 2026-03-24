import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyFSSA from "../components/WhyFSSA";
import Footer from "../components/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <WhyFSSA />
      <Footer />
    </div>
  );
}

export default Home;
