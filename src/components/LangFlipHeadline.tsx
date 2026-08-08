import { useEffect, useRef } from 'react';

interface WordPair {
  jp: string;
  en: string;
  color?: string;
}

interface LangFlipHeadlineProps {
  words: WordPair[];
  className?: string;
  startDelayMs?: number;
  charStaggerMs?: number;
  wordGapMs?: number;
}

const JP_FONT = "'Noto Sans SC', 'Bricolage Grotesque', sans-serif";
const EN_FONT = "'Bricolage Grotesque', sans-serif";
const FONT_SIZE = 'clamp(2.6rem, 6.5vw, 5.5rem)';

export default function LangFlipHeadline({
  words,
  className = '',
  startDelayMs = 600,
  charStaggerMs = 65,
  wordGapMs = 100,
}: LangFlipHeadlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = Array.from(el.querySelectorAll<HTMLSpanElement>('.lf-char'));

    // Reduced motion: show English immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      chars.forEach((c) => {
        c.style.transition = 'none';
        c.dataset.state = 'en';
        const jp = c.querySelector<HTMLElement>('.lf-face-jp');
        const en = c.querySelector<HTMLElement>('.lf-face-en');
        if (jp) jp.style.display = 'none';
        if (en) en.style.display = 'block';
      });
      return;
    }

    // Compute per-character delays.
    let offset = startDelayMs;
    chars.forEach((c, i) => {
      const wordIndex = Number(c.dataset.word);
      if (i > 0 && wordIndex !== Number(chars[i - 1].dataset.word)) {
        offset += wordGapMs;
      }
      c.dataset.delay = String(offset);
      offset += charStaggerMs;
    });

    // Observe when headline scrolls into view.
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          triggerFlip(chars);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px -50px 0px' },
    );
    observer.observe(el);

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, startDelayMs, charStaggerMs, wordGapMs]);

  return (
    <div ref={containerRef} className={className}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className="inline-block"
          style={{ marginRight: wi < words.length - 1 ? '0.35em' : 0 }}
        >
          {Array.from(word.en).map((enChar, ci) => {
            const jpChar = word.jp[ci] ?? '';
            return (
              <span
                key={ci}
                className="lf-char"
                data-word={wi}
                data-state="jp"
                style={{
                  display: 'inline-block',
                  fontSize: FONT_SIZE,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: word.color ?? 'var(--ivory)',
                  verticalAlign: 'top',
                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'rotateX(0deg)',
                  transformOrigin: 'center bottom',
                  willChange: 'transform',
                }}
              >
                <span
                  className="lf-face-jp"
                  style={{
                    display: 'block',
                    fontFamily: JP_FONT,
                  }}
                >
                  {jpChar}
                </span>
                <span
                  className="lf-face-en"
                  style={{
                    display: 'none',
                    fontFamily: EN_FONT,
                  }}
                >
                  {enChar}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

function triggerFlip(chars: HTMLSpanElement[]) {
  chars.forEach((c) => {
    const delay = Number(c.dataset.delay ?? 0);
    setTimeout(() => {
      // Quick flip down.
      c.style.transition = 'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)';
      c.style.transform = 'rotateX(-90deg)';

      // At midpoint swap the character, then flip back up.
      setTimeout(() => {
        c.dataset.state = 'en';
        const jp = c.querySelector<HTMLElement>('.lf-face-jp');
        const en = c.querySelector<HTMLElement>('.lf-face-en');
        if (jp) jp.style.display = 'none';
        if (en) en.style.display = 'block';
        c.style.transition = 'none';
        c.style.transform = 'rotateX(90deg)';
        void c.offsetHeight; // force reflow
        c.style.transition = 'transform 0.12s cubic-bezier(0.4, 0, 0.2, 1)';
        c.style.transform = 'rotateX(0deg)';
      }, 120);
    }, delay);
  });
}
