import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ScannerBeam(props: any) {
  const ref = useRef<any>(null);
  // Animate the beam up and down
  useFrame(({ clock }) => {
    if (ref.current) {
      // Move between y=0.5 and y=2.5
      ref.current.position.y = 1.5 + Math.sin(clock.getElapsedTime() * 2) * 1;
    }
  });
  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[2.1, 0.1, 1.05]} />
      <meshStandardMaterial color="#00eaff" emissive="#00eaff" emissiveIntensity={0.7} transparent opacity={0.7} />
    </mesh>
  );
} 