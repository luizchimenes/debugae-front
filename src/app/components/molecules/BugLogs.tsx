"use client";

import React from "react";
import { Calendar } from "lucide-react"; // Importe o ícone


import { DefeitoHistorico } from "@/app/services/logService";
import { AcaoRealizada } from "@/app/enums/AcaoRealizada";
import { UtilService } from "@/app/services/utilService";


interface UserData {
  id: string;
  firstName: string;
  lastName: string;
}

interface BugHistoryTabProps {
  history: DefeitoHistorico[] | undefined;
  getStatusColor: (status: string) => string;

}

const BugHistoryTab: React.FC<BugHistoryTabProps> = ({
  history,
  getStatusColor,
}) => {


  const renderHistoryEntry = (entry: DefeitoHistorico) => {
    switch (entry.acaoRealizada) {
      case AcaoRealizada.ATUALIZACAO_STATUS:
        return (
          <>
            Status alterado de "
            <span className={getStatusColor(entry.dadosAntigos?.status || "")}>
              {entry.dadosAntigos?.status}
            </span>
            " para "
            <span className={getStatusColor(entry.dadosNovos?.status || "")}>
              {entry.dadosNovos?.status}
            </span>
            ".
          </>
        );
      case AcaoRealizada.COMENTARIO_ADICIONADO:
        return <>Adicionou um comentário: "{entry.comentario}"</>;
      case AcaoRealizada.CRIACAO:
        return <>Defeito criado.</>;
      case AcaoRealizada.EXCLUSAO:
        return <>Defeito excluído.</>;
      case AcaoRealizada.FECHAMENTO:
        return <>Defeito foi fechado.</>;
      case AcaoRealizada.REABERTURA:
        return <>Defeito foi reaberto.</>;
      default:
        return entry.comentario || "Ação desconhecida.";
    }
  };

  return (
    <div className="space-y-4">
      {history && history.length > 0 ? (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="border-l-4 border-purple-400 pl-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-r-md"
            >
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                <span className="font-semibold">{entry.acaoRealizada}:</span>{" "}
                {renderHistoryEntry(entry)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                Por <span className="font-semibold">{entry.realizadoPorUserId}</span> em{" "}
                {UtilService.formatDate(entry.criadoEm)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Histórico do Defeito
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum histórico disponível ainda.
          </p>
        </div>
      )}
    </div>
  );
};

export default BugHistoryTab;