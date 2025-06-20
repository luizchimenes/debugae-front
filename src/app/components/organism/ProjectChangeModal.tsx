"use client";

import { useEffect, useState } from "react";
import { Input } from "@/app/components/atoms/InputComponent";
import { Label } from "@/app/components/atoms/LabelComponent";
import { Textarea } from "@/app/components/atoms/TextAreaComponent";
import { ScrollArea } from "@/app/components/atoms/ScrollAreaComponent";
import { User, UserService } from "@/app/services/userService";
import { Button } from "@/app/components/atoms";
import { Project, ProjectService } from "@/app/services/projectService";
import { toast } from "sonner";
import {
  AlertCircle,
  User as UserIcon,
  Users as UsersIcon,
  Plus,
  X,
  FileText, 
} from "lucide-react";

const MAX_DESCRIPTION_LENGTH = 500;

interface ProjectEditModalProps {
  show: boolean;
  onClose: () => void;
  project: Project | null;
  onProjectUpdated: (updatedProject: Project) => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  show,
  onClose,
  project,
  onProjectUpdated,
}) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(project);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<string[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && project) {
      setCurrentProject(project);
      setProjectName(project.name);
      setProjectDescription(project.description);
      setSelectedContributors(project.contributors);
      setAllUsers(UserService.getAll()); 
      setErrors({}); 
    }
  }, [show, project]);

  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!projectName.trim()) {
      newErrors.projectName = "Nome do projeto é obrigatório.";
    } else if (projectName.trim().length < 3) {
      newErrors.projectName = "Nome deve ter no mínimo 3 caracteres.";
    }

    if (!projectDescription.trim()) {
      newErrors.projectDescription = "Descrição do projeto é obrigatória.";
    } else if (projectDescription.trim().length < 10) {
      newErrors.projectDescription = "Descrição deve ter no mínimo 10 caracteres.";
    } else if (projectDescription.trim().length > MAX_DESCRIPTION_LENGTH) {
      newErrors.projectDescription = `Descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContributor = (userId: string) => {
    if (userId && !selectedContributors.includes(userId)) {
      setSelectedContributors((prev) => [...prev, userId]);
    }
  };

  const handleRemoveContributor = (id: string) => {
    setSelectedContributors((prev) => prev.filter((c) => c !== id));
  };

  const handleSave = async () => {
    if (!project) return;

    setIsLoading(true);
    try {
      if (!validateForm()) {
        toast.error("Por favor, preencha todas as informações corretamente.");
        return;
      }

      const updatedProject: Project = {
        ...project,
        name: projectName,
        description: projectDescription,
        contributors: selectedContributors,
      };

      await ProjectService.updateProject(updatedProject);

      toast.success("Projeto atualizado com sucesso!", {
        description: "As informações do projeto foram salvas.",
      });

      onProjectUpdated(updatedProject);
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      toast.error("Erro ao atualizar projeto.", {
        description: "Ocorreu um erro ao salvar o projeto. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getContributorDetails = (id: string) => {
    return allUsers.find((user) => user.id === id);
  };

  if (!show || !currentProject) return null;

  const hasChanges =
    projectName !== currentProject.name ||
    projectDescription !== currentProject.description ||
    JSON.stringify(selectedContributors.sort()) !==
      JSON.stringify(currentProject.contributors.sort());

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-[100vh] mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Editar Projeto: {currentProject.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <hr className="mb-4" />

        <div className="flex flex-col gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              Informações do Projeto
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="editProjectName">Nome do Projeto</Label>
                <Input
                  id="editProjectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (errors.projectName) {
                      setErrors((prev) => ({ ...prev, projectName: "" }));
                    }
                  }}
                  required
                  className={`w-full ${
                    errors.projectName ? "border-red-500 dark:border-red-400" : ""
                  }`}
                />
                {errors.projectName && (
                  <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.projectName}
                  </p>
                )}
              </div>
              <div className="grid w-full gap-4">
                <Label htmlFor="editProjectDescription">Descrição do Projeto</Label>
                <Textarea
                  id="editProjectDescription"
                  value={projectDescription}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= MAX_DESCRIPTION_LENGTH) {
                      setProjectDescription(value);
                    }
                    if (errors.projectDescription) {
                      setErrors((prev) => ({
                        ...prev,
                        projectDescription: "",
                      }));
                    }
                  }}
                  className={`w-full resize-none ${
                    errors.projectDescription ? "border-red-500 dark:border-red-400" : ""
                  }`}
                  rows={4}
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                  {projectDescription.length}/{MAX_DESCRIPTION_LENGTH} caracteres
                </div>
                {errors.projectDescription && (
                  <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.projectDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Gerenciar Colaboradores
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-primary dark:text-primary-400" />
                  Usuários Disponíveis
                </h3>
                <ScrollArea className="h-[200px] border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <div className="space-y-2">
                    {allUsers.map((user: User) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleAddContributor(user.id)}
                          disabled={selectedContributors.includes(user.id)}
                          className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          variant="ghost"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Colaboradores do Projeto ({selectedContributors.length})
                </h3>
                <ScrollArea className="h-[200px] border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  <div className="space-y-2">
                    {selectedContributors.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhum colaborador adicionado</p>
                      </div>
                    ) : (
                      selectedContributors.map((id) => {
                        const user = getContributorDetails(id);
                        if (!user) return null;

                        return (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-3 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/50"
                          >
                            <div>
                              <div className="font-medium text-gray-800 dark:text-white">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleRemoveContributor(user.id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              variant="ghost"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Salvando...</span>
              </div>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditModal;