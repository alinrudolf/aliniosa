import { useEffect, useMemo, useRef } from 'react';
import { signalHoverLabels, signalMonitorLabel, signalNavigation } from '../../data/navigation';

const DEBUG_ANIMATION = false;
const DEBUG_VISUAL = false;

type WaveConfig = {
  row: TerrainRow;
  motionScale: number;
  amplitudeScale: number;
  width: number;
  height: number;
};

type TerrainRow = {
  id: string;
  rowIndex: number;
  z: number;
  navId: string;
  navIndex: number;
};

type NavigationRegion = {
  id: string;
  href: string;
  title: string;
  action: string;
  y: number;
  height: number;
};

const TERRAIN_VISIBLE_ROW_COUNT = 24;
const TERRAIN_LOWER_EXTENSION_ROW_COUNT = 7;
const TERRAIN_ROW_COUNT = TERRAIN_VISIBLE_ROW_COUNT + TERRAIN_LOWER_EXTENSION_ROW_COUNT;
const TERRAIN_LOWER_EXTENSION_DEPTH =
  TERRAIN_LOWER_EXTENSION_ROW_COUNT / (TERRAIN_VISIBLE_ROW_COUNT - 1);
const TERRAIN_POINT_STEP = 18;

const terrainRows: TerrainRow[] = Array.from({ length: TERRAIN_ROW_COUNT }, (_, rowIndex) => {
  const visibleRowMaxIndex = TERRAIN_VISIBLE_ROW_COUNT - 1;
  const extensionRowIndex = rowIndex - visibleRowMaxIndex;
  const z =
    rowIndex <= visibleRowMaxIndex
      ? rowIndex / visibleRowMaxIndex
      : 1 + (extensionRowIndex / TERRAIN_LOWER_EXTENSION_ROW_COUNT) * TERRAIN_LOWER_EXTENSION_DEPTH;
  const navIndex = Math.min(signalNavigation.length - 1, Math.floor(z * signalNavigation.length));

  return {
    id: `terrain-row-${rowIndex}`,
    rowIndex,
    z,
    navId: signalNavigation[navIndex].id,
    navIndex,
  };
});

const hoverEnergyByDistance = [0.74, 0.2, 0.06];

function getHoverTarget(row: TerrainRow, activeNavId: string | null) {
  if (!activeNavId) {
    return 0;
  }

  const activeIndex = signalNavigation.findIndex((signal) => signal.id === activeNavId);

  if (activeIndex < 0) {
    return 0;
  }

  const distance = Math.abs(row.navIndex - activeIndex);

  return hoverEnergyByDistance[distance] ?? 0;
}

