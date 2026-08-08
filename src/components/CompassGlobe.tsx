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

/* ── Country polygons — each country a unique shade of its continent ── */
const CONTINENTS: { color: string; points: LonLat[] }[] = [
  // ── NORTH AMERICA ──
  {
    color: '#ff6600',
    points: [
      [-168, 72], [-145, 73], [-120, 74], [-95, 74], [-80, 73],
      [-65, 73], [-58, 70], [-52, 62], [-55, 52], [-58, 48],
      [-62, 46], [-66, 44], [-68, 44], [-70, 43], [-72, 41],
      [-74, 40], [-76, 38], [-77, 35], [-80, 32], [-82, 30],
      [-81, 28], [-80, 25], [-82, 25], [-84, 30], [-88, 30],
      [-90, 29], [-92, 29], [-94, 29], [-97, 26], [-97, 22],
      [-92, 18], [-88, 18], [-86, 16], [-84, 14],
      [-105, 20], [-110, 24], [-115, 28], [-118, 33],
      [-122, 37], [-124, 42], [-124, 48], [-130, 55],
      [-140, 60], [-148, 62], [-155, 60], [-162, 64],
      [-168, 72],
    ],
  },
  // ── ALASKA (darker orange) ──
  {
    color: '#dd5500',
    points: [
      [-168, 72], [-162, 64], [-155, 60], [-152, 58],
      [-148, 60], [-140, 60], [-135, 58], [-130, 56],
      [-138, 58], [-145, 60], [-152, 60], [-160, 62],
      [-165, 66], [-168, 72],
    ],
  },
  // ── GREENLAND (icy cyan) ──
  {
    color: '#66ddff',
    points: [
      [-55, 60], [-48, 60], [-42, 62], [-22, 70],
      [-18, 76], [-20, 82], [-40, 84], [-55, 82],
      [-65, 78], [-68, 76], [-60, 70], [-55, 60],
    ],
  },
  // ── CUBA (light amber) ──
  {
    color: '#ffaa44',
    points: [
      [-85, 22], [-82, 23], [-78, 23], [-75, 20],
      [-78, 19], [-82, 20], [-85, 22],
    ],
  },
  // ── HISPANIOLA (orange-red) ──
  {
    color: '#ff8833',
    points: [
      [-74, 20], [-72, 20], [-69, 19], [-68, 18],
      [-72, 18], [-74, 19], [-74, 20],
    ],
  },
  // ── CENTRAL AMERICA (muted orange) ──
  {
    color: '#ee7722',
    points: [
      [-86, 16], [-84, 14], [-83, 10], [-82, 8],
      [-80, 8], [-78, 8], [-77, 8], [-82, 10],
      [-84, 11], [-86, 12], [-88, 14], [-90, 14],
      [-92, 15], [-92, 18], [-88, 18], [-86, 16],
    ],
  },
  // ── SOUTH AMERICA (bright yellow) ──
  {
    color: '#ffdd00',
    points: [
      [-80, 12], [-75, 12], [-70, 12], [-63, 10],
      [-60, 8], [-55, 5], [-52, 4], [-50, 2],
      [-48, -2], [-45, -3], [-42, -3], [-38, -5],
      [-35, -6], [-35, -10], [-37, -14], [-39, -16],
      [-40, -20], [-42, -23], [-44, -23], [-46, -24],
      [-48, -28], [-50, -30], [-52, -33], [-55, -35],
      [-58, -38], [-62, -40], [-65, -42], [-66, -45],
      [-68, -50], [-70, -52], [-74, -50], [-75, -46],
      [-72, -42], [-72, -38], [-71, -30], [-70, -18],
      [-75, -15], [-78, -5], [-80, 0], [-78, 5],
      [-77, 8], [-80, 12],
    ],
  },
  // ── ICELAND (pale cyan) ──
  {
    color: '#aaffee',
    points: [
      [-24, 64], [-22, 63], [-18, 63], [-14, 65],
      [-14, 66], [-18, 67], [-22, 66], [-24, 64],
    ],
  },
  // ── IRELAND (bright magenta) ──
  {
    color: '#ee55ff',
    points: [
      [-10, 51], [-8, 51], [-6, 52], [-6, 53],
      [-8, 54], [-10, 54], [-10, 53], [-9, 52], [-10, 51],
    ],
  },
  // ── GREAT BRITAIN (deep purple) ──
  {
    color: '#cc33dd',
    points: [
      [-5, 50], [-3, 50], [0, 51], [2, 53],
      [0, 54], [-1, 55], [-2, 56], [-3, 57],
      [-5, 58], [-6, 57], [-5, 56], [-4, 54],
      [-3, 53], [-4, 52], [-5, 51], [-5, 50],
    ],
  },
  // ── SCANDINAVIA + NORTHERN EUROPE (violet) ──
  {
    color: '#bb44ee',
    points: [
      [-10, 36], [-8, 38], [-5, 40], [-8, 44],
      [-5, 44], [-2, 48], [0, 49], [2, 51],
      [5, 54], [8, 55], [10, 56], [12, 55],
      [14, 55], [16, 56], [18, 58], [20, 60],
      [22, 62], [25, 65], [28, 70], [30, 70],
      [32, 68], [30, 64], [28, 60], [26, 56],
      [24, 54], [22, 54], [20, 54], [18, 54],
      [16, 54], [14, 54], [12, 54], [10, 54],
      [8, 54], [6, 52], [4, 52], [2, 51],
      [0, 48], [-2, 44], [-4, 40], [-6, 38],
      [-10, 36],
    ],
  },
  // ── ITALY (blue-purple) ──
  {
    color: '#9955ff',
    points: [
      [7, 44], [8, 46], [12, 46], [14, 46],
      [16, 42], [18, 40], [16, 38], [13, 38],
      [15, 40], [14, 42], [12, 44], [7, 44],
    ],
  },
  // ── GREECE + BALKANS (magenta-purple) ──
  {
    color: '#aa33cc',
    points: [
      [20, 42], [22, 42], [24, 42], [26, 42],
      [28, 41], [28, 38], [26, 36], [24, 36],
      [22, 37], [20, 38], [20, 40], [20, 42],
    ],
  },
  // ── IBERIAN PENINSULA (bright purple) ──
  {
    color: '#cc44ff',
    points: [
      [-10, 36], [-8, 38], [-5, 40], [-2, 43],
      [0, 43], [3, 42], [3, 40], [0, 38],
      [-2, 37], [-5, 36], [-8, 36], [-10, 36],
    ],
  },
  // ── AFRICA (hot pink) ──
  {
    color: '#ff2299',
    points: [
      [-18, 35], [-17, 33], [-13, 33], [-10, 32],
      [-6, 35], [-2, 36], [0, 36], [5, 36],
      [10, 37], [12, 35], [10, 32], [10, 30],
      [12, 32], [15, 32], [20, 33], [25, 32],
      [30, 30], [32, 30], [35, 30], [38, 28],
      [40, 20], [42, 14], [50, 12], [50, 8],
      [48, 5], [44, 0], [42, -2], [40, -8],
      [40, -12], [38, -15], [36, -18], [35, -22],
      [33, -26], [30, -30], [28, -33], [26, -34],
      [22, -35], [18, -35], [16, -33], [18, -30],
      [20, -28], [25, -26], [28, -22], [32, -18],
      [35, -14], [38, -8], [40, -4], [38, 0],
      [36, 4], [34, 6], [30, 8], [28, 10],
      [22, 12], [18, 14], [14, 14], [10, 10],
      [8, 6], [5, 4], [2, 4], [-2, 5],
      [-8, 5], [-12, 8], [-16, 12], [-17, 15],
      [-16, 18], [-16, 22], [-14, 24], [-8, 32],
      [-5, 34], [-10, 36], [-14, 36], [-18, 35],
    ],
  },
  // ── MADAGASCAR (light pink) ──
  {
    color: '#ff44bb',
    points: [
      [44, -12], [48, -14], [50, -16], [50, -20],
      [48, -24], [44, -26], [44, -22], [44, -18],
      [44, -14], [44, -12],
    ],
  },
  // ── ARABIAN PENINSULA (amber-orange) ──
  {
    color: '#ff9944',
    points: [
      [35, 30], [38, 28], [40, 20], [42, 16],
      [44, 14], [48, 14], [52, 16], [56, 22],
      [56, 26], [54, 26], [52, 24], [50, 26],
      [48, 28], [46, 28], [44, 30], [42, 30],
      [40, 32], [38, 32], [35, 30],
    ],
  },
  // ── INDIA (bright cyan) ──
  {
    color: '#00eeff',
    points: [
      [68, 35], [72, 34], [76, 35], [80, 34],
      [84, 28], [88, 28], [92, 26], [92, 22],
      [88, 22], [86, 18], [82, 14], [80, 10],
      [78, 8], [76, 10], [74, 14], [72, 18],
      [72, 22], [68, 24], [68, 30], [68, 35],
    ],
  },
  // ── SRI LANKA (deep teal) ──
  {
    color: '#00bbdd',
    points: [
      [80, 10], [81, 8], [82, 7], [81, 6],
      [80, 6], [80, 8], [80, 10],
    ],
  },
  // ── ASIA MAINLAND (bright green) ──
  {
    color: '#00ff88',
    points: [
      [28, 70], [40, 68], [50, 68], [60, 70],
      [70, 72], [80, 72], [100, 72], [120, 70],
      [140, 62], [150, 60], [155, 58], [162, 60],
      [170, 62], [180, 66], [180, 72], [170, 72],
      [160, 68], [150, 62], [145, 55], [142, 50],
      [138, 48], [135, 42], [130, 35], [128, 35],
      [130, 42], [132, 46], [135, 50], [130, 55],
      [120, 58], [110, 55], [100, 52], [90, 50],
      [80, 50], [70, 55], [60, 55], [55, 52],
      [50, 48], [45, 45], [40, 42], [35, 42],
      [30, 42], [28, 48], [28, 55], [28, 62],
      [28, 70],
    ],
  },
  // ── CHINA + KOREA (medium green) ──
  {
    color: '#00cc66',
    points: [
      [74, 40], [80, 42], [90, 48], [100, 50],
      [110, 48], [118, 42], [122, 40], [125, 40],
      [128, 38], [130, 35], [128, 32], [122, 30],
      [118, 24], [112, 22], [110, 18], [108, 16],
      [106, 18], [100, 22], [98, 18], [92, 22],
      [88, 28], [84, 28], [80, 34], [76, 35],
      [72, 34], [68, 35], [68, 40], [74, 40],
    ],
  },
  // ── SOUTHEAST ASIA MAINLAND (lime) ──
  {
    color: '#aaff00',
    points: [
      [100, 22], [104, 20], [106, 18], [108, 16],
      [108, 12], [106, 10], [104, 8], [102, 4],
      [100, 2], [100, 6], [98, 10], [96, 14],
      [98, 18], [100, 22],
    ],
  },
  // ── SUMATRA (darker lime) ──
  {
    color: '#88dd00',
    points: [
      [96, 6], [98, 4], [100, 2], [104, -2],
      [106, -4], [106, -6], [104, -6], [100, -4],
      [98, 0], [96, 4], [96, 6],
    ],
  },
  // ── JAVA (bright yellow-lime) ──
  {
    color: '#ccff22',
    points: [
      [106, -6], [108, -6], [112, -7], [114, -8],
      [116, -8], [114, -7], [110, -6], [106, -6],
    ],
  },
  // ── BORNEO (warm lime) ──
  {
    color: '#99ee11',
    points: [
      [108, 6], [112, 4], [116, 4], [118, 2],
      [118, -2], [116, -4], [112, -4], [108, -2],
      [108, 2], [108, 6],
    ],
  },
  // ── SULAWESI (teal-green) ──
  {
    color: '#44dd66',
    points: [
      [120, 2], [122, 0], [124, -2], [122, -4],
      [120, -4], [118, -2], [120, 0], [120, 2],
    ],
  },
  // ── PHILIPPINES (yellow-green) ──
  {
    color: '#bbff44',
    points: [
      [118, 18], [120, 18], [122, 16], [124, 12],
      [126, 8], [124, 6], [122, 8], [120, 10],
      [118, 12], [118, 16], [118, 18],
    ],
  },
  // ── TAIWAN (emerald) ──
  {
    color: '#22cc88',
    points: [
      [120, 26], [122, 25], [122, 22], [120, 22],
      [120, 24], [120, 26],
    ],
  },
  // ── JAPAN — HONSHU (bright red) ──
  {
    color: '#ff3333',
    points: [
      [130, 34], [132, 34], [134, 34], [136, 36],
      [138, 38], [140, 40], [140, 42], [138, 40],
      [136, 36], [134, 34], [132, 34], [130, 34],
    ],
  },
  // ── JAPAN — HOKKAIDO (dark red) ──
  {
    color: '#dd2222',
    points: [
      [140, 42], [142, 44], [145, 44], [146, 42],
      [144, 42], [142, 42], [140, 42],
    ],
  },
  // ── JAPAN — KYUSHU (light red) ──
  {
    color: '#ff5544',
    points: [
      [130, 34], [132, 34], [132, 32], [130, 30],
      [130, 32], [130, 34],
    ],
  },
  // ── AUSTRALIA (amber) ──
  {
    color: '#ffaa00',
    points: [
      [115, -14], [120, -14], [128, -14], [132, -12],
      [136, -12], [140, -16], [144, -14], [148, -18],
      [152, -22], [154, -26], [154, -30], [152, -33],
      [148, -36], [144, -38], [140, -38], [136, -36],
      [132, -34], [128, -32], [124, -32], [118, -34],
      [116, -32], [114, -28], [114, -22], [115, -18],
      [115, -14],
    ],
  },
  // ── TASMANIA (dark amber) ──
  {
    color: '#dd9900',
    points: [
      [144, -40], [148, -40], [148, -43], [146, -44],
      [144, -43], [144, -40],
    ],
  },
  // ── NEW ZEALAND — NORTH ISLAND (coral) ──
  {
    color: '#ff6655',
    points: [
      [174, -35], [176, -36], [178, -38], [176, -40],
      [174, -40], [174, -38], [174, -36], [174, -35],
    ],
  },
  // ── NEW ZEALAND — SOUTH ISLAND (dark coral) ──
  {
    color: '#ee5544',
    points: [
      [168, -42], [170, -42], [174, -42], [174, -44],
      [172, -46], [170, -46], [168, -46], [166, -44],
      [168, -42],
    ],
  },
  // ── NEW GUINEA (yellow-green) ──
  {
    color: '#66cc00',
    points: [
      [132, -2], [136, -2], [140, -2], [144, -4],
      [148, -6], [150, -6], [152, -4], [150, -2],
      [146, -2], [142, -2], [138, -2], [134, -4],
      [132, -2],
    ],
  },
];

