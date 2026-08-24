import { type MouseEvent } from 'react';
import { bottomNavigation, navigation } from '../../data/navigation';
import contactIcon from '../../assets/icons/mobile-contact.svg?raw';
import identityIcon from '../../assets/icons/mobile-identity.svg?raw';
import installationsIcon from '../../assets/icons/mobile-installations.svg?raw';
import libraryIcon from '../../assets/icons/mobile-library.svg?raw';
import logsIcon from '../../assets/icons/mobile-logs.svg?raw';
import workIcon from '../../assets/icons/mobile-work.svg?raw';

type MobileNavigationPanelProps = {
  id: string;
  isOpen: boolean;
  activeHash: string;
  isAudioEnabled: boolean;
  onAudioToggle: () => void;
  onActiveNavClick: () => void;
  onClose: () => void;
};

const navigationDisplay: Record<string, { title: string; subtitle: string; icon: string; positionClass: string }> = {
  system: {
    title: 'IDENTITY',
    subtitle: 'HUMAN COMPONENT',
    icon: identityIcon,
    positionClass: 'mobile-nav-position-identity',
  },
  work: {
    title: 'WORK',
    subtitle: 'SELECTED PROJECTS',
    icon: workIcon,
    positionClass: 'mobile-nav-position-work',
  },
  installations: {
    title: 'INSTALLATIONS',
    subtitle: 'PHYSICAL & DIGITAL',
    icon: installationsIcon,
    positionClass: 'mobile-nav-position-installations',
  },
  library: {
    title: 'LIBRARY',
    subtitle: 'MEDIA RECOMMENDATIONS',
    icon: libraryIcon,
    positionClass: 'mobile-nav-position-library',
  },
  logs: {
    title: 'LOGS',
    subtitle: 'NOTES & WRITINGS',
    icon: logsIcon,
    positionClass: 'mobile-nav-position-logs',
  },
  contact: {
    title: 'CONTACT',
    subtitle: 'HUMAN COMPONENT',
    icon: contactIcon,
    positionClass: 'mobile-nav-position-contact',
  },
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
      <div className="mobile-nav-panel-inner h-full min-h-0">
        <div className="mobile-nav-content">
          <span className="mobile-nav-rule mobile-nav-rule-top" aria-hidden="true" />
          <nav className="mobile-nav-list" aria-label="Primary navigation">
            {navigation.map((item) => {
            const bottomItem = bottomNavigation.find((navItem) => navItem.href === item.href);
            const isActive = item.href === activeHash;
            const display = navigationDisplay[item.id];

            return (
              <a
                key={item.id}
                href={item.href}
                aria-label={bottomItem?.ariaLabel ?? `Navigate to ${item.label.toLowerCase()}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleRouteClick(event, item.href)}
                className={`mobile-nav-link ${display.positionClass} ${isActive ? 'mobile-nav-link-active' : ''}`}
              >
                <span
                  className="mobile-nav-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: display.icon }}
                />
                <span className="mobile-nav-separator" aria-hidden="true" />
                <span className="mobile-nav-copy">
                  <span className="mobile-nav-title">{display.title}</span>
                  <span className="mobile-nav-subtitle">{display.subtitle}</span>
                </span>
              </a>
            );
          })}
          </nav>
          <span className="mobile-nav-rule mobile-nav-rule-bottom" aria-hidden="true" />
        </div>
        <button
          type="button"
          aria-label={isAudioEnabled ? 'Disable background audio' : 'Enable background audio'}
          aria-pressed={isAudioEnabled}
          onClick={onAudioToggle}
          className="mobile-audio-button"
        >
          <span className="mobile-audio-label">AUDIO {isAudioEnabled ? 'ON' : 'OFF'}</span>
          <span className="mobile-audio-indicators">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mobile-audio-icon">
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
            <span className={`audio-status-dot ${isAudioEnabled ? 'audio-status-dot-active' : ''}`} aria-hidden="true" />
          </span>
        </button>
      </div>
    </aside>
  );
}
