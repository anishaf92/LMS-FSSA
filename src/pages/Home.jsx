import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyFSSA from "../components/WhyFSSA"; 

function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <WhyFSSA />
    </div>
  );
}

export default Home;