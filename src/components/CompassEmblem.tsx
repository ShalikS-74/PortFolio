import { useDeviceTier } from '@/hooks/useDeviceTier';
import DataCore from '@/components/DataCore';

interface CompassEmblemProps {
  src: string;
  size?: number;
  holeCenterXPercent?: number;
  holeCenterYPercent?: number;
  holeDiameterPercent?: number;
  className?: string;
}

export default function CompassEmblem({
  src,
  size = 420,
  holeCenterXPercent = 50,
  holeCenterYPercent = 50,
  holeDiameterPercent = 31,
  className = '',
}: CompassEmblemProps) {
  const tier = useDeviceTier();
  const coreSize = size * (holeDiameterPercent / 100);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="relative z-10 h-full w-full object-contain"
        style={{
          animation:
            tier === 'minimal' ? 'none' : 'compass-spin 80s linear infinite',
        }}
      />

      <div
        className="absolute z-20"
        style={{
          left: `${holeCenterXPercent}%`,
          top: `${holeCenterYPercent}%`,
          width: coreSize,
          height: coreSize,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DataCore size={coreSize} />
      </div>

      <style>{`
        @keyframes compass-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
