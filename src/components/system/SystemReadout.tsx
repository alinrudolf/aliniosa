import { useEffect, useRef, useState } from 'react';
import { systemReadout } from '../../data/systemReadout';

const UPTIME_INTERVAL_MS = 1000;

function formatUptime(elapsedMs: number) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${days}D ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function SystemReadout() {
  const startTimeRef = useRef(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const updateUptime = () => setElapsedMs(Date.now() - startTimeRef.current);
    const intervalId = window.setInterval(updateUptime, UPTIME_INTERVAL_MS);

    updateUptime();

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <aside
      className="system-label-type pointer-events-none grid w-[var(--readout-width)] grid-cols-[var(--readout-column-width)_var(--readout-column-width)] justify-between text-[color:var(--amber-base)]"
      aria-label="System readout"
    >
      <section className="grid gap-[var(--space-3)]">
        <div className="grid gap-[var(--space-2)] text-[length:var(--font-xs)] font-normal">
          <h2>{systemReadout.status.label}</h2>
          <span className="crt-divider-line h-px w-full text-[color:var(--amber-base)]" aria-hidden="true" />
        </div>
        <dl className="grid gap-[var(--space-2)] text-[length:var(--font-xs)] font-normal">
          <div>
            <dt className="sr-only">Location</dt>
            <dd>LOCATION: {systemReadout.status.location}</dd>
          </div>
          <div>
            <dt className="sr-only">Uptime</dt>
            <dd>UPTIME: {formatUptime(elapsedMs)}</dd>
          </div>
        </dl>
      </section>
      <section className="grid gap-[var(--space-3)]">
        <div className="grid gap-[var(--space-2)] text-[length:var(--font-xs)] font-normal">
          <h2>{systemReadout.node.label}</h2>
          <span className="crt-divider-line h-px w-full text-[color:var(--amber-base)]" aria-hidden="true" />
        </div>
        <dl className="grid gap-[var(--space-2)] text-[length:var(--font-xs)] font-normal">
          <div>
            <dt className="sr-only">Node</dt>
            <dd>{systemReadout.node.name}</dd>
          </div>
          <div>
            <dt className="sr-only">Last update</dt>
            <dd>LAST UPDATE: {systemReadout.node.lastUpdate}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
