import { contactPage } from '../../data/contact';

export function ContactSignal() {
  return (
    <div className="contact-signal mx-auto grid items-center" aria-hidden="true">
      <img className="contact-signal-image block h-auto w-full" src={contactPage.artwork.globe} width="80" height="80" alt="" />
      <div className="contact-signal-dots flex items-center justify-between">
        {[0, 1, 2, 3].map((dot) => <span key={dot} className="contact-signal-dot block aspect-square bg-[color:var(--amber-base)]" />)}
      </div>
      <img className="contact-signal-image block h-auto w-full" src={contactPage.artwork.computer} width="80" height="80" alt="" />
    </div>
  );
}
