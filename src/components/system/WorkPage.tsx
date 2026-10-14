import { useEffect, useRef, useState } from 'react';
import { workChapters, workPage } from '../../data/work';
import { SystemModule } from './SystemModule';

type ChapterId = typeof workChapters[number]['id'];
const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']);

export function WorkPage() {
  const [activeId, setActiveId] = useState<ChapterId | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLOListElement>(null);
  const programmaticRef = useRef(false);
  const targetScrollRef = useRef(0);
  const manualRef = useRef(false);
  const settleTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scroller = documentRef.current;
    if (!scroller) return;

    const finishNavigation = () => {
      window.clearTimeout(settleTimerRef.current);
      programmaticRef.current = false;
    };

    const syncChapter = () => {
      const chapters = Array.from(scroller.querySelectorAll<HTMLElement>('.work-chapter'));
      if (!chapters.length) return;

      const maxScroll = scroller.scrollHeight - scroller.clientHeight;
      let chapterIndex = 0;
      if (maxScroll > 0 && scroller.scrollTop >= maxScroll - 1) {
        chapterIndex = chapters.length - 1;
      } else {
        const contentTop = scroller.getBoundingClientRect().top + scroller.clientTop;
        const padding = parseFloat(window.getComputedStyle(scroller).paddingTop) || 0;
        // A fixed detection line avoids selection oscillation at boundaries.
        chapters.forEach((chapter, index) => {
          if (chapter.getBoundingClientRect().top <= contentTop + padding + 1) chapterIndex = index;
        });
      }
      setActiveId(workChapters[chapterIndex].id);
    };

    const onScroll = () => {
      if (programmaticRef.current) {
        window.clearTimeout(settleTimerRef.current);
        // scrollend is preferred; this also supports browsers without it.
        settleTimerRef.current = window.setTimeout(finishNavigation, 120);
      } else if (manualRef.current) {
        syncChapter();
      }
    };

    const onScrollEnd = () => {
      // An interrupted previous scroll can emit scrollend after a newer click.
      if (Math.abs(scroller.scrollTop - targetScrollRef.current) <= 1) finishNavigation();
    };

    const onManualInput = () => {
      const wasNavigating = programmaticRef.current;
      finishNavigation();
      manualRef.current = true;
      if (wasNavigating) {
        scroller.scrollTo({ top: scroller.scrollTop, behavior: 'instant' });
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) onManualInput();
    };
    const onResize = () => {
      // Resizing or initial layout must never create a chapter selection.
      finishNavigation();
      manualRef.current = false;
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(scroller);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('scrollend', onScrollEnd);
    scroller.addEventListener('wheel', onManualInput, { passive: true });
    scroller.addEventListener('touchstart', onManualInput, { passive: true });
    scroller.addEventListener('pointerdown', onManualInput, { passive: true });
    scroller.addEventListener('keydown', onKeyDown);

    return () => {
      finishNavigation();
      observer.disconnect();
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('scrollend', onScrollEnd);
      scroller.removeEventListener('wheel', onManualInput);
      scroller.removeEventListener('touchstart', onManualInput);
      scroller.removeEventListener('pointerdown', onManualInput);
      scroller.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const list = navigationRef.current;
    const item = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !item) return;

    const listRect = list.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < listRect.top) list.scrollTop += itemRect.top - listRect.top;
    else if (itemRect.bottom > listRect.bottom) list.scrollTop += itemRect.bottom - listRect.bottom;
  }, [activeId]);

  const selectChapter = (id: ChapterId) => {
    const scroller = documentRef.current;
    const chapter = scroller?.querySelector<HTMLElement>(`#work-${id}`);
    if (!scroller || !chapter) return;

    setActiveId(id);
    manualRef.current = false;
    programmaticRef.current = true;
    window.clearTimeout(settleTimerRef.current);
    const padding = parseFloat(window.getComputedStyle(scroller).paddingTop) || 0;
    const top = scroller.scrollTop + chapter.getBoundingClientRect().top
      - scroller.getBoundingClientRect().top - scroller.clientTop - padding;
    targetScrollRef.current = Math.max(0, Math.min(top, scroller.scrollHeight - scroller.clientHeight));
    scroller.scrollTo({
      top: targetScrollRef.current,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
    settleTimerRef.current = window.setTimeout(() => { programmaticRef.current = false; }, 120);
  };

  return (
    <section className="work-page grid h-full min-h-0 w-full gap-[var(--section-gap)] overflow-hidden border-t border-[color:var(--amber-base)] p-[var(--content-padding)] font-mono text-[length:var(--font-base)] leading-[1.32]" aria-label={workPage.label}>
      <aside className="work-index flex min-h-0 min-w-0 flex-col gap-[var(--space-8)] border border-[color:var(--amber-base)] p-[var(--space-10)]">
        <div className="work-introduction relative m-[var(--space-6)] grid shrink-0 gap-[var(--space-4)]">
          {workPage.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <span className="identity-avatar-corner identity-avatar-corner-tl" aria-hidden="true" />
          <span className="identity-avatar-corner identity-avatar-corner-tr" aria-hidden="true" />
          <span className="identity-avatar-corner identity-avatar-corner-bl" aria-hidden="true" />
          <span className="identity-avatar-corner identity-avatar-corner-br" aria-hidden="true" />
        </div>
        <nav className="flex min-h-0 flex-1" aria-label={workPage.navigationLabel}>
          <ol ref={navigationRef} className="work-chapter-list min-h-0 w-full overflow-x-hidden overflow-y-auto overscroll-contain">
            {workChapters.map((chapter) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  className={`work-chapter-button ${activeId === chapter.id ? 'work-chapter-button-active' : ''}`}
                  aria-current={activeId === chapter.id ? 'location' : undefined}
                  aria-controls={`work-${chapter.id}`}
                  onClick={() => selectChapter(chapter.id)}
                >
                  <span className="bottom-nav-state-layer bottom-nav-active-layer" aria-hidden="true" />
                  <span className="work-chapter-number">{chapter.number}</span>
                  <span className="work-chapter-name">{chapter.title}</span>
                  <span className="work-chapter-organization">{chapter.organization}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </aside>
      <div className="min-h-0 min-w-0 overflow-hidden border border-[color:var(--amber-base)]">
        <div ref={documentRef} className="work-document-scroll h-full min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain p-[var(--space-10)]" role="region" aria-label={workPage.documentLabel} tabIndex={0}>
          {workChapters.map((chapter) => (
            <SystemModule
              key={chapter.id}
              id={`work-${chapter.id}`}
              moduleId={chapter.number}
              status={workPage.status}
              title={chapter.title}
              document={{ active: activeId === chapter.id }}
              blocks={[
                { label: workPage.summaryLabel, value: <p className="font-semibold text-[color:var(--amber-core)]">{chapter.introduction}</p> },
                { label: workPage.bodyLabel, value: <p>{chapter.body}</p> },
              ]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
