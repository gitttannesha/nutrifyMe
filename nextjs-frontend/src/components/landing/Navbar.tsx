import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-20 flex items-center justify-between px-8 bg-white z-20 shadow-sm border-b border-zinc-200">
      {/* Logo */}
      <div
        className="text-3xl font-extrabold text-zinc-900 tracking-tight select-none transition-transform duration-300 hover:scale-110 hover:text-shadow-glow cursor-pointer"
        style={{
          textShadow: "0 2px 8px rgba(34,197,94,0.15), 0 1px 2px rgba(59,130,246,0.10)"
        }}
      >
        nutrify<span className="text-green-500">Me</span>
      </div>
      {/* Navlinks */}
      <div className="flex gap-10 text-lg font-bold text-zinc-800">
        {[
          { href: "/homepage", label: "Home" },
          { href: "#about", label: "About" },
          { href: "#review", label: "Review" },
          { href: "#contactus", label: "Contact Us" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="relative hover:text-green-500 transition-colors px-1 navlink-underline"
          >
            {link.label}
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-black scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        ))}
      </div>
      {/* User Profile Icon */}
      <div className="flex items-center">
        <FaUserCircle className="text-4xl text-zinc-700 hover:text-green-500 transition-colors cursor-pointer" />
      </div>
      <style jsx>{`
        .hover\\:text-shadow-glow:hover {
          text-shadow: 0 0 16px #22c55e, 0 0 8px #38bdf8;
        }
        .navlink-underline:hover span {
          transform: scaleX(1);
        }
      `}</style>
    </nav>
  );
} 