import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiMail, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";

function Creator() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const { data } = await axios.get("/api/user/admins", { withCredentials: true });
        setCreators(data.admins || []);
      } catch (err) {
        console.error("Creators fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A78BFA]/15 text-[#6D28D9] dark:text-[#A78BFA] text-xs font-semibold uppercase tracking-wider mb-2">
            <FiUsers />
            <span>Community Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Meet Featured Creators
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Storytellers and industry experts contributing regular insights
          </p>
        </div>

        <Link
          to="/creators"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#747FDD] hover:text-[#454FA8] transition-colors"
        >
          <span>All creators</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} className="h-64 animate-pulse flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </GlassCard>
          ))}
        </div>
      ) : creators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creators.slice(0, 4).map((creator) => (
            <GlassCard
              key={creator._id}
              interactive
              radius="panel"
              className="!p-6 text-center flex flex-col items-center group relative overflow-hidden"
            >
              {/* Decorative top ambient color bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#747FDD] via-[#A78BFA] to-[#69D8F2]" />

              {/* Avatar with Specular Border */}
              <div className="relative mb-4 mt-2">
                <img
                  src={creator.photo?.url || "/default-avatar.png"}
                  alt={creator.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--glass-border)] shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#747FDD] to-[#69D8F2] text-white flex items-center justify-center text-xs shadow-sm">
                  <FiCheckCircle size={13} />
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[#747FDD] transition-colors">
                {creator.name}
              </h3>
              <p className="text-xs font-semibold text-[#747FDD] uppercase tracking-wider mb-2">
                {creator.role}
              </p>

              <p className="text-xs text-[var(--text-secondary)] mb-4 line-clamp-2">
                Specializing in {creator.education || "Software Architecture"} and digital content.
              </p>

              {/* Email Chip */}
              <div className="mt-auto w-full pt-3 border-t border-[var(--glass-border-subtle)] flex items-center justify-center gap-1.5 text-xs text-[var(--text-muted)]">
                <FiMail className="shrink-0" />
                <span className="truncate max-w-[170px]">{creator.email}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="text-center py-12">
          <p className="text-[var(--text-secondary)]">No creators found.</p>
        </GlassCard>
      )}
    </section>
  );
}

export default Creator;
