"use client";

import { X, Loader2, AlertCircle } from "lucide-react";
import { DefectSeverity } from "@/app/enums/DefectSeverity";
import { StatusDefeito } from "@/app/enums/StatusDefeito";
import { DefectCategory } from "@/app/enums/DefectCategory";
import { DefectEnvironment } from "@/app/enums/DefectEnvironment";
import React, { useState, useEffect } from "react";
import { Button, Label } from "../atoms";
import { BugService } from "@/app/services/bugService";
import { Bug } from "@/app/models/Bug";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../atoms/SelectComponent";
import { stat } from "fs";
import { GetProjectDetailsResponse } from "@/app/models/responses/getProjectDetailsResponse";
import { ProjectService } from "@/app/services/projectService";

interface EditBugModalProps {
  show: boolean;
  onClose: () => void;
  bug: Bug;
  onBugUpdated: (updatedBug: Bug) => void;
}

const EditBugModal: React.FC<EditBugModalProps> = ({
  show,
  onClose,
  bug,
  onBugUpdated,
}) => {
  const [description, setDescription] = useState<string>(bug.details?.defectDescription || "");
  const [environment, setEnvironment] = useState<string>(String(bug.details?.defectEnvironment || ""));
  const [severity, setSeverity] = useState<string>(String(bug.defectSeverity || ""));
  const [status, setStatus] = useState<string>(String(bug.defectStatus || ""));
  const [category, setCategory] = useState<string>(String(bug.defectCategory || ""));
  const [currentBehavior, setCurrentBehavior] = useState<string>(bug.details?.actualBehaviour || "");
  const [expectedBehavior, setExpectedBehavior] = useState<string>(bug.details?.expectedBehaviour || "");
  const [stackTrace, setStackTrace] = useState<string>(bug.logStackTrace || "");
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<GetProjectDetailsResponse | null>(null);
  const [contributorId, setContributorId] = useState("");


  useEffect(() => {
    if (bug) {
      setDescription(bug.details?.defectDescription || "");
      setEnvironment(String(bug.details?.defectEnvironment || ""));
      setSeverity(String(bug.defectSeverity || ""));
      setStatus(String(bug.defectStatus || ""));
      setCategory(String(bug.defectCategory || ""));
      setCurrentBehavior(bug.details?.actualBehaviour || "");
      setExpectedBehavior(bug.details?.expectedBehaviour || "");
      setStackTrace(bug.logStackTrace || "");
      setContributorId(bug.responsibleContributor?.contributorEmail || "");
    }
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const projectDetails = await ProjectService.getProjectDetailsAsync(bug.projectId);
        setProject(projectDetails);
      } catch {
        toast.error("Erro ao carregar detalhes do projeto.");
      } finally {
        setLoading(false);
      }
    };
    if (bug) {
      fetchProjectDetails();
    }
  }, [bug]);

  const handleConfirmEdit = async () => {
    setUpdating(true);
    try {
      const environmentMap: { [key: string]: number } = {
        Development: 1,
        Testing: 2,
        Production: 3,
      };
      const severityMap: { [key: string]: number } = {
        VeryHigh: 1,
        High: 2,
        Medium: 3,
        Low: 4,
        VeryLow: 5,
      };
      const statusMap: { [key: string]: number } = {
        Resolved: 1,
        Invalid: 2,
        Reopened: 3,
        InProgress: 4,
        WaitingForUser: 5,
        New: 6,
      };
      const categoryMap: { [key: string]: number } = {
        Functional: 1,
        Interface: 2,
        Performance: 3,
        Improvement: 4,
      };
      const updatePayload = {
        defectId: bug.defectId,
        newDescription: description,
        newEnvironment: environmentMap[environment],
        newSeverity: severityMap[severity],
        newStatus: statusMap[status],
        newCategory: categoryMap[category],
        newCurrentBehaviour: currentBehavior,
        newExpectedBehaviour: expectedBehavior,
        newStackTrace: stackTrace,
        newAssignedToContributorEmail: contributorId
      };
      await BugService.updateDefectDetailsAsync(updatePayload);
      const fetchedUpdatedBug = await BugService.getBugByIdAsync(bug.defectId);
      if (fetchedUpdatedBug) {
        onBugUpdated(fetchedUpdatedBug);
      }
      onClose();
      toast.success("Defeito atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar defeito:", error);
      toast.error("Erro ao atualizar defeito");
    } finally {
      setUpdating(false);
    }
  };

  if (!show) return null;

  const handleInputChange = (
    field: string,
    value: string,
    maxLength?: number
  ) => {
    if (maxLength && value.length > maxLength) {
      value = value.substring(0, maxLength);
    }

    switch (field) {
      case "description":
        setDescription(value);
        break;
      case "environment":
        setEnvironment(value);
        break;
      case "severity":
        setSeverity(value);
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
      case "contributorId":
        setContributorId(value);
        break;
      default:
        break;
    }
  }

  const getStatusText = (status: string): string => {
      switch (status) {
        case StatusDefeito.RESOLVIDO:
          return "Resolvido";
        case StatusDefeito.INVALIDO:
          return "Inválido";
        case StatusDefeito.REABERTO:
          return "Reaberto";
        case StatusDefeito.EM_RESOLUCAO:
          return "Em Resolução";
        case "InProgress":
          return "Em Progresso";
        case StatusDefeito.AGUARDANDO_USUARIO:
          return "Aguardando Usuário";
        default:
          return "Novo";
      }
    }

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-5xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Editar Defeito
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={e => { e.preventDefault(); handleConfirmEdit(); }}>
          <div className="flex flex-col space-y-2 w-full md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
              required
            />
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="bugEnvironment">Ambiente</Label>
            <Select
              onValueChange={(value) => handleInputChange("environment", value)}
              value={environment}
            >
              <SelectTrigger className={`w-full ${errors.environment ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder="Selecione o ambiente" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectGroup>
                  <SelectLabel className="text-gray-500 dark:text-gray-400">Ambientes</SelectLabel>
                  <SelectItem value="Production" className="dark:text-white hover:dark:bg-gray-600">Produção</SelectItem>
                  <SelectItem value="Testing" className="dark:text-white hover:dark:bg-gray-600">Homologação</SelectItem>
                  <SelectItem value="Development" className="dark:text-white hover:dark:bg-gray-600">Desenvolvimento</SelectItem>
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
              <SelectTrigger className={`w-full ${errors.severity ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder="Selecione a severidade" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectGroup>
                  <SelectLabel className="text-gray-500 dark:text-gray-400">Severidade</SelectLabel>
                  <SelectItem value="VeryHigh" className="dark:text-white hover:dark:bg-gray-600">Muito Alta</SelectItem>
                  <SelectItem value="High" className="dark:text-white hover:dark:bg-gray-600">Alta</SelectItem>
                  <SelectItem value="Medium" className="dark:text-white hover:dark:bg-gray-600">Média</SelectItem>
                  <SelectItem value="Low" className="dark:text-white hover:dark:bg-gray-600">Baixa</SelectItem>
                  <SelectItem value="VeryLow" className="dark:text-white hover:dark:bg-gray-600">Muito Baixa</SelectItem>
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
            <Label htmlFor="bugStatus">Status</Label>
            <Select
              onValueChange={(value) => handleInputChange("status", value)}
              value={status}
            >
              <SelectTrigger className={`w-full ${errors.status ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectGroup>
                  <SelectLabel className="text-gray-500 dark:text-gray-400">Status</SelectLabel>
                  <SelectItem value="Resolved" className="dark:text-white hover:dark:bg-gray-600">Resolvido</SelectItem>
                  <SelectItem value="Invalid" className="dark:text-white hover:dark:bg-gray-600">Inválido</SelectItem>
                  <SelectItem value="Reopened" className="dark:text-white hover:dark:bg-gray-600">Reaberto</SelectItem>
                  <SelectItem value="InProgress" className="dark:text-white hover:dark:bg-gray-600">Em resolução</SelectItem>
                  <SelectItem value="WaitingForUser" className="dark:text-white hover:dark:bg-gray-600">Aguardando usuário</SelectItem>
                  <SelectItem value="New" className="dark:text-white hover:dark:bg-gray-600">Novo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 dark:text-red-400 text-sm flex items-center mt-1 animate-slide-down">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.status}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2 w-full">
            <Label htmlFor="bugCategory">Categoria</Label>
            <Select
              onValueChange={(value) => handleInputChange("category", value)}
              value={category}
            >
              <SelectTrigger className={`w-full ${errors.category ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectGroup>
                  <SelectLabel className="text-gray-500 dark:text-gray-400">Categoria</SelectLabel>
                  <SelectItem value="Functional" className="dark:text-white hover:dark:bg-gray-600">Funcional</SelectItem>
                  <SelectItem value="Interface" className="dark:text-white hover:dark:bg-gray-600">Interface</SelectItem>
                  <SelectItem value="Performance" className="dark:text-white hover:dark:bg-gray-600">Performance</SelectItem>
                  <SelectItem value="Improvement" className="dark:text-white hover:dark:bg-gray-600">Melhoria</SelectItem>
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
          <div className="flex flex-col space-y-2 w-full md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comportamento Atual</label>
            <textarea
              value={currentBehavior}
              onChange={e => setCurrentBehavior(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
              required
            />
          </div>
          <div className="flex flex-col space-y-2 w-full md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comportamento Esperado</label>
            <textarea
              value={expectedBehavior}
              onChange={e => setExpectedBehavior(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
              required
            />
          </div>
          <div className="flex flex-col space-y-2 w-full md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stack Trace</label>
            <textarea
              value={stackTrace}
              onChange={e => setStackTrace(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={2}
            />
          </div>
          <div className="flex flex-col space-y-1.5 w-full md:col-span-2">
            <Label htmlFor="contributorId">Responsável</Label>
            <Select
              onValueChange={(value) => handleInputChange("contributorId", value)}
              value={contributorId}
            >
              <SelectTrigger className={`w-full ${errors.contributorId ? "border-red-500 dark:border-red-400" : ""}`}>
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectGroup>
                  <SelectLabel className="text-gray-500 dark:text-gray-400">Contribuintes</SelectLabel>
                  {project?.colaborators?.map(colaborator => (
                    <SelectItem
                      key={colaborator.colaboratorEmail}
                      value={colaborator.colaboratorEmail}
                      className="dark:text-white hover:dark:bg-gray-600"
                    >
                      {colaborator.colaboratorName}
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
          <div className="flex space-x-3 mt-6 md:col-span-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={updating}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center"
              disabled={updating}
              type="submit"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Atualizando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBugModal;
