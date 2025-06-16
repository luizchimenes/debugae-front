"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { Button } from "../atoms";
import { Bug, BugService } from "@/app/services/bugService";
import {
  Bug as BugIcon,
  Calendar,
  User,
  Settings,
  ArrowLeft,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  FileText,
  Monitor,
  GitBranch,
  Edit3,
  File,
  Clock1,
  Plus,
  Eye,
  Download,
} from "lucide-react";
import ChangeStatusModal from "../organism/ChangeStatusModal";
import { Comment, CommentService } from "@/app/services/commentService";
import { AuthService } from "@/app/services/authService";
import { User as UserModel, UserService } from "@/app/services/userService";
import { Project, ProjectService } from "@/app/services/projectService";
import { StatusDefeito } from "@/app/enums/StatusDefeito";
import { CommentsSection } from "./BugComments";
import { UtilService } from "@/app/services/utilService";
import { DefeitoSeveridade } from "@/app/enums/DefeitoSeveridade";
import {
  DefeitoHistorico,
  DefeitoHistoricoService,
} from "@/app/services/logService";
import BugHistoryTab from "./BugLogs";

interface BugViewProps {
  bugId: string;
}

type BugWithProject = Bug & {
  project?: Project;
};

const BugView = ({ bugId }: BugViewProps) => {
  const [bug, setBug] = useState<BugWithProject | undefined>();
  const [contributor, setContributor] = useState<UserModel | undefined>();
  const [creator, setCreator] = useState<UserModel | undefined>();
  const [project, setProject] = useState<Project | undefined>();
  const [logs, setLogs] = useState<DefeitoHistorico[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [comments, setComments] = useState<Comment[] | undefined>([]);

  const loggedUser = AuthService.getLoggedUser();

  useEffect(() => {
    fetchAll();
  }, [bugId]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const bugData = await BugService.getBugById(bugId);

      setBug(bugData);

      const [userData, rawComments, creatorData, projectData, logsData] =
        await Promise.all([
          UserService.getById(bugData?.contributorId),
          CommentService.getAllCommentsByBug(bugData?.id),
          UserService.getById(bugData?.createdBy),
          ProjectService.getById(bugData?.projectId),
          DefeitoHistoricoService.getByBugId(bugData?.id),
        ]);

      setContributor(userData);
      setCreator(creatorData);
      setComments(rawComments);
      setProject(projectData);
      setLogs(logsData);
    } catch (error) {
      console.error("Erro ao carregar dados do defeito:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
  };

  const handleBugStatusChanged = (updatedBug: Bug) => {
    setBug(updatedBug);
    fetchAll();
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Defeito #{bug.id || "N/A"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {bug.summary || "Sem resumo"}
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

      {bug && (
        <ChangeStatusModal
          show={showStatusModal}
          onClose={handleCloseStatusModal}
          bug={bug}
          onStatusChanged={handleBugStatusChanged}
          getStatusColor={getStatusColor}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 dark:text-white">
                {bug.summary || "Sem título"}
              </CardTitle>
              <CardDescription className="text-base mb-4">
                {bug.description || "Sem descrição"}
              </CardDescription>
              <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Criado em{" "}
                    {bug.createdDate
                      ? UtilService.formatDate(bug.createdDate)
                      : "Data não disponível"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>
                    Por{" "}
                    {creator?.firstName + " " + creator?.lastName ||
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
                  className={`text-2xl ${getSeverityColor(bug.severity || "Baixa")} dark:text-white`}
                >
                  {bug.severity || "Não definida"}
                </CardTitle>
              </div>
              <div
                className={`p-3 ${getSeverityBgColor(bug.severity || "Baixa")} rounded-lg`}
              >
                <AlertTriangle
                  className={`w-6 h-6 ${getSeverityColor(bug.severity || "Baixa")}`}
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
                  className={`text-2xl ${getStatusColor(bug.status || "Aberto")} dark:text-white`}
                >
                  {bug.status || "Não definido"}
                </CardTitle>
              </div>
              <div
                className={`p-3 ${getStatusBgColor(bug.status || "Aberto")} rounded-lg`}
              >
                {React.cloneElement(getStatusIcon(bug.status || "Aberto"), {
                  className: `w-6 h-6 ${getStatusColor(bug.status || "Aberto")}`,
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
                  className={`text-2xl ${getExpirationTextColor(bug.expiredDate)}`}
                >
                  {UtilService.formatDate(bug.expiredDate) || "N/A"}
                </CardTitle>
              </div>
              <div
                className={`p-3 rounded-lg border ${getExpirationBgColor(bug.expiredDate)}`}
              >
                <Clock1
                  className={`w-6 h-6 ${getExpirationTextColor(bug.expiredDate)} `}
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
                  {bug.category || "Não definida"}
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
              {(contributor?.firstName || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {contributor?.firstName + " " + contributor?.lastName ||
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
              Comentários ({comments?.length})
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
                    {bug.description || "Nenhuma descrição disponível"}
                  </p>
                </div>

                {bug.environment && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      Ambiente
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 bg-blue-50 dark:bg-gray-900 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      {bug.environment}
                    </p>
                  </div>
                )}

                {(bug.currentBehavior || bug.expectedBehavior) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bug.currentBehavior && (
                      <div>
                        <h3 className="font-semibold text-red-700 dark:text-red-400 mb-3">
                          ❌ Comportamento Atual
                        </h3>
                        <p className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-gray-900 p-4 rounded-lg border border-red-100 dark:border-red-800">
                          {bug.currentBehavior}
                        </p>
                      </div>
                    )}
                    {bug.expectedBehavior && (
                      <div>
                        <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3">
                          ✅ Comportamento Esperado
                        </h3>
                        <p className="text-green-700 dark:text-green-300 bg-green-50 dark:bg-gray-900 p-4 rounded-lg border border-green-100 dark:border-green-800">
                          {bug.expectedBehavior}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {bug.stackTrace && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      🔍 Stack Trace
                    </h3>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                      {bug.stackTrace}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Projeto
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {project?.name || "Não especificado"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Categoria
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {bug.category || "Não definida"}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                      Responsável
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {contributor?.firstName || "Não atribuído"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <CommentsSection bugId={bugId} loggedUser={loggedUser} />
            )}

            {activeTab === "history" && (
              <BugHistoryTab history={logs} getStatusColor={getStatusColor} />
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
                              {UtilService.getFileName(bug.attachment)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {UtilService.getFileType(bug.attachment)} •{" "}
                              {UtilService.getFileSize(bug.attachment)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => UtilService.downloadAttachment(bug.attachment!)}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar
                          </Button>
                          {UtilService.isImageFile(bug.attachment) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => UtilService.previewAttachment(bug.attachment!)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                          )}
                        </div>
                      </div>

                      {UtilService.isImageFile(bug.attachment) && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <img
                            src={bug.attachment}
                            alt="Anexo do defeito"
                            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200 dark:border-gray-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                        <span>
                          Este anexo foi enviado em{" "}
                          {UtilService.formatDate(bug.createdDate)} por{" "}
                          {creator?.firstName + " " + creator?.lastName}
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
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default BugView;
