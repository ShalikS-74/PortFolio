import { type Project, type InsertProject } from "@shared/schema";

export interface IStorage {
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}

// In-memory storage for portfolio (no database needed)
export class InMemoryStorage implements IStorage {
  private projects: Project[] = [];
  private nextId = 1;

  async getProjects(): Promise<Project[]> {
    return this.projects;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
      id: this.nextId++,
      featured: false,
      ...insertProject,
      tags: insertProject.tags || [],
      projectUrl: insertProject.projectUrl || null,
    };
    this.projects.push(project);
    return project;
  }
}

export const storage = new InMemoryStorage();
