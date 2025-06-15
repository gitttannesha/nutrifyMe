"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

function ProductModel({ path, scale = 1, bounce = true }: { path: string; scale?: number; bounce?: boolean }) {
  const { scene } = useGLTF(path);
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (ref.current && bounce) {
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.18;
      ref.current.rotation.y += 0.005; // slow rotation
    }
  });
  return <primitive ref={ref} object={scene} scale={scale} />;
}

export default function Product3DViewer({ modelPath, scale = 1, className = "", bounce = true }: { modelPath: string; scale?: number; className?: string; bounce?: boolean }) {
  return (
    <div className={`relative w-full h-full ${className}`} style={{ minHeight: 320, minWidth: 320 }}>
      <Canvas camera={{ position: [0, 0, 3.5], fov: 50 }} className="rounded-xl">
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <ProductModel path={modelPath} scale={scale} bounce={bounce} />
        <Environment preset="sunset" />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
} 