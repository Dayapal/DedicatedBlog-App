import React, { useState } from "react";

/**
 * SafeImage provides rock-solid image rendering with:
 * 1. Automatic HTTPS upgrades for Cloudinary / insecure URLs to eliminate mixed-content warnings.
 * 2. Multi-tier graceful error fallback when images fail (e.g. 404 on Cloudinary).
 * 3. Infinite error loop prevention (`e.currentTarget.onerror = null`).
 * 4. Smooth fade-in transition on load.
 */
export const SafeImage = ({
  src,
  alt = "Image",
  type = "cover", // "cover" | "avatar"
  fallbackSrc,
  className = "",
  loading = "lazy",
  onError,
  onLoad,
  ...props
}) => {
  const defaultFallback = type === "avatar" ? "/default-avatar.svg" : "/imgPL.svg";
  const primaryFallback = fallbackSrc || defaultFallback;

  // Ensure HTTPS for Cloudinary URLs
  const sanitizeUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (trimmed.startsWith("http://res.cloudinary.com")) {
      return trimmed.replace("http://", "https://");
    }
    return trimmed;
  };

  const initialSrc = sanitizeUrl(src) || primaryFallback;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync if src changes
  React.useEffect(() => {
    const clean = sanitizeUrl(src);
    setCurrentSrc(clean || primaryFallback);
    setHasFailed(false);
    setIsLoaded(false);
  }, [src, primaryFallback]);

  const handleError = (e) => {
    e.currentTarget.onerror = null; // Prevent loop
    if (!hasFailed) {
      setHasFailed(true);
      setCurrentSrc(primaryFallback);
    } else {
      // In extreme case that primaryFallback also failed, switch to inline data URI
      setCurrentSrc(
        type === "avatar"
          ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%233F0071'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%23FFFFFF' fill-opacity='0.9'/%3E%3Cpath d='M20 85 C20 68 35 60 50 60 C65 60 80 68 80 85 Z' fill='%23FFFFFF' fill-opacity='0.9'/%3E%3C/svg%3E"
          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect width='800' height='450' fill='%230002A1'/%3E%3Ctext x='400' y='230' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='24'%3EDedicatedBlog%3C/text%3E%3C/svg%3E"
      );
    }
    if (onError) onError(e);
  };

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      onLoad={handleLoad}
      className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-80"} ${className}`}
      {...props}
    />
  );
};

export default SafeImage;
