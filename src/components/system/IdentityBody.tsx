import profileImageUrl from '../../../Profile Picture Large.png?url';
import { identityContent } from '../../data/identity';

export function IdentityBody() {
  return (
    <section
      className="relative h-full min-h-0 w-full overflow-visible border border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] text-[color:var(--amber-base)]"
      aria-labelledby="identity-title"
    >
      <span className="absolute right-8 top-0 z-10 -translate-y-1/2 bg-[color:var(--bg-crt)] px-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
        {identityContent.label}
      </span>
      <div className="grid h-full min-h-0 grid-cols-2 gap-0 overflow-hidden">
        <div className="relative min-h-0 overflow-hidden border-b border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)] md:border-b-0 md:border-r">
          <div className="absolute inset-0 bg-[color:var(--amber-base)] opacity-70 mix-blend-multiply" />
          <img
            src={profileImageUrl}
            alt={identityContent.imageAlt}
            className="h-full w-full object-cover object-center grayscale contrast-150 brightness-75 opacity-80 mix-blend-screen [filter:grayscale(1)_sepia(1)_saturate(3)_hue-rotate(2deg)_contrast(1.45)_brightness(0.72)]"
          />
          <div className="absolute inset-0 bg-[color:var(--bg-crt)] opacity-30 mix-blend-multiply" />
        </div>
        <div className="grid min-h-0 content-start gap-6 overflow-hidden p-8 md:p-10 lg:p-12">
          <h2
            id="identity-title"
            className="font-mono text-2xl font-medium uppercase leading-none tracking-[0.08em] text-[color:var(--amber-core)] [text-shadow:var(--glow-text-soft)] sm:text-3xl"
          >
            {identityContent.title}
          </h2>
          <div className="grid max-w-xl gap-5 font-mono text-sm leading-6 text-[color:var(--amber-core)]">
            {identityContent.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
