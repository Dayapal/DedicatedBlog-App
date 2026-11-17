import React from "react";
import { motion } from "framer-motion";
import {
  FaCode,
  FaServer,
  FaPalette,
  FaDatabase,
  FaCloud,
  FaRocket,
  FaGraduationCap,
  FaAward,
  FaHeart,
  FaLightbulb,
  FaFutbol,
  FaGithub,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";

function About() {
  const skillCards = [
    { icon: FaCode, title: "Frontend Architecture", skills: "React.js, Next.js, TypeScript, Tailwind CSS", color: "from-[#747FDD] to-[#69D8F2]" },
    { icon: FaServer, title: "Backend Systems", skills: "Node.js, Express.js, REST APIs, Microservices", color: "from-[#A78BFA] to-[#747FDD]" },
    { icon: FaPalette, title: "Design Systems", skills: "Material 3 Expressive, Glassmorphism, Responsive UI", color: "from-[#F0A6D8] to-[#A78BFA]" },
    { icon: FaDatabase, title: "Databases & Caching", skills: "MongoDB, Mongoose, Redis, Schema Indexing", color: "from-[#69D8F2] to-[#747FDD]" },
    { icon: FaCloud, title: "Cloud & DevOps", skills: "Docker, CI/CD Actions, Cloudinary, Linux/Nginx", color: "from-[#747FDD] to-[#454FA8]" },
    { icon: FaRocket, title: "Performance & Security", skills: "Web Vitals, Rate Limiting, OWASP, Compression", color: "from-[#A78BFA] to-[#69D8F2]" },
  ];

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Hero Header */}
      <GlassCard radius="hero" className="!p-8 sm:!p-12 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#747FDD] via-[#A78BFA] to-[#69D8F2] flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-[#747FDD]/30">
          <FaCode />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[var(--glass-border)] text-xs font-semibold text-[#747FDD] uppercase tracking-wider mb-4">
          <span>Full-Stack MERN Developer</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
          Crafting Digital Products with{" "}
          <span className="bg-gradient-to-r from-[#747FDD] via-[#A78BFA] to-[#69D8F2] bg-clip-text text-transparent">
            Care & Engineering Rigor
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-6">
          Hello, I'm <strong className="text-[var(--text-primary)] font-semibold">Daya Pal</strong>. I specialize in scalable web applications, thoughtful design systems, and resilient production backends.
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3">
          {[
            { icon: FaGithub, href: "https://github.com/Dayapal", label: "GitHub" },
            { icon: FaLinkedin, href: "https://www.linkedin.com/in/dayapal/", label: "LinkedIn" },
            { icon: FaGlobe, href: "https://dayapal-portflio-21.netlify.app/", label: "Portfolio" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl glass-panel text-[var(--text-secondary)] hover:text-[#747FDD] hover:scale-105 transition-all"
            >
              <item.icon size={18} />
            </a>
          ))}
        </div>
      </GlassCard>

      {/* Main Grid: Story + Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Journey & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Journey */}
          <GlassCard radius="panel" className="!p-6 sm:!p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#747FDD]" />
              Engineering Philosophy
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              <p>
                My path into software engineering is rooted in continuous learning, curiosity, and a deep appreciation for the craft. Having solved high-pressure challenges at Airtel Payments and engineered modern React web presences, I focus on building software that solves genuine human needs.
              </p>
              <p>
                Whether designing a clean 3-tier REST architecture, optimizing MongoDB aggregations, or composing fluid Android 16 glassmorphic interfaces, I prioritize maintainability, clean code, and delightful user experiences.
              </p>
            </div>
          </GlassCard>

          {/* Experience Timeline */}
          <GlassCard radius="panel" className="!p-6 sm:!p-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2.5 h-6 rounded-full bg-[#69D8F2]" />
              Professional Experience
            </h2>

            <div className="space-y-6">
              {/* Role 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#747FDD]/15 text-[#747FDD] flex items-center justify-center shrink-0">
                  <FaRocket />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[var(--text-primary)]">Frontend Engineer</h3>
                  <p className="text-xs font-semibold text-[#747FDD]">Mark Anthony • Bengaluru</p>
                  <p className="text-xs text-[var(--text-muted)]">March 2025 – September 2025</p>
                  <p className="text-sm text-[var(--text-secondary)] pt-1">
                    Developed performant React applications with code splitting, caching strategies, and Lighthouse 95+ Core Web Vitals.
                  </p>
                </div>
              </div>

              {/* Role 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#A78BFA]/15 text-[#6D28D9] dark:text-[#A78BFA] flex items-center justify-center shrink-0">
                  <FaAward />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-[var(--text-primary)]">Customer Operations & Support</h3>
                  <p className="text-xs font-semibold text-[#747FDD]">Adroit Synergies (Airtel Payments)</p>
                  <p className="text-sm text-[var(--text-secondary)] pt-1">
                    Honed active problem-solving, root-cause diagnostics, and user-first empathy under demanding operational SLAs.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Skills & Growth */}
        <div className="space-y-8">
          {/* Tech Stack */}
          <GlassCard radius="panel" className="!p-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-[#A78BFA]" />
              Core Capabilities
            </h2>
            <div className="space-y-3">
              {skillCards.map((skill) => (
                <div
                  key={skill.title}
                  className="p-3.5 rounded-2xl glass-panel border border-[var(--glass-border-subtle)] space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-xl bg-gradient-to-r ${skill.color} text-white flex items-center justify-center text-xs shadow-sm`}>
                      <skill.icon />
                    </div>
                    <h3 className="font-semibold text-xs text-[var(--text-primary)]">{skill.title}</h3>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] pl-9">{skill.skills}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Education */}
          <GlassCard radius="panel" className="!p-6 space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-[#F0A6D8]" />
              Education & Growth
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl glass-panel border border-[var(--glass-border-subtle)]">
                <FaGraduationCap className="text-[#747FDD] text-base shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">Masai School</h4>
                  <p className="text-[var(--text-secondary)]">Full Stack Web Development</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl glass-panel border border-[var(--glass-border-subtle)]">
                <FaGraduationCap className="text-[#69D8F2] text-base shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--text-primary)]">Delhi University</h4>
                  <p className="text-[var(--text-secondary)]">Bachelor of Arts in English</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default About;
