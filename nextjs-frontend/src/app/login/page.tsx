"use client";

import React from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorToast, setErrorToast] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorToast("Please enter both email and password");
      setTimeout(() => setErrorToast(""), 2500);
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (result.success) {
        router.push("/homepage");
      } else if (result.error === "No such user found") {
        setErrorToast("No such user found. Redirecting to signup...");
        setTimeout(() => {
          setErrorToast("");
          router.push("/signup");
        }, 2000);
      } else {
        setErrorToast(result.error || "Login failed");
        setTimeout(() => setErrorToast(""), 2500);
      }
    } catch (err) {
      setErrorToast("Login failed");
      setTimeout(() => setErrorToast(""), 2500);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/homepage" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white relative overflow-hidden">
      {/* Accent background shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-40 z-0" />
      {/* Logo top center */}
      {/* Removed the fixed logo from here */}
      {/* Main content split layout */}
      <div className="flex w-full max-w-4xl mx-auto z-10 rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-lg">
        {/* Left: Unsplash image */}
        <div className="hidden md:block flex-1 bg-cover bg-center min-h-[500px]" style={{ backgroundImage: 'url(/images/login.png)' }} />
        {/* Right: Login Card */}
        <div className="flex-1 flex flex-col items-center justify-center p-10">
          {/* Error Toast notification - revert to fixed top center */}
          {errorToast && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-lg animate-fade-in">
              {errorToast}
            </div>
          )}
          {/* NutriScore/apple icon replaced with logo */}
          <span className="text-3xl font-extrabold text-zinc-900 drop-shadow mb-4 flex items-center">
            nutrify<span className="text-green-500">Me</span>
          </span>
          <h3 className="text-2xl font-bold mb-2 text-zinc-900 text-center">Lets Start Eating Smart</h3>
          <p className="text-zinc-500 text-center mb-6 text-sm">Please login to continue</p>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10 py-2 rounded-lg border border-zinc-200 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/80 text-black placeholder:text-gray-500" />
              <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-green-500 transition" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button type="submit" className="w-full py-2 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-lg font-semibold shadow-lg hover:from-green-500 hover:to-blue-500 transition text-lg">Log In</button>
          </form>
          <div className="flex items-center my-4 w-full">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="mx-2 text-zinc-400 text-sm">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>
          <button className="w-full py-2 bg-white border border-zinc-300 rounded-lg font-semibold text-zinc-700 hover:bg-zinc-50 transition flex items-center justify-center gap-2 shadow" onClick={handleGoogleSignIn} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.711-1.57-3.922-2.531-6.656-2.531-5.523 0-10 4.477-10 10s4.477 10 10 10c5.75 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.672z" fill="#4285F4"></path><path d="M3.153 7.345l3.281 2.406c.891-1.781 2.578-2.953 4.806-2.953 1.172 0 2.273.406 3.125 1.078l2.672-2.609c-1.711-1.57-3.922-2.531-6.656-2.531-3.828 0-7.047 2.484-8.406 5.953z" fill="#34A853"></path><path d="M12 22c2.672 0 4.922-.883 6.563-2.406l-3.047-2.492c-.844.57-1.922.914-3.516.914-2.828 0-5.219-1.906-6.078-4.453l-3.25 2.5c1.344 3.422 4.578 5.937 8.328 5.937z" fill="#FBBC05"></path><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.711-1.57-3.922-2.531-6.656-2.531-5.523 0-10 4.477-10 10s4.477 10 10 10c5.75 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.672z" fill="none"></path></g></svg>
            Sign in with Google
          </button>
          <div className="mt-6 text-center text-sm text-zinc-600">
            Don&apos;t have an account? <Link href="/signup" className="text-green-600 font-semibold hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 