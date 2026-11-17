import React from "react";

export const GlassSkeleton = ({ className = "", height, width, circle = false }) => {
  return (
    <div
      style={{ height, width }}
      className={`
        glass-panel glass-shimmer-effect bg-[var(--glass-bg-subtle)] border border-[var(--glass-border-subtle)]
        ${circle ? "rounded-full" : "rounded-2xl"}
        ${className}
      `}
    />
  );
};

export const BlogCardSkeleton = () => {
  return (
    <div className="glass-panel rounded-3xl p-4 sm:p-5 space-y-4">
      {/* Image Skeleton */}
      <GlassSkeleton className="w-full h-48 sm:h-52 rounded-2xl" />

      {/* Meta Skeleton */}
      <div className="flex items-center gap-3">
        <GlassSkeleton className="w-20 h-6 rounded-full" />
        <GlassSkeleton className="w-16 h-4 rounded-full" />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <GlassSkeleton className="w-full h-5 rounded-lg" />
        <GlassSkeleton className="w-3/4 h-5 rounded-lg" />
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5 pt-1">
        <GlassSkeleton className="w-full h-3.5 rounded" />
        <GlassSkeleton className="w-5/6 h-3.5 rounded" />
      </div>

      {/* Author Strip */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--glass-border-subtle)]">
        <div className="flex items-center gap-2.5">
          <GlassSkeleton circle className="w-9 h-9" />
          <div className="space-y-1">
            <GlassSkeleton className="w-20 h-3.5 rounded" />
            <GlassSkeleton className="w-14 h-2.5 rounded" />
          </div>
        </div>
        <GlassSkeleton className="w-12 h-6 rounded-full" />
      </div>
    </div>
  );
};

export default GlassSkeleton;
