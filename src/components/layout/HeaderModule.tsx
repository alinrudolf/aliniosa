import type { SiteHeader } from '../../data/navigation';
import logoUrl from '../../../Logo AI Amber.svg?url';

type HeaderModuleProps = {
  header: SiteHeader;
};

export function HeaderModule({ header }: HeaderModuleProps) {
  return (
    <header className="relative grid border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] md:grid-cols-[204px_1fr]">
      <span className="absolute -top-px right-8 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {header.section}
      </span>
      <div className="flex min-h-48 items-center justify-center border-b border-[color:var(--amber-dim)] p-6 md:border-b-0 md:border-r">
        <img src={logoUrl} alt={header.logoAlt} className="h-40 w-40 object-contain" />
      </div>
      <div className="grid content-start gap-5 px-6 py-8 md:px-8">
        <p className="sr-only">{header.label}</p>
        <h1 className="font-mono text-4xl font-medium leading-none tracking-[0.14em] text-[color:var(--amber-core)] [text-shadow:var(--glow-text-soft)] sm:text-5xl">
          {header.title}
        </h1>
        <p className="max-w-3xl font-mono text-sm leading-7 text-[color:var(--amber-core)] sm:text-base">
          {header.summary}
        </p>
      </div>
    </header>
  );
}
