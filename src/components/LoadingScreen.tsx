import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [scramble, setScramble] = useState('000');

  useEffect(() => {
    // Visual scramble effect — purely cosmetic, decoupled from completion.
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 999).toString().padStart(3, '0');
      setScramble(rand);
    }, 30);

    // Completion is guaranteed by a single timer, independent of the interval above.
    const finish = setTimeout(() => {
      clearInterval(interval);
      setScramble('100');
      onComplete();
    }, 450);

    return () => {
      clearInterval(interval);
      clearTimeout(finish);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground text-background font-sans overflow-hidden"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="leading-none font-bold tracking-tight" style={{ fontSize: 'clamp(6rem, 22vw, 18rem)' }}>
        {scramble}
      </div>
      <div className="absolute bottom-12 right-12 font-mono text-sm uppercase tracking-widest text-background/50">
        Booting Environment...
      </div>
    </motion.div>
  );
}
