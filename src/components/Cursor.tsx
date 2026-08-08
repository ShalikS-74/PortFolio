import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { previewSpring } from '@/lib/motion';
import { useDeviceTier } from '@/hooks/useDeviceTier';

type CursorState = 'default' | 'project' | 'link' | 'text' | 'arrow';

export default function Cursor() {
  const tier = useDeviceTier();
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);

  const mvX = useMotionValue(-100);
  const mvY = useMotionValue(-100);
  const x = useSpring(mvX, previewSpring);
  const y = useSpring(mvY, previewSpring);

  useEffect(() => {
    if (tier !== 'full') return;

    const move = (event: MouseEvent) => {
      if (!visible) setVisible(true);
      mvX.set(event.clientX);
      mvY.set(event.clientY);

      const target = (event.target as HTMLElement)?.closest('[data-cursor]');
      const next =
        (target?.getAttribute('data-cursor') as CursorState | null) ??
        'default';

      setState(next);
    };

    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
    };
  }, [tier, visible, mvX, mvY]);

  if (tier !== 'full') return null;

  const sizeByState: Record<CursorState, number> = {
    default: 14,
    project: 64,
    link: 40,
    text: 4,
    arrow: 56,
  };

  const borderByState: Record<CursorState, number> = {
    default: 1.5,
    project: 2,
    link: 2,
    text: 0,
    arrow: 2,
  };

  const isArrow = state === 'arrow';
  const size = sizeByState[state];
  const border = borderByState[state];

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x, y }}
    >
      <motion.div
        className={`absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full ${
          isArrow
            ? 'bg-white text-[color:var(--ink)]'
            : 'bg-white text-[color:var(--ink)]'
        }`}
        style={{
          border: border ? `${border}px solid var(--ink)` : 'none',
        }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {isArrow && (
          <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
        )}
      </motion.div>
    </motion.div>
  );
}
