import type { SiteHeader } from '../../data/navigation';
import logoSvg from '../../assets/images/Logo AI Amber Accurate.svg?raw';

const inlineLogoSvg = logoSvg
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg viewBox="0 0 441 450" preserveAspectRatio="xMidYMid meet" ')
  .replace(/<path[^>]*transform="translate\(173\.24412536621094,-0\.267425537109375\)"\/>\s*/g, '')
  .replace(/<path[^>]*transform="translate\((3|314),435\)"\/>\s*/g, '')
  .replace(/<path[^>]*transform="translate\((12|305),409\)"\/>\s*/g, '')
  .replace(/fill="#B29241"/g, 'fill="currentColor"');

type HeaderModuleProps = {
  header: SiteHeader;
  logoAnimationKey?: string;
  embedded?: boolean;
};

export function HeaderModule({ header, logoAnimationKey = 'initial', embedded = false }: HeaderModuleProps) {
  const headerFrameClass = embedded
    ? 'relative flex h-[140px] shrink-0 items-start bg-[color:var(--bg-crt)]'
    : 'relative grid h-40 shrink-0 border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] md:grid-cols-[160px_1fr]';
  const identityGroupClass = embedded ? 'ml-6 inline-flex h-auto items-center p-2' : 'contents';
  const logoFrameClass = embedded
    ? 'logo-flip-stage flex items-center justify-center border-r border-[color:var(--amber-dim)] pr-6 [box-shadow:none]'
    : 'logo-flip-stage flex items-center justify-center overflow-hidden border-[color:var(--amber-dim)] p-6 [box-shadow:none] [contain:paint] max-md:border-b md:border-r';
  const contentClass = embedded ? 'grid content-center gap-2 pl-10 pr-6' : 'grid content-center gap-2 p-6';

  return (
    <header className={headerFrameClass}>
      {embedded ? null : (
        <span className="absolute right-8 top-0 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
          {header.section}
        </span>
      )}
      <div className={identityGroupClass}>
        <div className={logoFrameClass}>
          <span
            key={logoAnimationKey}
            className="header-logo-mark logo-flip-once block h-16 w-16 text-[color:var(--amber-base)]"
            role="img"
            aria-label={header.logoAlt}
            dangerouslySetInnerHTML={{ __html: inlineLogoSvg }}
          />
        </div>
        <div className={contentClass}>
          <p className="sr-only">{header.label}</p>
          <h1 className="font-mono text-2xl font-semibold leading-none tracking-[0.14em] text-[color:var(--amber-base)] [text-shadow:var(--glow-text-soft)]">
            {header.title}
          </h1>
          <p className="max-w-3xl font-mono text-sm leading-6 text-[color:var(--amber-base)]">
            {header.summary}
          </p>
        </div>
      </div>
    </header>
  );
}
