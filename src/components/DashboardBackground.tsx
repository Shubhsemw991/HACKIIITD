"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─── Laptop ──────────────────────────────────────────────── */
function Laptop({ position, scale = 1, speed = 0.4 }: {
  position: [number, number, number]; scale?: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * speed;
    groupRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.5) * 0.15;
  });
  return (
    <Float speed={1.2} floatIntensity={0.8} rotationIntensity={0.2}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Base */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2, 0.08, 1.4]} />
          <meshStandardMaterial color="#1a1a2e" emissive="#00ff88" emissiveIntensity={0.08} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Screen (slightly open) */}
        <mesh position={[0, 0.78, -0.56]} rotation={[-Math.PI * 0.18, 0, 0]}>
          <boxGeometry args={[2, 1.35, 0.06]} />
          <meshStandardMaterial color="#0d1117" emissive="#00e5ff" emissiveIntensity={0.15} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Screen glow panel */}
        <mesh position={[0, 0.79, -0.48]} rotation={[-Math.PI * 0.18, 0, 0]}>
          <planeGeometry args={[1.8, 1.15]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.4} transparent opacity={0.25} />
        </mesh>
        {/* Keyboard rows */}
        {[-0.4, -0.1, 0.2].map((z, i) => (
          <mesh key={i} position={[0, 0.06, z]}>
            <boxGeometry args={[1.7, 0.03, 0.18]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── Smartphone ─────────────────────────────────────────── */
function Smartphone({ position, scale = 1, speed = 0.5 }: {
  position: [number, number, number]; scale?: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * speed;
    groupRef.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.7) * 0.1;
  });
  return (
    <Float speed={1.5} floatIntensity={1} rotationIntensity={0.3}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.65, 1.35, 0.09]} />
          <meshStandardMaterial color="#111827" emissive="#7c3aed" emissiveIntensity={0.12} metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[0.55, 1.15]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.5} transparent opacity={0.3} />
        </mesh>
        {/* Camera dot */}
        <mesh position={[0, 0.56, 0.055]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
        </mesh>
        {/* Home bar */}
        <mesh position={[0, -0.55, 0.055]}>
          <boxGeometry args={[0.25, 0.025, 0.01]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── CPU Chip ───────────────────────────────────────────── */
function CpuChip({ position, scale = 1, speed = 0.6 }: {
  position: [number, number, number]; scale?: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * speed;
    groupRef.current.rotation.x = s.clock.elapsedTime * speed * 0.5;
  });
  const pins = useMemo(() => {
    const p = [];
    for (let i = 0; i < 6; i++) {
      p.push([-0.75, -0.45 + i * 0.18, 0] as [number, number, number]);
      p.push([0.75, -0.45 + i * 0.18, 0] as [number, number, number]);
      p.push([-0.45 + i * 0.18, 0.75, 0] as [number, number, number]);
      p.push([-0.45 + i * 0.18, -0.75, 0] as [number, number, number]);
    }
    return p;
  }, []);

  return (
    <Float speed={1} floatIntensity={0.6} rotationIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Main die */}
        <mesh>
          <boxGeometry args={[1.1, 1.1, 0.12]} />
          <meshStandardMaterial color="#1e293b" emissive="#00ff88" emissiveIntensity={0.2} metalness={1} roughness={0.05} />
        </mesh>
        {/* Core grid lines */}
        {[-0.25, 0, 0.25].map((x, i) => (
          <mesh key={`hx-${i}`} position={[x, 0, 0.07]}>
            <boxGeometry args={[0.02, 1.0, 0.01]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.7} />
          </mesh>
        ))}
        {[-0.25, 0, 0.25].map((y, i) => (
          <mesh key={`hy-${i}`} position={[0, y, 0.07]}>
            <boxGeometry args={[1.0, 0.02, 0.01]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={1} transparent opacity={0.7} />
          </mesh>
        ))}
        {/* Pins */}
        {pins.map((pos, i) => (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.06, 0.06, 0.18]} />
            <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── Battery ────────────────────────────────────────────── */
function Battery({ position, scale = 1, speed = 0.3 }: {
  position: [number, number, number]; scale?: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = s.clock.elapsedTime * speed;
    groupRef.current.rotation.x = Math.cos(s.clock.elapsedTime * 0.4) * 0.2;
  });
  return (
    <Float speed={1.3} floatIntensity={0.9} rotationIntensity={0.25}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[0.55, 1.2, 0.25]} />
          <meshStandardMaterial color="#0f172a" emissive="#00ff88" emissiveIntensity={0.15} metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Positive terminal */}
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
        </mesh>
        {/* Charge indicator bars */}
        {[0.3, 0.1, -0.1, -0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0.14]}>
            <boxGeometry args={[0.35, 0.1, 0.02]} />
            <meshStandardMaterial
              color={i < 3 ? "#00ff88" : "#1e293b"}
              emissive={i < 3 ? "#00ff88" : "#000000"}
              emissiveIntensity={i < 3 ? 0.8 : 0}
              transparent opacity={i < 3 ? 0.9 : 0.3}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── Circuit Board ──────────────────────────────────────── */
function CircuitBoard({ position, scale = 1, speed = 0.2 }: {
  position: [number, number, number]; scale?: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * speed;
    groupRef.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.3) * 0.12;
  });

  const traces = useMemo(() => {
    const t = [];
    for (let i = 0; i < 6; i++) {
      t.push({ pos: [(Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.2, 0.07] as [number, number, number], w: 1.0 + Math.random() * 0.6, h: 0.025 });
      t.push({ pos: [(Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 1.2, 0.07] as [number, number, number], w: 0.025, h: 0.7 + Math.random() * 0.5 });
    }
    return t;
  }, []);

  return (
    <Float speed={0.8} floatIntensity={0.5} rotationIntensity={0.15}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* PCB base */}
        <mesh>
          <boxGeometry args={[2.2, 1.6, 0.06]} />
          <meshStandardMaterial color="#064e3b" emissive="#00ff88" emissiveIntensity={0.05} roughness={0.6} />
        </mesh>
        {/* Traces */}
        {traces.map((t, i) => (
          <mesh key={i} position={t.pos}>
            <boxGeometry args={[t.w, t.h, 0.02]} />
            <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} transparent opacity={0.6} />
          </mesh>
        ))}
        {/* Capacitors */}
        {[[-0.6, 0.4], [0.3, -0.3], [0.8, 0.5], [-0.9, -0.4]].map(([x, y], i) => (
          <mesh key={`cap-${i}`} position={[x, y, 0.12]}>
            <cylinderGeometry args={[0.07, 0.07, 0.22, 12]} />
            <meshStandardMaterial color="#1e3a5f" emissive="#00e5ff" emissiveIntensity={0.4} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Mini chip */}
        <mesh position={[0.4, 0.1, 0.07]}>
          <boxGeometry args={[0.4, 0.4, 0.09]} />
          <meshStandardMaterial color="#0f172a" emissive="#7c3aed" emissiveIntensity={0.3} metalness={1} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── WiFi Router ────────────────────────────────────────── */
function Router({ position, scale = 1, speed = 0.35 }: {
  position: [number, number, number]; scale?: number; speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = s.clock.elapsedTime * speed;
  });
  return (
    <Float speed={1.1} floatIntensity={0.7} rotationIntensity={0.2}>
      <group ref={groupRef} position={position} scale={scale}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 0.3, 0.85]} />
          <meshStandardMaterial color="#111827" emissive="#00e5ff" emissiveIntensity={0.1} metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Antennas */}
        {[-0.55, 0, 0.55].map((x, i) => (
          <mesh key={i} position={[x, 0.68, -0.3]}>
            <cylinderGeometry args={[0.03, 0.03, 0.85, 8]} />
            <meshStandardMaterial color="#1e293b" emissive="#00e5ff" emissiveIntensity={0.3} metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        {/* LED strip */}
        {[-0.5, -0.2, 0.1, 0.4].map((x, i) => (
          <mesh key={`led-${i}`} position={[x, 0.17, 0.43]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={["#00ff88", "#00e5ff", "#00ff88", "#7c3aed"][i]}
              emissive={["#00ff88", "#00e5ff", "#00ff88", "#7c3aed"][i]}
              emissiveIntensity={1.2}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ─── Glowing Energy Orb ────────────────────────────────── */
function EnergyOrb({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} floatIntensity={1.2} rotationIntensity={0.5}>
      <mesh position={position}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          distort={0.5}
          speed={3}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

/* ─── Scene ──────────────────────────────────────────────── */
export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 16], fov: 65 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[8, 8, 6]} intensity={2} color="#00ff88" />
        <pointLight position={[-8, -6, 4]} intensity={1.5} color="#00e5ff" />
        <pointLight position={[0, 6, -8]} intensity={1} color="#7c3aed" />

        <Stars radius={90} depth={50} count={2500} factor={3} saturation={0} fade speed={0.4} />

        {/* Laptops */}
        <Laptop position={[-9, 4, -6]} scale={0.9} speed={0.25} />
        <Laptop position={[8, -3, -8]} scale={0.75} speed={0.3} />

        {/* Smartphones */}
        <Smartphone position={[7, 5, -5]} scale={1.1} speed={0.4} />
        <Smartphone position={[-7, -4, -4]} scale={0.85} speed={0.5} />
        <Smartphone position={[0, 6, -10]} scale={0.7} speed={0.35} />

        {/* CPU Chips */}
        <CpuChip position={[-5, 2, -7]} scale={0.8} speed={0.45} />
        <CpuChip position={[5, -5, -5]} scale={0.95} speed={0.35} />
        <CpuChip position={[11, 2, -9]} scale={0.65} speed={0.55} />

        {/* Batteries */}
        <Battery position={[3, 6, -6]} scale={0.85} speed={0.28} />
        <Battery position={[-10, -2, -7]} scale={0.7} speed={0.4} />

        {/* Circuit Boards */}
        <CircuitBoard position={[-3, -6, -8]} scale={0.8} speed={0.18} />
        <CircuitBoard position={[9, 3, -10]} scale={0.65} speed={0.22} />

        {/* Routers */}
        <Router position={[-11, 4, -8]} scale={0.75} speed={0.3} />
        <Router position={[4, -7, -7]} scale={0.8} speed={0.25} />

        {/* Energy orbs for ambient glow */}
        <EnergyOrb position={[-6, 6, -4]} color="#00ff88" />
        <EnergyOrb position={[6, -6, -3]} color="#00e5ff" />
        <EnergyOrb position={[0, -7, -6]} color="#7c3aed" />
        <EnergyOrb position={[-12, -1, -10]} color="#00ff88" />
      </Canvas>
    </div>
  );
}
