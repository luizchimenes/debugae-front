"use client";

import { X, Loader2 } from "lucide-react"; 
import React, { useState, useEffect } from "react";
import { Button } from "../atoms";
import { BugService } from "@/app/services/bugService"; 
import { Bug } from "@/app/models/Bug";
import { StatusDefeito } from "../../../app/enums/StatusDefeito"; 
import { toast } from "sonner";
import UpdateDefectStatusRequest from "@/app/models/requests/updateDefectStatusRequest";


interface StatusOption {
  value: string;
  label: string;
}

interface ChangeStatusModalProps {
  show: boolean;
  onClose: () => void;
  bug: Bug;
  onStatusChanged: (updatedBug: Bug) => void;
  getStatusColor: (status: string) => string;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  show,
  onClose,
  bug,
  onStatusChanged,
  getStatusColor,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(bug.defectStatus);
  const [statusComment, setStatusComment] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions: StatusOption[] = Object.values(StatusDefeito).map(
    (status) => ({
      value: status,
      label: status,
    })
  );

  useEffect(() => {
    if (bug && bug.defectStatus) {
      setSelectedStatus(bug.defectStatus);
    }
  }, [bug]);

  const getStatusValue = (status: string): number => {
    switch (status) {
      case StatusDefeito.RESOLVIDO:
        return 1;
      case StatusDefeito.INVALIDO:
        return 2;
      case StatusDefeito.REABERTO:
        return 3;
      case StatusDefeito.EM_RESOLUCAO:
        return 4;
      case StatusDefeito.AGUARDANDO_USUARIO:
        return 5;
      default:
        return 6;
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
      case StatusDefeito.AGUARDANDO_USUARIO:
        return "Aguardando Usuário";
      default:
        return "Novo";
    }
  }


  const handleConfirmChange = async () => {
    if (selectedStatus === bug.defectStatus && !statusComment.trim()) {
      onClose();
      return;
    }

    setUpdatingStatus(true);

    try {
      const request: UpdateDefectStatusRequest = { defectId: bug.defectId, newStatus: getStatusValue(selectedStatus) };
      await BugService.updateStatusAsync(request);
      const fetchedUpdatedBug = await BugService.getBugByIdAsync(bug.defectId);
      if (fetchedUpdatedBug) {
        onStatusChanged(fetchedUpdatedBug);
      }
      onClose();
      toast("Status atualizado com sucesso!", {
        description: "O status do defeito foi atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar status do defeito:", error);
      toast.error("Erro ao atualizas status", {
        description: "Ocorreu um erro ao atualizar o status do defeito",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alterar Status do Defeito
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Atual:{" "}
              <span className={getStatusColor(bug.defectStatus || "Aberto")}>
                {bug.defectStatus || "Aberto"}
              </span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {getStatusText(option.label)}
                </option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={updatingStatus}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmChange}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center" 
            disabled={
              updatingStatus ||
              (selectedStatus === bug.defectStatus && !statusComment.trim())
            }
          >
            {updatingStatus ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Atualizando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
