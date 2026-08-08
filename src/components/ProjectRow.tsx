import type { Project } from '@/lib/types';

const PIXEL_FONT = "'Press Start 2P', 'Courier New', monospace";
const PIXEL_SIZE = 'clamp(1.4rem, 3.5vw, 2.8rem)';

const DEVICON_MAP: Record<string, string> = {
  Python: 'devicon-python-plain',
  React: 'devicon-react-original',
  TypeScript: 'devicon-typescript-plain',
  Tailwind: 'devicon-tailwindcss-plain',
  Vite: 'devicon-vitejs-plain',
  Godot: 'devicon-godot-plain',
  PyTorch: 'devicon-pytorch-original',
  Vercel: 'devicon-vercel-original',
};

interface ProjectRowProps {
  project: Project;
  index: number;
}

export default function ProjectRow({ project, index }: ProjectRowProps) {
  return (
    <div
      className="group relative border-b border-current/15 py-7 outline-none transition-colors duration-300 hover:bg-black/[0.025] md:py-9"
      data-cursor="project"
    >
      <div className="grid min-w-0 gap-4 px-0 md:grid-cols-[7rem_minmax(0,1fr)_18rem] md:items-baseline">
        <span className="font-mono text-xs text-black/35">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="min-w-0">
          <h3
            className="max-w-full break-words text-2xl font-black uppercase leading-none tracking-normal transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-[color:var(--accent-blue)] min-[390px]:text-3xl sm:text-4xl md:text-6xl cursor-pointer"
            style={project.type === 'game' ? { fontFamily: PIXEL_FONT, fontSize: PIXEL_SIZE } : undefined}
          >
            {project.title}
          </h3>
          <p className="mt-3 max-w-2xl font-mono text-sm leading-relaxed text-black/60">
            {project.tagline}
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45 md:justify-end">
          <span>{project.type}</span>
          <span>/</span>
          <span>{project.status}</span>
          <span>/</span>
          <span>{project.year}</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 pl-0 md:pl-28">
        {project.stack.map((item) => {
          const iconClass = DEVICON_MAP[item];
          const labelFont =
            project.type === 'game'
              ? { fontFamily: PIXEL_FONT, fontSize: '0.6rem' }
              : { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem' };
          return (
            <span
              key={item}
              className="group/pill inline-flex items-center overflow-hidden py-1 pl-1 transition-all duration-300 hover:pl-2 hover:pr-2"
              aria-label={item}
            >
              <i className={`${iconClass} text-base leading-none shrink-0`} />
              <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-300 group-hover/pill:ml-2 group-hover/pill:max-w-[10rem] group-hover/pill:opacity-100">
                <span
                  className="uppercase tracking-[0.14em] text-black/60"
                  style={labelFont}
                >
                  {item}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
