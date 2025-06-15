import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function ProductModel(props: any) {
  // Make sure the path matches your file location
  const { scene } = useGLTF('/models/punga_chips_export.glb');
  return <primitive object={scene} {...props} scale={0.1} />;
}