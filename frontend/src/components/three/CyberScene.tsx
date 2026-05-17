"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingParticles({ count = 3000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.7}
      />
    </Points>
  );
}

function CyberGrid() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = ((state.clock.elapsedTime * 0.5) % 2) - 1;
    }
  });
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 40, 40);
    return geo;
  }, []);

  return (
    <mesh ref={ref} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
      <meshBasicMaterial
        color="#00d4ff"
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

function RadarRing({ radius, speed }: { radius: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * speed;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      ref.current.scale.set(scale, scale, scale);
    }
  });
  const geo = useMemo(() => new THREE.RingGeometry(radius - 0.02, radius, 64), [radius]);
  return (
    <mesh ref={ref} geometry={geo} position={[0, 0, 0]}>
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
}

function RadarSweep() {
  const sweepRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.z = -state.clock.elapsedTime * 1.2;
    }
  });
  const geo = useMemo(() => new THREE.CircleGeometry(4.5, 64, 0, Math.PI / 3), []);
  return (
    <group position={[0, 0, 0]}>
      <RadarRing radius={1.5} speed={0} />
      <RadarRing radius={3} speed={0} />
      <RadarRing radius={4.5} speed={0} />
      {/* Cross hairs */}
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[9, 0.01, 0.01]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[9, 0.01, 0.01]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.2} />
      </mesh>
      {/* Sweep */}
      <mesh ref={sweepRef} geometry={geo}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function RotatingShield() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.4;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });
  return (
    <group ref={ref} position={[5, 1, -2]}>
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function DataNodes() {
  const count = 12;
  const refs = useRef<THREE.Mesh[]>([]);
  const positions = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 5.5 + Math.random() * 3;
      return [Math.cos(angle) * r, (Math.random() - 0.5) * 4, Math.sin(angle) * r - 5] as [number, number, number];
    }), []);

  useFrame((state) => {
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y = positions[i][1] + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.3;
        const s = 0.9 + Math.sin(state.clock.elapsedTime + i) * 0.1;
        mesh.scale.set(s, s, s);
      }
    });
  });

  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el; }} position={pos}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#7c3aed" : "#00d4ff"} transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  );
}

export default function CyberScene() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.1} />
        <FloatingParticles count={2500} />
        <CyberGrid />
        <RadarSweep />
        <RotatingShield />
        <DataNodes />
      </Canvas>
    </div>
  );
}
