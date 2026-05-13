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
      className="font-vga pointer-events-none grid w-[640px] grid-cols-[300px_300px] justify-between text-[color:var(--amber-base)]"
      aria-label="System readout"
    >
      <section className="grid gap-3">
        <h2 className="border-b border-[color:var(--amber-base)] pb-2 text-[16px] font-normal leading-none">
          {systemReadout.status.label}
        </h2>
        <dl className="grid gap-2 text-[14px] font-normal leading-none">
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
      <section className="grid gap-3">
        <h2 className="border-b border-[color:var(--amber-base)] pb-2 text-[16px] font-normal leading-none">
          {systemReadout.node.label}
        </h2>
        <dl className="grid gap-2 text-[14px] font-normal leading-none">
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
