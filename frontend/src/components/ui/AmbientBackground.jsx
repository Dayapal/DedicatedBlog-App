import React from "react";

export const AmbientBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
    >
      {/* Dynamic ambient radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(116,127,221,0.18)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(167,139,250,0.15)_0%,transparent_50%),radial-gradient(circle_at_50%_40%,rgba(105,216,242,0.08)_0%,transparent_45%)]" />

      {/* Floating ambient colored orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[480px] h-[480px] rounded-full bg-[#747FDD]/20 blur-[110px] animate-float-slow" />
      <div className="absolute bottom-[5%] right-[-5%] w-[520px] h-[520px] rounded-full bg-[#A78BFA]/18 blur-[120px] animate-float-reverse" />
      <div className="absolute top-[40%] right-[15%] w-[380px] h-[380px] rounded-full bg-[#69D8F2]/14 blur-[95px] animate-pulse-subtle" />
      <div className="absolute bottom-[20%] left-[10%] w-[420px] h-[420px] rounded-full bg-[#F0A6D8]/12 blur-[105px] animate-float-slow" />
    </div>
  );
};

export default AmbientBackground;
