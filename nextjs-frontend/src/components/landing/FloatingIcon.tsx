import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface FloatingIconProps {
  position: [number, number, number];
  color: string;
}

export default function FloatingIcon({ position, color }: FloatingIconProps) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      // Gentle up/down float
      ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.3;
      // Gentle rotation
      ref.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
} 