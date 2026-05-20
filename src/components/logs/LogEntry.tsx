import type { LogRecord } from '../../data/logs';

type LogEntryProps = {
  log: LogRecord;
};

export function LogEntry({ log }: LogEntryProps) {
  return (
    <article className="grid gap-[var(--space-2)] border-l border-[color:var(--amber-dim)] pl-[var(--space-4)]">
      <p className="font-mono text-[length:var(--font-xs)] uppercase tracking-[0.16em] text-[color:var(--amber-dim)]">{log.stamp}</p>
      <h3 className="font-sans text-[length:var(--font-base)] font-medium text-[color:var(--amber-core)]">{log.title}</h3>
      <p className="text-[length:var(--font-sm)] leading-[calc(1.5rem*var(--ui-scale))] text-[color:var(--amber-base)]">{log.body}</p>
    </article>
  );
}
