import { useEffect, useRef } from 'react';
import { signalHoverLabels, signalMonitorLabel, signalNavigation } from '../../data/navigation';

const DEBUG_ANIMATION = false;

type WaveConfig = {
  rowIndex: number;
  baseY: number;
  amplitude: number;
  perspective: number;
  motionScale: number;
  frequencies: number[];
  speeds: number[];
  phases: number[];
  width: number;
};

function getTerrainFrequencies(rowIndex: number, perspective: number) {
  return [0.0062 + perspective * 0.002, 0.012 + rowIndex * 0.0002, 0.021 - perspective * 0.004];
}

function getTerrainSpeeds(rowIndex: number, perspective: number, speedScale = 1) {
  const rowDrift = 1 + (rowIndex % 5) * 0.045;
  const depthDrift = 0.88 + perspective * 0.32;

  return [1.85 * rowDrift * speedScale, -1.28 * depthDrift * speedScale, 0.92 * rowDrift * depthDrift * speedScale];
}

function getTerrainPhases(phase: number, rowIndex: number) {
  return [phase, phase * 1.8 + rowIndex * 0.13, phase * 0.68 - rowIndex * 0.09];
}

const terrainRows = Array.from({ length: 36 }, (_, rowIndex) => {
  const perspective = rowIndex / 35;
  const navIndex = Math.min(signalNavigation.length - 1, Math.floor(perspective * signalNavigation.length));
  const baseY = 126 + perspective * perspective * 320;

  return {
    id: `terrain-${rowIndex}`,
    rowIndex,
    navId: signalNavigation[navIndex].id,
    baseY,
    perspective,
    phase: 0.34 + rowIndex * 0.29,
  };
});

function makeWavePath(time: number, config: WaveConfig): string {
  const points: string[] = [];
  const step = 8;
  const componentCount = Math.min(config.frequencies.length, config.speeds.length, config.phases.length);

  for (let x = 0; x <= config.width; x += step) {
    const centerBias = Math.sin((x / config.width) * Math.PI);
    const perspectiveBias = 0.28 + config.perspective * 0.72;
    const ridgeBias =
      0.72 +
      Math.sin(x * 0.008 + time * 0.72 * config.motionScale + config.rowIndex * 0.31) * 0.18 +
      Math.sin(x * 0.017 - time * 0.52 * config.motionScale - config.rowIndex * 0.22) * 0.1;
    const crestDrift =
      Math.sin(time * 0.86 * config.motionScale + config.rowIndex * 0.27) *
      config.amplitude *
      0.1 *
      perspectiveBias *
      centerBias;
    let signalY = config.baseY;

    for (let index = 0; index < componentCount; index += 1) {
      const amplitudeShare = (config.amplitude * perspectiveBias * ridgeBias) / (index + 1.45);
      signalY +=
        Math.sin(x * config.frequencies[index] + time * config.speeds[index] * config.motionScale + config.phases[index]) *
        amplitudeShare *
        centerBias;
    }

    points.push(`${x.toFixed(1)},${(signalY + crestDrift).toFixed(1)}`);
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
  const debugPreviousPathRef = useRef<string | null>(null);
  const timeRef = useRef(0);
  const width = 1100;
  const height = 520;
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

      terrainRows.forEach((row) => {
        const pathElement = pathRefs.current[row.id];

        if (!pathElement) {
          return;
        }

        const active = row.navId === activeIdRef.current;
        const debugScale = DEBUG_ANIMATION ? 3.5 : 1;
        const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
        const amplitude = ((active ? 48 : 32) + row.perspective * (active ? 56 : 44)) * debugScale;
        const speedScale = active ? 1.34 : 1;
        const path = makeWavePath(timeRef.current, {
          rowIndex: row.rowIndex,
          baseY: row.baseY,
          amplitude,
          perspective: row.perspective,
          motionScale,
          frequencies: getTerrainFrequencies(row.rowIndex, row.perspective),
          speeds: getTerrainSpeeds(row.rowIndex, row.perspective, speedScale),
          phases: getTerrainPhases(row.phase, row.rowIndex),
          width,
        });

        if (DEBUG_ANIMATION && row.rowIndex === 18) {
          const previousPath = debugPreviousPathRef.current;
          debugChangedPath = previousPath === null || previousPath !== path;
          debugPreviousPathRef.current = path;
        }

        pathElement.setAttribute('d', path);
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
  }, [width]);

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
            const active = row.navId === activeNavId;
            const opacity = active ? Math.min(1, 0.48 + row.perspective * 0.52) : 0.12 + row.perspective * 0.58;
            const strokeWidth = active ? Math.min(2, 1.2 + row.perspective * 0.8) : 0.75 + row.perspective * 0.65;
            const debugScale = DEBUG_ANIMATION ? 3.5 : 1;
            const motionScale = DEBUG_ANIMATION ? 5 : 1.35;
            const path = makeWavePath(0, {
              rowIndex: row.rowIndex,
              baseY: row.baseY,
              amplitude: ((active ? 48 : 32) + row.perspective * (active ? 56 : 44)) * debugScale,
              perspective: row.perspective,
              motionScale,
              frequencies: getTerrainFrequencies(row.rowIndex, row.perspective),
              speeds: getTerrainSpeeds(row.rowIndex, row.perspective),
              phases: getTerrainPhases(row.phase, row.rowIndex),
              width,
            });

            return (
              <path
                key={row.id}
                ref={(node) => {
                  pathRefs.current[row.id] = node;
                }}
                d={path}
                fill="none"
                stroke={active ? 'var(--amber-core)' : 'var(--amber-dim)'}
                strokeWidth={strokeWidth}
                opacity={opacity}
                vectorEffect="non-scaling-stroke"
                className={active ? 'monitor-signal-path-active' : 'monitor-signal-path'}
              />
            );
          })}
          {signalNavigation.map((signal, index) => {
            const terrainTop = 112;
            const bandHeight = 58;

            return (
              <a
                key={signal.id}
                href={signal.href}
                aria-label={`${signal.title}: ${signal.action}`}
                onMouseEnter={() => onActiveNavChange(signal.id)}
                onMouseLeave={() => onActiveNavChange(null)}
                onFocus={() => onActiveNavChange(signal.id)}
                onBlur={() => onActiveNavChange(null)}
              >
                <rect
                  x="0"
                  y={terrainTop + index * bandHeight}
                  width={width}
                  height={bandHeight}
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
