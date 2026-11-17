import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiAward, FiShield, FiCalendar } from "react-icons/fi";
import { GlassCard } from "../components/ui/GlassCard";
import { GlassBadge } from "../components/ui/GlassBadge";
import SafeImage from "../components/ui/SafeImage";

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const { data } = await axios.get("/api/user/my-profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <GlassCard className="h-96 animate-pulse flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">Loading profile details...</p>
      </GlassCard>
    );
  }

  if (!profile) {
    return (
      <GlassCard className="text-center py-12">
        <p className="text-sm text-red-500">Profile data could not be retrieved.</p>
      </GlassCard>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Card */}
      <GlassCard radius="hero" className="!p-0 overflow-hidden shadow-xl">
        {/* Ambient Gradient Header */}
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-[#3F0071] via-[#332FD0] to-[#FB2576] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_70%)]" />
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-10 pb-10 relative">
          {/* Avatar floating over banner */}
          <div className="-mt-16 sm:-mt-20 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="relative inline-block">
              <SafeImage
                src={profile?.photo?.url}
                alt={profile.name}
                type="avatar"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-[var(--bg-app)] shadow-xl"
              />
              <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="flex gap-2">
              <GlassBadge variant="indigo" size="lg">
                <FiShield />
                <span className="capitalize">{profile.role || "Author"}</span>
              </GlassBadge>
            </div>
          </div>

          {/* User Name & Bio */}
          <div className="space-y-1 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {profile.name}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Digital creator & contributing author on DedicatedBlog
            </p>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-[var(--glass-border-subtle)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#332FD0]/15 text-[#332FD0] dark:text-[#B4B2FF] flex items-center justify-center shrink-0">
                <FiMail size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{profile.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-[var(--glass-border-subtle)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FB2576]/15 text-[#FB2576] flex items-center justify-center shrink-0">
                <FiPhone size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Phone</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{profile.phone || "Not specified"}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-[var(--glass-border-subtle)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3F0071]/15 text-[#3F0071] dark:text-[#E2C7FF] flex items-center justify-center shrink-0">
                <FiAward size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Education</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">{profile.education || "Bachelor Degree"}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-[var(--glass-border-subtle)] flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <FiCalendar size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Account Active Since</p>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {new Date(profile.createAt || profile.createdAt || Date.now()).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default MyProfile;
