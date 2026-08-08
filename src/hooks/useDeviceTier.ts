import { useEffect, useState } from 'react';

export type MotionTier = 'full' | 'reduced' | 'minimal';

export function useDeviceTier(): MotionTier {
  const [tier, setTier] = useState<MotionTier>('full');

  useEffect(() => {
    const compute = (): MotionTier => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (prefersReduced) return 'minimal';

      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const isWideViewport = window.matchMedia('(min-width: 768px)').matches;
      const cores = navigator.hardwareConcurrency ?? 4;

      if (isFinePointer && isWideViewport && cores >= 4) return 'full';
      return 'reduced';
    };

    const handler = () => setTier(compute());
    const viewportQuery = window.matchMedia('(min-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    handler();
    viewportQuery.addEventListener('change', handler);
    motionQuery.addEventListener('change', handler);
    pointerQuery.addEventListener('change', handler);
    window.addEventListener('resize', handler);

    return () => {
      viewportQuery.removeEventListener('change', handler);
      motionQuery.removeEventListener('change', handler);
      pointerQuery.removeEventListener('change', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return tier;
}
