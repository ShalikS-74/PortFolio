import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  // Seed data
  const existing = await storage.getProjects();
  if (existing.length === 0) {
    await storage.createProject({
      title: "Neon Horizon",
      description: "A futuristic dashboard visualization.",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      tags: ["React", "Three.js", "WebGL"],
      featured: true
    });
    await storage.createProject({
      title: "Cyberpunk City",
      description: "Immersive 3D environment exploration.",
      imageUrl: "https://images.unsplash.com/photo-1515630278258-407f66498911",
      tags: ["Framer Motion", "Tailwind"],
      featured: true
    });
    await storage.createProject({
      title: "Digital Nexus",
      description: "Connectivity platform for the future.",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      tags: ["TypeScript", "Drizzle"],
      featured: false
    });
  }

  return httpServer;
}
