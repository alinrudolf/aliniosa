import avatarImageUrl from '../../assets/images/identity-profile-outline-revised.png';
import { identityContent } from '../../data/identity';

type IdentityStatusItem = (typeof identityContent.statusLeft)[number];

function IdentityAvatarPanel() {
  return (
    <section className="identity-avatar-panel" aria-label="Identity signal portrait">
      <div className="identity-avatar-frame identity-photo-viewport">
        <div className="identity-portrait-crop">
          <img src={avatarImageUrl} alt={identityContent.imageAlt} className="identity-avatar-image" />
        </div>
        <span className="identity-avatar-corner identity-avatar-corner-tl" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-tr" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-bl" aria-hidden="true" />
        <span className="identity-avatar-corner identity-avatar-corner-br" aria-hidden="true" />
      </div>
    </section>
  );
}

function IdentityStatusColumn({ items }: { items: IdentityStatusItem[] }) {
  return (
    <dl className="identity-status-column">
      {items.map((item) => (
        <div key={item.label} className="identity-status-row">
          <dt>{item.label}:</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function IdentityInfoPanel({ mobile }: { mobile: boolean }) {
  return (
    <section className="identity-info-panel" aria-labelledby="identity-title" tabIndex={mobile ? 0 : undefined}>
      <span id="identity-title" className={mobile ? 'sr-only' : 'identity-info-label'}>
        {identityContent.label}
      </span>
      <div className="identity-info-scroll">
        <div className="identity-info-main">
          <div className="identity-status-grid">
            <IdentityStatusColumn items={identityContent.statusLeft} />
            <IdentityStatusColumn items={identityContent.statusRight} />
          </div>
          <div className="identity-copy">
            {identityContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IdentityPageContent({ mobile }: { mobile: boolean }) {
  return (
    <section className={mobile ? 'mobile-identity-page grid min-w-0 gap-[var(--space-4)] font-mono' : 'identity-page-content'}>
      <IdentityAvatarPanel />
      <IdentityInfoPanel mobile={mobile} />
    </section>
  );
}

export function IdentityBody({ mobile = false }: { mobile?: boolean }) {
  return <IdentityPageContent mobile={mobile} />;
}
