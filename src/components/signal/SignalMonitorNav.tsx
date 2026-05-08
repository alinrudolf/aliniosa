import { useEffect, useMemo, useRef } from 'react';
import { signalHoverLabels, signalMonitorLabel, signalNavigation } from '../../data/navigation';

const DEBUG_ANIMATION = false;
const DEBUG_VISUAL = false;

type TerrainRow = {
  id: string;
  rowIndex: number;
  z: number;
  navId: string;
  navIndex: number;
  renderDepth: number;
  baseY: number;
  baseAmplitude: number;
  perspectiveScale: number;
  baseOpacity: number;
  baseStrokeWidth: number;
  primaryOffset: number;
  secondaryOffset: number;
  tertiaryOffset: number;
  hasGlow: boolean;
};

type NavigationRegion = {
  id: string;
  href: string;
  title: string;
  action: string;
  y: number;
  height: number;
};

type WaveFrame = {
  primaryTime: number;
  secondaryTime: number;
  tertiaryTime: number;
};

type WaveSample = {
  xLabel: string;
  primaryX: number;
  secondaryX: number;
  tertiaryX: number;
  edgeFalloff: number;
};

const SVG_WIDTH = 1100;
const SVG_HEIGHT = 520;
const WAVE_RENDER_FPS = 30;
const WAVE_RENDER_INTERVAL = 1000 / WAVE_RENDER_FPS;
const INITIAL_WAVE_FRAME: WaveFrame = {
  primaryTime: 0,
  secondaryTime: 0,
  tertiaryTime: 0,
};
const TERRAIN_VISIBLE_ROW_COUNT = 24;
const TERRAIN_LOWER_EXTENSION_ROW_COUNT = 7;
const TERRAIN_ROW_COUNT = TERRAIN_VISIBLE_ROW_COUNT + TERRAIN_LOWER_EXTENSION_ROW_COUNT;
const TERRAIN_LOWER_EXTENSION_DEPTH =
  TERRAIN_LOWER_EXTENSION_ROW_COUNT / (TERRAIN_VISIBLE_ROW_COUNT - 1);
const TERRAIN_POINT_STEP = 24;

function createWaveSamples(width: number): WaveSample[] {
  const samples: WaveSample[] = [];

  const pushSample = (x: number) => {
    samples.push({
      xLabel: x.toFixed(1),
      primaryX: x * 0.0072,
      secondaryX: x * 0.013,
      tertiaryX: x * 0.0048,
      edgeFalloff: 0.58 + Math.sin((x / width) * Math.PI) * 0.42,
    });
  };

  for (let x = 0; x < width; x += TERRAIN_POINT_STEP) {
    pushSample(x);
  }

  pushSample(width);

  return samples;
}

const waveSamples = createWaveSamples(SVG_WIDTH);

const terrainRows: TerrainRow[] = Array.from({ length: TERRAIN_ROW_COUNT }, (_, rowIndex) => {
  const visibleRowMaxIndex = TERRAIN_VISIBLE_ROW_COUNT - 1;
  const extensionRowIndex = rowIndex - visibleRowMaxIndex;
  const z =
    rowIndex <= visibleRowMaxIndex
      ? rowIndex / visibleRowMaxIndex
      : 1 + (extensionRowIndex / TERRAIN_LOWER_EXTENSION_ROW_COUNT) * TERRAIN_LOWER_EXTENSION_DEPTH;
  const navIndex = Math.min(signalNavigation.length - 1, Math.floor(z * signalNavigation.length));
  const renderDepth = Math.min(1, z);
  const depthCurve = z ** 1.62;
  const horizonY = SVG_HEIGHT * 0.3;
  const depthSpan = SVG_HEIGHT * 0.56;
  const debugScale = DEBUG_ANIMATION ? 3.5 : 1;

  return {
    id: `terrain-row-${rowIndex}`,
    rowIndex,
    z,
    navId: signalNavigation[navIndex].id,
    navIndex,
    renderDepth,
    baseY: horizonY + depthCurve * depthSpan,
    baseAmplitude: (16 + z ** 1.35 * 54) * debugScale,
    perspectiveScale: 0.52 + z * 0.48,
    baseOpacity: 0.12 + renderDepth * 0.54,
    baseStrokeWidth: 0.65 + renderDepth * 0.78,
    primaryOffset: z * 5.8 + 0.4,
    secondaryOffset: -z * 7.1 + 1.7,
    tertiaryOffset: z * 420 * 0.0048 + 2.6,
    hasGlow: rowIndex % 3 === 0 || rowIndex >= TERRAIN_VISIBLE_ROW_COUNT - 2,
  };
});

const hoverEnergyByDistance = [0.74, 0.2, 0.06];

