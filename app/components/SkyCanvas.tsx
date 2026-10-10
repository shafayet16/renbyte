"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float, Cloud, Trail, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const SUN_POSITION = new THREE.Vector3(1.4, 1.6, -1.0);
const SUN_HEAT_RADIUS = 1.45;

// 1. WIND ELEMENTAL CURSOR (White Wind + 2 Ethereal Light Strands)
function WindElementalCursor() {
  const targetRef = useRef<THREE.Mesh>(null!);
  const cyanStrandRef = useRef<THREE.Mesh>(null!);
  const pinkStrandRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const x = (state.pointer.x * viewport.width) / 2;
    const y = (state.pointer.y * viewport.height) / 2;

    if (targetRef.current) {
      targetRef.current.position.lerp(new THREE.Vector3(x, y, 1.8), 0.22);
    }

    // Offset the 2 light strands to weave around the main white wind stream
    if (cyanStrandRef.current) {
      const offsetX = Math.sin(time * 6) * 0.12;
      const offsetY = Math.cos(time * 6) * 0.12;
      cyanStrandRef.current.position.lerp(
        new THREE.Vector3(x + offsetX, y + offsetY, 1.7),
        0.18
      );
    }

    if (pinkStrandRef.current) {
      const offsetX = Math.sin(time * 6 + Math.PI) * 0.12;
      const offsetY = Math.cos(time * 6 + Math.PI) * 0.12;
      pinkStrandRef.current.position.lerp(
        new THREE.Vector3(x + offsetX, y + offsetY, 1.7),
        0.18
      );
    }
  });

  return (
    <group>
      {/* Main Core White Wind Stream */}
      <mesh ref={targetRef} position={[0, 0, 1.8]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0} />

        <Trail
          width={2.8}
          length={16}
          color={new THREE.Color("#FFFFFF")}
          attenuation={(t) => t * t * t}
        >
          <mesh visible={false}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial />
          </mesh>
        </Trail>
      </mesh>

      {/* Colorful Light Strand 1: Electric Cyan */}
      <mesh ref={cyanStrandRef} position={[0, 0, 1.7]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#80E5FF" transparent opacity={0} />

        <Trail
          width={1.2}
          length={12}
          color={new THREE.Color("#80E5FF")}
          attenuation={(t) => t * t}
        >
          <mesh visible={false}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial />
          </mesh>
        </Trail>
      </mesh>

      {/* Colorful Light Strand 2: Ethereal Pink */}
      <mesh ref={pinkStrandRef} position={[0, 0, 1.7]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#FFD1DC" transparent opacity={0} />

        <Trail
          width={1.2}
          length={12}
          color={new THREE.Color("#FFD1DC")}
          attenuation={(t) => t * t}
        >
          <mesh visible={false}>
            <sphereGeometry args={[0.01, 8, 8]} />
            <meshBasicMaterial />
          </mesh>
        </Trail>
      </mesh>
    </group>
  );
}

// 2. VOLUMETRIC SUN
function VolumetricSun() {
  const sunGroupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (sunGroupRef.current) {
      const time = state.clock.elapsedTime;
      const scale = 1 + Math.sin(time * 1.8) * 0.02;
      sunGroupRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={sunGroupRef} position={[SUN_POSITION.x, SUN_POSITION.y, SUN_POSITION.z]}>
      <mesh>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh scale={1.3}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial color="#FFE399" transparent opacity={0.55} side={THREE.BackSide} />
      </mesh>
      <mesh scale={2.2}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial color="#FFCC66" transparent opacity={0.2} side={THREE.BackSide} />
      </mesh>
      <mesh scale={4.0}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial color="#FFB84D" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// 3. HOT AIR BALLOONS (No particle specks/bees)
const BALLOON_PALETTES = [
  { main: "#E63946", accent: "#F1F2EB" },
  { main: "#1D3557", accent: "#FFB703" },
  { main: "#2A9D8F", accent: "#E9C46A" },
];

function InteractiveBalloonInstance({
  index,
  palette,
  speed,
  scale,
  offsetY,
  initialX,
  balloonsRef,
}: {
  index: number;
  palette: { main: string; accent: string };
  speed: number;
  scale: number;
  offsetY: number;
  initialX: number;
  balloonsRef: React.MutableRefObject<
    { pos: THREE.Vector3; velocity: THREE.Vector3; radius: number; isBurning: boolean }[]
  >;
}) {
  const balloonGroupRef = useRef<THREE.Group>(null!);
  const mainMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const accentMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const skirtMatRef = useRef<THREE.MeshStandardMaterial>(null!);

  const pos = useRef(new THREE.Vector3(initialX, -4.5, -2.2));
  const vel = useRef(new THREE.Vector3(0, speed, 0));
  const isBurning = useRef(false);
  const burnFactor = useRef(0);
  const initialXRef = useRef(initialX);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (!isBurning.current) {
      pos.current.y += vel.current.y * delta * 60 * 0.016;
      pos.current.x += Math.sin(t * 0.8 + index) * 0.003 + vel.current.x;
      vel.current.x *= 0.95;

      const distToSun = pos.current.distanceTo(SUN_POSITION);
      if (distToSun < 2.5) {
        const avoidDir = new THREE.Vector3().subVectors(pos.current, SUN_POSITION).normalize();
        pos.current.x += avoidDir.x * 0.018;
      }

      if (distToSun < SUN_HEAT_RADIUS) {
        isBurning.current = true;
      }

      balloonsRef.current.forEach((other, i) => {
        if (i !== index && !other.isBurning) {
          const dist = pos.current.distanceTo(other.pos);
          const minDist = 0.8;
          if (dist < minDist && dist > 0) {
            const pushDir = new THREE.Vector3().subVectors(pos.current, other.pos).normalize();
            const overlap = minDist - dist;
            pos.current.addScaledVector(pushDir, overlap * 0.5);
            vel.current.x += pushDir.x * 0.01;
          }
        }
      });

      if (pos.current.y > 4.5) {
        pos.current.y = -4.5;
        initialXRef.current = (Math.random() - 0.5) * 4.2;
        pos.current.x = initialXRef.current;
        vel.current.set(0, speed, 0);
      }
    } else {
      burnFactor.current = Math.min(burnFactor.current + delta * 0.8, 1.0);
      pos.current.y -= delta * (1.5 + burnFactor.current * 3.0);
      pos.current.x += Math.sin(t * 15) * 0.01;

      if (mainMatRef.current && accentMatRef.current && skirtMatRef.current) {
        const charColor = new THREE.Color(palette.main).lerp(
          new THREE.Color("#111111"),
          burnFactor.current
        );
        mainMatRef.current.color = charColor;
        accentMatRef.current.color = charColor;
        skirtMatRef.current.color = charColor;
      }

      if (pos.current.y < -5.0) {
        isBurning.current = false;
        burnFactor.current = 0;
        pos.current.y = -4.5;
        initialXRef.current = (Math.random() - 0.5) * 4.2;
        pos.current.x = initialXRef.current;
        vel.current.set(0, speed, 0);

        if (mainMatRef.current && accentMatRef.current && skirtMatRef.current) {
          mainMatRef.current.color = new THREE.Color(palette.main);
          accentMatRef.current.color = new THREE.Color(palette.accent);
          skirtMatRef.current.color = new THREE.Color(palette.main);
        }
      }
    }

    balloonsRef.current[index] = {
      pos: pos.current.clone(),
      velocity: vel.current.clone(),
      radius: 0.4,
      isBurning: isBurning.current,
    };

    if (balloonGroupRef.current) {
      balloonGroupRef.current.position.copy(pos.current);
      if (isBurning.current) {
        balloonGroupRef.current.rotation.z += delta * 2.5;
        balloonGroupRef.current.scale.setScalar(scale * (1.0 - burnFactor.current * 0.5));
      } else {
        balloonGroupRef.current.rotation.y = Math.sin(t * 0.3 + index) * 0.2;
        balloonGroupRef.current.rotation.z = Math.sin(t * 0.6 + index) * 0.04;
        balloonGroupRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={balloonGroupRef} position={[initialX, offsetY, -2.2]} scale={scale}>
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial ref={mainMatRef} color={palette.main} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.2, 0]} scale={[1.02, 0.4, 1.02]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial ref={accentMatRef} color={palette.accent} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.6, 0.8, 32]} />
        <meshStandardMaterial ref={skirtMatRef} color={palette.main} roughness={0.4} />
      </mesh>
      {[0.25, -0.25].map((x, i) => (
        <mesh key={i} position={[x, -0.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.6]} />
          <meshBasicMaterial color="#2A2B2A" />
        </mesh>
      ))}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.35, 0.3, 0.35]} />
        <meshStandardMaterial color="#8D5B4C" roughness={0.8} />
      </mesh>

      {/* Smoke & fire ONLY triggers when ignited by the sun */}
      {isBurning.current && (
        <group position={[0, 1.0, 0]}>
          <Sparkles count={50} scale={[1.5, 3.0, 1.5]} size={10} speed={1.5} opacity={0.7} color="#222222" />
          <Sparkles count={35} scale={[1.0, 2.0, 1.0]} size={7} speed={2.5} opacity={0.85} color="#FF4500" />
        </group>
      )}
    </group>
  );
}

