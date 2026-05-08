import { useEffect, useMemo, useRef } from 'react';
import { signalHoverLabels, signalMonitorLabel, signalNavigation } from '../../data/navigation';

const DEBUG_ANIMATION = false;
const DEBUG_VISUAL = false;

type WaveConfig = {
  row: TerrainRow;
  segment: TerrainSegment;
  motionScale: number;
  activeZone: NavigationZone | null;
  activeBoost: number;
  width: number;
  height: number;
};

type TerrainRow = {
  id: string;
  rowIndex: number;
  z: number;
};

type NavigationZone = {
  id: string;
  href: string;
  title: string;
  action: string;
  x: number;
  width: number;
};

type TerrainSegment = {
  id: string;
  xStart: number;
  xEnd: number;
};

const TERRAIN_SEGMENT_COUNT = 22;

const terrainRows: TerrainRow[] = Array.from({ length: 42 }, (_, rowIndex) => {
  const z = rowIndex / 41;

  return {
    id: `terrain-row-${rowIndex}`,
    rowIndex,
    z,
  };
});

function createNavigationZones(width: number): NavigationZone[] {
  const zoneWidth = width / signalNavigation.length;

  return signalNavigation.map((signal, index) => ({
    id: signal.id,
    href: signal.href,
    title: signal.title,
    action: signal.action,
    x: index * zoneWidth,
    width: zoneWidth,
  }));
}

function createTerrainSegments(width: number): TerrainSegment[] {
  const segmentWidth = width / TERRAIN_SEGMENT_COUNT;

  return Array.from({ length: TERRAIN_SEGMENT_COUNT }, (_, segmentIndex) => ({
    id: `segment-${segmentIndex}`,
    xStart: segmentIndex * segmentWidth,
    xEnd: (segmentIndex + 1) * segmentWidth,
  }));
}

function getRegionInfluence(x: number, zone: NavigationZone | null) {
  if (!zone) {
    return 0;
  }

  const zoneCenter = zone.x + zone.width / 2;
  const sigma = zone.width * 0.42;
  const distance = x - zoneCenter;

  return Math.exp(-(distance * distance) / (2 * sigma * sigma));
}

function terrainHeight(
  x: number,
  z: number,
  time: number,
  motionScale: number,
  activeZone: NavigationZone | null,
  activeBoost: number,
) {
  const baseHeight =
    Math.sin(x * 0.0072 + z * 5.8 + time * 0.82 * motionScale + 0.4) * 0.52 +
    Math.sin(x * 0.013 - z * 7.1 - time * 0.58 * motionScale + 1.7) * 0.3 +
    Math.sin((x + z * 420) * 0.0048 + time * 0.42 * motionScale + 2.6) * 0.18;
  const influence = getRegionInfluence(x, activeZone);
  const localRidge =
    Math.sin(x * 0.018 + z * 9.4 + time * 1.18 * motionScale + 0.9) * 0.44 +
    Math.sin((x - z * 280) * 0.009 + time * 0.92 * motionScale + 2.1) * 0.24;

  return (
    baseHeight * (1 + influence * activeBoost) +
    localRidge * influence * activeBoost * 0.78
  );
}

function getActiveBoost(active: boolean) {
  if (!active) {
    return 0;
  }

  return DEBUG_VISUAL ? 5 : 2.85;
}

function makeWavePath(time: number, config: WaveConfig): string {
  const points: string[] = [];
  const step = 10;
  const depthCurve = config.row.z ** 1.62;
  const horizonY = config.height * 0.3;
  const depthSpan = config.height * 0.56;
  const baseY = horizonY + depthCurve * depthSpan;
  const debugScale = DEBUG_ANIMATION ? 3.5 : 1;
  const amplitude = (12 + config.row.z ** 1.35 * 42) * debugScale;
  const perspectiveScale = 0.52 + config.row.z * 0.48;

  const pushPoint = (x: number) => {
    const edgeFalloff = 0.58 + Math.sin((x / config.width) * Math.PI) * 0.42;
    const heightValue = terrainHeight(x, config.row.z, time, config.motionScale, config.activeZone, config.activeBoost);
    const y = baseY - heightValue * amplitude * perspectiveScale * edgeFalloff;

    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  };

  for (let x = config.segment.xStart; x <= config.segment.xEnd; x += step) {
    pushPoint(x);
  }

  const lastPoint = points[points.length - 1];

  if (!lastPoint || !lastPoint.startsWith(config.segment.xEnd.toFixed(1))) {
    pushPoint(config.segment.xEnd);
  }

  return `M ${points.join(' L ')}`;
}

function getRowActiveInfluence(row: TerrainRow, activeZone: NavigationZone | null) {
  if (!activeZone) {
    return 0;
  }

  return 0.55 + row.z * 0.45;
}

function getSegmentActiveInfluence(row: TerrainRow, segment: TerrainSegment, activeZone: NavigationZone | null) {
  if (!activeZone) {
    return 0;
  }

  const influence =
    (getRegionInfluence(segment.xStart, activeZone) +
      getRegionInfluence((segment.xStart + segment.xEnd) / 2, activeZone) +
      getRegionInfluence(segment.xEnd, activeZone)) /
    3;

  return influence * getRowActiveInfluence(row, activeZone);
}

