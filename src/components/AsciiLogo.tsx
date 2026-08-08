import { useEffect, useRef } from 'react';
import { useDeviceTier } from '@/hooks/useDeviceTier';

const RAMP = ' .:-=+*#%@';
const CELL_PX = 8;
const ROTATE_SPEED = 0.15;
const MAX_FPS = 30;
const FRAME_BUDGET = 1000 / MAX_FPS;
const MAX_DPR = 2;
const SOLID_ALPHA_THRESHOLD = 200;
const SOLID_RAMP_START = RAMP.indexOf('#');

interface Cell {
  x: number;
  y: number;
  char: string;
  r: number;
  g: number;
  b: number;
}

interface AsciiLogoProps {
  src: string;
  size?: number;
  className?: string;
}

export default function AsciiLogo({
  src,
  size = 420,
  className = '',
}: AsciiLogoProps) {
  const tier = useDeviceTier();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<Cell[]>([]);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let raf = 0;
    let cancelled = false;
    let lastFrame = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const cols = Math.floor(size / CELL_PX);
    const rows = Math.floor(size / CELL_PX);

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const drawCells = (time = 0) => {
      ctx.clearRect(0, 0, size, size);
      ctx.font = `${CELL_PX + 1}px "JetBrains Mono", "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const cell of cellsRef.current) {
        let alpha = 1;

        if (tier === 'full') {
          const cx = cols / 2;
          const cy = rows / 2;
          const dist = Math.hypot(cell.x - cx, cell.y - cy);
          const wave = Math.sin(dist * 0.35 - time * 2);
          alpha = 0.88 + Math.max(0, wave) * 0.12;
        }

        ctx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${alpha.toFixed(
          2,
        )})`;
        ctx.fillText(
          cell.char,
          cell.x * CELL_PX + CELL_PX / 2,
          cell.y * CELL_PX + CELL_PX / 2,
        );
      }
    };

    const animate = (start: number) => {
      const loop = (now: number) => {
        if (now - lastFrame >= FRAME_BUDGET) {
          drawCells((now - start) / 1000);
          lastFrame = now;

          if (spinRef.current) {
            angleRef.current = (angleRef.current + ROTATE_SPEED) % 360;
            spinRef.current.style.transform = `rotate(${angleRef.current}deg)`;
          }
        }

        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;

      const offscreen = document.createElement('canvas');
      offscreen.width = cols;
      offscreen.height = rows;

      const offscreenCtx = offscreen.getContext('2d', {
        willReadFrequently: true,
      });
      if (!offscreenCtx) return;

      const srcSize = Math.min(img.width, img.height);
      const sx = (img.width - srcSize) / 2;
      const sy = (img.height - srcSize) / 2;

      offscreenCtx.drawImage(img, sx, sy, srcSize, srcSize, 0, 0, cols, rows);

      const { data } = offscreenCtx.getImageData(0, 0, cols, rows);
      const cells: Cell[] = [];

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const index = (y * cols + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a < 40) continue;

          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const baseRampIndex = Math.max(
            1,
            Math.round(luminance * (RAMP.length - 1)),
          );
          const rampIndex =
            a > SOLID_ALPHA_THRESHOLD
              ? Math.max(SOLID_RAMP_START, baseRampIndex)
              : baseRampIndex;

          cells.push({ x, y, char: RAMP[rampIndex], r, g, b });
        }
      }

      cellsRef.current = cells;
      drawCells();

      if (tier === 'full') {
        animate(performance.now());
      }
    };
    img.src = src;

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [src, size, tier]);

  return (
    <div
      ref={spinRef}
      className={`pointer-events-none inline-block ${className}`}
      style={{ willChange: tier === 'full' ? 'transform' : undefined }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
