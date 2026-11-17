import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiMail, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { GlassCard } from "../components/ui/GlassCard";
import SafeImage from "../components/ui/SafeImage";

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3F0071]/10 dark:bg-[#3F0071]/30 text-[#3F0071] dark:text-[#E2C7FF] border border-[#3F0071]/20 dark:border-white/15 text-xs font-bold uppercase tracking-wider mb-2">
            <FiUsers className="text-sm" />
            <span>Community Voices</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Meet Featured Creators
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
            Storytellers and industry experts contributing regular insights
          </p>
        </div>

        <Link
          to="/creators"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#332FD0] dark:text-[#B4B2FF] hover:text-[#FB2576] transition-colors px-3 py-1.5 rounded-xl hover:bg-[#332FD0]/10"
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
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#3F0071] via-[#FB2576] to-[#332FD0]" />

              {/* Avatar with Specular Border */}
              <div className="relative mb-4 mt-2">
                <SafeImage
                  src={creator.photo?.url}
                  alt={creator.name}
                  type="avatar"
                  className="w-20 h-20 rounded-2xl object-cover aspect-square border-2 border-white/80 dark:border-white/20 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-tr from-[#FB2576] to-[#3F0071] text-white flex items-center justify-center text-xs shadow-sm shadow-[#FB2576]/30">
                  <FiCheckCircle size={13} />
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-[#FB2576] transition-colors">
                {creator.name}
              </h3>
              <div className="mt-1 mb-2.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#332FD0]/10 dark:bg-[#332FD0]/25 text-[#332FD0] dark:text-[#B4B2FF] border border-[#332FD0]/20 dark:border-white/10">
                  {creator.role}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                Specializing in {creator.education || "Software Architecture"} and digital content.
              </p>

              {/* Email Chip */}
              <div className="mt-auto w-full pt-3 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
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
