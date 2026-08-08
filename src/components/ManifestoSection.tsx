import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import CompassGlobe from '@/components/CompassGlobe';
import { reveal, staggerContainer } from '@/lib/motion';

interface StatItem {
  label: string;
  value: string | number;
}

interface ManifestoSectionProps {
  index?: string;
  eyebrow?: string;
  headline: string;
  fallbackStats: StatItem[];
}

export default function ManifestoSection({
  index = '01',
  eyebrow = 'Operating note',
  headline,
  fallbackStats,
}: ManifestoSectionProps) {
  const [liveCommits, setLiveCommits] = useState<number | null>(null);

  useEffect(() => {
    const statsUrl = `${import.meta.env.BASE_URL}data/stats.json`;

    fetch(statsUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Stats unavailable');
        return response.json();
      })
      .then((data) => setLiveCommits(data?.github?.totalCommits ?? null))
      .catch(() => setLiveCommits(null));
  }, []);

  const stats = useMemo(
    () =>
      fallbackStats.map((stat) =>
        stat.label.toUpperCase().includes('COMMIT') && liveCommits !== null
          ? { ...stat, value: liveCommits }
          : stat,
      ),
    [fallbackStats, liveCommits],
  );

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <CompassGlobe />

      <motion.div
        className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 py-8 md:px-12 md:py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={staggerContainer(0.1)}
      >
        <motion.div
          variants={reveal}
          className="flex items-baseline gap-6 font-mono text-xs uppercase tracking-[0.22em] text-black/55"
        >
          <span>{index}</span>
          <span className="text-black/40">{eyebrow}</span>
        </motion.div>

        <motion.h2
          variants={reveal}
          className="max-w-[68rem] text-4xl font-black uppercase leading-[0.98] tracking-normal min-[390px]:text-5xl sm:text-6xl md:max-w-[55%] md:text-7xl lg:text-8xl"
        >
          {headline}
        </motion.h2>

        <motion.div
          variants={staggerContainer(0.08)}
          className="grid gap-6 border-t border-black/15 pt-6 font-mono uppercase tracking-[0.16em] text-black/55 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={reveal}
              className="flex flex-col gap-2"
            >
              <span className="text-[11px] text-black/40">{stat.label}</span>
              <span className="text-3xl font-bold leading-none tracking-normal text-[color:var(--ink)] tabular-nums md:text-4xl">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
