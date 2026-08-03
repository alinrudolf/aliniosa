import type { SiteHeader } from '../../data/navigation';
import { LogoMark } from './LogoMark';

type HeaderModuleProps = {
  header: SiteHeader;
  embedded?: boolean;
  compact?: boolean;
};

export function HeaderModule({ header, embedded = false, compact = false }: HeaderModuleProps) {
  const headerFrameClass = embedded
    ? `relative flex shrink-0 items-start bg-[color:var(--bg-crt)] ${compact ? '' : 'h-[var(--header-embedded-height)]'}`
    : 'relative grid h-[calc(10rem*var(--ui-scale))] shrink-0 border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] md:grid-cols-[var(--header-logo-column)_1fr]';
  const identityGroupClass = embedded ? 'ml-[var(--space-6)] inline-flex h-auto items-center p-[var(--space-2)]' : 'contents';
  const logoFrameClass = embedded
    ? 'logo-flip-stage flex items-center justify-center text-[color:var(--amber-dim)]'
    : 'logo-flip-stage flex items-center justify-center overflow-hidden border-[color:var(--amber-dim)] p-[var(--space-6)] [box-shadow:none] [contain:paint] max-md:border-b md:border-r';
  const contentClass = embedded ? 'grid content-center gap-[var(--space-2)] pl-[var(--space-6)] pr-[var(--space-6)]' : 'grid content-center gap-[var(--space-2)] p-[var(--space-6)]';

  return (
    <header className={headerFrameClass}>
      {embedded ? null : (
        <span className="absolute right-[var(--space-8)] top-0 -translate-y-1/2 bg-[color:var(--bg-crt)] px-[var(--space-2)] font-mono text-[length:var(--font-xs)] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
          {header.section}
        </span>
      )}
      <div className={identityGroupClass}>
        <div className={logoFrameClass}>
          <LogoMark
            className="header-logo-mark block h-[var(--header-logo-size)] w-[var(--header-logo-size)] text-[color:var(--amber-base)]"
            label={header.logoAlt}
          />
          {embedded ? <span className="crt-divider-line ml-[var(--space-6)] h-[var(--header-logo-size)] w-px" aria-hidden="true" /> : null}
        </div>
        <div className={contentClass}>
          <p className="sr-only">{header.label}</p>
          <h1 className="font-mono text-[length:var(--font-lg)] font-semibold leading-none tracking-[0.14em] text-[color:var(--amber-base)] [text-shadow:var(--glow-text-soft)]">
            {header.title}
          </h1>
          <p className="max-w-[calc(48rem*var(--ui-scale))] font-mono text-[length:var(--font-sm)] leading-[calc(1.5rem*var(--ui-scale))] text-[color:var(--amber-base)]">
            {header.summary}
          </p>
        </div>
      </div>
    </header>
  );
}