/* ── Rendering constants ───────────────────────────────────────────── */
const LAND_CHARS = ['+', '#', '▓'];
const OCEAN_CHARS = ['·', '~', '≋'];
const DESKTOP_GLOBE_CELLS = 90;
const MOBILE_GLOBE_CELLS = 34;
const MAX_FPS = 30;
const FRAME_BUDGET = 1000 / MAX_FPS;
const DEG_PER_SEC = 14;
const LAND_CACHE = new Map<string, string | null>();

/* ── Precompute bounding boxes for early-exit polygon testing ──────── */
const POLY_BBOXES = CONTINENTS.map((c) => {
  const lons = c.points.map((p) => p[0]);
  const lats = c.points.map((p) => p[1]);
  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
});

/* ── Geometry helpers ──────────────────────────────────────────────── */
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
  // 0.5-degree cache resolution for finer coastlines
  const key = `${Math.round(lon * 2) / 2}:${Math.round(lat * 2) / 2}`;
  const cached = LAND_CACHE.get(key);

  if (cached !== undefined) return cached;

  for (let i = 0; i < CONTINENTS.length; i++) {
    const bbox = POLY_BBOXES[i];
    if (lon < bbox.minLon || lon > bbox.maxLon || lat < bbox.minLat || lat > bbox.maxLat) continue;
    if (pointInPolygon(lon, lat, CONTINENTS[i].points)) {
      LAND_CACHE.set(key, CONTINENTS[i].color);
      return CONTINENTS[i].color;
    }
  }

  LAND_CACHE.set(key, null);
  return null;
}

