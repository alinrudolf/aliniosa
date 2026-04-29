import type { Installation } from '../../data/installations';
import { StatusBadge } from '../system/StatusBadge';

type InstallationModuleProps = {
  installation: Installation;
};

export function InstallationModule({ installation }: InstallationModuleProps) {
  return (
    <article className="grid gap-2 border-l border-[color:var(--amber-dim)] pl-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-sans text-base font-medium text-[color:var(--amber-core)]">{installation.title}</h3>
        <StatusBadge status={installation.status} />
      </div>
      <p className="text-sm leading-6 text-[color:var(--amber-base)]">{installation.details}</p>
    </article>
  );
}
