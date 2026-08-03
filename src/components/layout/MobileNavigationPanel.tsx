import { type MouseEvent } from 'react';
import { bottomNavigation, navigation } from '../../data/navigation';

type MobileNavigationPanelProps = {
  id: string;
  isOpen: boolean;
  activeHash: string;
  isAudioEnabled: boolean;
  onAudioToggle: () => void;
  onActiveNavClick: () => void;
  onClose: () => void;
};

export function MobileNavigationPanel({
  id,
  isOpen,
  activeHash,
  isAudioEnabled,
  onAudioToggle,
  onActiveNavClick,
  onClose,
}: MobileNavigationPanelProps) {
  const handleRouteClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === activeHash) {
      event.preventDefault();
      onActiveNavClick();
    }

    onClose();
  };

  return (
    <aside
      id={id}
      className="mobile-nav-panel fixed inset-x-0 bottom-0 z-40 bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]"
      aria-label="Mobile navigation"
      aria-hidden={!isOpen}
      hidden={!isOpen}
    >
      <div className="mobile-nav-panel-inner grid h-full min-h-0 grid-rows-[auto_1fr_auto] border-t border-[color:var(--amber-dim)]">
        <div className="flex min-h-[44px] items-center border-b border-[color:var(--amber-dim)] px-[var(--mobile-shell-padding-x)]">
          <span className="system-label-type text-[length:var(--font-xs)] text-[color:var(--amber-core)]">[NAVIGATION]</span>
        </div>
        <nav className="min-h-0 overflow-y-auto" aria-label="Primary navigation">
          {navigation.map((item, index) => {
            const bottomItem = bottomNavigation.find((navItem) => navItem.href === item.href);
            const isActive = item.href === activeHash;

            return (
              <a
                key={item.id}
                href={item.href}
                aria-label={bottomItem?.ariaLabel ?? `Navigate to ${item.label.toLowerCase()}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleRouteClick(event, item.href)}
                className={`mobile-nav-link grid min-h-[44px] grid-cols-[auto_1fr_auto] items-center gap-[var(--space-4)] border-b border-[color:var(--amber-dim)] px-[var(--mobile-shell-padding-x)] py-[var(--space-4)] font-mono uppercase text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[color:var(--amber-core)] ${isActive ? 'mobile-nav-link-active' : ''}`}
              >
                <span className="text-[length:var(--font-xs)] text-[color:var(--amber-core)]">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[length:var(--font-base)] font-semibold leading-none">{item.label}</span>
                <span className="text-[length:var(--font-xs)] leading-none">{bottomItem?.label}</span>
              </a>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label={isAudioEnabled ? 'Disable background audio' : 'Enable background audio'}
          aria-pressed={isAudioEnabled}
          onClick={onAudioToggle}
          className="mobile-audio-button grid min-h-[44px] grid-cols-[1fr_auto] items-center border-t border-[color:var(--amber-dim)] px-[var(--mobile-shell-padding-x)] py-[var(--space-4)] font-mono uppercase text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[color:var(--amber-core)]"
        >
          <span className="text-left text-[length:var(--font-sm)] leading-none">Audio</span>
          <span className="inline-flex items-center gap-[var(--space-2)]">
            <span className={`audio-status-dot ${isAudioEnabled ? 'audio-status-dot-active' : ''}`} aria-hidden="true" />
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
              {isAudioEnabled ? (
                <>
                  <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  <path d="M18 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  <path d="M20 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  <path d="M18 8V8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                  <path d="M20 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                </>
              ) : null}
              <path d="M8 6V6.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M8 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
              <path d="M10 4H13V20H10" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              <path d="M6 8H2V16H6" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
            </svg>
          </span>
        </button>
      </div>
    </aside>
  );
}
