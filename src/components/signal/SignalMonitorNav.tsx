import { useMemo, useState } from 'react';
import { signalMonitorLabel, signalNavigation } from '../../data/navigation';

function makeWavePath(width: number, baseY: number, amplitude: number, frequency: number, phase: number) {
  const points: string[] = [];
  const step = 10;

  for (let x = 0; x <= width; x += step) {
    const centerBias = Math.sin((x / width) * Math.PI);
    const noise =
      Math.sin(x / (frequency * 0.42) + phase * 2.1) * 0.35 +
      Math.sin(x / (frequency * 0.19) + phase * 0.7) * 0.18;
    const y = baseY + Math.sin(x / frequency + phase) * amplitude * centerBias + noise * amplitude * centerBias;

    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return `M ${points.join(' L ')}`;
}

export function SignalMonitorNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeSignal = useMemo(() => signalNavigation.find((signal) => signal.id === activeId) ?? null, [activeId]);
  const width = 1100;
  const height = 520;
  const calloutY = activeSignal ? Math.max(42, activeSignal.y - 190) : 0;
  const calloutLineY = activeSignal ? calloutY + 100 : 0;

  return (
    <section
      className="relative w-full overflow-hidden border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]"
      aria-label="Secondary signal navigation"
    >
      <span className="absolute -top-px right-8 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {signalMonitorLabel}
      </span>
      <style>{`
        @keyframes signalFlow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -80; }
        }

        @keyframes softPulse {
          0%, 100% { opacity: .72; }
          50% { opacity: 1; }
        }

        @keyframes restUndulate {
          0%, 100% { transform: scaleY(.88); }
          50% { transform: scaleY(1.04); }
        }

        @keyframes activeUndulate {
          0%, 100% { transform: scaleY(.96); }
          50% { transform: scaleY(1.22); }
        }

        .monitor-signal-path {
          stroke-dasharray: 14 10;
          transform-box: fill-box;
          transform-origin: center;
          animation:
            signalFlow 7s linear infinite,
            restUndulate 4.8s ease-in-out infinite;
        }

        .monitor-signal-path-active {
          stroke-dasharray: 20 8;
          transform-box: fill-box;
          transform-origin: center;
          animation:
            signalFlow 2.4s linear infinite,
            softPulse 1.6s ease-in-out infinite,
            activeUndulate 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .monitor-signal-path,
          .monitor-signal-path-active {
            animation: none;
          }
        }
      `}</style>
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

        <path d="M 8 24 L 8 8 L 24 8" stroke="var(--amber-core)" strokeWidth="1" fill="none" />
        <path d={`M ${width - 24} 8 L ${width - 8} 8 L ${width - 8} 24`} stroke="var(--amber-core)" strokeWidth="1" fill="none" />
        <path d={`M 8 ${height - 24} L 8 ${height - 8} L 24 ${height - 8}`} stroke="var(--amber-core)" strokeWidth="1" fill="none" />
        <path d={`M ${width - 24} ${height - 8} L ${width - 8} ${height - 8} L ${width - 8} ${height - 24}`} stroke="var(--amber-core)" strokeWidth="1" fill="none" />

        {Array.from({ length: 28 }).map((_, index) => {
          const y = 46 + index * 15;
          const tick = index % 4 === 0 ? 20 : 15;

          return (
            <g key={index} opacity={index % 4 === 0 ? 0.75 : 0.38}>
              <line x1="10" y1={y} x2={tick} y2={y} stroke="var(--amber-dim)" strokeWidth="1" />
              <line x1={width - 10} y1={y} x2={width - tick} y2={y} stroke="var(--amber-dim)" strokeWidth="1" />
            </g>
          );
        })}

        <line x1="40" y1="260" x2={width - 40} y2="260" stroke="var(--amber-dim)" strokeWidth="1" opacity="0.14" />

        {signalNavigation.map((signal) => {
          const active = signal.id === activeId;
          const path = makeWavePath(width, signal.y, active ? signal.amp * 1.28 : signal.amp * 0.42, signal.freq, signal.phase);

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
                d={path}
                fill="none"
                stroke={active ? 'var(--amber-core)' : 'var(--amber-dim)'}
                strokeWidth={active ? 2.4 : 1.05}
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
