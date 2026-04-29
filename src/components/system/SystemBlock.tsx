import type { ReactNode } from 'react';

type SystemBlockProps = {
  label: string;
  children: ReactNode;
};

export function SystemBlock({ label, children }: SystemBlockProps) {
  return (
    <div className="grid gap-2 border-l border-[color:var(--amber-dim)] pl-4">
      <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--amber-dim)]">{label}</dt>
      <dd className="m-0 text-sm leading-7 text-[color:var(--amber-core)] sm:text-base">{children}</dd>
    </div>
  );
}
