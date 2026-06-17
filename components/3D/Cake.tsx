import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Cake() {
  const groupRef = useRef<THREE.Group>(null);
  const candleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle swaying motion for elegance
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.25) * 0.05;
    }
    if (candleRef.current) {
      // Realistic candle flicker
      candleRef.current.scale.y = 0.95 + Math.sin(clock.getElapsedTime() * 8) * 0.08 + Math.random() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Base Layer - Rich pastry color */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[2, 0.8, 2]} />
        <meshStandardMaterial
          color="#8b6f47"
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* Frosting Base - Elegant cream */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
        <meshStandardMaterial
          color="#e8d4b8"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Decorative border - bottom layer */}
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[1.15, 0.08, 8, 32]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.5}
        />
      </mesh>

      {/* Middle Layer */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 0.8, 1.6]} />
        <meshStandardMaterial
          color="#8b6f47"
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* Middle Frosting */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 0.25, 32]} />
        <meshStandardMaterial
          color="#e8d4b8"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Decorative border - middle layer */}
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.92, 0.06, 8, 32]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.5}
        />
      </mesh>

      {/* Top Layer */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial
          color="#8b6f47"
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* Top Frosting */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.25, 32]} />
        <meshStandardMaterial
          color="#e8d4b8"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Decorative border - top layer */}
      <mesh position={[0, 2.15, 0]}>
        <torusGeometry args={[0.68, 0.05, 8, 32]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.5}
        />
      </mesh>

      {/* Elegant gold leaf decorations - front */}
      <mesh position={[-0.35, 1.5, 0.7]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      <mesh position={[0.35, 1.5, 0.7]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Elegant gold leaf decorations - back */}
      <mesh position={[-0.35, 1.5, -0.7]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      <mesh position={[0.35, 1.5, -0.7]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#d4a574"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Elegant pearl decoration on top */}
      <mesh position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#f5f2ed"
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Candle Holder - Elegant white */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshStandardMaterial
          color="#e8d4b8"
          roughness={0.5}
          metalness={0}
        />
      </mesh>

      {/* Candle Flame - Realistic warm glow */}
      <mesh ref={candleRef} position={[0, 2.65, 0]}>
        <coneGeometry args={[0.08, 0.35, 16]} />
        <meshStandardMaterial
          color="#ffa500"
          emissive="#ff8c00"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Flame core glow */}
      <mesh position={[0, 2.65, 0]}>
        <coneGeometry args={[0.12, 0.4, 16]} />
        <meshStandardMaterial
          color="#ffcc00"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          roughness={0.6}
        />
      </mesh>
    </group>
  );
}
