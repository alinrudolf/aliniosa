import type { LogRecord } from '../../data/logs';

type LogEntryProps = {
  log: LogRecord;
};

export function LogEntry({ log }: LogEntryProps) {
  return (
    <article className="grid gap-2 border-l border-[color:var(--amber-dim)] pl-4">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[color:var(--amber-dim)]">{log.stamp}</p>
      <h3 className="font-sans text-base font-medium text-[color:var(--amber-core)]">{log.title}</h3>
      <p className="text-sm leading-6 text-[color:var(--amber-base)]">{log.body}</p>
    </article>
  );
}
