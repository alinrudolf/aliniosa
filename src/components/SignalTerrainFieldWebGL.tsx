import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const TERRAIN_WIDTH = 58;
const TERRAIN_DEPTH = 52;
const GRID_RESOLUTION_X = 132;
const GRID_RESOLUTION_Z = 112;
const BASE_AMPLITUDE = 1.72;
const HOVER_AMPLITUDE = 2.18;
const MOTION_SPEED = 0.055;
const AMBER_COLOR = 'rgb(255, 176, 0)';
const AMBER_ACTIVE_COLOR = 'rgb(255, 201, 74)';
const CAMERA_POSITION = [0, -20, 6.4] as const;
const CAMERA_FOV = 36;
const TERRAIN_TILT = -Math.PI * 0.48;

type SectionId = 'SYS' | 'WRK' | 'INS' | 'LIB' | 'LOG' | 'CNT';

type SignalTerrainFieldWebGLProps = {
  onHoverSection?: (section: SectionId | null) => void;
};

type TerrainMeshProps = {
  activeSection: SectionId | null;
};

const SECTIONS: SectionId[] = ['SYS', 'WRK', 'INS', 'LIB', 'LOG', 'CNT'];

const HILLS = [
  { x: -20.8, z: -13.2, radiusX: 7.8, radiusZ: 6.2, height: 3.2 },
  { x: -9.6, z: -8.8, radiusX: 10.4, radiusZ: 7.8, height: 4.5 },
  { x: 4.2, z: -11.6, radiusX: 11.8, radiusZ: 8.6, height: 5.1 },
  { x: 18.2, z: -8.2, radiusX: 8.8, radiusZ: 7.2, height: 3.8 },
  { x: -24.0, z: 3.8, radiusX: 8.4, radiusZ: 6.6, height: 2.9 },
  { x: -6.8, z: 5.6, radiusX: 12.6, radiusZ: 8.8, height: 3.6 },
  { x: 12.6, z: 4.4, radiusX: 10.8, radiusZ: 8.0, height: 3.4 },
  { x: 25.0, z: 12.8, radiusX: 7.6, radiusZ: 6.4, height: 2.4 },
  { x: -15.0, z: 18.4, radiusX: 9.2, radiusZ: 7.4, height: 2.1 },
  { x: 3.8, z: 20.0, radiusX: 11.4, radiusZ: 8.2, height: 2.5 },
] as const;

function gaussianHill(x: number, z: number, hill: (typeof HILLS)[number]) {
  const normalizedX = (x - hill.x) / hill.radiusX;
  const normalizedZ = (z - hill.z) / hill.radiusZ;

  return Math.exp(-(normalizedX * normalizedX + normalizedZ * normalizedZ) * 0.5) * hill.height;
}