function mixNumber(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function createNavigationRegions(height: number): NavigationRegion[] {
  const horizonY = height * 0.3;
  const depthSpan = height * 0.56;

  return signalNavigation.map((signal, index) => ({
    id: signal.id,
    href: signal.href,
    title: signal.title,
    action: signal.action,
    y: horizonY + (index / signalNavigation.length) ** 1.62 * depthSpan - 18,
    height:
      horizonY + ((index + 1) / signalNavigation.length) ** 1.62 * depthSpan -
      (horizonY + (index / signalNavigation.length) ** 1.62 * depthSpan) +
      36,
  }));
}

function terrainHeight(
  x: number,
  z: number,
  time: number,
  motionScale: number,
) {
  return (
    Math.sin(x * 0.0072 + z * 5.8 + time * 0.82 * motionScale + 0.4) * 0.52 +
    Math.sin(x * 0.013 - z * 7.1 - time * 0.58 * motionScale + 1.7) * 0.3 +
    Math.sin((x + z * 420) * 0.0048 + time * 0.42 * motionScale + 2.6) * 0.18
  );
}

function makeWavePath(time: number, config: WaveConfig): string {
  const points: string[] = [];
  const depthCurve = config.row.z ** 1.62;
  const horizonY = config.height * 0.3;
  const depthSpan = config.height * 0.56;
  const baseY = horizonY + depthCurve * depthSpan;
  const debugScale = DEBUG_ANIMATION ? 3.5 : 1;
  const amplitude = (16 + config.row.z ** 1.35 * 54) * debugScale * config.amplitudeScale;
  const perspectiveScale = 0.52 + config.row.z * 0.48;

  const pushPoint = (x: number) => {
    const edgeFalloff = 0.58 + Math.sin((x / config.width) * Math.PI) * 0.42;
    const heightValue = terrainHeight(x, config.row.z, time, config.motionScale);
    const y = baseY - heightValue * amplitude * perspectiveScale * edgeFalloff;

    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  };

  for (let x = 0; x <= config.width; x += TERRAIN_POINT_STEP) {
    pushPoint(x);
  }

  const lastPoint = points[points.length - 1];

  if (!lastPoint || !lastPoint.startsWith(config.width.toFixed(1))) {
    pushPoint(config.width);
  }

  return `M ${points.join(' L ')}`;
}

type SignalMonitorNavProps = {
  activeNavId: string | null;
  onActiveNavChange: (id: string | null) => void;
};

export function SignalMonitorNav({ activeNavId, onActiveNavChange }: SignalMonitorNavProps) {
  const activeIdRef = useRef<string | null>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const hoverEnergyRefs = useRef<Record<string, number>>({});
  const debugPreviousPathRef = useRef<string | null>(null);
  const timeRef = useRef(0);
  const width = 1100;
  const height = 520;
  const navigationRegions = useMemo(() => createNavigationRegions(height), [height]);
  const sectionLabel = activeNavId ? signalHoverLabels[activeNavId] : signalMonitorLabel;

  useEffect(() => {
    activeIdRef.current = activeNavId;
  }, [activeNavId]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let lastFrameTime = performance.now();

    const renderTerrain = (elapsed = 0) => {
      let debugChangedPath = false;
      const easing = elapsed > 0 ? Math.min(0.18, elapsed * 7.5) : 1;

      terrainRows.forEach((row) => {
        const pathElement = pathRefs.current[row.id];

        if (!pathElement) {
          return;
        }

        const renderDepth = Math.min(1, row.z);
        const baseOpacity = 0.12 + renderDepth * 0.54;
        const baseStrokeWidth = 0.65 + renderDepth * 0.78;
        const hoverTarget = getHoverTarget(row, activeIdRef.current);
        const hoverEnergy = mixNumber(hoverEnergyRefs.current[row.id] ?? 0, hoverTarget, easing);
        const tonalWeight = Math.round(mixNumber(0, 62, hoverEnergy));
        const easedOpacity = Math.min(0.82, baseOpacity + hoverEnergy * 0.16);
        const easedStrokeWidth = Math.min(1.7, baseStrokeWidth + hoverEnergy * 0.18);
        const amplitudeScale = 1 + hoverEnergy * 0.216;
        const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
        const path = makeWavePath(timeRef.current, {
          row,
          motionScale,
          amplitudeScale,
          width,
          height,
        });

        if (DEBUG_ANIMATION && row.rowIndex === 14) {
          const previousPath = debugPreviousPathRef.current;
          debugChangedPath = previousPath === null || previousPath !== path;
          debugPreviousPathRef.current = path;
        }

        hoverEnergyRefs.current[row.id] = hoverEnergy;
        pathElement.setAttribute('d', path);
        pathElement.setAttribute(
          'stroke',
          `color-mix(in srgb, var(--amber-core) ${tonalWeight}%, var(--amber-dim))`,
        );
        pathElement.setAttribute('stroke-width', (DEBUG_VISUAL ? easedStrokeWidth * 1.6 : easedStrokeWidth).toFixed(2));
        pathElement.setAttribute('opacity', (DEBUG_VISUAL ? Math.min(1, easedOpacity + 0.12) : easedOpacity).toFixed(3));
      });

      if (DEBUG_ANIMATION && debugPreviousPathRef.current && !debugChangedPath) {
        console.warn('SignalMonitorNav terrain path did not change on this frame.');
      }
    };

    const renderWaveforms = (frameTime: number) => {
      const elapsed = (frameTime - lastFrameTime) / 1000;
      lastFrameTime = frameTime;

      if (DEBUG_ANIMATION || !motionQuery.matches) {
        timeRef.current += elapsed;
      }

      renderTerrain(elapsed);
      animationFrame = window.requestAnimationFrame(renderWaveforms);
    };

    renderTerrain();
    animationFrame = window.requestAnimationFrame(renderWaveforms);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [height, width]);

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
          {terrainRows.map((row) => {
            const renderDepth = Math.min(1, row.z);
            const opacity = 0.12 + renderDepth * 0.54;
            const strokeWidth = 0.65 + renderDepth * 0.78;
            const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
            const path = makeWavePath(0, {
              row,
              motionScale,
              amplitudeScale: 1,
              width,
              height,
            });

            return (
              <path
                key={row.id}
                ref={(node) => {
                  pathRefs.current[row.id] = node;
                }}
                d={path}
                fill="none"
                stroke="var(--amber-dim)"
                strokeWidth={DEBUG_VISUAL ? strokeWidth * 1.6 : strokeWidth}
                opacity={DEBUG_VISUAL ? Math.min(1, opacity + 0.12) : opacity}
                vectorEffect="non-scaling-stroke"
                className="monitor-signal-path"
              />
            );
          })}
          {navigationRegions.map((zone) => {
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
                  x="0"
                  y={zone.y}
                  width={width}
                  height={zone.height}
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
