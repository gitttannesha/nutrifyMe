"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import React from "react";
import FloatingModel from "@/components/landing/FloatingModel";
import LandingNavbar from "@/components/landing/LandingNavbar";
import Link from "next/link";

const productConfigs = [
  { path: "/models/lays-chips.glb", position: [-5.5, -1.5, 0], scale: 0.12 },
  { path: "/models/burger.glb", position: [-1, -1.3, 0], scale: 0.05 },
  { path: "/models/starbucks.glb", position: [2.5, -1.5, 0], scale: 4 },
  { path: "/models/nutella.glb", position: [6.6, -1, -1.5], scale: 22 },
];

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white overflow-hidden">
      <LandingNavbar />
      <main className="flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto pt-35 px-4 gap-10 min-h-[calc(100vh-5rem)]">
        {/* Left: Branding Text */}
        <section className="flex-1 flex flex-col justify-center items-start max-w-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-zinc-900 mb-6 leading-tight">
            Scan. Score. <br /> Eat Smart.!
          </h1>
          <p className="text-lg text-zinc-700 mb-8">
            NutrifyMe helps you make healthier food choices. Scan products, get instant and personalized HealthScore, and take control of your nutrition journey.
          </p>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="px-6 py-2 ml-24 bg-green-500 text-white rounded-full text-lg font-semibold shadow hover:bg-green-600 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </section>
        {/* Right: 3D Canvas in Card */}
        <section className="flex-1 flex justify-center items-center w-full">
          <div className="bg-gradient-to-br rounded-3xl shadow-2xl bg-green-100 border border-black  md:p-8 w-[800px] h-[500px] flex items-center justify-center">
            <Canvas camera={{ position: [0, 2, 10], fov: 50 }} className="w-full h-10%">
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 10, 7]} intensity={1.1} color="#a3e635" />
              <directionalLight position={[-5, 5, 5]} intensity={0.7} color="#38bdf8" />
              {productConfigs.map((prod) => (
                <FloatingModel
                  key={prod.path}
                  path={prod.path}
                  position={prod.position as [number, number, number]}
                  scale={prod.scale}
                  floatY={true}
                />
              ))}
              <ContactShadows position={[0, -2, 0]} opacity={0.3} scale={10} blur={2.5} far={10} />
              <OrbitControls enablePan={false} enableZoom={false} />
              <Environment preset="sunset" />
            </Canvas>
          </div>
        </section>
      </main>
    </div>
  );
} 


// from-white via-blue-100 to-green-100 