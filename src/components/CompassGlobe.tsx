import { useEffect, useRef } from 'react';
import { useDeviceTier } from '@/hooks/useDeviceTier';

type LonLat = [number, number];
type GlobeCell = {
  px: number;
  py: number;
  lat: number;
  lonBase: number;
  brightness: number;
};

const CONTINENTS: { color: string; points: LonLat[] }[] = [
  {
    color: '#ff6600',
    points: [
      [-168, 60],
      [-140, 70],
      [-100, 74],
      [-78, 56],
      [-60, 46],
      [-66, 44],
      [-73, 43],
      [-80, 25],
      [-88, 16],
      [-78, 8],
      [-85, 10],
      [-105, 20],
      [-110, 24],
      [-122, 22],
      [-135, 38],
      [-155, 58],
      [-168, 60],
    ],
  },
  {
    color: '#ffdd00',
    points: [
      [-80, 12],
      [-60, 12],
      [-38, -5],
      [-34, -8],
      [-40, -22],
      [-48, -34],
      [-65, -55],
      [-70, -52],
      [-75, -48],
      [-80, -35],
      [-80, 12],
    ],
  },
  {
    color: '#cc44ff',
    points: [
      [-10, 36],
      [-8, 44],
      [-2, 48],
      [5, 54],
      [10, 56],
      [20, 58],
      [26, 68],
      [22, 71],
      [12, 70],
      [5, 58],
      [-5, 44],
      [-10, 36],
    ],
  },
  {
    color: '#ff2299',
    points: [
      [-18, 37],
      [10, 37],
      [32, 32],
      [42, 12],
      [50, 12],
      [43, -5],
      [35, -15],
      [18, -35],
      [14, -35],
      [10, -25],
      [-5, 5],
      [-18, 10],
      [-18, 37],
    ],
  },
  {
    color: '#00ff88',
    points: [
      [26, 70],
      [50, 72],
      [80, 72],
      [120, 68],
      [140, 60],
      [145, 45],
      [128, 32],
      [118, 22],
      [100, 10],
      [80, 8],
      [58, 22],
      [40, 38],
      [28, 62],
      [26, 70],
    ],
  },
  {
    color: '#00eeff',
    points: [
      [68, 25],
      [78, 30],
      [88, 22],
      [80, 8],
      [72, 8],
      [68, 25],
    ],
  },
  {
    color: '#aaff00',
    points: [
      [100, 22],
      [108, 20],
      [115, 5],
      [106, 2],
      [100, 5],
      [100, 22],
    ],
  },
  {
    color: '#ffaa00',
    points: [
      [116, -22],
      [126, -14],
      [138, -14],
      [152, -22],
      [152, -33],
      [140, -38],
      [116, -35],
      [116, -22],
    ],
  },
  {
    color: '#66ddff',
    points: [
      [-56, 60],
      [-44, 60],
      [-18, 66],
      [-18, 76],
      [-40, 83],
      [-58, 82],
      [-70, 76],
      [-56, 60],
    ],
  },
  {
    color: '#dd44ff',
    points: [
      [15, 56],
      [18, 62],
      [24, 70],
      [28, 71],
      [30, 68],
      [24, 62],
      [18, 58],
      [15, 56],
    ],
  },
  {
    color: '#ff3333',
    points: [
      [130, 34],
      [133, 36],
      [136, 40],
      [132, 44],
      [130, 43],
      [130, 34],
    ],
  },
  {
    color: '#44ff88',
    points: [
      [168, -46],
      [172, -40],
      [175, -37],
      [172, -35],
      [168, -46],
    ],
  },
  {
    color: '#aaffee',
    points: [
      [-24, 63],
      [-14, 63],
      [-12, 66],
      [-22, 66],
      [-24, 63],
    ],
  },
];

const LAND_CHARS = ['+', '#', '▓'];
const OCEAN_CHARS = ['·', '~', '≋'];
const DESKTOP_GLOBE_CELLS = 58;
const MOBILE_GLOBE_CELLS = 34;
const MAX_FPS = 30;
const FRAME_BUDGET = 1000 / MAX_FPS;
const DEG_PER_SEC = 8;
const LAND_CACHE = new Map<string, string | null>();

