import { memo } from 'react';
import { motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

interface MorphCharProps {
  fromChar: string;
  toChar: string;
  index: number;
  active: boolean;
  pixelFont: boolean;
}

const STAGGER_DELAY = 0.026;
const OUT_DURATION = 0.34;
const IN_DURATION = 0.42;

function isBlank(char: string) {
  return char === '' || char === ' ';
}

const MorphChar = memo(function MorphChar({
  fromChar,
  toChar,
  index,
  active,
  pixelFont,
}: MorphCharProps) {
  const displayChar = toChar || fromChar;
  const blank = isBlank(displayChar);
  const sameChar = fromChar === toChar;
  const delay = index * STAGGER_DELAY;
  const width = blank ? '0.42em' : pixelFont ? '1em' : '0.72em';

  if (!active || sameChar) {
    return (
      <span
        className="relative inline-grid h-[1.06em] place-items-center"
        style={{ width }}
        aria-hidden={blank}
      >
        {blank ? '\u00a0' : displayChar}
      </span>
    );
  }

  return (
    <span
      className="relative inline-grid h-[1.06em] place-items-center"
      style={{
        width,
        perspective: '720px',
        transformStyle: 'preserve-3d',
      }}
      aria-hidden={blank}
    >
      {!isBlank(fromChar) && (
        <motion.span
          className="absolute inset-0 grid place-items-center"
          style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity, filter',
          }}
          initial={{
            opacity: 1,
            rotateY: 0,
            x: 0,
            y: 0,
            scaleX: 1,
            filter: 'blur(0px)',
          }}
          animate={{
            opacity: 0,
            rotateY: -92,
            x: -7,
            y: -5,
            scaleX: 0.82,
            filter: 'blur(3px)',
          }}
          transition={{ duration: OUT_DURATION, delay, ease: EASE }}
        >
          {fromChar}
        </motion.span>
      )}

      {!isBlank(toChar) && (
        <motion.span
          className="absolute inset-0 grid place-items-center"
          style={{
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity, filter',
          }}
          initial={{
            opacity: 0,
            rotateY: 92,
            x: 7,
            y: 5,
            scaleX: 0.82,
            filter: 'blur(3px)',
          }}
          animate={{
            opacity: 1,
            rotateY: 0,
            x: 0,
            y: 0,
            scaleX: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: IN_DURATION,
            delay: delay + 0.12,
            ease: EASE,
          }}
        >
          {toChar}
        </motion.span>
      )}
    </span>
  );
});

export default MorphChar;
