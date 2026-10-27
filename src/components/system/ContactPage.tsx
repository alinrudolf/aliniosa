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
              className="contact-link grid min-w-0 items-start font-mono focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-[color:var(--amber-core)]"
            >
              <span className="contact-link-number font-bold text-[color:var(--amber-core)]" aria-hidden="true">{link.number}</span>
              <span className="contact-link-copy min-w-0">
                <span className="contact-link-title block font-normal">{link.title}</span>
                <span className="contact-link-subtitle block font-bold">{link.subtitle}</span>
              </span>
              <span className="contact-link-arrow self-center font-normal" aria-hidden="true">{link.arrow}</span>
            </a>
          ),
        }))}
      />
    </div>
  );
}
