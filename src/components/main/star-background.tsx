'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function generateStars(count: number, radius: number) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Random point in a sphere
    let x = (Math.random() * 2 - 1);
    let y = (Math.random() * 2 - 1);
    let z = (Math.random() * 2 - 1);
    let len = Math.sqrt(x * x + y * y + z * z);
    if (len > 1 || len === 0) {
      i--;
      continue;
    }
    x *= radius;
    y *= radius;
    z *= radius;
    positions.push(x, y, z);
  }
  return new Float32Array(positions);
}

function StarField() {
  const ref = useRef<THREE.Points>(null);
  const sphere = useMemo(() => generateStars(5000, 1.5), []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

const StarBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
    </div>
  );
};

export default StarBackground; 