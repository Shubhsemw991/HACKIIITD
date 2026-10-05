"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function EWasteNode({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    // Subtle mouse influence
    meshRef.current.position.x = position[0] + mouse.x * 0.3;
    meshRef.current.position.y = position[1] + mouse.y * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        wireframe
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function CircuitBoard() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.08 + mouse.x * 0.4;
    groupRef.current.rotation.x = mouse.y * 0.2;
  });

  const nodes = [
    { position: [0, 0, 0] as [number, number, number], color: "#00ff88", scale: 1.5 },
    { position: [3, 1.5, -1] as [number, number, number], color: "#00e5ff", scale: 0.8 },
    { position: [-3, -1, 1] as [number, number, number], color: "#7c3aed", scale: 0.7 },
    { position: [2, -2, 0.5] as [number, number, number], color: "#00ff88", scale: 0.6 },
    { position: [-2, 2, -0.5] as [number, number, number], color: "#00e5ff", scale: 0.9 },
    { position: [0, 3, 1] as [number, number, number], color: "#7c3aed", scale: 0.5 },
    { position: [-1.5, -3, -1] as [number, number, number], color: "#00ff88", scale: 0.7 },
  ];

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <EWasteNode key={i} {...node} />
      ))}
      {/* Connection lines */}
      {nodes.slice(1).map((node, i) => {
        const start = new THREE.Vector3(0, 0, 0);
        const end = new THREE.Vector3(...node.position);
        const points = [start, end];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={`line-${i}`}>
            <bufferGeometry attach="geometry" {...lineGeometry} />
            <lineBasicMaterial attach="material" color="#00ff88" transparent opacity={0.3} />
          </line>
        );
      })}
    </group>
  );
}

function GlowOrb() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1.2, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#00ff88"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          transparent
          opacity={0.07}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#00ff88" />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#00e5ff" />
        <pointLight position={[0, 5, -5]} intensity={1} color="#7c3aed" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <GlowOrb />
        <CircuitBoard />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
