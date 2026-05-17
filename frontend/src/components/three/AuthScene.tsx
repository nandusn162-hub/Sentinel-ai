"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function MiniParticles() {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00d4ff" size={0.04} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

function AuthGrid() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = ((state.clock.elapsedTime * 0.3) % 2) - 1;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[30, 30, 25, 25]} />
      <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

function FloatingHexagons() {
  const refs = useRef<THREE.Mesh[]>([]);
  const data = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      pos: [(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4] as [number, number, number],
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? "#00d4ff" : "#7c3aed",
    })), []);

  useFrame((state) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y = data[i].pos[1] + Math.sin(state.clock.elapsedTime * data[i].speed + data[i].offset) * 0.6;
        mesh.rotation.z = state.clock.elapsedTime * 0.2 + data[i].offset;
      }
    });
  });

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }} position={d.pos}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 6]} />
          <meshBasicMaterial color={d.color} transparent opacity={0.4} />
        </mesh>
      ))}
    </>
  );
}

export default function AuthScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <MiniParticles />
        <AuthGrid />
        <FloatingHexagons />
      </Canvas>
    </div>
  );
}
