import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DURATION, EASE } from '@/lib/motion';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface LoaderProps {
  onComplete: () => void;
  progress?: number;
}

const BOOT_LOG = [
  'MOUNTING_FS',
  'INIT_RENDERER',
  'LOADING_ASSETS',
  'CALIBRATING_MOTION',
  'READY',
] as const;

export default function Loader({ onComplete, progress }: LoaderProps) {
  const tier = useDeviceTier();
  const reduced = tier === 'minimal';
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!('fonts' in document)) return;

    void document.fonts.load('400 100px "Anton"');
    void document.fonts.load('500 14px "JetBrains Mono"');
    void document.fonts.load('400 96px "Six Caps"');
  }, []);

  useEffect(() => {
    if (progress !== undefined) {
      setCount(Math.round(progress));

      if (progress >= 100) {
        const timer = window.setTimeout(() => setDone(true), 150);
        return () => window.clearTimeout(timer);
      }

      return;
    }

    const start = performance.now();
    const budgetMs = DURATION.boot * 1000;
    let frame = 0;
    let finishTimer = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const percent = Math.min(100, Math.round((elapsed / budgetMs) * 100));

      setCount(percent);

      if (percent >= 100) {
        finishTimer = window.setTimeout(() => setDone(true), 100);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
    };
  }, [progress]);

  const logIndex = useMemo(
    () =>
      Math.min(
        BOOT_LOG.length - 1,
        Math.floor((count / 100) * (BOOT_LOG.length - 1)),
      ),
    [count],
  );

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!done && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[color:var(--ink)] text-[color:var(--ivory)]"
          initial={{ opacity: 1 }}
          exit={
            reduced
              ? {
                  opacity: 0,
                  transition: { duration: DURATION.fast, ease: EASE },
                }
              : {
                  clipPath: 'inset(0% 0% 100% 0%)',
                  transition: { duration: 0.55, ease: EASE },
                }
          }
          style={!reduced ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined}
        >
          {!reduced && (
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 3px)',
              }}
            />
          )}

          <div className="relative flex flex-col items-center gap-3">
            <div className="h-4 overflow-hidden font-mono text-xs uppercase tracking-[0.28em] text-white/60">
              <AnimatePresence mode="wait">
                <motion.span
                  key={BOOT_LOG[logIndex]}
                  className="block"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? {} : { opacity: 0, y: -8 }}
                  transition={{ duration: DURATION.instant, ease: EASE }}
                >
                  {BOOT_LOG[logIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="font-loader-number text-8xl uppercase leading-none tracking-[0.04em] tabular-nums md:text-[9rem]">
              {String(count).padStart(3, '0')}
              <span className="ml-3 inline-block text-[0.58em] text-[color:var(--accent-blue)]">
                %
              </span>
            </div>

            <div className="h-[2px] w-40 overflow-hidden bg-white/15">
              <div
                className="h-full bg-[color:var(--accent-blue)]"
                style={{ width: `${count}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
