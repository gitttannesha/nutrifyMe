import React from "react";

export default function LandingNavbar() {
  return (
    <nav className="w-full h-20 flex items-center justify-center bg-gradient-to-r from-green-100 via-green-50 to-blue-100 shadow-lg fixed top-0 left-0 z-50">
      <div
        className="text-4xl font-extrabold tracking-tight select-none text-black transition-transform duration-300 hover:scale-110 hover:text-shadow-glow cursor-pointer"
        style={{
          textShadow: "0 2px 8px rgba(34,197,94,0.15), 0 1px 2px rgba(59,130,246,0.10)"
        }}
      >
        nutrify<span className="text-green-500">Me</span>
      </div>
      <style jsx>{`
        .hover\\:text-shadow-glow:hover {
          text-shadow: 0 0 16px #22c55e, 0 0 8px #38bdf8;
        }
      `}</style>
    </nav>
  );
}