function getHoverTarget(row: TerrainRow, activeNavIndex: number) {
  if (activeNavIndex < 0) {
    return 0;
  }

  const distance = Math.abs(row.navIndex - activeNavIndex);

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

function makeWavePath(row: TerrainRow, frame: WaveFrame, amplitudeScale: number): string {
  let path = '';
  const amplitude = row.baseAmplitude * row.perspectiveScale * amplitudeScale;

  for (let index = 0; index < waveSamples.length; index += 1) {
    const sample = waveSamples[index];
    const heightValue =
      Math.sin(sample.primaryX + row.primaryOffset + frame.primaryTime) * 0.52 +
      Math.sin(sample.secondaryX + row.secondaryOffset + frame.secondaryTime) * 0.3 +
      Math.sin(sample.tertiaryX + row.tertiaryOffset + frame.tertiaryTime) * 0.18;
    const y = row.baseY - heightValue * amplitude * sample.edgeFalloff;

    path += `${index === 0 ? 'M' : ' L'} ${sample.xLabel},${y.toFixed(1)}`;
  }

  return path;
}

type SignalMonitorNavProps = {
  activeNavId: string | null;
  onActiveNavChange: (id: string | null) => void;
};

export function SignalMonitorNav({ activeNavId, onActiveNavChange }: SignalMonitorNavProps) {
  const activeNavIndexRef = useRef(-1);
  const pathRefs = useRef<Array<SVGPathElement | null>>([]);
  const hoverEnergyRefs = useRef<number[]>([]);
  const debugPreviousPathRef = useRef<string | null>(null);
  const timeRef = useRef(0);
  const navigationRegions = useMemo(() => createNavigationRegions(SVG_HEIGHT), []);
  const sectionLabel = activeNavId ? signalHoverLabels[activeNavId] : signalMonitorLabel;

  useEffect(() => {
    activeNavIndexRef.current = activeNavId
      ? signalNavigation.findIndex((signal) => signal.id === activeNavId)
      : -1;
  }, [activeNavId]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let lastFrameTime = performance.now();
    let renderAccumulator = 0;

    const renderTerrain = (elapsed = 0) => {
      let debugChangedPath = false;
      const easing = elapsed > 0 ? Math.min(0.18, elapsed * 7.5) : 1;
      const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
      const frame = {
        primaryTime: timeRef.current * 0.82 * motionScale,
        secondaryTime: timeRef.current * -0.58 * motionScale,
        tertiaryTime: timeRef.current * 0.42 * motionScale,
      };

      terrainRows.forEach((row) => {
        const pathElement = pathRefs.current[row.rowIndex];

        if (!pathElement) {
          return;
        }

        const hoverTarget = getHoverTarget(row, activeNavIndexRef.current);
        const hoverEnergy = mixNumber(hoverEnergyRefs.current[row.rowIndex] ?? 0, hoverTarget, easing);
        const tonalWeight = Math.round(mixNumber(0, 62, hoverEnergy));
        const easedOpacity = Math.min(0.82, row.baseOpacity + hoverEnergy * 0.16);
        const easedStrokeWidth = Math.min(1.7, row.baseStrokeWidth + hoverEnergy * 0.18);
        const amplitudeScale = 1 + hoverEnergy * 0.216;
        const path = makeWavePath(row, frame, amplitudeScale);

        if (DEBUG_ANIMATION && row.rowIndex === 14) {
          const previousPath = debugPreviousPathRef.current;
          debugChangedPath = previousPath === null || previousPath !== path;
          debugPreviousPathRef.current = path;
        }

        hoverEnergyRefs.current[row.rowIndex] = hoverEnergy;
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
      renderAccumulator += elapsed * 1000;

      if (DEBUG_ANIMATION || !motionQuery.matches) {
        timeRef.current += elapsed;
      }

      if (DEBUG_ANIMATION || renderAccumulator >= WAVE_RENDER_INTERVAL) {
        renderTerrain(renderAccumulator / 1000);
        renderAccumulator %= WAVE_RENDER_INTERVAL;
      }

      animationFrame = window.requestAnimationFrame(renderWaveforms);
    };

    renderTerrain();
    animationFrame = window.requestAnimationFrame(renderWaveforms);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

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
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="block h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Overlapping navigation signal waveforms"
        >
          {terrainRows.map((row) => {
            const path = makeWavePath(row, INITIAL_WAVE_FRAME, 1);

            return (
              <path
                key={row.id}
                ref={(node) => {
                  pathRefs.current[row.rowIndex] = node;
                }}
                d={path}
                fill="none"
                stroke="var(--amber-dim)"
                strokeWidth={DEBUG_VISUAL ? row.baseStrokeWidth * 1.6 : row.baseStrokeWidth}
                opacity={DEBUG_VISUAL ? Math.min(1, row.baseOpacity + 0.12) : row.baseOpacity}
                vectorEffect="non-scaling-stroke"
                className={row.hasGlow ? 'monitor-signal-path' : undefined}
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
                  width={SVG_WIDTH}
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
