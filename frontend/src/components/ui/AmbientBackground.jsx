import React from "react";

export const AmbientBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
    >
      {/* Dynamic ambient radial gradients matching the 4 official brand colors */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(63,0,113,0.16)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,2,161,0.18)_0%,transparent_50%),radial-gradient(circle_at_50%_40%,rgba(51,47,208,0.12)_0%,transparent_45%),radial-gradient(circle_at_80%_20%,rgba(251,37,118,0.06)_0%,transparent_40%)]" />

      {/* Floating ambient colored orbs */}
      {/* Orb 1: Royal Purple (#3F0071) */}
      <div className="absolute top-[-10%] left-[-5%] w-[520px] h-[520px] rounded-full bg-[#3F0071]/22 blur-[120px] animate-float-slow" />
      
      {/* Orb 2: Deep Royal Blue (#0002A1) */}
      <div className="absolute bottom-[5%] right-[-5%] w-[550px] h-[550px] rounded-full bg-[#0002A1]/20 blur-[130px] animate-float-reverse" />
      
      {/* Orb 3: Electric Indigo (#332FD0) */}
      <div className="absolute top-[35%] right-[12%] w-[420px] h-[420px] rounded-full bg-[#332FD0]/18 blur-[105px] animate-pulse-subtle" />
      
      {/* Orb 4: Neon Pink (#FB2576) subtle highlight reflection */}
      <div className="absolute bottom-[20%] left-[8%] w-[380px] h-[380px] rounded-full bg-[#FB2576]/10 blur-[115px] animate-float-slow" />
    </div>
  );
};

export default AmbientBackground;
