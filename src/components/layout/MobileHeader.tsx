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
    <header className="mobile-header sticky top-0 z-50 grid min-h-[var(--mobile-header-height)] grid-cols-[var(--mobile-logo-column)_1fr_auto] items-center border-b border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]">
      <div className="mobile-header-logo-cell flex h-full min-w-0 items-center justify-center border-r border-[color:var(--amber-dim)]">
        <LogoMark
          label={header.logoAlt}
          className="mobile-header-logo block h-[var(--mobile-logo-size)] w-[var(--mobile-logo-size)] text-[color:var(--amber-base)]"
        />
      </div>
      <div className="mobile-header-title min-w-0 px-[var(--mobile-header-title-padding-x)] font-mono text-[length:var(--mobile-header-title-size)] font-normal uppercase leading-none tracking-[0.04em] text-[color:var(--amber-base)]">
        {pageTitle}
      </div>
      <span className="sr-only">{header.label}</span>
      <button
        ref={menuButtonRef}
        type="button"
        aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isMenuOpen}
        aria-controls={menuPanelId}
        onClick={onMenuToggle}
        className="mobile-menu-button mr-[var(--mobile-menu-button-offset)] grid min-h-[44px] min-w-[44px] place-items-center bg-[color:var(--bg-crt)] text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[color:var(--amber-core)]"
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
