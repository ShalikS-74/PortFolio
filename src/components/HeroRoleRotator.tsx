import { useEffect, useMemo, useState } from 'react';
import MorphingRoleText from '@/components/MorphingRoleText';
import { useDeviceTier } from '@/hooks/useDeviceTier';

const ROLES = [
  'AIML ENTHUSIAST',
  'GAME DEV',
] as const;

const PIXEL_FONT_ROLE = 'GAME DEV';

const ROTATE_MS = 2600;

interface HeroRoleRotatorProps {
  className?: string;
}

interface RolePair {
  from: string;
  to: string;
  index: number;
  transitionCount: number;
}

export default function HeroRoleRotator({
  className = '',
}: HeroRoleRotatorProps) {
  const tier = useDeviceTier();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [pair, setPair] = useState<RolePair>({
    from: ROLES[0],
    to: ROLES[0],
    index: 0,
    transitionCount: 0,
  });

  const slotCount = useMemo(
    () => Math.max(...ROLES.map((role) => role.length)),
    [],
  );
  const animated = tier !== 'minimal' && !prefersReducedMotion;
  const pixelFont = pair.to === PIXEL_FONT_ROLE;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!animated) {
      setPair({
        from: ROLES[0],
        to: ROLES[0],
        index: 0,
        transitionCount: 0,
      });
      return undefined;
    }

    const interval = window.setInterval(() => {
      setPair((current) => {
        const nextIndex = (current.index + 1) % ROLES.length;
        const nextRole = ROLES[nextIndex] ?? ROLES[0];

        return {
          from: current.to,
          to: nextRole,
          index: nextIndex,
          transitionCount: current.transitionCount + 1,
        };
      });
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [animated]);

  return (
    <div className={`relative w-full ${className}`}>
      <MorphingRoleText
        key={pair.transitionCount}
        from={pair.from}
        to={pair.to}
        active={animated && pair.transitionCount > 0}
        slotCount={slotCount}
        pixelFont={pixelFont}
      />
    </div>
  );
}
