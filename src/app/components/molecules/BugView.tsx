"use client";

import React, { act, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { Button } from "../atoms";
import { BugService } from "@/app/services/bugService";
import { Bug, BugOld, TrelloUserStory } from "@/app/models/Bug";
import { NotificationService } from "@/app/services/notificationService";
import {
  Bug as BugIcon,
  Calendar,
  User,
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Monitor,
  GitBranch,
  Edit3,
  File,
  Clock1,
  Plus,
  Eye,
  Download,
  Trello,
  Tag,
  KanbanIcon,
  ExternalLink,
  TrashIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EditBugModal from "../organism/EditBugModal";
import { Comment, CommentService } from "@/app/services/commentService";
import { UserService } from "@/app/services/userService";
import { ProjectService } from "@/app/services/projectService";
import { StatusDefeito } from "@/app/enums/StatusDefeito";
import { CommentsSection } from "./BugComments";
import { UtilService } from "@/app/services/utilService";
import { DefeitoSeveridade } from "@/app/enums/DefeitoSeveridade";
import {
  DefeitoHistorico,
  DefeitoHistoricoService,
} from "@/app/services/logService";
import BugHistoryTab from "./BugLogs";
import UserModel from "@/app/models/User";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import { Project } from "@/app/models/Project";
import TrelloIntegrationModal from "../organism/TrelloIntegrationModal";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/config/axiosConfig";
import ChangeStatusModal from "../organism/ChangeStatusModal";
import { DefectSeverity } from "@/app/enums/DefectSeverity";
import { toast } from "sonner";

interface BugViewProps {
  bugId: string;
}

const PostIt = ({ userStory }: { userStory: TrelloUserStory }) => {

  const handleRedirect = (e: React.MouseEvent, shortUrl: string) => {
    e.stopPropagation(); 
    e.preventDefault(); 
    console.log('a')
    window.open(shortUrl, "_blank");
  }

  return (
    <div
      className="w-56 h-40 bg-yellow-200 shadow-lg rounded-xl p-4 cursor-grab active:cursor-grabbing relative"
    >
      <h3 className="font-bold text-sm mb-2">{userStory.name}</h3>
      <p className="text-xs line-clamp-3">{userStory.desc}</p>
      <button
        type="button"
        onClick={(e) => handleRedirect(e, userStory.shortUrl)}
        onPointerDown={(e) => e.stopPropagation()} 
        onMouseDown={(e) => e.stopPropagation()}  
        className="absolute bottom-2 right-2 p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 shadow cursor-pointer"
      >
        <ExternalLink size={16} />
      </button>
    </div>
  );
};


const BugView = ({ bugId }: BugViewProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [bug, setBug] = useState<Bug | undefined>();
  const [contributor, setContributor] = useState<UserModel | undefined>();
  const [creator, setCreator] = useState<UserModel | undefined>();
  const [project, setProject] = useState<Project | undefined>();
  const [logs, setLogs] = useState<DefeitoHistorico[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTrelloModal, setShowTrelloModal] = useState(false);
  const [comments, setComments] = useState<Comment[] | undefined>([]);

  const loggedUser = useAtomValue(userAtom);

  const manageTags = async (tag: string) => {
    try {
      setLoading(true)
      await BugService.manageTagsAsync(bugId, tag);
      await fetchAll();
      toast.success("Tag gerenciada com sucesso.");
    } catch {
      toast.error("Erro ao gerenciar tags.");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll();
  }, [bugId]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const bugData = await BugService.getBugByIdAsync(bugId);

      console.log(bugData)

      setBug(bugData);

    } catch (error) {
      console.error("Erro ao carregar dados do defeito:", error);
    } finally {
      setLoading(false);
    }
  };

  const [mailLoading, setMailLoading] = useState(false);

  const handleToggleMailLetter = async () => {
    if (!bug) return;
    setMailLoading(true);
    try {
      await NotificationService.addOrRemoveToMailLettersAsync(bug.defectId);
      setBug(prev => prev ? { ...prev, isCurrentUserOnMailLetter: !prev.isCurrentUserOnMailLetter } : prev);
      toast.success(
        !(bug.isCurrentUserOnMailLetter) ? "Agora você está acompanhando este defeito." : "Você parou de acompanhar este defeito."
      );
    } catch {
      toast.error("Erro ao atualizar acompanhamento do defeito.");
    } finally {
      setMailLoading(false);
    }
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCloseTrelloModal = () => {
    console.log("Closing Trello Modal");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("isAuthenticated");
    router.replace(`${window.location.pathname}?${params.toString()}`);
    setShowTrelloModal(false);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const isAuthenticated = params.get("isAuthenticated");
    console.log(params.toString());
    if (isAuthenticated === "true" && showTrelloModal === false) {
      console.log("Showing Trello Modal");
      setShowTrelloModal(true);
    }
  }, [searchParams]);

  const trelloReturnUrl = api.defaults.baseURL + `/trello/login?returnUrl=${window.location.href}`;

  const handleTrelloLogin = () => {
    window.location.href = trelloReturnUrl;
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      [DefeitoSeveridade.BAIXA]: "text-blue-600",
      [DefeitoSeveridade.MUITO_BAIXA]: "text-blue-600",
      [DefeitoSeveridade.MEDIA]: "text-yellow-600",
      [DefeitoSeveridade.ALTA]: "text-orange-600",
      [DefeitoSeveridade.MUITO_ALTA]: "text-red-600",
    };
    return colors[severity as keyof typeof colors] || "text-gray-600";
  };

  const getSeverityBgColor = (severity: string) => {
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
  };

  const getStatusColor = (status: string) => {
    const colors = {
      [StatusDefeito.NOVO]: "text-blue-500",
      [StatusDefeito.EM_RESOLUCAO]: "text-yellow-500",
      [StatusDefeito.RESOLVIDO]: "text-green-500",
      [StatusDefeito.AGUARDANDO_USUARIO]: "text-gray-500",
      [StatusDefeito.INVALIDO]: "text-red-500",
    };
    return colors[status as keyof typeof colors] || "text-gray-500";
  };

  const getStatusBgColor = (status: string) => {
    const colors = {
      [StatusDefeito.NOVO]: "bg-blue-100 text-blue-800 border-blue-200",
      [StatusDefeito.EM_RESOLUCAO]:
        "bg-yellow-100 text-yellow-800 border-yellow-200",
      [StatusDefeito.AGUARDANDO_USUARIO]:
        "bg-orange-100 text-orange-800 border-orange-200",
      [StatusDefeito.REABERTO]: "bg-red-100 text-red-800 border-red-200",
      [StatusDefeito.RESOLVIDO]: "bg-green-100 text-green-800 border-green-200",
      [StatusDefeito.INVALIDO]: "bg-red-200 text-gray-800 border-gray-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      [StatusDefeito.NOVO]: <BugIcon className="w-6 h-6" />,
      [StatusDefeito.EM_RESOLUCAO]: <Clock className="w-6 h-6" />,
      [StatusDefeito.RESOLVIDO]: <CheckCircle className="w-6 h-6" />,
    };
    return (
      icons[status as keyof typeof icons] || <BugIcon className="w-6 h-6" />
    );
  };

  const getExpirationTextColor = (expiredDate: string | Date) => {
    if (!expiredDate) return "text-gray-800";

    const today = new Date();
    const expiration = new Date(expiredDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return "text-green-800";
    } else if (diffDays >= 3) {
      return "text-yellow-800";
    } else if (diffDays >= 0) {
      return "text-red-800";
    } else {
      return "text-gray-800";
    }
  };

  const getExpirationBgColor = (expiredDate: string | Date) => {
    if (!expiredDate) return "bg-gray-100 text-gray-800 border-gray-200";

    const today = new Date();
    const expiration = new Date(expiredDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      return "bg-green-100 text-green-800 border-green-200";
    } else if (diffDays >= 3) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    } else if (diffDays >= 0) {
      return "bg-red-100 text-red-800 border-red-200";
    } else {
      return "bg-gray-200 text-gray-800 border-gray-300";
    }
  };

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

  const handleViewDefect = (defectId: string) => {
    const url = `/www/bugs/view/${defectId}`;
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    if (!newWindow) {
      toast.warning("Erro ao abrir defeito relacionado em nova guia.");
    }
  };

  const getSeverityText = (severity: string): string => {
    switch (severity) {
      case "VeryHigh":
        return "Muito Alta";
      case "High":
        return "Alta";
      case "Medium":
        return "Média";
      case "Low":
        return "Baixa";
      case "VeryLow":
        return "Muito Baixa";
      default:
        return "Não definida";
    }
  }

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-yellow-500",
      low: "bg-blue-500",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
  };

  const handleBugStatusChanged = (updatedBug: Bug) => {
    setBug(updatedBug);
    fetchAll();
  };

  const handleBugEdited = (updatedBug: Bug) => {
    setBug(updatedBug);
    fetchAll();
  };

  const downloadAttachment = async () => {
    try {
      setLoading(true);
      const resp = await BugService.downloadAttachmentAsync(bugId);

      const url = window.URL.createObjectURL(resp);

      const a = document.createElement("a");
      a.href = url;
      a.download = 'anexo_' + (bug?.attachment?.fileName || 'defeito_' + bugId);
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Erro ao baixar anexo.");
    } finally {
      setLoading(false);
    }
  }

  const getActionText = (action: string): string => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return "Criado";
      case "UPDATE":
        return "Atualizado";
      default:
        return "-";
    }
  }

  const getText = (column: string | null, value: string | null): string | null => {
    if (column == null) return value;
    if (column.toLowerCase() == "status") {
      return getStatusText(value || "");
    }
    return value;
  }

  const getEnvironmentText = (environment: string): string => {
    switch (environment) {
      case "Production":
        return "Produção";
      case "Development":
        return "Desenvolvimento";
      case "Testing":
        return "Homologação";
      default:
        return "Não definido";
    }
  }

  const getCategoryText = (category: string): string => {
    switch (category) {
      case "Functional":
        return "Funcional";
      case "Performance":
        return "Performance";
      case "Interface":
        return "Interface";
      case "Improvement":
        return "Melhoria";
      default:
        return "Não definido";
    }
  }

  const getUpdatedField = (column: string | null): string | null => {
    if (column == null) return column;
    if (column.toLowerCase() == "status") return "Status";
    if (column.toLowerCase() == "defectseverity") return "Severidade";
    if (column.toLowerCase() == "defectenvironment") return "Ambiente";
    if (column.toLowerCase() == "defectsummary") return "Resumo";
    if (column.toLowerCase() == "description") return "Descrição";
    if (column.toLowerCase() == "defectcategory") return "Categoria";
    if (column.toLowerCase() == "errorlog") return "Log de erro";
    if (column.toLowerCase() == "actualbehaviour") return "Comportamento atual";
    if (column.toLowerCase() == "expectedbehaviour") return "Comportamento esperado";
    if (column.toLowerCase() == "assignedtocontributorid") return "Usuário responsável";
    return column;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando defeito...</p>
        </div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="text-center py-12">
        <BugIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Defeito não encontrado</p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mt-4"
        >
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        {bug && (
          <button
            className={`px-4 py-2 rounded text-white text-sm font-medium transition-colors focus:outline-none ${bug.isCurrentUserOnMailLetter ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} flex items-center gap-2`}
            onClick={handleToggleMailLetter}
            disabled={mailLoading}
          >
            {mailLoading && (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            {bug.isCurrentUserOnMailLetter ? 'Parar de acompanhar defeito' : 'Acompanhar defeito'}
          </button>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Defeito #{bug.defectId || "N/A"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {bug.defectSummary || "Sem resumo"}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowStatusModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Alterar Status
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar Defeito
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => handleTrelloLogin()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Trello className="w-4 h-4 mr-2" />
            Integrar com Trello
          </Button>
          {/* <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button> */}
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <Tag className="w-5 h-5 mr-2 text-blue-400" />
              Tags do Defeito
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-4">
              {bug.tags && bug.tags.length > 0 ? (
                bug.tags.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center bg-blue-50 border border-blue-300 rounded-lg px-3 py-1 text-blue-700 text-sm font-medium shadow-sm"
                  >
                    <span className="mr-2">{tag}</span>
                    <button
                      type="button"
                      className="ml-1 px-1 py-0.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-500 border border-blue-200"
                      onClick={() => manageTags(tag)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-gray-400">Nenhuma tag cadastrada.</span>
              )}
            </div>
            <form
              className="flex items-center gap-2 mt-4"
              onSubmit={e => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem('newTag') as HTMLInputElement;
                if (input && input.value.trim()) {
                  manageTags(input.value.trim());
                  input.value = '';
                }
              }}
            >
              <input
                type="text"
                name="newTag"
                placeholder="Adicionar tag..."
                className="border border-blue-300 rounded-lg px-3 py-1 text-blue-700 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                autoComplete="off"
              />
              <button
                type="submit"
                className="px-2 py-1 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
              >
                Adicionar
              </button>
            </form>
          </CardHeader>
        </Card>

      {bug && (
        <ChangeStatusModal
          show={showStatusModal}
          onClose={handleCloseStatusModal}
          bug={bug}
          onStatusChanged={handleBugStatusChanged}
          getStatusColor={getStatusColor}
        />
      )} 

      {bug && (
        <EditBugModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          bug={bug}
          onBugUpdated={handleBugEdited}
        />
      )}

      {bug && (
        <TrelloIntegrationModal
          show={showTrelloModal}
          onClose={() => handleCloseTrelloModal()}
          bug={bug}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 dark:text-white">
                {bug.defectSummary || "Sem título"}
              </CardTitle>
              <CardDescription className="text-base mb-4">
                {bug.defectDescription || "Sem descrição"}
              </CardDescription>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Criado em{" "}
                    {bug.createdAt
                      ? UtilService.formatDate(bug.createdAt)
                      : "Data não disponível"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>
                    Por{" "}
                    {bug.createdByUser ||
                      "Usuário desconhecido"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Severidade</CardDescription>
                <CardTitle
                  className={`text-2xl ${getSeverityColor(bug.defectSeverity || "Baixa")} dark:text-white`}
                >
                  {getSeverityText(bug.defectSeverity || "Não definida")}
                </CardTitle>
              </div>
              <div
                className={`p-3 ${getSeverityBgColor(bug.defectSeverity || "Baixa")} rounded-lg`}
              >
                <AlertTriangle
                  className={`w-6 h-6 ${getSeverityColor(bug.defectSeverity || "Baixa")}`}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Status</CardDescription>
                <CardTitle
                  className={`text-2xl ${getStatusColor(bug.defectStatus || "Aberto")} dark:text-white`}
                >
                  {getStatusText(bug.defectStatus) || "Não definido"}
                </CardTitle>
              </div>
              <div
                className={`p-3 ${getStatusBgColor(bug.defectStatus || "Aberto")} rounded-lg`}
              >
                {React.cloneElement(getStatusIcon(bug.defectStatus || "Aberto"), {
                  className: `w-6 h-6 ${getStatusColor(bug.defectStatus || "Aberto")}`,
                })}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Expira em</CardDescription>
                <CardTitle
                  className={`text-2xl ${getExpirationTextColor(bug.expirationDate)}`}
                >
                  {UtilService.formatDate(bug.expirationDate) || "N/A"}
                </CardTitle>
              </div>
              <div
                className={`p-3 rounded-lg border ${getExpirationBgColor(bug.expirationDate)}`}
              >
                <Clock1
                  className={`w-6 h-6 ${getExpirationTextColor(bug.expirationDate)} `}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Categoria</CardDescription>
                <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">
                  {getCategoryText(bug.defectCategory) || "Não definida"}
                </CardTitle>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <GitBranch className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center dark:text-white">
            <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Responsável pelo Defeito
          </CardTitle>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {(bug.responsibleContributor.contributorName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {bug.responsibleContributor.contributorName ||
                  "Usuário desconhecido"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Responsável
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center dark:text-white">
              <BugIcon className="w-5 h-5 mr-2 text-red-600" />
              Detalhes do Defeito
            </CardTitle>
          </div>

          <div className="flex space-x-1 mt-4">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "details"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900"
              }`}
            >
              <FileText className="w-4 h-4 mr-2 inline" />
              Detalhes
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "comments"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900"
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2 inline" />
              Comentários ({bug.comments.length})
            </button>
            <button
              onClick={() => setActiveTab("trello")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "trello"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900"
              }`}
            >
              <KanbanIcon className="w-4 h-4 mr-2 inline" />
              User stories
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900"
              }`}
            >
              <Calendar className="w-4 h-4 mr-2 inline" />
              Histórico
            </button>
            <button
              onClick={() => setActiveTab("attachments")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "attachments"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:text-gray-300 dark:hover:text-purple-300 dark:hover:bg-purple-900"
              }`}
            >
              <File className="w-4 h-4 mr-2 inline" />
              Anexos
            </button>
          </div>
        </CardHeader>

        <ScrollArea>
          <div className="p-6 pt-0">
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Descrição
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    {bug.defectDescription || "Nenhuma descrição disponível"}
                  </p>
                </div>

                {bug.details.defectEnvironment && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      Ambiente
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 bg-blue-50 dark:bg-gray-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      {getEnvironmentText(bug.details.defectEnvironment)}
                    </p>
                  </div>
                )}

                {(bug.details.actualBehaviour || bug.details.expectedBehaviour) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bug.details.actualBehaviour && (
                      <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3">
                          ❌ Comportamento Atual
                        </h3>
                        <p className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-gray-900 p-4 rounded-lg border border-red-100 dark:border-red-800">
                          {bug.details.actualBehaviour}
                        </p>
                      </div>
                    )}
                    {bug.details.expectedBehaviour && (
                      <div>
                        <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3">
                          ✅ Comportamento Esperado
                        </h3>
                        <p className="text-green-700 dark:text-green-300 bg-green-50 dark:bg-gray-900 p-4 rounded-lg border border-green-100 dark:border-green-800">
                          {bug.details.expectedBehaviour}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {bug.defectStatus && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      🔍 Stack Trace
                    </h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {bug.logStackTrace || "Nenhum stack trace disponível"}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Projeto
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {bug.details.projectName || "Não especificado"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Categoria
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getCategoryText(bug.defectCategory) || "Não definida"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Responsável
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {bug.responsibleContributor.contributorName || "Não atribuído"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    🪃 Defeitos relacionados
                  </h3>
                  {bug.relatedDefects.length === 0 && (
                    <p className="text-gray-600 dark:text-gray-300">
                      Nenhum defeito relacionado.
                    </p>
                  )}
                  <ScrollArea className="h-96">
                  {bug.relatedDefects.map((relatedBug) => (
                    <div
                      key={relatedBug.id}
                      className="border border-primary dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getPriorityColor(relatedBug.defectPriority)}`}
                            />
                            <h3 className="font-semibold text-gray-800 truncate dark:text-white">
                              #{relatedBug.id} - {relatedBug.summary}
                            </h3>
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(relatedBug.status)}`}
                            >
                              {getStatusIcon(relatedBug.status)}
                              <span className="capitalize">
                                {relatedBug.status.replace("-", " ")}
                              </span>
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-white">
                            {relatedBug.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span className="dark:text-white">
                                Criado:{" "}
                                {new Date(relatedBug.createdAt || "").toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tag className="w-4 h-4" />
                              <span className="dark:text-white">
                                Prioridade: {relatedBug.defectPriority}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            className="cursor-pointer hover:bg-muted transition"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDefect(relatedBug.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              </div>
            )}

            {activeTab === "comments" && loggedUser && (
              <CommentsSection bugId={bugId} loggedUser={loggedUser} />
            )}

            {activeTab === "attachments" && (
              <div className="space-y-6">
                {bug.attachment ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                      <File className="w-4 h-4 mr-2" />
                      Anexos do Defeito
                    </h3>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <File className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {UtilService.getFileName(bug.attachment.fileName)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {UtilService.getFileType(bug.attachment.fileType)} •{" "}
                              {bug.attachment.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadAttachment()}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      </div>

                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        <span>
                          Este anexo foi enviado em{" "}
                          {UtilService.formatDate(bug.createdAt)} por{" "}
                          {bug.attachment.uploadedBy || "Usuário desconhecido"}.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                        <File className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Nenhum anexo encontrado
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Este defeito não possui anexos associados.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900"
                        onClick={() => {
                          console.log("Adicionar anexo não implementado");
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Anexo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab == "trello" && (
              <div className="flex flex-wrap gap-4">
                {bug.trelloUserStories && bug.trelloUserStories.map((userStory) => (
                  <PostIt key={userStory.defectId} userStory={userStory} />
                ))}
              </div>
            )}

            {activeTab == "history" && (
              <div className="space-y-6">
                <Table>
                  <TableCaption>Histórico do defeito</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Ação</TableHead>
                      <TableHead>Campo atualizado</TableHead>
                      <TableHead>Valor antigo</TableHead>
                      <TableHead>Valor atual</TableHead>
                      <TableHead>Atualizado por</TableHead>
                      <TableHead>Atualizado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bug.history.map((hs) => (
                      <TableRow key={hs.createdAt?.toString() + hs.action}>
                        <TableCell className="font-medium">{getActionText(hs.action)}</TableCell>
                        <TableCell>{getUpdatedField(hs.updatedField)}</TableCell>
                        <TableCell>{getText(hs.updatedField, hs.oldValue)}</TableCell>
                        <TableCell>{getText(hs.updatedField, hs.newValue)}</TableCell>
                        <TableCell>{hs.contributor}</TableCell>
                        <TableCell>{new Date(hs.createdAt).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default BugView;
