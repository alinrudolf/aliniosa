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
  title: ReactNode;
  blocks: SystemModuleBlock[];
  command?: string;
  document?: { active: boolean };
  panel?: {
    controls: ReactNode;
    externalLink: { label: ReactNode; href: string };
  };
};

export function SystemModule({ id, moduleId, status, title, blocks, command, panel, document }: SystemModuleProps) {
  if (document) {
    return (
      <section id={id} className="work-chapter" aria-labelledby={`${id}-title`}>
        <div className="sr-only">{moduleId} <StatusBadge status={status} /></div>
        <h2 id={`${id}-title`} className="work-chapter-heading border-y border-dashed border-[color:var(--amber-dim)] p-[var(--space-4)] text-[length:var(--font-xl)] font-normal leading-tight">
          {title}<span className={`work-heading-cursor ${document.active ? 'work-heading-cursor-active' : ''}`} aria-hidden="true">_</span>
        </h2>
        <dl className="work-chapter-copy grid gap-[var(--space-4)] pt-[var(--space-6)]">
          {blocks.map((block) => (
            <div key={block.label}>
              <dt className="sr-only">{block.label}</dt>
              <dd>{block.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  if (panel) {
    return (
      <section id={id} className="identity-info-panel installation-info-panel" aria-labelledby={`${id}-title`}>
        <span className="identity-info-label">{moduleId}</span>
        <span className="sr-only"><StatusBadge status={status} /></span>
        <div className="installation-title-row">
          <h2 id={`${id}-title`} className="min-w-0 font-mono text-[length:var(--font-xl)] font-normal leading-tight">
            {title}
          </h2>
          {panel.controls}
        </div>
        <div key={id} className="identity-info-scroll installation-description-scroll">
          <dl>
            {blocks.map((block) => (
              <div key={block.label}>
                <dt className="sr-only">{block.label}</dt>
                <dd className="m-0">{block.value}</dd>
              </div>
            ))}
          </dl>
          <a href={panel.externalLink.href} target="_blank" rel="noreferrer" className="library-imdb-link shrink-0">
            {panel.externalLink.label}
          </a>
        </div>
      </section>
    );
  }

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