function DynamicBalloonsWithPhysics() {
  const balloonsRef = useRef<
    { pos: THREE.Vector3; velocity: THREE.Vector3; radius: number; isBurning: boolean }[]
  >([]);

  const balloonsConfig = [
    { index: 0, palette: BALLOON_PALETTES[0], speed: 0.35, scale: 0.38, offsetY: -3.0, initialX: -1.6 },
    { index: 1, palette: BALLOON_PALETTES[1], speed: 0.28, scale: 0.42, offsetY: 1.5, initialX: 1.2 },
    { index: 2, palette: BALLOON_PALETTES[2], speed: 0.32, scale: 0.35, offsetY: -0.5, initialX: -0.2 },
  ];

  return (
    <>
      {balloonsConfig.map((config) => (
        <InteractiveBalloonInstance key={config.index} {...config} balloonsRef={balloonsRef} />
      ))}
    </>
  );
}

// 4. ANIMATED DOVE SILHOUETTES
function FlappingDove({ position, offset }: { position: [number, number, number]; offset: number }) {
  const leftWingRef = useRef<THREE.Mesh>(null!);
  const rightWingRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime * 10 + offset;
    const flap = Math.sin(t) * 0.45;

    if (leftWingRef.current) leftWingRef.current.rotation.z = flap;
    if (rightWingRef.current) rightWingRef.current.rotation.z = -flap;
  });

  return (
    <group position={position} scale={0.06}>
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.4, 1.5, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>
      <mesh ref={leftWingRef} position={[-0.4, 0, 0]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="#F5F5F5" side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={rightWingRef} position={[0.4, 0, 0]}>
        <planeGeometry args={[1.2, 0.5]} />
        <meshStandardMaterial color="#F5F5F5" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DoveFlock() {
  const flockGroup = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flockGroup.current) {
      flockGroup.current.position.x = ((t * 0.6) % 18) - 9;
      flockGroup.current.position.y = 2.0 + Math.sin(t * 0.7) * 0.2;
    }
  });

  return (
    <group ref={flockGroup} position={[-9, 2.0, -1.5]}>
      <FlappingDove position={[0, 0, 0]} offset={0} />
      <FlappingDove position={[-0.5, -0.2, -0.2]} offset={0.8} />
      <FlappingDove position={[0.5, -0.25, -0.1]} offset={1.5} />
      <FlappingDove position={[-1.0, -0.4, -0.4]} offset={2.2} />
    </group>
  );
}

