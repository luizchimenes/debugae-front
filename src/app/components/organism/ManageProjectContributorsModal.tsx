"use client";

import { useState } from "react";
import { Input } from "@/app/components/atoms/InputComponent";
import { Button } from "@/app/components/atoms";
import {
  User as UserIcon,
  Users as UsersIcon,
  Plus,
  X,
  FileText, 
} from "lucide-react";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import { ProjectService } from "@/app/services/projectService";
import { ManageContributorsRequest } from "@/app/models/requests/manageContributorsRequest";
import { toast } from "sonner";
import { LoadingOverlay } from "../atoms/LoadingPage";

const MAX_DESCRIPTION_LENGTH = 500;

interface ManageProjectContributorsModalProps {
  show: boolean;
  onClose: () => void;
  currentContributors: string[];
  projectId: string;
}

const ManageProjectContributorsModal: React.FC<ManageProjectContributorsModalProps> = ({
  show,
  onClose,
  currentContributors,
  projectId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentContributorToAdd, setCurrentContributorToAdd] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const loggedUser = useAtomValue(userAtom);

  const handleAddContributor = async (contributorEmail: string) => {
    try {
      setIsLoading(true);
      const req: ManageContributorsRequest = {
        contributorEmail: contributorEmail,
        projectId: projectId,
        isAdding: true,
      }
      await ProjectService.manageContributorsAsync(req);
      setCurrentContributorToAdd("");
      currentContributors.push(contributorEmail);
      toast.success("Colaborador adicionado com sucesso!");
    } catch {
      toast.error("Erro ao adicionar colaborador.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRemoveContributor = async (contributorEmail: string) => {
    try {
      setIsLoading(true);
      const req: ManageContributorsRequest = {
        contributorEmail: contributorEmail,
        projectId: projectId,
        isAdding: false,
      }
      await ProjectService.manageContributorsAsync(req);
      currentContributors.splice(currentContributors.indexOf(contributorEmail), 1);
      toast.success("Colaborador removido com sucesso!");
    } catch {
      toast.error("Erro ao adicionar colaborador. Verifique se o colaborador existe.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 flex items-center justify-center z-50">
      {isLoading && (
        <LoadingOverlay
          title="Gerenciando colaboradores..."
          subtitle="Processando operação do colaborador"
          showDots={true}
        />
      )}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-[100vh] mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gerenciar colaboradores do projeto
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
            <div className="flex gap-2 mb-4">
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
                disabled={currentContributors.includes(currentContributorToAdd)}
                className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                variant="ghost"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                Colaboradores atuais ({currentContributors.length})
              </h3>
              
              {currentContributors.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <UserIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum colaborador adicionado ainda</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentContributors.map((contributor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-white font-medium">
                          {contributor}
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveContributor(contributor)}
                        disabled={isLoading || contributor == loggedUser?.email}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        variant="ghost"
                        size="sm"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProjectContributorsModal;