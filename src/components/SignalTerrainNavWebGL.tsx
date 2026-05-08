import { Canvas, type ThreeEvent, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { signalNavigation } from '../data/navigation';

const TERRAIN_WIDTH = 18;
const TERRAIN_DEPTH = 10;
const GRID_RESOLUTION_X = 72;
const GRID_RESOLUTION_Z = 42;
const BASE_AMPLITUDE = 0.58;
const HOVER_AMPLITUDE = 0.92;
const MOTION_SPEED = 0.18;
const AMBER_COLOR = 'rgb(255, 201, 74)';
const REST_OPACITY = 0.5;
const HOVER_OPACITY = 0.78;

type SectionId = 'SYS' | 'WRK' | 'INS' | 'LIB' | 'LOG' | 'CNT';

type SignalTerrainNavWebGLProps = {
  onHoverSection?: (section: SectionId | null) => void;
};

type TerrainSurfaceProps = {
  activeSection: SectionId | null;
};

const SECTIONS = signalNavigation.map((signal) => signal.id) as SectionId[];

function getSectionInfluence(x: number, activeSection: SectionId | null) {
  if (!activeSection) {
    return 0;
  }

  const sectionIndex = SECTIONS.indexOf(activeSection);
  const sectionWidth = TERRAIN_WIDTH / SECTIONS.length;
  const centerX = -TERRAIN_WIDTH / 2 + sectionWidth * (sectionIndex + 0.5);
  const sigma = sectionWidth * 0.44;
  const distance = x - centerX;

  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

function getTerrainHeight(x: number, z: number, time: number, activeSection: SectionId | null) {
  const influence = getSectionInfluence(x, activeSection);
  const amplitude = BASE_AMPLITUDE + influence * (HOVER_AMPLITUDE - BASE_AMPLITUDE);
  const slowTime = time * MOTION_SPEED;
  const baseSignal =
    Math.sin(x * 0.68 + z * 0.72 + slowTime * 1.5) * 0.52 +
    Math.sin(x * 0.34 - z * 1.08 - slowTime * 1.1 + 1.4) * 0.3 +
    Math.sin((x + z) * 0.22 + slowTime * 0.8 + 2.1) * 0.18;
  const pressureSignal =
    Math.sin(x * 0.82 + z * 1.18 + slowTime * 1.9 + 0.6) * 0.24 +
    Math.sin(x * 0.46 - z * 0.52 - slowTime * 1.4 + 2.4) * 0.14;

  return baseSignal * amplitude + pressureSignal * influence * 0.22;
}

function TerrainSurface({ activeSection }: TerrainSurfaceProps) {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { geometry, basePositions } = useMemo(() => {
    const terrainGeometry = new THREE.PlaneGeometry(
      TERRAIN_WIDTH,
      TERRAIN_DEPTH,
      GRID_RESOLUTION_X - 1,
      GRID_RESOLUTION_Z - 1,
    );
    const positions = terrainGeometry.attributes.position.array;

    return {
      geometry: terrainGeometry,
      basePositions: Float32Array.from(positions),
    };
  }, []);

  useFrame(({ clock }) => {
    const position = geometry.attributes.position;
    const time = clock.getElapsedTime();

    for (let index = 0; index < position.count; index += 1) {
      const x = basePositions[index * 3];
      const z = basePositions[index * 3 + 1];
      const height = getTerrainHeight(x, z, time, activeSection);

      position.setZ(index, height);
    }

    position.needsUpdate = true;

    if (materialRef.current) {
      materialRef.current.opacity = activeSection ? HOVER_OPACITY : REST_OPACITY;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation-x={-Math.PI * 0.62}>
      <meshBasicMaterial
        ref={materialRef}
        color={AMBER_COLOR}
        wireframe
        transparent
        opacity={REST_OPACITY}
        depthWrite={false}
      />
    </mesh>
  );
}

function HoverZones({ onHoverSection }: SignalTerrainNavWebGLProps) {
  const sectionWidth = TERRAIN_WIDTH / SECTIONS.length;

  return (
    <group rotation-x={-Math.PI * 0.62}>
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
            position={[centerX, 0, 1.2]}
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

export default function SignalTerrainNavWebGL({ onHoverSection }: SignalTerrainNavWebGLProps) {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);

  const handleHoverSection = (section: SectionId | null) => {
    setActiveSection(section);
    onHoverSection?.(section);
  };

  return (
    <div className="h-full min-h-[360px] w-full bg-transparent">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 18], zoom: 42, near: 0.1, far: 100 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <TerrainSurface activeSection={activeSection} />
        <HoverZones onHoverSection={handleHoverSection} />
      </Canvas>
    </div>
  );
}
