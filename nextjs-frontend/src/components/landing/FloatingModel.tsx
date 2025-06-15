import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface FloatingModelProps {
  path: string;
  position: [number, number, number];
  scale?: number;
  floatY?: boolean;
  name?: string;
  showScanner?: boolean;
  showBadge?: boolean;
}

export default function FloatingModel({ path, position, scale = 1, floatY = false, name, showScanner, showBadge }: FloatingModelProps) {
  const ref = useRef<any>(null);
  const { scene } = useGLTF(path);

  useFrame(({ clock }) => {
    if (ref.current) {
      if (floatY) {
        // Only up/down float, no orbital motion
        ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.3;
      }
      ref.current.rotation.y += 0.01;
    }
  });

  // Attach name to the root mesh for raycasting
  React.useEffect(() => {
    if (ref.current && name) {
      ref.current.name = name;
    }
  }, [name]);

  return (
    <group>
      <primitive ref={ref} object={scene} position={position} scale={scale} />
      {/* Scanner Beam Effect */}
      {showScanner && (
        <mesh position={[position[0], position[1] + 1.2, position[2]]}>
          <boxGeometry args={[1.5 * scale, 0.1 * scale, 1 * scale]} />
          <meshStandardMaterial color="#00eaff" emissive="#00eaff" emissiveIntensity={0.7} transparent opacity={0.7} />
        </mesh>
      )}
      {/* NutriScore Badge */}
      {showBadge && (
        <mesh position={[position[0], position[1] + 2.2 * scale, position[2]]}>
          <sphereGeometry args={[0.3 * scale, 32, 32]} />
          <meshStandardMaterial color="#4ade80" />
        </mesh>
      )}
    </group>
  );
}