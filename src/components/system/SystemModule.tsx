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
    <section id={id} className="scroll-mt-8 border-t border-[color:var(--amber-dim)] py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[color:var(--amber-dim)]">{moduleId}</p>
        <StatusBadge status={status} />
      </div>
      <h2 className="mb-6 max-w-4xl font-sans text-2xl font-semibold leading-tight text-[color:var(--amber-core)] [text-shadow:var(--glow-text-soft)] sm:text-3xl">
        {title}
      </h2>
      <dl className="grid gap-5">
        {blocks.map((block) => (
          <SystemBlock key={block.label} label={block.label}>
            {block.value}
          </SystemBlock>
        ))}
      </dl>
      {command ? <div className="mt-6"><SystemCommand command={command} /></div> : null}
    </section>
  );
}