function pointInPolygon(lon: number, lat: number, points: LonLat[]) {
  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const current = points[i];
    const previous = points[j];

    if (!current || !previous) continue;

    const [xi, yi] = current;
    const [xj, yj] = previous;

    if (
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
}

function getLandColor(lon: number, lat: number) {
  const key = `${Math.round(lon)}:${Math.round(lat)}`;
  const cached = LAND_CACHE.get(key);

  if (cached !== undefined) return cached;

  for (const continent of CONTINENTS) {
    if (pointInPolygon(lon, lat, continent.points)) {
      LAND_CACHE.set(key, continent.color);
      return continent.color;
    }
  }

  LAND_CACHE.set(key, null);
  return null;
}

function hexRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function drawAsciiGlobe(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  rotationDegrees: number,
  cells: GlobeCell[],
  rows: number,
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#000008';
  ctx.fillRect(0, 0, width, height);

  const cellHeight = height / rows;
  ctx.font = `bold ${(cellHeight * 0.9).toFixed(1)}px "JetBrains Mono", "Courier New", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const cell of cells) {
    const lonRaw = cell.lonBase + rotationDegrees;
    const lon = ((lonRaw % 360) + 360) % 360 - 180;
    const land = getLandColor(lon, cell.lat);

    let r: number;
    let g: number;
    let b: number;
    let char: string;

    if (land) {
      char = LAND_CHARS[Math.min(2, Math.floor(cell.brightness * 3))];
      const [lr, lg, lb] = hexRgb(land);
      const factor = 0.3 + 0.7 * cell.brightness;
      r = Math.round(lr * factor);
      g = Math.round(lg * factor);
      b = Math.round(lb * factor);
    } else {
      char = OCEAN_CHARS[Math.min(2, Math.floor(cell.brightness * 3))];
      r = Math.round(8 * cell.brightness);
      g = Math.round(120 * cell.brightness);
      b = Math.round(210 + 45 * cell.brightness);
    }

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillText(char, cell.px, cell.py);
  }
}

function buildGlobeCells(
  width: number,
  height: number,
  cols: number,
  rows: number,
): GlobeCell[] {
  const cells: GlobeCell[] = [];
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const lx = -0.28;
  const ly = -0.28;
  const lz = 1;
  const lightLength = Math.sqrt(lx * lx + ly * ly + lz * lz);
  const nlx = lx / lightLength;
  const nly = ly / lightLength;
  const nlz = lz / lightLength;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const px = (col + 0.5) * cellWidth;
      const py = (row + 0.5) * cellHeight;
      const sx = (px - centerX) / radius;
      const sy = (py - centerY) / radius;
      const sz2 = 1 - sx * sx - sy * sy;

      if (sz2 < 0) continue;

      const sz = Math.sqrt(sz2);
      const lat = Math.asin(-sy) * (180 / Math.PI);
      const lonBase = Math.atan2(sx, sz) * (180 / Math.PI);
      const diffuse = Math.max(0, sx * nlx + sy * nly + sz * nlz);
      const brightness = 0.12 + 0.88 * diffuse;

      cells.push({ px, py, lat, lonBase, brightness });
    }
  }

  return cells;
}

export default function CompassGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceTier();
  const shouldAnimate = tier !== 'minimal';
  const cellsPerSide = tier === 'full' ? DESKTOP_GLOBE_CELLS : MOBILE_GLOBE_CELLS;
  const frameBudget = tier === 'full' ? FRAME_BUDGET : FRAME_BUDGET * 2;
  const rotationSpeed = tier === 'full' ? DEG_PER_SEC : DEG_PER_SEC * 0.28;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const width = canvas.width;
    const height = canvas.height;
    const cells = buildGlobeCells(width, height, cellsPerSide, cellsPerSide);
    const start = performance.now();
    let raf = 0;
    let lastFrame = 0;

    if (!shouldAnimate) {
      drawAsciiGlobe(ctx, width, height, 0, cells, cellsPerSide);
      return undefined;
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      if (now - lastFrame < frameBudget) return;

      lastFrame = now;
      drawAsciiGlobe(
        ctx,
        width,
        height,
        ((now - start) / 1000) * rotationSpeed,
        cells,
        cellsPerSide,
      );
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [cellsPerSide, frameBudget, rotationSpeed, shouldAnimate]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-[54%] z-0 block h-[clamp(190px,52vw,260px)] w-[clamp(190px,52vw,260px)] -translate-x-1/2 -translate-y-1/2 select-none opacity-42 sm:h-[clamp(230px,42vw,320px)] sm:w-[clamp(230px,42vw,320px)] sm:opacity-52 md:left-auto md:right-[4vw] md:top-1/2 md:h-[clamp(420px,34vw,620px)] md:w-[clamp(420px,34vw,620px)] md:translate-x-0 md:opacity-95 xl:right-[5vw]"
      aria-hidden="true"
    >
      <style>{`
        @keyframes moonOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        className="absolute inset-[-11%]"
        style={{
          transform: 'rotateZ(-18deg) scaleY(0.42)',
        }}
      >
        <div
          className="absolute inset-0 rounded-full border border-black/20"
          style={{
            boxShadow:
              '0 0 22px rgba(47, 92, 255, 0.14), inset 0 0 18px rgba(47, 92, 255, 0.08)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            animation: shouldAnimate ? 'moonOrbit 19s linear infinite' : 'none',
          }}
        >
          <span
            className="absolute left-1/2 top-[-6px] block rounded-full bg-[color:var(--ivory)]"
            style={{
              width: 'clamp(9px, 1.1vw, 15px)',
              height: 'clamp(9px, 1.1vw, 15px)',
              transform: 'translateX(-50%) scaleY(2.38)',
              boxShadow:
                '0 0 0 1px rgba(11, 11, 12, 0.2), 0 0 18px rgba(180, 220, 255, 0.65)',
            }}
          />
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          boxShadow:
            '0 0 0 1px rgba(11,11,12,0.22), 0 22px 70px rgba(0, 32, 120, 0.18), 0 0 46px rgba(47,92,255,0.18)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={620}
          height={620}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  );
}
