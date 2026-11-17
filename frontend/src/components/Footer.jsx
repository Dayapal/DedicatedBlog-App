import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { FiFeather, FiArrowRight, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Subscribed to weekly stories! ✨");
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  const categories = [
    "Technology",
    "Devotional",
    "Business",
    "Sports",
    "Health",
    "Entertainment",
  ];

  return (
    <footer className="relative mt-24 border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#747FDD] via-[#6571D8] to-[#69D8F2] flex items-center justify-center text-white shadow-md shadow-[#747FDD]/30">
                <FiFeather className="text-xl" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Dedicated<span className="bg-gradient-to-r from-[#747FDD] to-[#69D8F2] bg-clip-text text-transparent">Blog</span>
              </span>
            </Link>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              An Android 16-inspired publishing platform where ideas, culture, and technology connect through captivating stories.
            </p>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Subscribe for curated articles
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="glass-input flex-1 py-2.5 px-4 text-xs sm:text-sm font-normal"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#747FDD] to-[#454FA8] text-white text-xs font-semibold shadow-md shadow-[#747FDD]/25 hover:shadow-lg transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {subscribed ? <FiCheck /> : <FiArrowRight />}
                  <span>{subscribed ? "Done" : "Join"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to="/blogs"
                    className="hover:text-[#747FDD] transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li>
                <Link to="/" className="hover:text-[#747FDD] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-[#747FDD] transition-colors">
                  All Stories
                </Link>
              </li>
              <li>
                <Link to="/creators" className="hover:text-[#747FDD] transition-colors">
                  Authors & Creators
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#747FDD] transition-colors">
                  About the Engineer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#747FDD] transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4">
              Connect
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Crafted with clean code, SOLID architecture, and modern Liquid Glass aesthetics.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: FaGithub, href: "https://github.com/Dayapal", label: "GitHub" },
                { icon: FaLinkedin, href: "https://www.linkedin.com/in/dayapal/", label: "LinkedIn" },
                { icon: BsYoutube, href: "#", label: "YouTube" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center glass-panel border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[#747FDD] hover:scale-105 transition-all"
                >
                  <item.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--glass-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} DedicatedBlog Platform. Built with React & Node.js.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[var(--text-primary)] transition-colors">
              Portfolio
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-[var(--text-primary)] transition-colors">
              Support
            </Link>
            <span>•</span>
            <span>MERN Stack Production Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
