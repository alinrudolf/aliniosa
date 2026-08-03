import { systemReadout } from '../../data/systemReadout';
import { useSystemUptime } from './useSystemUptime';

export function SystemReadout() {
  const uptime = useSystemUptime();

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
            <dd>UPTIME: {uptime}</dd>
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
