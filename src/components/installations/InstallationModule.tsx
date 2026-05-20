import type { Installation } from '../../data/installations';
import { StatusBadge } from '../system/StatusBadge';

type InstallationModuleProps = {
  installation: Installation;
};

export function InstallationModule({ installation }: InstallationModuleProps) {
  return (
    <article className="grid gap-[var(--space-2)] border-l border-[color:var(--amber-dim)] pl-[var(--space-4)]">
      <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
        <h3 className="font-sans text-[length:var(--font-base)] font-medium text-[color:var(--amber-core)]">{installation.title}</h3>
        <StatusBadge status={installation.status} />
      </div>
      <p className="text-[length:var(--font-sm)] leading-[calc(1.5rem*var(--ui-scale))] text-[color:var(--amber-base)]">{installation.details}</p>
    </article>
  );
}
