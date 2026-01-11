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
      title: "Tkinter Red Block Game",
      description: "Mouse-driven survival game: move the red block to dodge bouncing blue blocks across multiple difficulties, with invincibility windows and dynamic speed ramps.",
      imageUrl: "/images/tkinter-game.png",
      projectUrl: null,
      tags: ["Python", "Tkinter", "Game"],
      featured: true
    });
    await storage.createProject({
      title: "Coming soon",
      description: "Reserved slot for the next project.",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
      projectUrl: null,
      tags: [],
      featured: false
    });
    await storage.createProject({
      title: "Coming soon",
      description: "Reserved slot for the next project.",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=1200",
      projectUrl: null,
      tags: [],
      featured: false
    });
  }

  return httpServer;
}
