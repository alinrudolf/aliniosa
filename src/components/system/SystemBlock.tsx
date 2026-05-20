import type { ReactNode } from 'react';

type SystemBlockProps = {
  label: string;
  children: ReactNode;
};

export function SystemBlock({ label, children }: SystemBlockProps) {
  return (
    <div className="grid gap-[var(--space-2)] border-l border-[color:var(--amber-dim)] pl-[var(--space-4)]">
      <dt className="font-mono text-[length:var(--font-xs)] uppercase tracking-[0.18em] text-[color:var(--amber-dim)]">{label}</dt>
      <dd className="m-0 text-[length:var(--font-sm)] leading-[calc(1.75rem*var(--ui-scale))] text-[color:var(--amber-core)]">{children}</dd>
    </div>
  );
}
