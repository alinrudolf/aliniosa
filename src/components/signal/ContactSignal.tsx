import type { CSSProperties } from 'react';
import { contactPage } from '../../data/contact';

export function ContactSignal() {
  return (
    <div className="contact-signal mx-auto grid items-center" aria-hidden="true">
      <span
        className="contact-signal-globe contact-signal-image block aspect-square w-full"
        style={{ '--contact-globe-sprite': `url("${import.meta.env.BASE_URL}assets/contact/globe-sprite-8frame.png")` } as CSSProperties}
      >
        <img className="contact-signal-globe-fallback block h-auto w-full" src={contactPage.artwork.globe} width="80" height="80" alt="" />
      </span>
      <div className="contact-signal-dots flex items-center justify-between">
        {[0, 1, 2, 3].map((dot) => <span key={dot} className="contact-signal-dot block aspect-square bg-[color:var(--amber-base)]" />)}
      </div>
      <img className="contact-signal-image block h-auto w-full" src={contactPage.artwork.computer} width="80" height="80" alt="" />
    </div>
  );
}
