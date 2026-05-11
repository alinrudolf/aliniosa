import type { SiteHeader } from '../../data/navigation';
import logoUrl from '../../../Logo AI Amber.svg?url';

type HeaderModuleProps = {
  header: SiteHeader;
  logoAnimationKey?: string;
};

export function HeaderModule({ header, logoAnimationKey = 'initial' }: HeaderModuleProps) {
  return (
    <header className="relative grid h-40 shrink-0 border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] md:grid-cols-[160px_1fr]">
      <span className="absolute right-8 top-0 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {header.section}
      </span>
      <div className="logo-flip-stage flex items-center justify-center border-b border-[color:var(--amber-dim)] p-6 md:border-b-0 md:border-r">
        <img key={logoAnimationKey} src={logoUrl} alt={header.logoAlt} className="logo-flip-once h-24 w-24 object-contain" />
      </div>
      <div className="grid content-center gap-4 p-6">
        <p className="sr-only">{header.label}</p>
        <h1 className="font-mono text-3xl font-medium leading-none tracking-[0.14em] text-[color:var(--amber-core)] [text-shadow:var(--glow-text-soft)] sm:text-4xl">
          {header.title}
        </h1>
        <p className="max-w-3xl font-mono text-sm leading-6 text-[color:var(--amber-core)]">
          {header.summary}
        </p>
      </div>
    </header>
  );
}
