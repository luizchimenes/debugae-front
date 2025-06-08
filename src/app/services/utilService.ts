import { DefeitoSeveridade } from "../enums/DefeitoSeveridade";
import { StatusDefeito } from "../enums/StatusDefeito";

export const UtilService = {
  formatDate: (dateString: Date | string): string => {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
      }

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  },

  getSeverityColor: (severity: string) => {
    const colors = {
      [DefeitoSeveridade.BAIXA]: "text-blue-600",
      [DefeitoSeveridade.MUITO_BAIXA]: "text-blue-600",
      [DefeitoSeveridade.MEDIA]: "text-yellow-600",
      [DefeitoSeveridade.ALTA]: "text-orange-600",
      [DefeitoSeveridade.MUITO_ALTA]: "text-red-600",
    };
    return colors[severity as keyof typeof colors] || "text-gray-600";
  },

  getSeverityBgColor: (severity: string) => {
    const colors = {
      [DefeitoSeveridade.BAIXA]: "bg-blue-100 dark:bg-blue-900",
      [DefeitoSeveridade.MUITO_BAIXA]: "bg-blue-100 dark:bg-blue-900",
      [DefeitoSeveridade.MEDIA]: "bg-yellow-100 dark:bg-yellow-900",
      [DefeitoSeveridade.ALTA]: "bg-orange-100 dark:bg-orange-900",
      [DefeitoSeveridade.MUITO_ALTA]: "bg-red-100 dark:bg-red-900",
    };
    return (
      colors[severity as keyof typeof colors] || "bg-gray-100 dark:bg-gray-900"
    );
  },

  getStatusDefeitoColor: (status: string) => {
    const colors = {
      [StatusDefeito.NOVO]: "text-blue-500",
      [StatusDefeito.EM_RESOLUCAO]: "text-yellow-500",
      [StatusDefeito.RESOLVIDO]: "text-green-500",
      [StatusDefeito.AGUARDANDO_USUARIO]: "text-gray-500",
    };
    return colors[status as keyof typeof colors] || "text-gray-500";
  },

  getStatusDefeitoBgColor: (status: string) => {
    const colors = {
      [StatusDefeito.NOVO]: "bg-blue-100 text-blue-800 border-blue-200",
      [StatusDefeito.EM_RESOLUCAO]:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
      [StatusDefeito.AGUARDANDO_USUARIO]:
        "bg-orange-100 text-orange-800 border-orange-200",
      [StatusDefeito.REABERTO]: "bg-red-100 text-red-800 border-red-200",
      [StatusDefeito.RESOLVIDO]: "bg-green-100 text-green-800 border-green-200",
      [StatusDefeito.INVALIDO]: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  },

};
