import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiLogOut, FiUser, FiHome, FiEdit } from "react-icons/fi";
import { signOut } from "next-auth/react";

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: <FiHome />, selected: true },
  { name: "HomePage", href: "/homepage", icon: <FiUser />, selected: false },
  { name: "Edit Profile Details", href: "/profile/edit", icon: <FiEdit />, selected: false },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`flex flex-col h-screen bg-[#f6faff] border-r border-zinc-200 transition-all duration-300 ${open ? "w-64" : "w-16"} fixed md:static z-30`}
    >
      {/* Top: Logo and Menu */}
      <div className="flex items-center justify-between px-4 py-6">
        <div className={`text-3xl font-extrabold tracking-tight select-none text-black ${open ? "block" : "hidden md:block"}`}>
          nutrify<span className="text-green-500">Me</span>
        </div>
        <button
          className="md:hidden text-xl text-zinc-700 focus:outline-none"
          onClick={() => setOpen((prev) => !prev)}
        >
          <FiMenu />
        </button>
      </div>
      {/* Nav Links */}
      <nav className="flex flex-col gap-2 mt-4 px-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition-colors ${
              link.selected
                ? "bg-green-500 text-white shadow"
                : "text-zinc-800 hover:bg-green-100 hover:text-green-600"
            } ${open ? "justify-start" : "justify-center"}`}
          >
            <span className="text-xl">{link.icon}</span>
            {open && <span>{link.name}</span>}
          </Link>
        ))}
      </nav>
      {/* Yellow Action Box */}
      <div className={`mt-48 mx-4 p-4 rounded-xl bg-yellow-200 text-yellow-900 text-sm font-semibold shadow ${open ? "block" : "hidden md:block"}`}>
        <div className="mb-2">A ML-driven web platform that scans, analyzes, and scores packaged food based on ingredient safety.</div>
        <Link href="/scan">
          <button className="w-full bg-white text-green-600 font-bold py-2 rounded-lg shadow hover:bg-green-50 transition-all border border-green-500">
            Scan product
          </button>
        </Link>
      </div>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Logout Button */}
      <div className={`mb-6 px-4 ${open ? "block" : "hidden md:block"}`}>
        <button
          className="w-full flex items-center justify-center gap-2 bg-white text-red-500 font-bold py-2 rounded-lg shadow hover:bg-red-50 transition-all border border-red-300"
          onClick={() => signOut({ callbackUrl: "/landing" })}
        >
          <FiLogOut className="text-xl" /> Logout
        </button>
      </div>
    </aside>
  );
} 