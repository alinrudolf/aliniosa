import type { ReactNode } from 'react';
import { StatusBadge } from './StatusBadge';
import { SystemBlock } from './SystemBlock';
import { SystemCommand } from './SystemCommand';

export type SystemModuleBlock = {
  label: string;
  value: ReactNode;
};

type SystemModuleProps = {
  id: string;
  moduleId: string;
  status: string;
  title: string;
  blocks: SystemModuleBlock[];
  command?: string;
};

export function SystemModule({ id, moduleId, status, title, blocks, command }: SystemModuleProps) {
  return (
    <section id={id} className="scroll-mt-[var(--space-8)] border-t border-[color:var(--amber-dim)] py-[var(--space-8)]">
      <div className="mb-[var(--space-5)] flex items-center justify-between gap-[var(--space-4)]">
        <p className="font-mono text-[length:var(--font-xs)] uppercase tracking-[0.18em] text-[color:var(--amber-dim)]">{moduleId}</p>
        <StatusBadge status={status} />
      </div>
      <h2 className="mb-[var(--space-6)] max-w-[calc(56rem*var(--ui-scale))] font-sans text-[length:var(--font-xl)] font-semibold leading-tight text-[color:var(--amber-core)] [text-shadow:var(--glow-text-soft)]">
        {title}
      </h2>
      <dl className="grid gap-[var(--space-5)]">
        {blocks.map((block) => (
          <SystemBlock key={block.label} label={block.label}>
            {block.value}
          </SystemBlock>
        ))}
      </dl>
      {command ? <div className="mt-[var(--space-6)]"><SystemCommand command={command} /></div> : null}
    </section>
  );
}
