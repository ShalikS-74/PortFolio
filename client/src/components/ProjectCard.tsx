import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@shared/schema';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Use vanilla JS for tilt to keep it lightweight without full R3F canvas overhead for every card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg rotation
    const rotateY = ((x - centerX) / centerX) * 5;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    
    // Shine effect calculation
    const shine = cardRef.current.querySelector('.shine') as HTMLElement;
    if (shine) {
      shine.style.opacity = '1';
      shine.style.transform = `translate(${x}px, ${y}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    
    const shine = cardRef.current.querySelector('.shine') as HTMLElement;
    if (shine) {
      shine.style.opacity = '0';
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative h-[450px] w-full cursor-pointer group"
    >
      <div 
        ref={cardRef}
        className="relative w-full h-full rounded-2xl bg-card border border-white/10 overflow-hidden shadow-xl transition-all duration-100 ease-out preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Shine Effect */}
        <div 
          className="shine absolute w-96 h-96 bg-white/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-0 z-20 mix-blend-overlay"
        />

        {/* Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={project.imageUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000"} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
          <div className="transform translate-z-10 group-hover:-translate-y-2 transition-transform duration-300">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags?.map((tag, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/5 rounded-full text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-2xl font-bold font-display text-white mb-2">{project.title}</h3>
            <p className="text-gray-400 line-clamp-3 mb-6 text-sm leading-relaxed">
              {project.description}
            </p>

            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
              {project.projectUrl && (
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  View Live <ExternalLink size={14} />
                </a>
              )}
              <button className="flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-400 transition-colors">
                Source Code <Github size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
