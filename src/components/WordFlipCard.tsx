import { useEffect, useRef } from 'react';

interface WordPair {
  jp: string;
  en: string;
}

interface WordFlipCardProps {
  wordPairs: WordPair[];
  delayMs?: number;
  className?: string;
}

const JP_FONT = "'Noto Sans SC', 'Bricolage Grotesque', sans-serif";
const EN_FONT = "'Bricolage Grotesque', sans-serif";

export default function WordFlipCard({
  wordPairs,
  delayMs = 0,
  className = '',
}: WordFlipCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = Array.from(el.querySelectorAll<HTMLDivElement>('.wf-word'));

    // Reduced motion: show English immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((w) => {
        w.style.transition = 'none';
        const jp = w.querySelector<HTMLElement>('.wf-jp');
        const en = w.querySelector<HTMLElement>('.wf-en');
        if (jp) jp.style.display = 'none';
        if (en) {
          en.style.opacity = '1';
          en.style.clipPath = 'inset(0 0 0 0)';
        }
      });
      return;
    }

    // Compute per-word delays (synchronized across all cards by word index).
    words.forEach((w, i) => {
      w.dataset.delay = String(delayMs + i * 80);
    });

    // Observe when card scrolls into view.
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          triggerReveal(words);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px -50px 0px' },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [wordPairs, delayMs]);

  return (
    <div ref={containerRef} className={className}>
      {wordPairs.map((pair, i) => (
        <div
          key={i}
          className="wf-word"
          style={{
            position: 'relative',
            marginBottom: '0.35em',
            minHeight: '1.1em',
          }}
        >
          {/* Japanese text — slides out to the left */}
          <span
            className="wf-jp"
            style={{
              display: 'block',
              fontFamily: JP_FONT,
              fontWeight: 800,
              willChange: 'transform, opacity',
            }}
          >
            {pair.jp}
          </span>
          {/* English text — clips in from left to right */}
          <span
            className="wf-en"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              fontFamily: EN_FONT,
              fontWeight: 800,
              opacity: 0,
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path, opacity',
            }}
          >
            {pair.en}
          </span>
        </div>
      ))}
    </div>
  );
}

function triggerReveal(words: HTMLDivElement[]) {
  words.forEach((w) => {
    const delay = Number(w.dataset.delay ?? 0);
    setTimeout(() => {
      const jp = w.querySelector<HTMLElement>('.wf-jp');
      const en = w.querySelector<HTMLElement>('.wf-en');
      if (!jp || !en) return;

      // Slide Japanese out to the left.
      jp.style.transition =
        'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.12s ease-out';
      jp.style.transform = 'translateX(-15px)';
      jp.style.opacity = '0';

      // Reveal English from left to right with clip-path.
      setTimeout(() => {
        en.style.opacity = '1';
        en.style.transition =
          'clip-path 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
        en.style.clipPath = 'inset(0 0 0 0)';

        // Clean up: hide Japanese after transition.
        setTimeout(() => {
          jp.style.display = 'none';
        }, 180);
      }, 40);
    }, delay);
  });
}
