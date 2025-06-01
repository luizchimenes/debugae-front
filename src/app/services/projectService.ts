import { v4 as uuidv4 } from "uuid";

export interface Project {
  id: string;
  name: string;
  description: string;
  contributors: string[];
  adminId: string;
}

const PROJECTS_KEY = "projects";
export const ProjectService = {

    getAllProjects: (): Project[] => {
    if (typeof window === "undefined") return [];
    const projectsJson = localStorage.getItem(PROJECTS_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
    },

    saveProject: (project: Omit<Project, "id">) => {
    const newProject: Project = { ...project, id: uuidv4() };
    const projects = ProjectService.getAllProjects();
    projects.push(newProject);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    },

    deleteProject: (id: string) => {
    const projects = ProjectService.getAllProjects().filter((project) => project.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }

}
