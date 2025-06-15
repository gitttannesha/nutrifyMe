"use client";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import React from "react";
import { useGLTF } from "@react-three/drei";

const foodModels = [
  { path: "/models/apple2.glb", position: [-16, 2, -8], scale: 2.2 },
  { path: "/models/lays-chips.glb", position: [13, -6, -7], scale: 0.15 },
  { path: "/models/burger.glb", position: [12, 3, -6], scale: 0.08 },
  { path: "/models/starbucks.glb", position: [-16, -3, -7], scale: 6  },
  { path: "/models/nutella.glb", position: [8, 2, -8], scale: 18 },
  { path: "/models/milk.glb", position: [-10, -4, -7], scale: 0.18 },
];

function FloatingFood({ path, position, scale }: { path: string; position: [number, number, number]; scale: number }) {
  const ref = React.useRef<any>(null);
  const { scene } = useGLTF(path);
  // Animate in a no-gravity, random floating motion
  React.useEffect(() => {
    let frame: number;
    const xPhase = Math.random() * Math.PI * 2;
    const yPhase = Math.random() * Math.PI * 2;
    const zPhase = Math.random() * Math.PI * 2;
    const animate = () => {
      if (ref.current) {
        ref.current.position.x = position[0] + Math.sin(Date.now() / 1200 + xPhase) * 2.5;
        ref.current.position.y = position[1] + Math.sin(Date.now() / 1000 + yPhase) * 2.5;
        ref.current.position.z = position[2] + Math.sin(Date.now() / 1400 + zPhase) * 2.5;
        ref.current.rotation.y += 0.003;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [position]);
  return <primitive ref={ref} object={scene} position={position} scale={scale} />;
}

export default function FloatingFoodCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 18], fov: 50 }} className="fixed inset-0 w-full h-full z-0 bg-black">
      <ambientLight intensity={0.7} />
      {foodModels.map((food, idx) => (
        <FloatingFood key={food.path + idx} path={food.path} position={food.position as [number, number, number]} scale={food.scale} />
      ))}
      <Environment preset="sunset" />
    </Canvas>
  );
} 