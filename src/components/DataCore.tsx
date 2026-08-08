import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface DataCoreProps {
  size: number;
}

export default function DataCore({ size }: DataCoreProps) {
  const tier = useDeviceTier();
  const reduced = tier === 'minimal';
  const [activity, setActivity] = useState<number[] | null>(null);

  useEffect(() => {
    const statsUrl = `${import.meta.env.BASE_URL}data/stats.json`;

    fetch(statsUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Stats unavailable');
        return response.json();
      })
      .then((data) => setActivity(data?.github?.recentActivity ?? null))
      .catch(() => setActivity(null));
  }, []);

  const bars =
    activity && activity.length > 0
      ? activity.slice(-14)
      : [1, 2, 1, 3, 2, 4, 2, 3, 5, 2, 4, 3, 6, 4];
  const max = Math.max(1, ...bars);
  const peakIndex = bars.indexOf(max);

  return (
    <div
      className="relative overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
      style={{ width: size, height: size, backgroundColor: '#071527' }}
    >
      <div
        className="absolute inset-0 opacity-65"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(47,92,255,0.78) 1px, transparent 1px)',
          backgroundSize: '6px 6px',
        }}
      />

      <div className="absolute inset-x-[14%] bottom-[17%] top-[24%] flex items-end justify-center gap-[3px]">
        {bars.map((count, index) => {
          const heightPct = Math.max(8, (count / max) * 100);
          const isPeak = index === peakIndex && max > 0;

          return (
            <motion.div
              key={`${count}-${index}`}
              className="min-w-[3px] flex-1 rounded-t-[1px]"
              style={{
                backgroundColor: isPeak ? '#ffc93c' : '#3ddc84',
              }}
              initial={reduced ? false : { height: 0 }}
              animate={{
                height: `${heightPct}%`,
                opacity: reduced ? 1 : [0.92, 1, 0.92],
              }}
              transition={{
                height: {
                  duration: reduced ? 0 : 0.65,
                  ease: [0.16, 1, 0.3, 1],
                  delay: reduced ? 0 : index * 0.025,
                },
                opacity: {
                  duration: 2.2 + (index % 3) * 0.35,
                  repeat: reduced ? 0 : Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
