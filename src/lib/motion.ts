import type { Variants } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DURATION = {
  instant: 0.16,
  fast: 0.28,
  base: 0.48,
  slow: 0.72,
  boot: 0.7,
} as const;

export const previewSpring = {
  damping: 28,
  stiffness: 260,
  mass: 0.35,
} as const;

export const reveal: Variants = {
  hidden: {
    y: 28,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASE,
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: DURATION.base,
      ease: EASE,
    },
  },
};

export const staggerContainer = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.04,
    },
  },
});

export const wipeExit = {
  y: '-100%',
  transition: {
    duration: DURATION.slow,
    ease: EASE,
  },
};
