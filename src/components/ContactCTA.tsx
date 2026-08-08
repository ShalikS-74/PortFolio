import { motion } from 'framer-motion';
import { reveal, staggerContainer } from '@/lib/motion';
import MagneticLink from '@/components/MagneticLink';

interface ContactCTAProps {
  headline?: string;
  subhead?: string;
  href?: string;
}

export default function ContactCTA({
  headline = 'READY TO COMPILE?',
  subhead = "I'm looking for a fast-moving environment to prototype, ship, and iterate.",
  href = 'mailto:you@example.com',
}: ContactCTAProps) {
  return (
    <motion.section
      className="flex min-h-[72svh] flex-col items-center justify-center gap-10 bg-[color:var(--accent-blue)] px-6 py-24 text-center text-white md:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer(0.1)}
    >
      <motion.h2
        variants={reveal}
        className="max-w-6xl text-5xl font-black uppercase leading-[0.86] tracking-normal sm:text-7xl md:text-8xl lg:text-9xl"
      >
        {headline}
      </motion.h2>
      <motion.p
        variants={reveal}
        className="max-w-2xl text-xl font-medium leading-snug text-white/90 md:text-3xl"
      >
        {subhead}
      </motion.p>
      <motion.div variants={reveal}>
        <MagneticLink
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-3xl font-black uppercase leading-none tracking-normal sm:text-4xl md:text-5xl"
        >
          Send a Message
        </MagneticLink>
      </motion.div>
    </motion.section>
  );
}
