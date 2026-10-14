import { useLayoutEffect, useRef } from 'react';
import { installationLabels, type Installation } from '../../data/installations';
import { useTerminalTextSwap } from '../layout/TerminalTextSwap';
import { SystemModule } from '../system/SystemModule';

type InstallationModuleProps = {
  installation: Installation;
  onSelect: (direction: -1 | 1) => void;
  mobile?: boolean;
};

function InstallationText({ value, displayValue }: { value: string; displayValue: string }) {
  return (
    <span className="relative inline-grid max-w-full align-top">
      <span className="sr-only">{value}</span>
      <span className="invisible" aria-hidden="true">{value}</span>
      <span className="absolute inset-0 overflow-hidden" aria-hidden="true">{displayValue}</span>
    </span>
  );
}

export function InstallationModule({ installation, onSelect, mobile = false }: InstallationModuleProps) {
  const contentRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!mobile) return;

    if (window.matchMedia('(orientation: portrait)').matches) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [installation.id, mobile]);

  // Keep animation state above SystemModule's keyed scroll container. Its remount
  // resets scrolling without resetting the text swaps on each selection.
  const { displayValue: displayedTitle } = useTerminalTextSwap(installation.title, installation.id);
  const { displayValue: displayedDescription } = useTerminalTextSwap(installation.paragraphs.join(''), installation.id);
  const { displayValue: displayedLink } = useTerminalTextSwap(installation.link.label, installation.id);
  let paragraphOffset = 0;
  const paragraphs = installation.paragraphs.map((paragraph) => {
    const displayValue = displayedDescription.slice(paragraphOffset, paragraphOffset + paragraph.length);
    paragraphOffset += paragraph.length;

    return (
      <p key={paragraph}>
        <InstallationText value={paragraph} displayValue={displayValue} />
      </p>
    );
  });

  return (
    <section className={mobile ? 'mobile-installations-page grid min-w-0 gap-[var(--space-4)] font-mono' : 'identity-page-content'} aria-label={installation.title}>
      <div className={mobile ? 'mobile-installations-image-panel min-h-0 min-w-0' : 'identity-avatar-panel'}>
        <div className={`${mobile ? 'mobile-installations-image-frame' : 'identity-avatar-frame'} installation-illustration-viewport`}>
          <img key={installation.id} src={installation.image} alt={installation.imageAlt} className="identity-avatar-image" />
          <span className="identity-avatar-corner identity-avatar-corner-tl" aria-hidden="true" />
          <span className="identity-avatar-corner identity-avatar-corner-tr" aria-hidden="true" />
          <span className="identity-avatar-corner identity-avatar-corner-bl" aria-hidden="true" />
          <span className="identity-avatar-corner identity-avatar-corner-br" aria-hidden="true" />
        </div>
      </div>
      <SystemModule
        id={`installation-${installation.id}`}
        moduleId={installation.identifier}
        status={installationLabels.status}
        title={<InstallationText value={installation.title} displayValue={displayedTitle} />}
        blocks={[{
          label: installationLabels.description,
          value: (
            <div className="identity-copy installation-copy">
              {paragraphs}
            </div>
          ),
        }]}
        panel={{
          mobile,
          contentRef: mobile ? contentRef : undefined,
          controls: (
            <div className="flex shrink-0 gap-[var(--space-8)]">
              <button type="button" aria-label={installationLabels.previous} onClick={() => onSelect(-1)} className="installation-chevron">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[var(--space-6)] w-[var(--space-6)]">
                  <path d="M16 17V19H14V17H12V15H10V13H8V11H10V9H12V7H14V5H16V7H14V9H12V11H10V13H12V15H14V17H16Z" />
                </svg>
              </button>
              <button type="button" aria-label={installationLabels.next} onClick={() => onSelect(1)} className="installation-chevron">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-[var(--space-6)] w-[var(--space-6)]">
                  <path d="M8 7V5L10 5V7H12V9H14V11H16V13H14V15H12V17H10V19H8V17H10V15H12V13H14V11H12V9H10V7H8Z" />
                </svg>
              </button>
            </div>
          ),
          externalLink: {
            ...installation.link,
            label: <InstallationText value={installation.link.label} displayValue={displayedLink} />,
          },
        }}
      />
    </section>
  );
}
