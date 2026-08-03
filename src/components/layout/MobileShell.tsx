import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { type ViewportLayoutMode } from '../../app/viewportLayout';
import { type SiteHeader } from '../../data/navigation';
import { MobileHeader } from './MobileHeader';
import { MobileNavigationPanel } from './MobileNavigationPanel';

type MobileShellProps = {
  layoutMode: Extract<ViewportLayoutMode, 'mobile-portrait' | 'mobile-landscape'>;
  header: SiteHeader;
  pageTitle: string;
  activeHash: string;
  isAudioEnabled: boolean;
  onAudioToggle: () => void;
  onActiveNavClick: () => void;
  children: ReactNode;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function MobileShell({
  layoutMode,
  header,
  pageTitle,
  activeHash,
  isAudioEnabled,
  onAudioToggle,
  onActiveNavClick,
  children,
}: MobileShellProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const wasNavOpenRef = useRef(false);
  const menuPanelId = useId();
  const orientation = layoutMode === 'mobile-landscape' ? 'landscape' : 'portrait';

  const closeNav = () => {
    setIsNavOpen(false);
  };

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }

    document.body.classList.add('mobile-nav-scroll-lock');

    return () => {
      document.body.classList.remove('mobile-nav-scroll-lock');
    };
  }, [isNavOpen]);

  useEffect(() => {
    if (wasNavOpenRef.current && !isNavOpen) {
      menuButtonRef.current?.focus();
    }

    wasNavOpenRef.current = isNavOpen;
  }, [isNavOpen]);

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isNavOpen]);

  useEffect(() => {
    setIsNavOpen(false);
  }, [activeHash]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isNavOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeNav();

      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      shellRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    ).filter(
      (element) =>
        !element.hasAttribute('disabled') &&
        !element.closest('[aria-hidden="true"]') &&
        element.getClientRects().length > 0,
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();

      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div
      ref={shellRef}
      className={`mobile-shell mobile-shell-${orientation} ${isNavOpen ? 'mobile-shell-nav-open' : ''}`}
      data-layout-mode={layoutMode}
      data-orientation={orientation}
      onKeyDown={handleKeyDown}
    >
      <MobileHeader
        header={header}
        pageTitle={pageTitle}
        isMenuOpen={isNavOpen}
        menuButtonRef={menuButtonRef}
        menuPanelId={menuPanelId}
        onMenuToggle={() => setIsNavOpen((current) => !current)}
      />
      <main className="mobile-shell-main" aria-hidden={isNavOpen}>
        {children}
      </main>
      <div ref={panelRef}>
        <MobileNavigationPanel
          id={menuPanelId}
          isOpen={isNavOpen}
          activeHash={activeHash}
          isAudioEnabled={isAudioEnabled}
          onAudioToggle={onAudioToggle}
          onActiveNavClick={onActiveNavClick}
          onClose={closeNav}
        />
      </div>
    </div>
  );
}
