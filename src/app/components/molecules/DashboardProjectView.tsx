"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { Button } from "../atoms";
import { ProjectService } from "@/app/services/projectService";
import { useEffect, useState } from "react";
import {
  FolderOpen,
  Users,
  User,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "../atoms/LoadingPage";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import { UserProject } from "@/app/models/UserProject";

const DashboardProjectView = () => {
  const [projects, setProjects] = useState<UserProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loggedUser = useAtomValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!loggedUser || !loggedUser.id) {
          setProjects([]);
          return;
        }
        const data = await ProjectService.getAllProjectByUserAsync();
        setProjects(data || []);
      } catch (error) {
        console.error("Erro ao carregar projetos:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleRedirect = async (path: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      router.push(path);
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast.error("Erro ao redirecionar", {
        description: "Ocorreu um problema ao navegar. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingOverlay />
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FolderOpen className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-300" />
              Meus Projetos
            </CardTitle>
            <CardDescription className="mt-1">
              {projects.length}{" "}
              {projects.length === 1 ? "projeto ativo" : "projetos ativos"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="bg-primary text-white" onClick={() => handleRedirect("/www/project/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="h-80">
        <div className="p-6 pt-0">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Você ainda não participa de nenhum projeto
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Projeto
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.projectId}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                          {project.projectName}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              <User className="w-3 h-3 mr-1" />
                              {project.userProjectRole.toString() == "Administrator" ? "Administrador" : "Contribuidor"}
                            </span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {project.projectDescription}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>
                            {project.totalContributors}{" "}
                            {project.totalContributors === 1
                              ? "colaborador"
                              : "colaboradores"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRedirect("/www/project/view/" + project.projectId)}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {projects.length > 0 && (
        <div className="px-6 pb-6">
          <Button
            variant="outline"
            className="w-full bg-primary text-white"
            onClick={() => handleRedirect("/www/project/list")}
          >
            Ver Todos os Projetos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DashboardProjectView;
