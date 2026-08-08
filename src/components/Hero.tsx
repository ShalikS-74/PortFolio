import { motion, useScroll } from 'framer-motion';
import HeroRoleRotator from '@/components/HeroRoleRotator';
import { reveal, staggerContainer } from '@/lib/motion';
import StatusSignal from '@/components/StatusSignal';

interface HeroProps {
  firstName: string;
  lastInitial: string;
  portfolioLabel: string;
  status: string;
  location: string;
}

export default function Hero({
  firstName,
  lastInitial,
  portfolioLabel,
  status,
  location,
}: HeroProps) {
  const { scrollYProgress } = useScroll();

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[color:var(--ivory)] text-[color:var(--ink)]">
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-[color:var(--accent-blue)]"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.div
        className="relative z-10 flex min-h-[100svh] flex-col justify-between px-6 py-7 md:px-12 md:py-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.11)}
      >
        <motion.header
          variants={reveal}
          className="flex items-start justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.28em] text-black/65"
        >
          <div className="flex flex-col gap-1">
            <span>
              {firstName} {lastInitial}
            </span>
            <span className="text-black/40">{portfolioLabel}</span>
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <StatusSignal label={status} />
            <span className="text-black/40">{location}</span>
          </div>
        </motion.header>

        <div className="relative flex flex-1 flex-col justify-between py-8 sm:py-10 md:py-14 lg:py-8">
          <motion.h1
            variants={reveal}
            className="relative z-10 self-start text-7xl font-black uppercase leading-[0.78] tracking-normal min-[390px]:text-8xl sm:text-9xl md:text-[9.5rem] lg:text-[12rem]"
          >
            {firstName}
          </motion.h1>
          <motion.div
            variants={reveal}
            className="relative z-20 mx-auto w-full max-w-[56rem] py-5"
          >
            <HeroRoleRotator />
          </motion.div>
          <motion.h1
            variants={reveal}
            className="relative z-10 self-end text-8xl font-black uppercase leading-[0.78] tracking-normal min-[390px]:text-9xl sm:text-[10rem] md:text-[13rem] lg:text-[16rem] [@media(min-width:1024px)_and_(max-height:800px)]:text-[14rem]"
          >
            {lastInitial}
          </motion.h1>
        </div>
      </motion.div>
    </section>
  );
}
