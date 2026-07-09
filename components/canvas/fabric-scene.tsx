'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

// Silky Waving Fabric Plane
function WavingPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
    const positionAttribute = geometry.attributes.position;
    const time = clock.getElapsedTime();

    for (let i = 0; i < positionAttribute.count; i++) {
      const u = positionAttribute.getX(i);
      const v = positionAttribute.getY(i);
      
      // Calculate dynamic wave heights using sin/cos combinations
      const z =
        Math.sin(u * 0.5 + time * 1.0) * 0.4 +
        Math.cos(v * 0.5 + time * 0.8) * 0.3 +
        Math.sin((u + v) * 0.2 + time * 1.5) * 0.15;
        
      positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;
    
    // Rotate the plane extremely slowly
    meshRef.current.rotation.z = time * 0.03;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, 0, -1.5]}>
      <planeGeometry args={[12, 12, 45, 45]} />
      <meshStandardMaterial
        color="#080808"
        roughness={0.25}
        metalness={0.8}
        flatShading={false}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
}

// Floating Particle System
function FloatingDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;
  const positions = new Float32Array(count * 3);

  // Generate random positions for the dust particles
  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.015;
    pointsRef.current.rotation.x = time * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffffff"
        transparent
        opacity={0.35}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function FabricScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
        <div className="text-white/20 font-light tracking-widest text-sm">LOADING REALM...</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.1} />
        
        {/* Cinematic Studio Lights */}
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#cfcfcf" />
        <directionalLight position={[0, 5, 5]} intensity={2.0} color="#ffffff" />
        
        <WavingPlane />
        <FloatingDust />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