function getSegmentStroke(influence: number) {
  if (influence <= 0.04) {
    return 'var(--amber-dim)';
  }

  const amberMix = Math.round(Math.min(68, 18 + influence * 50));

  return `color-mix(in srgb, var(--amber-dim) ${100 - amberMix}%, var(--amber-core) ${amberMix}%)`;
}

type SignalMonitorNavProps = {
  activeNavId: string | null;
  onActiveNavChange: (id: string | null) => void;
};

export function SignalMonitorNav({ activeNavId, onActiveNavChange }: SignalMonitorNavProps) {
  const activeIdRef = useRef<string | null>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const debugPreviousPathRef = useRef<string | null>(null);
  const timeRef = useRef(0);
  const width = 1100;
  const height = 520;
  const navigationZones = useMemo(() => createNavigationZones(width), [width]);
  const terrainSegments = useMemo(() => createTerrainSegments(width), [width]);
  const activeZone = navigationZones.find((zone) => zone.id === activeNavId) ?? null;
  const sectionLabel = activeNavId ? signalHoverLabels[activeNavId] : signalMonitorLabel;

  useEffect(() => {
    activeIdRef.current = activeNavId;
  }, [activeNavId]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let lastFrameTime = performance.now();

    const renderTerrain = () => {
      let debugChangedPath = false;
      const activeZone = navigationZones.find((zone) => zone.id === activeIdRef.current) ?? null;
      const activeBoost = getActiveBoost(Boolean(activeZone));

      terrainRows.forEach((row) => {
        terrainSegments.forEach((segment) => {
          const pathElement = pathRefs.current[`${row.id}-${segment.id}`];

          if (!pathElement) {
            return;
          }

          const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
          const path = makeWavePath(timeRef.current, {
            row,
            segment,
            motionScale: activeZone ? motionScale * 1.16 : motionScale,
            activeZone,
            activeBoost,
            width,
            height,
          });

          if (DEBUG_ANIMATION && row.rowIndex === 24 && segment.id === 'segment-11') {
            const previousPath = debugPreviousPathRef.current;
            debugChangedPath = previousPath === null || previousPath !== path;
            debugPreviousPathRef.current = path;
          }

          pathElement.setAttribute('d', path);
        });
      });

      if (DEBUG_ANIMATION && debugPreviousPathRef.current && !debugChangedPath) {
        console.warn('SignalMonitorNav terrain path did not change on this frame.');
      }
    };

    const renderWaveforms = (frameTime: number) => {
      const elapsed = (frameTime - lastFrameTime) / 1000;
      lastFrameTime = frameTime;
      timeRef.current += elapsed;

      renderTerrain();
      animationFrame = window.requestAnimationFrame(renderWaveforms);
    };

    if (DEBUG_ANIMATION || !motionQuery.matches) {
      renderTerrain();
      animationFrame = window.requestAnimationFrame(renderWaveforms);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [height, navigationZones, terrainSegments, width]);

  return (
    <section
      className="relative h-full min-h-0 w-full overflow-visible border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]"
      aria-label="Secondary signal navigation"
    >
      <span className="absolute right-8 top-0 z-10 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {sectionLabel}
      </span>
      <div className="h-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Overlapping navigation signal waveforms"
        >
          {terrainRows.flatMap((row) => {
            const opacity = 0.12 + row.z * 0.54;
            const strokeWidth = 0.65 + row.z * 0.78;
            const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
            return terrainSegments.map((segment) => {
              const activeInfluence = getSegmentActiveInfluence(row, segment, activeZone);
              const path = makeWavePath(0, {
                row,
                segment,
                motionScale: activeZone ? motionScale * 1.16 : motionScale,
                activeZone,
                activeBoost: getActiveBoost(Boolean(activeZone)),
                width,
                height,
              });

              return (
                <path
                  key={`${row.id}-${segment.id}`}
                  ref={(node) => {
                    pathRefs.current[`${row.id}-${segment.id}`] = node;
                  }}
                  d={path}
                  fill="none"
                  stroke={getSegmentStroke(activeInfluence)}
                  strokeWidth={DEBUG_VISUAL && activeInfluence > 0.08 ? 2.5 : strokeWidth + activeInfluence * 0.32}
                  opacity={activeInfluence > 0 ? (DEBUG_VISUAL ? 1 : Math.min(0.9, opacity + activeInfluence * 0.16)) : opacity}
                  vectorEffect="non-scaling-stroke"
                  className={activeInfluence > 0.04 ? 'monitor-signal-path-active' : 'monitor-signal-path'}
                />
              );
            });
          })}
          {navigationZones.map((zone) => {
            return (
              <a
                key={zone.id}
                href={zone.href}
                aria-label={`${zone.title}: ${zone.action}`}
                onMouseEnter={() => onActiveNavChange(zone.id)}
                onMouseLeave={() => onActiveNavChange(null)}
                onFocus={() => onActiveNavChange(zone.id)}
                onBlur={() => onActiveNavChange(null)}
              >
                <rect
                  x={zone.x}
                  y="0"
                  width={zone.width}
                  height={height}
                  fill="transparent"
                  className="cursor-pointer"
                />
              </a>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

export default SignalMonitorNav;
