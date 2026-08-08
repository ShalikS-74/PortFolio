import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface StatusSignalProps {
  label: string;
}

const phases = [
  { color: '#ff3b30', bars: 1 },
  { color: '#ffcc00', bars: 2 },
  { color: '#b4ff39', bars: 3 },
  { color: '#b4ff39', bars: 3 },
] as const;

export default function StatusSignal({ label }: StatusSignalProps) {
  const tier = useDeviceTier();
  const [phase, setPhase] = useState(tier === 'minimal' ? 3 : 0);
  const current = phases[phase];
  const isOnline = phase === 3;

  useEffect(() => {
    if (tier === 'minimal') {
      setPhase(3);
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase(1), 360),
      window.setTimeout(() => setPhase(2), 720),
      window.setTimeout(() => setPhase(3), 1120),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [tier]);

  return (
    <span
      className="inline-flex items-center justify-end gap-2"
      aria-label={label}
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
        <motion.span
          className="mb-[1px] h-2 w-2 rounded-full"
          style={{ backgroundColor: current.color }}
          animate={
            isOnline
              ? { opacity: [0.45, 1, 0.45], scale: [0.92, 1, 0.92] }
              : { opacity: 1, scale: 1 }
          }
          transition={
            isOnline
              ? { duration: 1.45, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }
          }
        />
        {[0, 1, 2].map((index) => {
          const active = index < current.bars;

          return (
            <motion.span
              key={index}
              className="w-[3px] rounded-full"
              style={{
                height: `${6 + index * 4}px`,
                backgroundColor: current.color,
                transformOrigin: 'bottom',
              }}
              animate={{
                opacity: active ? 1 : 0.16,
                scaleY: active ? 1 : 0.45,
              }}
              transition={{
                duration: 0.28,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}
      </span>
      <span>{label}</span>
    </span>
  );
}
