"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Sphere, Torus, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function VaultScene() {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
    const targetX = mouse.y * 0.15;
    const targetZ = mouse.x * -0.15;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.z += (targetZ - groupRef.current.rotation.z) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Central vault cube */}
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
        <RoundedBox args={[1.8, 1.8, 1.8]} radius={0.25} smoothness={4}>
          <meshPhysicalMaterial
            color="#0E1A22"
            metalness={0.3}
            roughness={0.15}
            transmission={0.4}
            thickness={1.5}
            envMapIntensity={1.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={1.5}
          />
        </RoundedBox>
      </Float>

      {/* Orbiting spheres */}
      <Float speed={3} rotationIntensity={0} floatIntensity={0.6}>
        <Sphere args={[0.25, 32, 32]} position={[1.8, 0.5, 0.5]}>
          <meshPhysicalMaterial color="#00D6A4" metalness={0.6} roughness={0.1} emissive="#00D6A4" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      <Float speed={2.5} rotationIntensity={0} floatIntensity={0.5}>
        <Sphere args={[0.18, 32, 32]} position={[-1.5, -0.8, 0.8]}>
          <meshPhysicalMaterial color="#6366F1" metalness={0.6} roughness={0.1} emissive="#6366F1" emissiveIntensity={0.2} />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0} floatIntensity={0.8}>
        <Sphere args={[0.15, 32, 32]} position={[0.8, -1.2, -0.6]}>
          <meshPhysicalMaterial color="#5BFFD0" metalness={0.5} roughness={0.2} emissive="#5BFFD0" emissiveIntensity={0.15} />
        </Sphere>
      </Float>

      {/* Orbital ring */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
        <Torus args={[2.2, 0.03, 16, 100]} rotation={[Math.PI / 3, 0.2, 0]}>
          <meshPhysicalMaterial color="#00D6A4" metalness={0.8} roughness={0.1} emissive="#00D6A4" emissiveIntensity={0.15} transparent opacity={0.5} />
        </Torus>
      </Float>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
        <Torus args={[2.6, 0.02, 16, 100]} rotation={[Math.PI / 5, -0.4, 0.3]}>
          <meshPhysicalMaterial color="#6366F1" metalness={0.8} roughness={0.1} emissive="#6366F1" emissiveIntensity={0.1} transparent opacity={0.3} />
        </Torus>
      </Float>
    </group>
  );
}

function SVGFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width="300" height="300" viewBox="0 0 300 300" className="float-card">
        <defs>
          <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D6A4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="75" y="75" width="150" height="150" rx="24" fill="url(#vaultGrad)" stroke="rgba(0,214,164,0.3)" strokeWidth="1.5" />
        <circle cx="200" cy="90" r="15" fill="rgba(0,214,164,0.4)" />
        <circle cx="100" cy="210" r="10" fill="rgba(99,102,241,0.4)" />
        <circle cx="220" cy="190" r="8" fill="rgba(91,255,208,0.3)" />
        <ellipse cx="150" cy="150" rx="120" ry="120" fill="none" stroke="rgba(0,214,164,0.15)" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function VaultScene3D() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      setWebgl(!!gl);
    } catch { setWebgl(false); }
  }, []);

  if (!webgl) return <SVGFallback />;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      frameloop="demand"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, -2, 4]} intensity={0.3} color="#00D6A4" />
      <Environment preset="studio" />
      <VaultScene />
    </Canvas>
  );
}
