import { useEffect, useRef } from 'react';
import { useDeviceTier } from '../hooks/useDeviceTier';

const GLYPHS = ['S', 'H', 'A', 'L', 'I', 'K'] as const;
const FONT_FAMILY = 'Anton';
const FONT_FALLBACK = '"Arial Black", Impact, sans-serif';
const CHARS = ' .:-=+*#%@';

const CELL_WIDTH = 8;
const CELL_HEIGHT = 10;
const MAX_DPR = 2;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

const RIPPLE_SPEED = 1.15;
const RIPPLE_FREQ = 0.43;
const RIPPLE_CONTRAST = 1.85;
const GLYPH_INTERVAL = 2600;
const GLYPH_FADE = 420;
const GLYPH_SCALE = 1;
const ALPHA_BASE = 0.32;
const ALPHA_SCALE = 0.5;

const INK = { r: 11, g: 11, b: 12 };
const LETTER_BORDER = 'rgb(11 11 12)';

type GlyphMask = Uint8Array;

interface GridState {
  cols: number;
  rows: number;
  fontSize: number;
  fontSizePx: number;
  clipMasks: HTMLCanvasElement[];
  masks: GlyphMask[];
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeInOut(value: number) {
  return value * value * (3 - 2 * value);
}

async function ensureGlyphFont() {
  if (!('fonts' in document)) return undefined;

  try {
    await document.fonts.load(`400 100px "${FONT_FAMILY}"`);
    await document.fonts.ready;
  } catch {
    return undefined;
  }

  return undefined;
}

function buildMask(glyph: string, cols: number, rows: number, fontSize: number) {
  const canvas = document.createElement('canvas');
  canvas.width = cols;
  canvas.height = rows;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return new Uint8Array(cols * rows);

  ctx.clearRect(0, 0, cols, rows);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `400 ${fontSize}px "${FONT_FAMILY}", ${FONT_FALLBACK}`;
  ctx.fillText(glyph, cols / 2, rows / 2 + rows * 0.035);

  const { data } = ctx.getImageData(0, 0, cols, rows);
  const mask = new Uint8Array(cols * rows);

  for (let i = 0; i < cols * rows; i += 1) {
    mask[i] = data[i * 4 + 3];
  }

  return mask;
}

function buildClipMask(
  glyph: string,
  width: number,
  height: number,
  fontSizePx: number,
) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(width));
  canvas.height = Math.max(1, Math.floor(height));

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `400 ${fontSizePx}px "${FONT_FAMILY}", ${FONT_FALLBACK}`;
  ctx.fillText(glyph, width / 2, height / 2 + height * 0.035);

  return canvas;
}

function buildGrid(width: number, height: number): GridState | null {
  if (width <= 0 || height <= 0) return null;

  const cols = Math.max(30, Math.floor(width / CELL_WIDTH));
  const rows = Math.max(24, Math.floor(height / CELL_HEIGHT));
  const fontSize = Math.min(cols * 0.72, rows * 0.84) * GLYPH_SCALE;
  const fontSizePx = fontSize * CELL_HEIGHT;
  const masks = GLYPHS.map((glyph) => buildMask(glyph, cols, rows, fontSize));
  const clipMasks = GLYPHS.map((glyph) =>
    buildClipMask(glyph, width, height, fontSizePx),
  );

  return { cols, rows, fontSize, fontSizePx, clipMasks, masks };
}

