"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { FaBarcode, FaUserCheck, FaFlask } from "react-icons/fa";
import Image from "next/image";
import Product3DViewer from "@/components/shared/Product3DViewer";
import Head from "next/head";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import Footer from "./Footer";
import Link from "next/link";

export default function Homepage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get("toast") === "1") {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        router.replace("/homepage");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      </Head>
      <Navbar />
      <section className="relative flex flex-col items-center justify-center w-full pt-14 pb-0 px-6 bg-gradient-to-br from-[#f3f7fd] via-[#eaf1fb] to-white rounded-none shadow-lg overflow-hidden border-b border-zinc-100 min-h-[520px]">
        <div className="flex flex-col items-center justify-center w-full z-20">
          <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 mb-4 leading-tight text-center">
            Personalized Nutrition, <span className="text-green-500">Instantly!</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 mb-4 max-w-2xl text-center">
            Scan, score, and choose the best foods for your health—powered by science and tailored to you.
          </p>
          <Link href="/scan">
            <button className="px-8 py-4 bg-green-500 text-white rounded-full text-xl font-bold shadow hover:bg-green-600 transition-all mb-10">
              Scan a product NOW!
            </button>
          </Link>
          {/* Bagman image only, no floating elements */}
          <div className="relative flex flex-col items-center justify-center w-full mb-0">
            {/* Darker radial gradient behind bagman */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#b3c6f7] via-[#a5b4fc] to-transparent opacity-80 z-0" />
            <img src="/images/bagman2.png" alt="Bagman" className="w-64 h-64 md:w-80 md:h-80 object-contain z-10 drop-shadow-2xl" />
          </div>
        </div>
        {/* Black strip block below hero with feature tiles */}
        <div className="w-full max-w-6xl mx-auto mt-0 mb-0 px-6 ">
          <div className="bg-zinc-900 rounded-2xl py-6 px-8 flex flex-col md:flex-row items-center justify-center gap-6 shadow-xl mt-[-40px]">
          </div>
        </div>
        {/* Stepper animation styles */}
        <style jsx global>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
          .animate-float-slow { animation: float-slow 5s ease-in-out infinite; }
          @keyframes float-fast {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
          .animate-float-fast { animation: float-fast 3.2s ease-in-out infinite; }
          @keyframes float-mid {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-22px); }
          }
          .animate-float-mid { animation: float-mid 4.2s ease-in-out infinite; }
        `}</style>
      </section>
      {/* How We Work Section */}
      <section className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white" id="about">
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-12 text-center">How Nutrify<span className="text-green-500">Me</span> Works?</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mx-auto">
          {/* Step 1: Scan */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              {/* Animated barcode */}
              <svg viewBox="0 0 64 64" fill="none" className="w-20 h-20">
                <rect x="8" y="16" width="4" height="32" rx="2" fill="#22c55e" />
                <rect x="16" y="16" width="2" height="32" rx="1" fill="#22c55e" />
                <rect x="20" y="16" width="6" height="32" rx="2" fill="#22c55e" />
                <rect x="28" y="16" width="2" height="32" rx="1" fill="#22c55e" />
                <rect x="32" y="16" width="8" height="32" rx="2" fill="#22c55e" />
                <rect x="42" y="16" width="2" height="32" rx="1" fill="#22c55e" />
                <rect x="46" y="16" width="4" height="32" rx="2" fill="#22c55e" />
                {/* Animated scan line */}
                <rect y="0" width="64" height="6" rx="3" className="animate-barcode-scan" fill="#38bdf8" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">Scan</h3>
            <p className="text-zinc-500">Scan any product's barcode in seconds.</p>
          </div>
          {/* Step 2: Score */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              {/* Flipping product card */}
              <div className="flip-card w-16 h-20">
                <div className="flip-card-inner animate-flip-card">
                  {/* Front: Product/food icon */}
                  <div className="flip-card-front w-16 h-20 bg-zinc-100 rounded-xl flex items-center justify-center shadow">
                    <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fbbf24"/><ellipse cx="12" cy="15" rx="6" ry="3" fill="#fde68a"/><ellipse cx="12" cy="10" rx="4" ry="2.5" fill="#f59e42"/></svg>
                  </div>
                  {/* Back: Score badge */}
                  <div className="flip-card-back w-16 h-20 bg-white rounded-xl flex flex-col items-center justify-center shadow">
                    <span className="text-3xl font-extrabold text-green-500">83</span>
                    <span className="text-sm font-semibold text-green-600 mt-1">Healthy</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">Score</h3>
            <p className="text-zinc-500">Get personalized health score instantly.</p>
          </div>
          {/* Step 3: Decide */}
          <div className="flex flex-col items-center text-center flex-1">
            <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
              {/* Animated checkmark */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="animate-checkmark">
                <circle cx="32" cy="32" r="28" fill="#22c55e" opacity="0.12" />
                <circle cx="32" cy="32" r="24" fill="#22c55e" opacity="0.18" />
                <path d="M20 34l8 8 16-16" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">Decide</h3>
            <p className="text-zinc-500">Make smarter choices for your health.</p>
          </div>
        </div>
        {/* Stepper animation styles */}
        <style jsx>{`
          .flip-card {
            perspective: 600px;
          }
          .flip-card-inner {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            animation: flip 2.5s infinite linear;
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
          @keyframes flip {
            0%, 80%, 100% { transform: rotateY(0deg); }
            40%, 60% { transform: rotateY(180deg); }
          }
          @keyframes barcode-scan {
            0% { y: 0; }
            100% { y: 58px; }
          }
          .animate-barcode-scan {
            animation: barcode-scan 1.5s cubic-bezier(0.4,0,0.2,1) infinite alternate;
          }
          @keyframes checkmark {
            0%, 80%, 100% { stroke-dasharray: 0, 40; }
            40%, 60% { stroke-dasharray: 40, 0; }
          }
          .animate-checkmark path {
            stroke-dasharray: 40, 0;
            stroke-dashoffset: 0;
            animation: checkmark 2.5s infinite linear;
          }
        `}</style>
      </section>
      {/* Why Use Us Section - Evaluate Food Quality */}
      <section className="w-full flex flex-col items-center justify-center py-10 px-4 bg-white">
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-16 text-center">Why use Nutrify<span className="text-green-500">Me</span>?</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mx-auto">
          {/* 3D Product Model (Cup Noodles) with overlayed badge */}
          <div className="flex-1 flex flex-row items-center justify-center relative min-h-[320px] min-w-[320px]">
            {/* Pills on the left side of the model */}
            <div className="flex flex-col gap-3 mr-4">
              <span className="flex items-center gap-2 px-5 py-2 bg-red-300 rounded-full text-zinc-700 font-medium text-base shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2l4 8h-8l4-8zm0 20c-4.41 0-8-3.59-8-8 0-2.21.9-4.21 2.36-5.64l1.42 1.42A5.978 5.978 0 0 0 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.3-.42-2.5-1.14-3.47l1.42-1.42A7.963 7.963 0 0 1 20 12c0 4.41-3.59 8-8 8z" fill="#a3a3a3"/></svg>
                Additives
              </span>
              <span className="flex items-center gap-2 px-5 py-2 bg-red-300 rounded-full text-zinc-700 font-medium text-base shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-2.21.9-4.21 2.36-5.64l1.42 1.42A5.978 5.978 0 0 0 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.3-.42-2.5-1.14-3.47l1.42-1.42A7.963 7.963 0 0 1 20 12c0 4.41-3.59 8-8 8z" fill="#a3a3a3"/></svg>
                Sodium
              </span>
              <span className="flex items-center gap-2 px-5 py-2 bg-red-300 rounded-full text-zinc-700 font-medium text-base shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-2.21.9-4.21 2.36-5.64l1.42 1.42A5.978 5.978 0 0 0 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.3-.42-2.5-1.14-3.47l1.42-1.42A7.963 7.963 0 0 1 20 12c0 4.41-3.59 8-8 8z" fill="#a3a3a3"/></svg>
                Preservatives
              </span>
            </div>
            {/* 3D Product Model (Cup Noodles) with overlayed badge */}
            <div className="relative w-[320px] h-[320px] md:w-[340px] md:h-[340px] flex items-center justify-center">
              <Product3DViewer modelPath="/models/cupnoodles2.glb" scale={30.2} bounce={true} className="!absolute !top-0 !left-0 !w-full !h-full" />
              {/* Bad score badge */}
              <div className="absolute top-4 left-4 bg-white rounded-full shadow-lg px-6 py-2 flex items-center gap-2 text-lg font-semibold text-zinc-700 border border-zinc-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span>
                Bad – <span className="font-bold">21/100</span>
              </div>
            </div>
          </div>
          {/* Text Block */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-xl pl-0 md:pl-8">
            <h3 className="text-3xl md:text-4xl font-semibold text-zinc-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Evaluate the quality of your <span className="font-normal" style={{ fontFamily: 'Pacifico, cursive', fontSize: '1em' }}>foods!</span>
            </h3>
            <p className="text-lg text-zinc-600 mb-4 mt-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: 1.5  }}>
              Do you really know what you're buying? NutrifyMe scans and analyzes labels in the blink of an eye so you can learn at a glance which products are good for you and which ones you should avoid.
            </p>
          </div>
        </div>
      </section>
      {/* Why Use Us Section - Check Cosmetics Quality (mirrored split) */}
      <section className="w-full flex flex-col items-center justify-center py-10 px-4 bg-white">
        <div className="flex flex-col md:flex-row-reverse items-center justify-center gap-12 w-full max-w-5xl mx-auto">
          {/* 3D Product Model (Cornflakes) with overlayed badge */}
          <div className="flex-1 flex flex-row items-center justify-center relative min-h-[320px] min-w-[320px]">
            {/* 3D Product Model (Cornflakes) with overlayed badge */}
            <div className="relative w-[320px] h-[320px] md:w-[340px] md:h-[340px] flex items-center justify-center">
              <Product3DViewer modelPath="/models/cornflakes.glb" scale={0.35} bounce={true} className="!absolute !top-0 !left-0 !w-full !h-full" />
              {/* Healthy score badge */}
              <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg px-6 py-2 flex items-center gap-2 text-lg font-semibold text-zinc-700 border border-zinc-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
                Healthy – <span className="font-bold">85/100</span>
              </div>
            </div>
            {/* Pills on the right side of the model */}
            <div className="flex flex-col gap-3 ml-4">
              <span className="flex items-center gap-2 px-5 py-2 bg-green-50 rounded-full text-green-700 font-medium text-base shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2l4 8h-8l4-8zm0 20c-4.41 0-8-3.59-8-8 0-2.21.9-4.21 2.36-5.64l1.42 1.42A5.978 5.978 0 0 0 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.3-.42-2.5-1.14-3.47l1.42-1.42A7.963 7.963 0 0 1 20 12c0 4.41-3.59 8-8 8z" fill="#22c55e"/></svg>
                Fortified
              </span>
              <span className="flex items-center gap-2 px-5 py-2 bg-green-50 rounded-full text-green-700 font-medium text-base shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-2.21.9-4.21 2.36-5.64l1.42 1.42A5.978 5.978 0 0 0 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.3-.42-2.5-1.14-3.47l1.42-1.42A7.963 7.963 0 0 1 20 12c0 4.41-3.59 8-8 8z" fill="#22c55e"/></svg>
                Low fat
              </span>
              <span className="flex items-center gap-2 px-5 py-2 bg-green-50 rounded-full text-green-700 font-medium text-base shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-2.21.9-4.21 2.36-5.64l1.42 1.42A5.978 5.978 0 0 0 6 12c0 3.31 2.69 6 6 6s6-2.69 6-6c0-1.3-.42-2.5-1.14-3.47l1.42-1.42A7.963 7.963 0 0 1 20 12c0 4.41-3.59 8-8 8z" fill="#22c55e"/></svg>
                Fibre
              </span>
            </div>
          </div>
          {/* Text Block */}
          <div className="flex-1 flex flex-col items-start justify-center max-w-xl pr-0 md:pr-8">
            <h3 className="text-3xl md:text-4xl font-semibold text-zinc-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Also, Start your mornings the <span className="font-normal" style={{ fontFamily: 'Pacifico, cursive', fontSize: '1em' }}>Smarter Way!</span>
            </h3>
            <p className="text-lg text-zinc-600 mb-4 mt-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: 1.5  }}>
              NutrifyMe helps you discover healthy choices in your breakfast too! Scan cereals and more to see which products are high in protein, low in fat and fibre-rich, so you can start your day right.
            </p>
          </div>
        </div>
      </section>

      {/* Review Section - Animated Testimonials */}
      <section
  className="w-full flex flex-col items-center justify-center py-20 px-4 bg-white"
  id="review"
>
  <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-16 text-center">
    Foodie Feedback Corner!
  </h2>
  <AnimatedTestimonials
    testimonials={[
      {
        quote:
          "NutrifyMe changed how I shop for groceries. The instant scores make it so easy to pick healthy options!",
        name: "Ahmed El‑Sayed",
        designation: "Fitness Enthusiast",
        src: "/images/review1.png",
      },
      {
        quote:
          "I love the transparency and science‑backed recommendations. Highly recommended for families!",
        name: "Alex Rodriguez",
        designation: "Parent & Home Cook",
        src: "/images/review2.png",
      },
      {
        quote:
          "Finally, a nutrition app that's easy, beautiful, and actually useful. The best part? No ads!",
        name: "Catherine Samuels",
        designation: "Student",
        src: "/images/review3.png",
      },
      {
        quote:
          "Even a busy actor like me needs to know what goes into my body. Thanks to NutrifyMe, I’m eating like a hero on and off screen!",
        name: "Shah Rukh Khan",
        designation: "Bollywood Superstar",
        src: "/images/shah.png",
      },
      {
        quote:
          "On the pitch I give 100%, off the pitch I rely on NutrifyMe to give me the best fuel. My performance has never been sharper!",
        name: "Lionel Messi",
        designation: "The Football GOAT",
        src: "/images/messi.jpg",
      },
    ]}
    autoplay={true}
  />
</section>

      {/* Footer Section */}
      <section id="contactus">
        <Footer />
      </section>
    </>
  );
}