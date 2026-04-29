import { useEffect, useMemo, useRef, useState } from 'react';
import { signalMonitorLabel, signalNavigation } from '../../data/navigation';

type WaveConfig = {
  baseY: number;
  amplitude: number;
  frequencies: number[];
  speeds: number[];
  phases: number[];
  width: number;
};

function makeWavePath(time: number, config: WaveConfig): string {
  const points: string[] = [];
  const step = 10;
  const componentCount = Math.min(config.frequencies.length, config.speeds.length, config.phases.length);

  for (let x = 0; x <= config.width; x += step) {
    const centerBias = Math.sin((x / config.width) * Math.PI);
    let signalY = config.baseY;

    for (let index = 0; index < componentCount; index += 1) {
      const amplitudeShare = config.amplitude / (index + 1.65);
      signalY +=
        Math.sin(x * config.frequencies[index] + time * config.speeds[index] + config.phases[index]) *
        amplitudeShare *
        centerBias;
    }

    points.push(`${x.toFixed(1)},${signalY.toFixed(1)}`);
  }

  return `M ${points.join(' L ')}`;
}

export function SignalMonitorNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeSignal = useMemo(() => signalNavigation.find((signal) => signal.id === activeId) ?? null, [activeId]);
  const activeIdRef = useRef<string | null>(null);
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const timeRef = useRef(0);
  const width = 1100;
  const height = 520;
  const calloutY = activeSignal ? Math.max(42, activeSignal.y - 190) : 0;
  const calloutLineY = activeSignal ? calloutY + 100 : 0;

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrame = 0;
    let lastFrameTime = performance.now();

    const renderWaveforms = (frameTime: number) => {
      const elapsed = (frameTime - lastFrameTime) / 1000;
      lastFrameTime = frameTime;
      timeRef.current += elapsed;

      signalNavigation.forEach((signal) => {
        const pathElement = pathRefs.current[signal.id];

        if (!pathElement) {
          return;
        }

        const active = signal.id === activeIdRef.current;
        const amplitude = active ? signal.amp * 1.62 : signal.amp * 0.42;
        const speedScale = active ? 1.28 : 1;
        const path = makeWavePath(timeRef.current, {
          baseY: signal.y,
          amplitude,
          frequencies: [1 / signal.freq, 1 / (signal.freq * 0.42), 1 / (signal.freq * 0.19)],
          speeds: [1.1 * speedScale, -0.76 * speedScale, 0.48 * speedScale],
          phases: [signal.phase, signal.phase * 2.1, signal.phase * 0.7],
          width,
        });

        pathElement.setAttribute('d', path);
      });

      animationFrame = window.requestAnimationFrame(renderWaveforms);
    };

    if (!motionQuery.matches) {
      animationFrame = window.requestAnimationFrame(renderWaveforms);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [width]);

  return (
    <section
      className="relative w-full overflow-hidden border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]"
      aria-label="Secondary signal navigation"
    >
      <span className="absolute -top-px right-8 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {signalMonitorLabel}
      </span>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-[420px] w-full md:h-[520px]"
        preserveAspectRatio="none"
        role="img"
        aria-label="Overlapping navigation signal waveforms"
      >
        <defs>
          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {signalNavigation.map((signal) => {
          const active = signal.id === activeId;
          const path = makeWavePath(0, {
            baseY: signal.y,
            amplitude: active ? signal.amp * 1.62 : signal.amp * 0.42,
            frequencies: [1 / signal.freq, 1 / (signal.freq * 0.42), 1 / (signal.freq * 0.19)],
            speeds: [1.1, -0.76, 0.48],
            phases: [signal.phase, signal.phase * 2.1, signal.phase * 0.7],
            width,
          });

          return (
            <a
              key={signal.id}
              href={signal.href}
              aria-label={`${signal.title}: ${signal.action}`}
              onMouseEnter={() => setActiveId(signal.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(signal.id)}
              onBlur={() => setActiveId(null)}
            >
              <path
                ref={(node) => {
                  pathRefs.current[signal.id] = node;
                }}
                d={path}
                fill="none"
                stroke={active ? 'var(--amber-core)' : 'var(--amber-dim)'}
                strokeWidth={active ? 1.75 : 1.05}
                opacity={active ? 1 : 0.42}
                filter={active ? 'url(#amberGlow)' : undefined}
                className={active ? 'monitor-signal-path-active' : 'monitor-signal-path'}
              />
              <rect x="0" y={signal.y - 28} width={width} height="56" fill="transparent" className="cursor-pointer" />
            </a>
          );
        })}

        {activeSignal ? (
          <g filter="url(#amberGlow)">
            <line x1="720" y1={activeSignal.y} x2="720" y2={calloutLineY} stroke="var(--amber-core)" strokeWidth="1" opacity="0.95" />
            <circle cx="720" cy={activeSignal.y} r="6" fill="var(--amber-core)" />
            <rect x="700" y={calloutY} width="250" height="100" fill="var(--bg-crt)" stroke="var(--amber-core)" strokeWidth="1.5" />
            <text x="720" y={calloutY + 38} fill="var(--amber-core)" fontFamily="var(--font-family-mono)" fontSize="30" letterSpacing="2">
              {activeSignal.title}
            </text>
            <text x="720" y={calloutY + 75} fill="var(--amber-core)" fontFamily="var(--font-family-mono)" fontSize="16" letterSpacing="1.4">
              {activeSignal.action} &gt;
            </text>
          </g>
        ) : null}
      </svg>
    </section>
  );
}

export default SignalMonitorNav;
