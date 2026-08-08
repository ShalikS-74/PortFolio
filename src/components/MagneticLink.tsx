import { useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useDeviceTier } from '@/hooks/useDeviceTier';

interface MagneticLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const STRENGTH = 0.3;
const MAX_OFFSET = 16;

export default function MagneticLink({
  href,
  children,
  className = '',
  target,
  rel,
}: MagneticLinkProps) {
  const tier = useDeviceTier();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const handleMove = (event: MouseEvent) => {
    if (tier !== 'full') return;

    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = event.clientX - centerX;
    const offsetY = event.clientY - centerY;

    x.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetX * STRENGTH)));
    y.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offsetY * STRENGTH)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      data-cursor="arrow"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className={`inline-flex items-center gap-4 ${className}`}
    >
      <span>{children}</span>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[color:var(--ink)] sm:h-16 sm:w-16">
        <ArrowUpRight className="h-6 w-6" strokeWidth={2.5} />
      </span>
    </motion.a>
  );
}
