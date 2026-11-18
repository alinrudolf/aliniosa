import { contactLinks, contactPage } from '../../data/contact';
import { ContactSignal } from '../signal/ContactSignal';
import { SystemModule } from './SystemModule';

export function ContactPage({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`${mobile ? 'mobile-contact-page' : 'contact-page'} min-w-0 font-mono text-[color:var(--amber-base)]`}>
      <SystemModule
        id="contact"
        moduleId={contactPage.label}
        status={contactPage.status}
        title={contactPage.title}
        contact={{ mobile, signal: <ContactSignal /> }}
        blocks={contactLinks.map((link) => ({
          label: link.title,
          value: (
            <a
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              download={link.external ? undefined : 'Curriculum Vitae.pdf'}
              aria-label={link.accessibleName}
              className="contact-link"
            >
              <span className="bottom-nav-state-layer bottom-nav-active-layer" aria-hidden="true" />
              <span className="contact-link-number" aria-hidden="true">{link.number}</span>
              <span className="contact-link-title">{link.title}</span>
              <span className="contact-link-subtitle">{link.subtitle}</span>
              <span className="contact-link-arrow" aria-hidden="true">{link.arrow}</span>
            </a>
          ),
        }))}
      />
    </div>
  );
}
