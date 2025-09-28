"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/app/components/atoms/InputComponent";
import { Label } from "@/app/components/atoms/LabelComponent";
import { Textarea } from "../atoms/TextAreaComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { Button } from "../atoms";
import { ProjectService } from "@/app/services/projectService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Check,
  AlertCircle,
  User as UserIcon,
  Users as UsersIcon,
  Plus,
  X,
  CircleHelp,
} from "lucide-react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import CreateProjectRequest from "@/app/models/requests/createProjectRequest";
import { useDriverTour, type DriveStep } from "@hooks/useDriverTour";

const MAX_DESCRIPTION_LENGTH = 500;

const ProjectCreateForm = () => {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [, setSelectedContributor] = useState<
    string | undefined
  >(undefined);
  const loggedUser = useAtomValue(userAtom);
  const [contributors, setContributors] = useState<string[]>([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentContributorToAdd, setCurrentContributorToAdd] = useState("");

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};

    if (!projectName.trim()) {
      newErrors.projectName = "Nome do projeto é obrigatório.";
    } else if (projectName.trim().length < 3) {
      newErrors.projectName = "Nome deve ter no mínimo 3 caracteres.";
    }

    if (!projectDescription.trim()) {
      newErrors.projectDescription = "Descrição do projeto é obrigatória.";
    } else if (projectDescription.trim().length < 10) {
      newErrors.projectDescription =
        "Descrição deve ter no mínimo 10 caracteres.";
    } else if (projectDescription.trim().length > MAX_DESCRIPTION_LENGTH) {
      newErrors.projectDescription = `Descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddContributor = (userEmail: string) => {
    if (userEmail && !contributors.includes(userEmail)) {
      contributors.push(userEmail);
      setSelectedContributor(undefined);
      setCurrentContributorToAdd("");
    }
  };

  const handleRemoveContributor = (userEmail: string) => {
    setContributors(contributors.filter((c) => c !== userEmail));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { startTour } = useDriverTour((): DriveStep[] => [
    {
      element: "#projectNameField",
      popover: {
        title: "Nome do projeto",
        description: "Digite aqui o nome do projeto que você deseja criar.",
        side: "bottom",
      },
    },
    {
      element: "#projectDescriptionField",
      popover: {
        title: "Descrição do projeto",
        description: "Explique brevemente o propósito do projeto.",
        side: "bottom",
      },
    },
    {
      element: "#addContributor",
      popover: {
        title: "Adicionar colaboradores",
        description:
          "Inclua os e-mails das pessoas que vão participar do projeto.",
        side: "top",
      },
    },
    {
      element: "#saveProjectBtn",
      popover: {
        title: "Salvar projeto",
        description: "Clique aqui para finalizar o cadastro do projeto.",
        side: "top",
      },
    },
  ]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!validateStep1()) {
        setCurrentStep(1);
        toast.error(
          "Por favor, preencha as informações do projeto corretamente."
        );
        return;
      }

      if (!loggedUser || !loggedUser.id) {
        toast.error("Usuário não está autenticado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const request: CreateProjectRequest = {
        projectName: projectName,
        projectDescription: projectDescription,
        contributorsEmails: contributors,
      }

      await ProjectService.saveProjectAsync(request);

      setProjectName("");
      setProjectDescription("");
      setContributors([]);
      setSelectedContributor(undefined);
      setErrors({});
      setCurrentStep(1);

      toast("Projeto criado com sucesso!", {
        description: "Seu projeto foi cadastrado em nosso sistema.",
        action: {
          label: "Ver",
          onClick: () => router.push("/www/project/list"),
        },
      });

      setTimeout(() => {
        router.push("/www/project/list");
      }, 1000);
    } catch (error: any) {
      console.error("Erro ao salvar projeto:", error);
      if (error.message){
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (loggedUser && !contributors.includes(loggedUser?.email)) {
      contributors.push(loggedUser?.email || "");
    }
  }, [contributors]);

  const getContributorDetails = (email: string) => {
    return contributors.find((userEmail) => userEmail === email);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Cadastro de novo Projeto
        </h2>
        <Button
          type="button"
          onClick={startTour}
          variant="outline"
          className="group self-start sm:self-auto inline-flex items-center gap-2 rounded-full border-primary text-primary shadow-sm transition-all hover:bg-primary hover:text-white"
        >
          <CircleHelp className="w-4 h-4 transition-transform group-hover:-rotate-6" />
          Guia Interativo
        </Button>
      </div>
      <hr />
      {currentStep === 1 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Primeiro passo
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Preencha as informações do projeto
          </p>
        </div>
      )}
      {currentStep === 2 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Adicionar colaboradores
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Selecione os usuários que farão parte do projeto
          </p>
        </div>
      )}

      <div className="flex justify-center items-center my-4 relative gap-x-20">
        <div className="flex items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
                          ${
                            currentStep > 1
                              ? "bg-green-500 border-green-500 text-white"
                              : currentStep === 1
                                ? "bg-primary text-white border-primary"
                                : "bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          }`}
          >
            {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
          </div>
          <span
            className={`ml-2 text-sm font-medium hidden sm:block ${currentStep >= 1 ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            Informações Básicas
          </span>
        </div>

        <div className="flex items-center z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
                          ${
                            currentStep === 2
                              ? "bg-primary text-white border-primary"
                              : "bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          }`}
          >
            2
          </div>
          <span
            className={`ml-2 text-sm font-medium hidden sm:block ${currentStep === 2 ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            Colaboradores
          </span>
        </div>
      </div>

      {currentStep === 1 && (
        <form className="flex flex-col gap-4 animate-fade-in">
          <div id="projectNameField" className="flex flex-col space-y-1.5 w-full">
            <Label htmlFor="projectName">Nome do Projeto</Label>
            <Input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) {
                  setErrors((prev) => ({ ...prev, projectName: "" }));
                }
              }}
              required
              className={`w-full ${errors.projectName ? "border-red-500 dark:border-red-400" : ""}`}
            />
            {errors.projectName && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.projectName}
              </p>
            )}
          </div>
          <div id="projectDescriptionField" className="grid w-full gap-4">
            <Label htmlFor="projectDescription">Descrição do Projeto</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_DESCRIPTION_LENGTH) {
                  setProjectDescription(value);
                }
                if (errors.projectDescription) {
                  setErrors((prev) => ({ ...prev, projectDescription: "" }));
                }
              }}
              className={`w-full resize-none ${errors.projectDescription ? "border-red-500 dark:border-red-400" : ""}`}
              rows={4}
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
              {projectDescription.length}/{MAX_DESCRIPTION_LENGTH} caracteres
            </div>
            {errors.projectDescription && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.projectDescription}
              </p>
            )}
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <div className="flex flex-col gap-6 animate-fade-in">
          {" "}
          <div className="grid md:grid-cols-2 gap-6">
            {" "}
            <div id="addContributor">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-primary dark:text-primary-400" />
                Usuários Disponíveis
              </h3>
              <ScrollArea className="h-[200px] border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <div className="flex gap-2">
                  <Input
                    id="addContributor"
                    type="text"
                    value={currentContributorToAdd}
                    placeholder="Digite o e-mail de um usuário..."
                    onChange={(e) => {
                      setCurrentContributorToAdd(e.target.value);
                      if (errors.currentContributorToAdd) {
                        setErrors((prev) => ({ ...prev, currentContributorToAdd: "" }));
                      }
                    }}
                    required
                    className={`w-full ${errors.currentContributorToAdd ? "border-red-500 dark:border-red-400" : ""}`}
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddContributor(currentContributorToAdd)}
                    disabled={contributors.includes(currentContributorToAdd)}
                    className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    variant="ghost"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </ScrollArea>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Colaboradores do Projeto ({contributors.length})
              </h3>
              <ScrollArea className="h-[200px] border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                <div className="space-y-2">
                  {contributors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum colaborador adicionado</p>
                    </div>
                  ) : (
                    contributors.map((email) => {
                      const user = getContributorDetails(email);
                      if (!user) return null;

                      return (
                        <div
                          key={email}
                          className="flex items-center justify-between p-3 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/50"
                        >
                          <div>
                            <div className="font-medium text-gray-800 dark:text-white">
                              {email}
                            </div>
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleRemoveContributor(email)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                            variant="ghost"
                            disabled={email === loggedUser?.email}
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
      )}

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {currentStep === 1 ? (
          <Button variant="outline" onClick={() => router.back()}>
            Voltar
          </Button>
        ) : (
          <Button variant="outline" onClick={handlePreviousStep}>
            Voltar
          </Button>
        )}

        {currentStep === 1 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            Próximo Passo
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            id="saveProjectBtn"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Cadastrando...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" />
                <span>Cadastrar Projeto</span>
              </div>
            )}
          </Button>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProjectCreateForm;
