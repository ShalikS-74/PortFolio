import { useEffect, useRef } from 'react';
import type { IconItem } from '@/lib/types';

interface IconFlipCardProps {
  items: IconItem[];
  delayMs?: number;
  className?: string;
}

const JP_FONT = "'Noto Sans SC', 'Bricolage Grotesque', sans-serif";
const EN_FONT = "'Bricolage Grotesque', sans-serif";

export default function IconFlipCard({
  items,
  delayMs = 0,
  className = '',
}: IconFlipCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const rows = Array.from(el.querySelectorAll<HTMLDivElement>('.ifc-row'));

    // Reduced motion: show English immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows.forEach((r) => {
        r.style.transition = 'none';
        const jp = r.querySelector<HTMLElement>('.ifc-jp');
        const en = r.querySelector<HTMLElement>('.ifc-en');
        if (jp) jp.style.display = 'none';
        if (en) {
          en.style.opacity = '1';
          en.style.clipPath = 'inset(0 0 0 0)';
        }
      });
      return;
    }

    // Compute per-row delays (synchronized across all cards by row index).
    rows.forEach((r, i) => {
      r.dataset.delay = String(delayMs + i * 80);
    });

    // Observe when card scrolls into view.
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          triggerReveal(rows);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px -50px 0px' },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [items, delayMs]);

  return (
    <div ref={containerRef} className={className}>
      {items.map((item, i) => (
        <div
          key={i}
          className="ifc-row"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em',
            marginBottom: '0.3em',
            minHeight: '1.4em',
          }}
        >
          {/* Devicon — always visible (if available) */}
          {item.icon && (
            <i
              className={item.icon}
              title={item.en}
              aria-label={item.en}
              style={{ fontSize: '1.1em', flexShrink: 0 }}
            />
          )}
          {/* Japanese text — slides out to the left */}
          <span
            className="ifc-jp"
            style={{
              fontFamily: JP_FONT,
              fontWeight: 800,
              willChange: 'transform, opacity',
            }}
          >
            {item.jp}
          </span>
          {/* English text — clips in from left to right */}
          <span
            className="ifc-en"
            style={{
              position: 'absolute',
              left: item.icon ? '1.6em' : '0',
              fontFamily: EN_FONT,
              fontWeight: 800,
              opacity: 0,
              clipPath: 'inset(0 100% 0 0)',
              willChange: 'clip-path, opacity',
            }}
          >
            {item.en}
          </span>
        </div>
      ))}
    </div>
  );
}

function triggerReveal(rows: HTMLDivElement[]) {
  rows.forEach((r) => {
    const delay = Number(r.dataset.delay ?? 0);
    setTimeout(() => {
      const jp = r.querySelector<HTMLElement>('.ifc-jp');
      const en = r.querySelector<HTMLElement>('.ifc-en');
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