function getSectionInfluence(x: number, activeSection: SectionId | null) {
  if (!activeSection) {
    return 0;
  }

  const sectionIndex = SECTIONS.indexOf(activeSection);
  const sectionWidth = TERRAIN_WIDTH / SECTIONS.length;
  const centerX = -TERRAIN_WIDTH / 2 + sectionWidth * (sectionIndex + 0.5);
  const sigma = sectionWidth * 0.48;
  const distance = x - centerX;

  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

function getTerrainHeight(x: number, z: number, time: number, activeSection: SectionId | null) {
  const influence = getSectionInfluence(x, activeSection);
  const amplitude = BASE_AMPLITUDE + influence * (HOVER_AMPLITUDE - BASE_AMPLITUDE);
  const drift = time * MOTION_SPEED;
  const hills =
    HILLS.reduce((height, hill, index) => {
      const breathing = 1 + Math.sin(drift * (0.45 + index * 0.025) + index * 0.8) * 0.035;

      return height + gaussianHill(x, z, hill) * breathing;
    }, 0) * 0.78;
  const field =
    Math.sin(x * 0.11 + z * 0.16 + drift * 1.0) * 0.38 +
    Math.sin(x * 0.07 - z * 0.2 - drift * 0.72 + 1.6) * 0.26 +
    Math.sin((x + z) * 0.055 + drift * 0.48 + 2.2) * 0.18;
  const pressure =
    Math.sin(x * 0.2 + z * 0.16 + drift * 1.24 + 0.4) * 0.22 +
    Math.sin(x * 0.12 - z * 0.11 - drift * 0.84 + 2.6) * 0.14;

  return (hills + field) * amplitude + pressure * influence * 0.35;
}

function TerrainMesh({ activeSection }: TerrainMeshProps) {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { geometry, basePositions, colors } = useMemo(() => {
    const terrainGeometry = new THREE.PlaneGeometry(
      TERRAIN_WIDTH,
      TERRAIN_DEPTH,
      GRID_RESOLUTION_X - 1,
      GRID_RESOLUTION_Z - 1,
    );
    const positions = terrainGeometry.attributes.position.array;
    const vertexColors = new Float32Array((positions.length / 3) * 3);
    const dim = new THREE.Color(AMBER_COLOR);
    const bright = new THREE.Color(AMBER_ACTIVE_COLOR);

    for (let index = 0; index < vertexColors.length / 3; index += 1) {
      const z = positions[index * 3 + 1];
      const depthFade = THREE.MathUtils.smoothstep((TERRAIN_DEPTH / 2 - z) / TERRAIN_DEPTH, 0.06, 0.92);
      const color = dim.clone().lerp(bright, depthFade * 0.28);
      const intensity = THREE.MathUtils.clamp(depthFade * 0.86, 0.04, 0.88);

      vertexColors[index * 3] = color.r * intensity;
      vertexColors[index * 3 + 1] = color.g * intensity;
      vertexColors[index * 3 + 2] = color.b * intensity;
    }

    terrainGeometry.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3));

    return {
      geometry: terrainGeometry,
      basePositions: Float32Array.from(positions),
      colors: vertexColors,
    };
  }, []);

  useFrame(({ clock }) => {
    const position = geometry.attributes.position;
    const color = geometry.attributes.color;
    const time = clock.getElapsedTime();

    for (let index = 0; index < position.count; index += 1) {
      const x = basePositions[index * 3];
      const z = basePositions[index * 3 + 1];
      const influence = getSectionInfluence(x, activeSection);
      const height = getTerrainHeight(x, z, time, activeSection);
      const activeLift = influence * Math.sin(time * MOTION_SPEED * 1.1 + z * 0.08) * 0.1;
      const depthFade = THREE.MathUtils.smoothstep((TERRAIN_DEPTH / 2 - z) / TERRAIN_DEPTH, 0.08, 0.88);

      position.setZ(index, height + activeLift);
      color.setXYZ(
        index,
        colors[index * 3] * (1 + influence * 0.34),
        colors[index * 3 + 1] * (1 + influence * 0.34),
        colors[index * 3 + 2] * (1 + influence * 0.34),
      );

      if (materialRef.current) {
        materialRef.current.opacity = activeSection ? 0.76 : 0.58;
      }

      position.setX(index, x);
      position.setY(index, z + depthFade * 0.04);
    }

    position.needsUpdate = true;
    color.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation-x={TERRAIN_TILT} position={[0, 1.2, -1.8]}>
      <meshBasicMaterial
        ref={materialRef}
        vertexColors
        wireframe
        transparent
        opacity={0.58}
        depthWrite={false}
      />
    </mesh>
  );
}

function HoverRegions({ onHoverSection }: SignalTerrainFieldWebGLProps) {
  const sectionWidth = TERRAIN_WIDTH / SECTIONS.length;

  return (
    <group rotation-x={TERRAIN_TILT} position={[0, 1.2, -1.6]}>
      {SECTIONS.map((section, index) => {
        const centerX = -TERRAIN_WIDTH / 2 + sectionWidth * (index + 0.5);
        const handleEnter = (event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          onHoverSection?.(section);
        };
        const handleLeave = (event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          onHoverSection?.(null);
        };

        return (
          <mesh
            key={section}
            position={[centerX, 0, 5.2]}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
          >
            <planeGeometry args={[sectionWidth, TERRAIN_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function SignalTerrainFieldWebGL({ onHoverSection }: SignalTerrainFieldWebGLProps) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  const handleHoverSection = (section: SectionId | null) => {
    setActiveSection(section);
    onHoverSection?.(section);
  };

  return (
    <div className="h-full min-h-[520px] w-full bg-[color:var(--bg-crt)]">
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: CAMERA_FOV, near: 0.1, far: 120 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#0D0B08', 18, 46]} />
        <TerrainMesh activeSection={activeSection} />
        <HoverRegions onHoverSection={handleHoverSection} />
      </Canvas>
    </div>
  );
}
