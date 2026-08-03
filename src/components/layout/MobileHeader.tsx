import { type RefObject } from 'react';
import { type SiteHeader } from '../../data/navigation';
import { LogoMark } from './LogoMark';

type MobileHeaderProps = {
  header: SiteHeader;
  pageTitle: string;
  isMenuOpen: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  menuPanelId: string;
  onMenuToggle: () => void;
};

export function MobileHeader({
  header,
  pageTitle,
  isMenuOpen,
  menuButtonRef,
  menuPanelId,
  onMenuToggle,
}: MobileHeaderProps) {
  return (
    <header className="mobile-header sticky top-0 z-50 grid min-h-[var(--mobile-header-height)] grid-cols-[auto_1fr_auto] items-center border-b border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
      <div className="flex min-w-0 items-center gap-[var(--space-3)] pl-[var(--mobile-shell-padding-x)]">
        <LogoMark
          label={header.logoAlt}
          className="mobile-header-logo block h-[var(--mobile-logo-size)] w-[var(--mobile-logo-size)] text-[color:var(--amber-base)]"
        />
        <div className="grid min-w-0 gap-[var(--space-1)]">
          <span className="font-mono text-[length:var(--font-xs)] uppercase leading-none tracking-[0.14em] text-[color:var(--amber-core)]">
            [{pageTitle}]
          </span>
          <span className="truncate font-mono text-[length:var(--font-sm)] font-semibold uppercase leading-none tracking-[0.14em] text-[color:var(--amber-base)] [text-shadow:var(--glow-text-soft)]">
            {header.title}
          </span>
        </div>
      </div>
      <span className="sr-only">{header.label}</span>
      <button
        ref={menuButtonRef}
        type="button"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls={menuPanelId}
        onClick={onMenuToggle}
        className="mobile-menu-button mr-[var(--mobile-shell-padding-x)] grid min-h-[44px] min-w-[44px] place-items-center border-l border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[color:var(--amber-core)]"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
          <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          <path d="M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
        </svg>
      </button>
    </header>
  );
}
