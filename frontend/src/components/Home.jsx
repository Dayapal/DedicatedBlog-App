import React from "react";
import Hero from "../home/Hero";
import Trending from "../home/Trending";
import Creator from "../home/Creator";
import CategoryPage from "../home/CategoryPage";

const Home = () => {
  return (
    <div className="space-y-4">
      <Hero />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[var(--glass-border-subtle)]" />
      </div>
      <Trending />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[var(--glass-border-subtle)]" />
      </div>
      <CategoryPage />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[var(--glass-border-subtle)]" />
      </div>
      <Creator />
    </div>
  );
};

export default Home;
