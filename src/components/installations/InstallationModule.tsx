import { installationLabels, type Installation } from '../../data/installations';
import { SystemModule } from '../system/SystemModule';

type InstallationModuleProps = {
  installation: Installation;
  onSelect: (direction: -1 | 1) => void;
};

export function InstallationModule({ installation, onSelect }: InstallationModuleProps) {
  return (
    <section className="identity-page-content" aria-label={installation.title}>
      <div className="identity-avatar-panel">
        <div className="identity-avatar-frame installation-illustration-viewport">
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
        title={installation.title}
        blocks={[{
          label: installationLabels.description,
          value: (
            <div className="identity-copy installation-copy">
              {installation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          ),
        }]}
        panel={{
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
          externalLink: installation.link,
        }}
      />
    </section>
  );
}