// 5. 3D CLOUD MODEL
function CloudModel() {
  const { scene } = useGLTF("/cloud.glb");

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#FFFFFF"),
          roughness: 0.15,
          metalness: 0.05,
        });
      }
    });
    return clone;
  }, [scene]);

  return (
    <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.5} floatingRange={[-0.15, 0.15]}>
      <group position={[-1.3, -0.3, 0.8]}>
        <primitive object={clonedScene} scale={4.8} rotation={[0.2, 0.6, 0]} />
        <Cloud
          opacity={0.65}
          speed={0.12}
          width={6.0}
          depth={1.8}
          segments={12}
          color="#FFFFFF"
          position={[0, -0.4, -0.5]}
        />
      </group>
    </Float>
  );
}

// 6. ATMOSPHERIC MIST
function HeavenlyMist() {
  return (
    <group position={[0, -3.2, 1]}>
      <Cloud
        opacity={0.35}
        speed={0.15}
        width={10}
        depth={1.5}
        segments={14}
        color="#F8F9F5"
      />
    </group>
  );
}

// 7. PARALLAX CAMERA RIG
function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame(() => {
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.35 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// MAIN CANVAS ENGINE
export default function SkyCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={2.3} color="#EBF4FF" />
        <directionalLight position={[3, 5, 3]} intensity={4.2} color="#FFF1D6" />
        <directionalLight position={[-2, 0, 2]} intensity={0.4} color="#355070" />

        <VolumetricSun />
        <CloudModel />
        <DynamicBalloonsWithPhysics />
        <DoveFlock />
        <HeavenlyMist />
        <WindElementalCursor />
        <CameraRig />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/cloud.glb");