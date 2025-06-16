import { DefeitoSeveridade } from "../enums/DefeitoSeveridade";
import { StatusDefeito } from "../enums/StatusDefeito";

export const UtilService = {
  // Métodos existentes
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

  getFileName: (attachment: string): string => {
    if (attachment.startsWith("data:")) {
      return "anexo." + UtilService.getFileExtensionFromDataUrl(attachment);
    }
    return attachment.split("/").pop() || "anexo";
  },

  getFileType: (attachment: string): string => {
    if (attachment.startsWith("data:")) {
      const mimeType = attachment.split(";")[0].split(":")[1];
      return UtilService.getFileTypeFromMime(mimeType);
    }

    const extension = attachment.split(".").pop()?.toLowerCase() || "";
    const typeMap: { [key: string]: string } = {
      pdf: "PDF",
      doc: "Word",
      docx: "Word",
      xls: "Excel",
      xlsx: "Excel",
      jpg: "Imagem",
      jpeg: "Imagem",
      png: "Imagem",
      gif: "Imagem",
      txt: "Texto",
      zip: "Arquivo",
      rar: "Arquivo",
    };

    return typeMap[extension] || "Arquivo";
  },

  getFileTypeFromMime: (mimeType: string): string => {
    const mimeMap: { [key: string]: string } = {
      "application/pdf": "PDF",
      "application/msword": "Word",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "Word",
      "application/vnd.ms-excel": "Excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "Excel",
      "image/jpeg": "Imagem",
      "image/jpg": "Imagem",
      "image/png": "Imagem",
      "image/gif": "Imagem",
      "text/plain": "Texto",
      "application/zip": "Arquivo",
      "application/x-rar-compressed": "Arquivo",
    };

    return mimeMap[mimeType] || "Arquivo";
  },

  getFileExtensionFromDataUrl: (dataUrl: string): string => {
    const mimeType = dataUrl.split(";")[0].split(":")[1];
    const extensionMap: { [key: string]: string } = {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "text/plain": "txt",
    };

    return extensionMap[mimeType] || "file";
  },

  getFileSize: (attachment: string): string => {
    if (attachment.startsWith("data:")) {
      const base64Data = attachment.split(",")[1];
      const sizeInBytes = (base64Data.length * 3) / 4;

      if (sizeInBytes < 1024) {
        return `${Math.round(sizeInBytes)} B`;
      } else if (sizeInBytes < 1024 * 1024) {
        return `${Math.round(sizeInBytes / 1024)} KB`;
      } else {
        return `${Math.round(sizeInBytes / (1024 * 1024))} MB`;
      }
    }

    return "Tamanho desconhecido";
  },

  isImageFile: (attachment: string): boolean => {
    if (attachment.startsWith("data:")) {
      const mimeType = attachment.split(";")[0].split(":")[1];
      return mimeType.startsWith("image/");
    }

    const extension = attachment.split(".").pop()?.toLowerCase() || "";
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
  },

  downloadAttachment: (attachment: string) => {
    try {
      const link = document.createElement("a");
      link.href = attachment;
      link.download = UtilService.getFileName(attachment); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao fazer download do anexo:", error);
    }
  },

  previewAttachment: (attachment: string) => {
    try {
      window.open(attachment, "_blank");
    } catch (error) {
      console.error("Erro ao visualizar anexo:", error);
    }
  },
};
