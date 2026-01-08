import { useProjects } from "@/hooks/use-projects";
import ProjectCard from "./ProjectCard";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
  const { data: projects, isLoading, error } = useProjects();

  // Fallback dummy data if no projects exist in DB yet
  const dummyProjects = [
    {
      id: 1,
      title: "Neon Finance Dashboard",
      description: "A futuristic financial analytics platform featuring real-time data visualization, AI-driven predictions, and a dark mode interface optimized for trading professionals.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
      projectUrl: "#",
      tags: ["React", "D3.js", "TypeScript"],
      featured: true
    },
    {
      id: 2,
      title: "Cyberpunk Social",
      description: "Decentralized social network built on blockchain technology. Features end-to-end encryption, NFT profile pictures, and zero-knowledge proof authentication.",
      imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
      projectUrl: "#",
      tags: ["Web3", "Solidity", "Next.js"],
      featured: true
    },
    {
      id: 3,
      title: "Zenith AI Assistant",
      description: "Voice-activated AI assistant for developers. Integrates with IDEs to suggest code optimizations and automate repetitive tasks using natural language processing.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
      projectUrl: "#",
      tags: ["Python", "OpenAI", "TensorFlow"],
      featured: false
    }
  ];

  const displayProjects = (projects && projects.length > 0) ? projects : dummyProjects;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        Failed to load projects. Please try again later.
      </div>
    );
  }

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
            Selected <span className="text-gradient-magenta">Works</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A curated selection of projects that push the boundaries of design and engineering.
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