export default function AsciiGlyph({ className = '' }: { className?: string }) {
  const tier = useDeviceTier();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<GridState | null>(null);
  const targetPull = useRef({ x: 0, y: 0 });
  const pull = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let raf = 0;
    let resizeTimer = 0;
    let lastFrame = 0;
    let mounted = true;

    const syncCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      gridRef.current = buildGrid(rect.width, rect.height);
    };

    const drawGlyph = (now: number) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const grid = gridRef.current;

      if (!grid || width <= 0 || height <= 0) return;

      ctx.clearRect(0, 0, width, height);

      const cycle = now % (GLYPH_INTERVAL * GLYPHS.length);
      const glyphIndex = Math.min(
        GLYPHS.length - 1,
        Math.floor(cycle / GLYPH_INTERVAL),
      );
      const phase = cycle - glyphIndex * GLYPH_INTERVAL;
      const fadeIn = easeInOut(clamp(phase / GLYPH_FADE));
      const fadeOut = easeInOut(clamp((GLYPH_INTERVAL - phase) / GLYPH_FADE));
      const glyphAlpha = Math.min(fadeIn, fadeOut);
      const mask = grid.masks[glyphIndex];
      const clipMask = grid.clipMasks[glyphIndex];
      const glyph = GLYPHS[glyphIndex];

      if (!mask || !clipMask || !glyph) return;

      const centerX = grid.cols / 2 + pull.current.x * 2.4;
      const centerY = grid.rows / 2 + pull.current.y * 1.8;
      const localSeconds = phase / 1000;
      const cellOffsetX = (width - grid.cols * CELL_WIDTH) / 2;
      const cellOffsetY = (height - grid.rows * CELL_HEIGHT) / 2;

      ctx.save();
      ctx.font = `500 ${Math.round(CELL_HEIGHT * 0.88)}px "JetBrains Mono", "Space Mono", monospace`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      for (let y = 0; y < grid.rows; y += 1) {
        for (let x = 0; x < grid.cols; x += 1) {
          const coverage = mask[x + y * grid.cols] / 255;
          if (coverage <= 0.08) continue;

          const dx = (x - centerX) / grid.cols;
          const dy = (y - centerY) / grid.rows;
          const dist = Math.sqrt(dx * dx + dy * dy) * 16;
          const wave = Math.sin(
            dist * RIPPLE_FREQ * Math.PI - localSeconds * RIPPLE_SPEED,
          );
          const intensity = Math.pow((wave + 1) / 2, RIPPLE_CONTRAST);
          const alpha =
            (ALPHA_BASE + ALPHA_SCALE * intensity) * glyphAlpha * coverage;
          const charIndex = Math.min(
            CHARS.length - 1,
            Math.max(0, Math.floor(intensity * (CHARS.length - 1))),
          );

          ctx.fillStyle = `rgba(${INK.r}, ${INK.g}, ${INK.b}, ${alpha})`;
          ctx.fillText(
            CHARS[charIndex],
            cellOffsetX + x * CELL_WIDTH + CELL_WIDTH / 2,
            cellOffsetY + y * CELL_HEIGHT + CELL_HEIGHT / 2,
          );
        }
      }

      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(clipMask, 0, 0, width, height);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = glyphAlpha;
      ctx.strokeStyle = LETTER_BORDER;
      ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.012);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `400 ${grid.fontSizePx}px "${FONT_FAMILY}", ${FONT_FALLBACK}`;
      ctx.strokeText(glyph, width / 2, height / 2 + height * 0.035);
      ctx.restore();
    };

    const animate = (now: number) => {
      if (now - lastFrame >= FRAME_INTERVAL) {
        pull.current.x += (targetPull.current.x - pull.current.x) * 0.035;
        pull.current.y += (targetPull.current.y - pull.current.y) * 0.035;
        drawGlyph(now);
        lastFrame = now;
      }

      if (tier === 'full') {
        raf = requestAnimationFrame(animate);
      }
    };

    const handleMove = (event: MouseEvent) => {
      targetPull.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetPull.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        syncCanvas();
        drawGlyph(performance.now());
      }, 140);
    };

    const setup = async () => {
      await ensureGlyphFont();
      if (!mounted) return;

      syncCanvas();
      drawGlyph(performance.now());

      if (tier === 'full') {
        window.addEventListener('mousemove', handleMove, { passive: true });
        raf = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('resize', handleResize);
    void setup();

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMove);
      window.clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
    };
  }, [tier]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
