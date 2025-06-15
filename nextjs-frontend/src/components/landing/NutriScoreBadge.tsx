import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function NutriScoreBadge(props: any) {
  const ref = useRef<any>(null);
  // Animate the badge popping up
  useFrame(({ clock }) => {
    if (ref.current) {
      // Scale from 0.5 to 1.1 and back
      const scale = 1 + Math.abs(Math.sin(clock.getElapsedTime() * 1.5)) * 0.2;
      ref.current.scale.set(scale, scale, scale);
    }
  });
  return (
    <mesh ref={ref} position={[0, 2.5, 0]} {...props}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#4ade80" />
      {/* 3D Text for NutriScore */}
    </mesh>
  );
} 