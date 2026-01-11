import ProjectCard from "./ProjectCard";
import { motion } from "framer-motion";

export default function Projects() {
  // Fallback dummy data if no projects exist in DB yet
  const projects = [
    {
      id: 1,
      title: "Tkinter Red Block Game",
      description: "Survival game where you drag the red block with the mouse and dodge bouncing blue blocks; multiple difficulties, invincibility windows, and dynamic speed ramps.",
      imageUrl: "/images/tkinter-game.png",
      projectUrl: "https://github.com/ShalikS-74?tab=repositories",
      sourceUrl: "https://github.com/ShalikS-74?tab=repositories",
      tags: ["Python", "Tkinter", "Game"],
      featured: true,
    },
    {
      id: 2,
      title: "Coming soon",
      description: "Reserved slot for the next project.",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
      projectUrl: "",
      sourceUrl: "",
      tags: [],
      featured: false,
    },
    {
      id: 3,
      title: "Coming soon",
      description: "Reserved slot for the next project.",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
      projectUrl: "",
      sourceUrl: "",
      tags: [],
      featured: false,
    },
  ];

  const displayProjects = projects;

  return (
    <section id="projects" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Projects that blend <span className="text-gradient-magenta">AI, web, and play</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experiments, prototypes, and shipping work where I learn in public and iterate fast.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            // @ts-ignore - types mismatch between dummy and schema but structure is compatible for UI
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
