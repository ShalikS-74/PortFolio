import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

// We don't have mutation hooks for this scope, only read operations for the portfolio
// But I will implement them as per instructions for completeness if needed, 
// though the prompt implies a portfolio view. I'll stick to the requested API methods.

export function useProjects() {
  return useQuery({
    queryKey: [api.projects.list.path],
    queryFn: async () => {
      const res = await fetch(api.projects.list.path);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();
      return api.projects.list.responses[200].parse(data);
    },
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: [api.projects.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.projects.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch project");
      const data = await res.json();
      return api.projects.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}
