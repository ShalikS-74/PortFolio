import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactCTA from '@/components/ContactCTA';
import Hero from '@/components/Hero';
import IconFlipCard from '@/components/IconFlipCard';
import LangFlipHeadline from '@/components/LangFlipHeadline';
import ManifestoSection from '@/components/ManifestoSection';
import ProjectRow from '@/components/ProjectRow';
import WordFlipCard from '@/components/WordFlipCard';
import { capabilities, projects } from '@/lib/types';
import { reveal, staggerContainer } from '@/lib/motion';

function SectionLabel({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker: string;
}) {
  return (
    <div className="mb-10 grid gap-4 border-t border-black/15 pt-5 font-mono uppercase tracking-[0.22em] text-black/55 md:grid-cols-[7rem_1fr] md:items-start">
      <span className="text-xs">{index}</span>
      <div>
        <p className="text-xs text-black/40">{kicker}</p>
        <h2 className="mt-3 max-w-5xl break-words font-sans text-5xl font-black leading-[0.9] tracking-normal text-[color:var(--ink)] [overflow-wrap:anywhere] md:text-8xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

export default function Home() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[color:var(--ivory)] text-[color:var(--ink)] selection:bg-[color:var(--accent-blue)] selection:text-white">
      <Hero
        firstName="Shalik"
        lastInitial="S."
        portfolioLabel={`Portfolio ©${new Date().getFullYear()}`}
        status="Status: Online"
        location="Based in System"
      />

      <ManifestoSection
        index="01"
        eyebrow="Operating note"
        headline="I approach code as a laboratory, making things meant to be touched, played with, and explored rather than just consumed."
        fallbackStats={[
          { label: 'Projects Completed', value: 2 },
          { label: 'Years Studying', value: 4 },
          { label: 'Git Commits', value: 54 },
        ]}
      />

      <section id="projects" className="overflow-hidden px-6 py-20 md:px-12 md:py-32">
        <SectionLabel
          index="02"
          kicker="Selected modules"
          title="Executable work queue."
        />

        <div className="border-t border-black/15">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </section>

      <motion.section
        className="bg-[color:var(--ink)] px-6 py-24 text-[color:var(--ivory)] md:px-12 md:py-36"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px -120px 0px' }}
        variants={staggerContainer(0.08)}
      >
        <motion.div
          variants={reveal}
          className="mb-10 grid gap-4 border-t border-white/15 pt-5 font-mono uppercase tracking-[0.22em] text-white/55 md:grid-cols-[7rem_1fr]"
        >
          <span className="text-xs">03</span>
          <div>
            <p className="text-xs text-white/35">Lab stack</p>
            <h2 className="mt-3 max-w-5xl break-words font-sans text-5xl font-black leading-[0.9] tracking-normal [overflow-wrap:anywhere] md:text-8xl">
              <LangFlipHeadline
                words={[
                  { jp: 'システム', en: 'SYSTEM', color: 'var(--ivory)' },
                  { jp: 'キャパビリティ.', en: 'CAPABILITIES.', color: '#C6F135' },
                ]}
                startDelayMs={600}
                charStaggerMs={55}
                wordGapMs={90}
              />
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-px overflow-hidden bg-white/10 md:grid-cols-2">
          {capabilities.map((capability) => (
            <motion.div
              key={capability.id}
              variants={reveal}
              className="bg-[color:var(--ink)] flex gap-4 p-5 md:gap-6 md:p-8"
            >
              <div className="flex-1 min-w-0">
                <div className="mb-8 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.22em] text-white/45">
                  <span>{capability.label}</span>
                  {capability.proficiency !== undefined && (
                    <span>{capability.proficiency}%</span>
                  )}
                </div>
                <p className="min-h-20 text-2xl font-black uppercase leading-tight md:text-4xl">
                  {capability.iconItems ? (
                    <IconFlipCard
                      items={capability.iconItems}
                      delayMs={600 + capabilities.indexOf(capability) * 100}
                    />
                  ) : capability.wordPairs ? (
                    <WordFlipCard
                      wordPairs={capability.wordPairs}
                      delayMs={600 + capabilities.indexOf(capability) * 100}
                    />
                  ) : (
                    <span style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
                      {capability.jp ?? capability.detail}
                    </span>
                  )}
                </p>
              </div>
              {capability.proficiency !== undefined && (
                <div className="relative w-1 flex-shrink-0 bg-white/10 self-stretch my-1">
                  <motion.div
                    className="absolute bottom-0 left-0 w-full bg-[color:var(--accent-green)]"
                    style={{ transformOrigin: 'bottom' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: capability.proficiency / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      <ContactCTA href="https://www.linkedin.com/in/shalik-sahul-43aaa0378/" />

      <footer className="flex items-center justify-between border-t border-black/15 px-6 py-6 font-mono text-[11px] uppercase tracking-[0.22em] text-black/45 md:px-12">
        <span>Shalik S. / Portfolio</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
