"use client";

import { useEffect, useState } from "react";
import { Button, Input, Label } from "../atoms";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../atoms/CardComponent";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../atoms/SelectComponent";
import { Textarea } from "../atoms/TextAreaComponent";
import { User, UserService } from "@/app/services/userService";
import { AuthService } from "@/app/services/authService";
import { Project, ProjectService } from "@/app/services/projectService";
import { toast } from "sonner";
import { BugService } from "@/app/services/bugService";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { AcaoRealizada } from "@/app/enums/AcaoRealizada";
import { StatusDefeito } from "@/app/enums/StatusDefeito";

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_SUMMARY_LENGTH = 100;

const BugCreateForm = () => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [projectContributors, setProjectContributors] = useState<User[]>([]);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("");
  const [severity, setSeverity] = useState("");
  const [version, setVersion] = useState("");
  const [category, setCategory] = useState("");
  const [currentBehavior, setCurrentBehavior] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [stackTrace, setStackTrace] = useState("");
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  const [projectId, setProjectId] = useState("");
  const [contributorId, setContributorId] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const loggedUser: User = AuthService.getLoggedUser();

  useEffect(() => {
    setAllProjects(ProjectService.getAllProjects());
  }, []);

  useEffect(() => {
    if (!projectId) {
      setProjectContributors([]);
      setContributorId("");
      return;
    }

    const selectedProject = allProjects.find((p) => p.id === projectId);
    if (!selectedProject || !selectedProject.contributors?.length) {
      setProjectContributors([]);
      setContributorId("");
      return;
    }

    const users = UserService.getByListIds(selectedProject.contributors);
    setProjectContributors(users);
    setContributorId("");
  }, [projectId, allProjects]);

  const severityToDaysMap: Record<string, number> = {
    "1": 3,
    "2": 7,
    "3": 14,
    "4": 21,
    "5": 30,
  };

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!projectId) {
      newErrors.projectId = "O projeto é obrigatório.";
    }
    if (!contributorId) {
      newErrors.contributorId = "O responsável é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!summary.trim()) {
      newErrors.summary = "O sumário do defeito é obrigatório.";
    } else if (summary.trim().length < 5) {
      newErrors.summary = "O sumário deve ter no mínimo 5 caracteres.";
    } else if (summary.trim().length > MAX_SUMMARY_LENGTH) {
      newErrors.summary = `O sumário não pode exceder ${MAX_SUMMARY_LENGTH} caracteres.`;
    }

    if (!description.trim()) {
      newErrors.description = "A descrição do defeito é obrigatória.";
    } else if (description.trim().length < 10) {
      newErrors.description = "A descrição deve ter no mínimo 10 caracteres.";
    } else if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
      newErrors.description = `A descrição não pode exceder ${MAX_DESCRIPTION_LENGTH} caracteres.`;
    }

    if (!environment) {
      newErrors.environment = "O ambiente é obrigatório.";
    }
    if (!severity) {
      newErrors.severity = "A severidade é obrigatória.";
    }
    if (!version) {
      newErrors.version = "A versão é obrigatória.";
    }
    if (!category) {
      newErrors.category = "A categoria é obrigatória.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!expectedBehavior) {
      newErrors.environment = "O comportamento atual é obrigatório.";
    }
    if (!currentBehavior) {
      newErrors.severity = "O comportamento esperado é obrigatória.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: string,
    value: string,
    maxLength?: number
  ) => {
    if (maxLength && value.length > maxLength) {
      value = value.substring(0, maxLength);
    }

    switch (field) {
      case "summary":
        setSummary(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "environment":
        setEnvironment(value);
        break;
      case "severity":
        setSeverity(value);
        break;
      case "version":
        setVersion(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "currentBehavior":
        setCurrentBehavior(value);
        break;
      case "expectedBehavior":
        setExpectedBehavior(value);
        break;
      case "stackTrace":
        setStackTrace(value);
        break;
      case "projectId":
        setProjectId(value);
        break;
      case "contributorId":
        setContributorId(value);
        break;
      default:
        break;
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        setErrors({});
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
        setErrors({});
      }
    }
  };

  const handlePreviousStep = async (e: React.FormEvent) => {
    if (currentStep > 1) {
      e.preventDefault();
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    if (!validateStep3()) {
      setIsLoading(false);
      toast.error(
        "Por favor, preencha as informações adicionais corretamente."
      );
      return;
    }

    if (!validateStep1()) {
      setCurrentStep(1);
      setIsLoading(false);
      toast.error(
        "Por favor, preencha as informações do projeto e responsável."
      );
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      setIsLoading(false);
      toast.error("Por favor, preencha os detalhes do defeito corretamente.");
      return;
    }

    const now = new Date();
    const expirationDays = severityToDaysMap[severity] || 30;
    const expiredDate = new Date(
      now.getTime() + expirationDays * 24 * 60 * 60 * 1000
    );

    try {
      await BugService.saveBug({
        projectId,
        summary,
        description,
        environment,
        severity,
        version,
        category,
        currentBehavior,
        expectedBehavior,
        stackTrace,
        attachment,
        createdBy: loggedUser.id,
        status: StatusDefeito.NOVO,
        createdDate: new Date(),
        expiredDate,
        contributorId,
      });

      toast.success("Defeito criado com sucesso!", {
        description: "Seu defeito foi cadastrado em nosso sistema.",
        action: {
          label: "Ver Defeitos",
          onClick: () => (window.location.href = "/www/bugs/list"),
        },
      });

      setSummary("");
      setDescription("");
      setEnvironment("");
      setSeverity("");
      setVersion("");
      setCategory("");
      setCurrentBehavior("");
      setExpectedBehavior("");
      setStackTrace("");
      setAttachment(undefined);
      setProjectId("");
      setContributorId("");
      setErrors({});

      setTimeout(() => {
        window.location.href = "/www/bugs/list";
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar defeito:", error);
      toast.error("Erro ao criar defeito.", {
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const steps = [
    {
      number: 1,
      title: "Seleção do Projeto",
      description: "Projeto e Responsável",
    },
    {
      number: 2,
      title: "Informações do Defeito",
      description: "Sumário e Detalhes",
    },
    {
      number: 3,
      title: "Informações Adicionais",
      description: "Comportamento e Log",
    },
  ];

  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Cadastro de novo defeito
      </h2>
      <hr />
      <div className="flex justify-between items-center my-4 relative px-4">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="flex items-center flex-col sm:flex-row z-10"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300
                            ${
                              currentStep > step.number
                                ? "bg-green-500 border-green-500 text-white"
                                : currentStep === step.number
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <div
              className={`ml-0 sm:ml-2 mt-2 sm:mt-0 text-center sm:text-left ${currentStep >= step.number ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
            >
              <div className="font-medium">{step.title}</div>
              <div className="text-sm opacity-75 hidden md:block">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border border-primary animate-fade-in">
          <CardHeader>
            <CardTitle>Primeiro passo</CardTitle>
            <CardDescription>
              Selecione o projeto em que o defeito ocorre e o responsável
            </CardDescription>
          </CardHeader>
          <hr className="my-1 border-gray-200 dark:border-gray-700" />
          <div className="flex w-full gap-4 flex-col">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="projectId">Projeto</Label>
              <Select
                onValueChange={(value) => handleInputChange("projectId", value)}
                value={projectId}
              >
                <SelectTrigger
                  className={`w-full ${errors.projectId ? "border-red-500 dark:border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">
                      Projetos
                    </SelectLabel>
                    {allProjects.map((project: any) => (
                      <SelectItem
                        key={project.id}
                        value={project.id}
                        className="dark:text-white hover:dark:bg-gray-600"
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.projectId}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="contributorId">Responsável</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("contributorId", value)
                }
                value={contributorId}
              >
                <SelectTrigger
                  className={`w-full ${errors.contributorId ? "border-red-500 dark:border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">
                      Contribuintes
                    </SelectLabel>
                    {projectContributors.map((user: any) => (
                      <SelectItem
                        key={user.id}
                        value={user.id}
                        className="dark:text-white hover:dark:bg-gray-600"
                      >
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.contributorId && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.contributorId}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border border-primary animate-fade-in">
          <CardHeader>
            <CardTitle>Segundo passo</CardTitle>
            <CardDescription>
              Adicione as informações do defeito
            </CardDescription>
          </CardHeader>
          <hr className="my-1 border-gray-200 dark:border-gray-700" />
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="bugSummary">Sumário do defeito</Label>
              <Input
                id="bugSummary"
                value={summary}
                onChange={(e) =>
                  handleInputChange(
                    "summary",
                    e.target.value,
                    MAX_SUMMARY_LENGTH
                  )
                }
                required
                className={
                  errors.summary ? "border-red-500 dark:border-red-400" : ""
                }
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                {summary.length}/{MAX_SUMMARY_LENGTH} caracteres
              </div>
              {errors.summary && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.summary}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5 w-full">
              <Label htmlFor="bugDescription">Descrição do Defeito</Label>
              <Textarea
                id="bugDescription"
                value={description}
                onChange={(e) =>
                  handleInputChange(
                    "description",
                    e.target.value,
                    MAX_DESCRIPTION_LENGTH
                  )
                }
                className={`resize-none ${errors.description ? "border-red-500 dark:border-red-400" : ""}`}
                rows={4}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                {description.length}/{MAX_DESCRIPTION_LENGTH} caracteres
              </div>
              {errors.description && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid w-full gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugEnvironment">Ambiente</Label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("environment", value)
                }
                value={environment}
              >
                <SelectTrigger
                  className={`w-full ${errors.environment ? "border-red-500 dark:border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Selecione o ambiente" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">
                      Ambientes
                    </SelectLabel>
                    <SelectItem
                      value="Produção"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Produção
                    </SelectItem>
                    <SelectItem
                      value="Homologação"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Homologação
                    </SelectItem>
                    <SelectItem
                      value="Desenvolvimento"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Desenvolvimento
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.environment && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.environment}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugSeverity">Severidade</Label>
              <Select
                onValueChange={(value) => handleInputChange("severity", value)}
                value={severity}
              >
                <SelectTrigger
                  className={`w-full ${errors.severity ? "border-red-500 dark:border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Selecione a severidade" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">
                      Severidade
                    </SelectLabel>
                    <SelectItem
                      value="1"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Muito Alta
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Alta
                    </SelectItem>
                    <SelectItem
                      value="3"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Média
                    </SelectItem>
                    <SelectItem
                      value="4"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Baixa
                    </SelectItem>
                    <SelectItem
                      value="5"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Muito Baixa
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.severity && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.severity}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugVersion">Versão</Label>
              <Select
                onValueChange={(value) => handleInputChange("version", value)}
                value={version}
              >
                <SelectTrigger
                  className={`w-full ${errors.version ? "border-red-500 dark:border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Selecione a versão" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">
                      Versões
                    </SelectLabel>
                    <SelectItem
                      value="1.2.0"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      1.2.0
                    </SelectItem>
                    <SelectItem
                      value="1.1.2"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      1.1.2
                    </SelectItem>
                    <SelectItem
                      value="1.1.1"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      1.1.1
                    </SelectItem>
                    <SelectItem
                      value="1.1.0"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      1.1.0
                    </SelectItem>
                    <SelectItem
                      value="1.0.0"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      1.0.0
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.version && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.version}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
              <Label htmlFor="bugCategory">Categoria</Label>
              <Select
                onValueChange={(value) => handleInputChange("category", value)}
                value={category}
              >
                <SelectTrigger
                  className={`w-full ${errors.category ? "border-red-500 dark:border-red-400" : ""}`}
                >
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectGroup>
                    <SelectLabel className="text-gray-500 dark:text-gray-400">
                      Categoria
                    </SelectLabel>
                    <SelectItem
                      value="Funcional"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Funcional
                    </SelectItem>
                    <SelectItem
                      value="Interface"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Interface
                    </SelectItem>
                    <SelectItem
                      value="Performance"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Performance
                    </SelectItem>
                    <SelectItem
                      value="Melhoria"
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      Melhoria
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {currentStep === 3 && (
        <Card className="p-6 dark:bg-gray-800 rounded-lg shadow-md dark:border border-primary animate-fade-in">
          <CardHeader>
            <CardTitle>Terceiro passo</CardTitle>
            <CardDescription>
              Informações adicionais sobre o defeito
            </CardDescription>
          </CardHeader>
          <hr className="my-1 border-gray-200 dark:border-gray-700" />
          <div className="grid w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bugCurrentBehavior">Comportamento atual</Label>
              <Textarea
                id="bugCurrentBehavior"
                value={currentBehavior}
                onChange={(e) =>
                  handleInputChange("currentBehavior", e.target.value)
                }
                className="resize-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bugExpectedBehavior">
                Comportamento esperado
              </Label>
              <Textarea
                id="bugExpectedBehavior"
                value={expectedBehavior}
                onChange={(e) =>
                  handleInputChange("expectedBehavior", e.target.value)
                }
                className="resize-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bugStackTrace">Log de erro</Label>
              <Textarea
                id="bugStackTrace"
                value={stackTrace}
                onChange={(e) =>
                  handleInputChange("stackTrace", e.target.value)
                }
                className="resize-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="bugFile">Anexo</Label>
              <Input id="bugFile" type="file" onChange={handleFileChange} />
            </div>
          </div>
        </Card>
      )}

      {/* Botões de Navegação e Ação */}
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {currentStep > 1 ? (
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={isLoading}
          >
            Voltar
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/www/bugs/list")}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="bg-primary hover:bg-primary-dark text-white ml-auto"
            disabled={isLoading}
          >
            Próximo Passo
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white ml-auto"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Cadastrando...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2" />
                <span>Cadastrar Defeito</span>
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
    </form>
  );
};

export default BugCreateForm;
