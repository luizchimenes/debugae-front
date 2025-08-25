"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, AlertTriangle, Calendar, Tag, Plus, Eye, Minus } from "lucide-react";
import { Button } from "../atoms";
import { UtilService } from "@/app/services/utilService";
import { useRouter } from "next/navigation";
import { DefectDuplicatesViewModel } from "@/app/models/responses/getDefectDuplicatedResponse";

export interface DuplicatedBug {
  id: string;
  projectId: string;
  summary: string;
  description: string;
  environment: string;
  severity: string;
  version: string;
  category: string;
  status: string;
  createdDate: Date;
  createdBy: string;
  contributorId: string;
}

interface SimilarBugsModalProps {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
  similarBugs: DefectDuplicatesViewModel[];
  getStatusColor: (status: string) => string;
  onAddDuplicatedBug: (defectId: string) => void;
  onRemoveDuplicatedBug: (defectId: string) => void;
  duplicatedIds: string[];
}

const getSeverityColor = (severity: string): string => {
  const colorMap: Record<string, string> = {
    "1": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    "2": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "3": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "4": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "5": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };
  return (
    colorMap[severity] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  );
};

const getSeverityLabel = (severity: string): string => {
  const labelMap: Record<string, string> = {
    "1": "Muito Alta",
    "2": "Alta",
    "3": "Média",
    "4": "Baixa",
    "5": "Muito Baixa",
  };
  return labelMap[severity] || severity;
};

interface BugItemProps {
  bug: DefectDuplicatesViewModel;
  onBugClick: (id: string) => void;
  getStatusColor: (status: string) => string;
  onAddDuplicatedBug: (defectId: string) => void;
  onRemoveDuplicatedBug: (defectId: string) => void;
  duplicatedIds: string[];
}

const BugItem: React.FC<BugItemProps> = ({
  bug,
  onBugClick,
  getStatusColor,
  onAddDuplicatedBug,
  onRemoveDuplicatedBug,
  duplicatedIds,
}) => {
  const [isDuplicated, setIsDuplicated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsDuplicated(duplicatedIds.includes(bug.defectId));
  }, [duplicatedIds, bug.defectId]);

  const handleClick = useCallback(() => {
    onBugClick(bug.defectId);
  }, [bug.defectId, onBugClick]);

  const handleAddDuplicated = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onAddDuplicatedBug(bug.defectId);
      setIsDuplicated(true);
    },
    [bug.defectId, onAddDuplicatedBug]
  );

  const handleRemoveDuplicated = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onRemoveDuplicatedBug(bug.defectId);
      setIsDuplicated(false);
    },
    [bug.defectId, onRemoveDuplicatedBug]
  );

  const formattedDate = useMemo(() => {
    return UtilService.formatDate(bug.createdAt);
  }, [bug.createdAt]);

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 
               cursor-pointer transition-all duration-200 
               hover:bg-gray-100 dark:hover:bg-gray-600/50 
               hover:border-gray-300 dark:hover:border-gray-600
               active:scale-[0.98]"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors duration-200">
              {bug.summary}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {bug.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 ml-4">
            <div className="flex items-center gap-2">
              <a
                href={`/www/bugs/view/${bug.defectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-full bg-gray-500 hover:bg-gray-600 text-white 
                         transition-all duration-200 hover:scale-110 active:scale-95
                         shadow-sm hover:shadow-md z-10 relative"
                title="Ver detalhes"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="w-3 h-3" />
              </a>
              {isDuplicated ? (
                <button
                  onClick={handleRemoveDuplicated}
                  type="button"
                  className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white 
                           transition-all duration-200 hover:scale-110 active:scale-95
                           shadow-sm hover:shadow-md z-10 relative"
                  title="Remover da lista de duplicados"
                >
                  <Minus className="w-3 h-3" />
                </button>
              ) : (
                <button
                  onClick={handleAddDuplicated}
                  type="button"
                  className="p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white 
                           transition-all duration-200 hover:scale-110 active:scale-95
                           shadow-sm hover:shadow-md z-10 relative"
                  title="Adicionar como duplicado"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>{bug.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>{bug.environment}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>v{bug.version}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DuplicatedBugModal: React.FC<SimilarBugsModalProps> = ({
  show,
  onClose,
  onContinue,
  similarBugs,
  getStatusColor,
  onAddDuplicatedBug,
  onRemoveDuplicatedBug,
  duplicatedIds,
}) => {
  const router = useRouter();

  const handleBugClick = useCallback(
    (bugId: string) => {
      router.push(`/www/bugs/view/${bugId}`);
    },
    [router]
  );

  const bugCount = useMemo(() => similarBugs.length, [similarBugs]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-brightness-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Possíveis Bugs Similares Encontrados
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                     transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                     rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Encontramos <strong>{bugCount}</strong> bug(s) com resumo ou
            descrição similar. Verifique se algum deles já reporta o mesmo
            problema antes de continuar.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {similarBugs.map((bug) => (
            <BugItem
              key={bug.defectId}
              bug={bug}
              onBugClick={handleBugClick}
              getStatusColor={getStatusColor}
              onAddDuplicatedBug={onAddDuplicatedBug}
              onRemoveDuplicatedBug={onRemoveDuplicatedBug}
              duplicatedIds={duplicatedIds}
            />
          ))}
        </div>

        <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onContinue}
            className="flex-1 bg-primary hover:bg-primary-dark text-white 
                     transition-all duration-200 hover:shadow-lg hover:scale-105 
                     active:scale-95"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DuplicatedBugModal;