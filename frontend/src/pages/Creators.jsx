import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiMail, FiPhone, FiBookOpen, FiAward } from "react-icons/fi";
import axios from "axios";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";

function Creators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data } = await axios.get("/api/user/admins", { withCredentials: true });
        setCreators(data.admins || []);
      } catch (error) {
        console.error("Creators fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-panel border border-[var(--glass-border)] text-xs font-semibold text-[#747FDD] uppercase tracking-wider">
          <FiUsers />
          <span>Creators Roster</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Meet Our Platform Authors
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          The developers, writers, and thinkers publishing regular perspectives on DedicatedBlog.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <GlassCard key={i} className="h-64 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </GlassCard>
          ))}
        </div>
      ) : creators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {creators.map((creator) => (
            <GlassCard
              key={creator._id}
              interactive
              radius="panel"
              className="!p-6 text-center flex flex-col items-center group relative overflow-hidden h-full"
            >
              {/* Top ambient color accent */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#747FDD] via-[#A78BFA] to-[#69D8F2]" />

              {/* Avatar */}
              <div className="relative mb-4 mt-2">
                <img
                  src={creator.photo?.url || "/default-avatar.png"}
                  alt={creator.name}
                  className="w-24 h-24 rounded-3xl object-cover border-2 border-[var(--glass-border)] shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Name & Role */}
              <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[#747FDD] transition-colors mb-1">
                {creator.name}
              </h2>
              <div className="mb-4">
                <GlassBadge variant="primary" size="sm">
                  {creator.role}
                </GlassBadge>
              </div>

              <div className="w-full space-y-2 text-xs text-[var(--text-secondary)] mb-6">
                {creator.education && (
                  <div className="flex items-center justify-center gap-1.5">
                    <FiAward className="text-[#69D8F2]" />
                    <span>Degree: {creator.education}</span>
                  </div>
                )}
                {creator.email && (
                  <div className="flex items-center justify-center gap-1.5 text-[var(--text-muted)] truncate">
                    <FiMail className="shrink-0" />
                    <span className="truncate max-w-[200px]">{creator.email}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-auto w-full pt-4 border-t border-[var(--glass-border-subtle)] text-[11px] font-medium text-[var(--color-primary)]">
                Active Contributor ✨
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="text-center py-16">
          <p className="text-[var(--text-secondary)]">No creators found.</p>
        </GlassCard>
      )}
    </div>
  );
}

export default Creators;
