import { v4 as uuidv4 } from "uuid";
import { Project } from "../models/Project";
import CreateProjectRequest from "../models/requests/createProjectRequest";
import api from "../config/axiosConfig";
import { PaginatedRequest } from "../models/requests/paginatedRequest";
import { GetCurrentUsersProject } from "../models/responses/getCurrentUserProjectsResponse";

const PROJECTS_KEY = "projects";

export const ProjectService = {
  getAllProjects: (): Project[] => {
    if (typeof window === "undefined") return [];
    const projectsJson = localStorage.getItem(PROJECTS_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
  },

  saveProject: (project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = { ...project, id: uuidv4(), createdAt: new Date() };
    const projects = ProjectService.getAllProjects();
    projects.push(newProject);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  saveProjectAsync: async (project: CreateProjectRequest): Promise<void> => {
    const response = await api.post("/projects/create", project);
    if (response.status === 400) {
      throw new Error(response.data.message);
    }
    if (response.status !== 201) {
      throw new Error("Erro interno ao salvar projeto, contacte o administrador.");
    }
  },

  deleteProject: (id: string) => {
    const projects = ProjectService.getAllProjects().filter(
      (project) => project.id !== id
    );
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  getById: (id: string | undefined): Project | undefined => {
    const project = ProjectService.getAllProjects().find(
      (project) => project.id === id
    );
    return project;
  },

  getAllProjectsByUser: (id: string): Project[] => {
    if (typeof window === "undefined") return [];

    const projects = ProjectService.getAllProjects();

    return projects.filter(
      (project) => project.adminId === id || project.contributors.includes(id)
    );
  },

  getAllProjectsByUserAsync: async (paginatedRequest: PaginatedRequest): Promise<GetCurrentUsersProject> => {
    const response = await api.get(`/projects/getCurrentUserProjects?page=${paginatedRequest.page}&pageSize=${paginatedRequest.pageSize}`);

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    
    return response.data.data as GetCurrentUsersProject;
  },

  updateProjectContributors: async (
    projectId: string,
    newContributors: string[]
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const projects: Project[] = ProjectService.getAllProjects();
        const projectIndex = projects.findIndex(
          (p: Project) => p.id === projectId
        );

        if (projectIndex !== -1) {
          const updatedProject = {
            ...projects[projectIndex],
            contributors: newContributors,
          };

          projects[projectIndex] = updatedProject;
          localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
          resolve();
        } else {
          reject(new Error("Projeto não encontrado."));
        }
      }, 500);
    });
  },

  updateProject: async (updatedProjectData: Project): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const projects: Project[] = ProjectService.getAllProjects();
        const projectIndex = projects.findIndex(
          (p: Project) => p.id === updatedProjectData.id
        );

        if (projectIndex !== -1) {
          projects[projectIndex] = {
            ...updatedProjectData,
            createdAt: projects[projectIndex].createdAt
          };
          localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
          resolve();
        } else {
          reject(new Error("Projeto não encontrado para atualização."));
        }
      }, 500); 
    });
  },
};