/* ── Color utilities ───────────────────────────────────────────────── */
function hexRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

/* ── ASCII globe renderer ──────────────────────────────────────────── */
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

/* ── Globe cell builder ────────────────────────────────────────────── */
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

/* ── Component ─────────────────────────────────────────────────────── */
export default function CompassGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useDeviceTier();
  const shouldAnimate = tier !== 'minimal';
  const cellsPerSide = tier === 'full' ? DESKTOP_GLOBE_CELLS : MOBILE_GLOBE_CELLS;
  const frameBudget = tier === 'full' ? FRAME_BUDGET : FRAME_BUDGET * 2;
  const rotationSpeed = tier === 'full' ? DEG_PER_SEC : DEG_PER_SEC * 0.7;

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
      className="pointer-events-none absolute left-1/2 top-[54%] z-0 block h-[clamp(190px,52vw,260px)] w-[clamp(190px,52vw,260px)] -translate-x-1/2 -translate-y-1/2 select-none opacity-42 sm:h-[clamp(230px,42vw,320px)] sm:w-[clamp(230px,42vw,320px)] sm:opacity-52 md:left-auto md:right-[4vw] md:top-1/2 md:h-[clamp(500px,40vw,720px)] md:w-[clamp(500px,40vw,720px)] md:translate-x-0 md:opacity-100 xl:right-[5vw]"
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
            animation: shouldAnimate ? 'moonOrbit 11s linear infinite' : 'none',
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
          width={tier === 'full' ? 800 : 620}
          height={tier === 'full' ? 800 : 620}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>
    </div>
  );
}
