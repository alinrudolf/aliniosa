import { useEffect, useRef, useState } from 'react';
import { bottomNavigation } from '../../data/navigation';

const navigationDisplay: Record<string, { index: string; title: string; subtitle: string }> = {
  SYS: { index: '01', title: 'IDENTITY', subtitle: 'Human Component' },
  WRK: { index: '02', title: 'WORK', subtitle: 'Selected Projects' },
  INS: { index: '03', title: 'INSTALLATIONS', subtitle: 'Physical & Digital' },
  LIB: { index: '04', title: 'LIBRARY', subtitle: 'Media Recommendations' },
  LOG: { index: '05', title: 'LOGS', subtitle: 'Notes & Writings' },
  CNT: { index: '06', title: 'CONTACT', subtitle: 'Human component' },
};

const BACKGROUND_AUDIO_SRC = '/audio/bg-audio.mp3';
const BACKGROUND_AUDIO_STORAGE_KEY = 'backgroundAudioEnabled';

function storeBackgroundAudioPreference(isEnabled: boolean) {
  try {
    localStorage.setItem(BACKGROUND_AUDIO_STORAGE_KEY, String(isEnabled));
  } catch {
    // Audio preference persistence is optional.
  }
}

type BottomNavProps = {
  activeNavId?: string | null;
  onActiveNavClick: () => void;
  onActiveNavChange: (id: string | null) => void;
};

export function BottomNav({ activeNavId = null, onActiveNavClick, onActiveNavChange }: BottomNavProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleBackgroundAudio = async () => {
    if (isAudioEnabled) {
      audioRef.current?.pause();
      storeBackgroundAudioPreference(false);
      setIsAudioEnabled(false);

      return;
    }

    const audio = audioRef.current ?? new Audio(BACKGROUND_AUDIO_SRC);

    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.1;

    try {
      await audio.play();
      storeBackgroundAudioPreference(true);
      setIsAudioEnabled(true);
    } catch {
      audio.pause();
      storeBackgroundAudioPreference(false);
      setIsAudioEnabled(false);
    }
  };

  return (
    <section className="h-[154px] shrink-0 overflow-hidden border-t border-[color:var(--amber-dim)] bg-[color:var(--bg-crt)]">
      <div className="flex h-[46px] items-center justify-between border-b border-[color:var(--amber-dim)] px-6">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[color:var(--amber-core)]">
          [NAVIGATION]
        </span>
        <button
          type="button"
          aria-label={isAudioEnabled ? 'Disable background audio' : 'Enable background audio'}
          aria-pressed={isAudioEnabled}
          onClick={toggleBackgroundAudio}
          className="grid h-8 w-8 place-items-center bg-[color:var(--bg-crt)] text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--amber-core)]"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-auto w-4">
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
        </button>
      </div>
      <nav aria-label="Primary navigation" className="grid h-[108px] grid-cols-6">
        {bottomNavigation.map((item, index) => {
          const isActive = item.id === activeNavId;
          const display = navigationDisplay[item.id];
          const dividerClass =
            index === 0
              ? ''
              : 'border-l border-[color:var(--amber-dim)] before:absolute before:left-[-12px] before:top-1/2 before:h-0.5 before:w-6 before:-translate-y-1/2 before:bg-[color:var(--amber-dim)] before:content-[""]';
          const buttonStateClass = isActive ? 'outline outline-1 -outline-offset-1 outline-[color:var(--amber-base)]' : '';

          return (
            <a
              key={item.id}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              onClick={(event) => {
                if (!isActive) {
                  return;
                }

                event.preventDefault();
                onActiveNavClick();
              }}
              onMouseEnter={() => onActiveNavChange(item.id)}
              onMouseLeave={() => onActiveNavChange(null)}
              onFocus={() => onActiveNavChange(item.id)}
              onBlur={() => onActiveNavChange(null)}
              className={`relative grid h-full min-w-0 content-start gap-2 bg-[color:var(--bg-crt)] px-6 py-4 font-mono text-[color:var(--amber-base)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--amber-core)] ${dividerClass} ${buttonStateClass}`}
            >
              <span className="whitespace-nowrap text-base font-semibold uppercase leading-none">{display.index}</span>
              <span className="whitespace-nowrap text-base font-semibold uppercase leading-none">{display.title}</span>
              <span className="whitespace-nowrap text-sm font-normal leading-none">{display.subtitle}</span>
              <span className="sr-only">
                {item.label}
              </span>
            </a>
          );
        })}
      </nav>
    </section>
  );
}
