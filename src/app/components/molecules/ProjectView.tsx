"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/atoms/CardComponent";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { Button } from "../atoms";
import { User, UserService } from "@/app/services/userService";
import { ProjectService, Project } from "@/app/services/projectService";
import {
  Bug,
  Users,
  Calendar,
  BarChart3,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  Tag,
  Settings,
  Download,
  ArrowLeft,
} from "lucide-react";
import { Bug as Bugs, BugService } from "@/app/services/bugService";
import ProjectEditModal from "../organism/ProjectChangeModal";
import { useRouter } from "next/navigation";
import { AuthService } from "@/app/services/authService";
import { LoadingOverlay } from "../atoms/LoadingPage";
import { toast } from "sonner";

interface ProjectViewProps {
  projectId: string;
}

const ProjectView = ({ projectId }: ProjectViewProps) => {
  const [project, setProject] = useState<Project | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [bugs, setBugs] = useState<Bugs[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [showChangeModal, setShowChangeModal] = useState(false);

  const loggedUser = AuthService.getLoggedUser();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [projectData, userData, bugData] = await Promise.all([
          ProjectService.getById(projectId),
          UserService.getAll(),
          BugService.getProjectById(projectId),
        ]);

        if (projectData) {
          setProject(projectData);
        }
        setAllUsers(userData);
        if (bugData) {
          setBugs(bugData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-100 text-red-800 border-red-200",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
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

  const getStatusIcon = (status: string) => {
    const icons = {
      open: <Bug className="w-4 h-4" />,
      "in-progress": <Clock className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <Bug className="w-4 h-4" />;
  };

  const handleOpenEditModal = () => {
    setShowChangeModal(true);
  };

  const handleCloseEditModal = () => {
    setShowChangeModal(false);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const handleViewDefect = async (defectId: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      router.push(`/www/bugs/view/${defectId}`);
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast.error("Erro ao redirecionar", {
        description: "Ocorreu um problema ao navegar. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  const filteredDefects = bugs.filter((bug) => {
    const matchesSearch =
      bug.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || bug.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "all" || bug.severity === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getDefectStats = () => {
    const total = bugs.length;
    const open = bugs.filter((d) => d.status === "open").length;
    const inProgress = bugs.filter((d) => d.status === "in-progress").length;
    const resolved = bugs.filter((d) => d.status === "resolved").length;

    return { total, open, inProgress, resolved };
  };


  if (!project) {
    return (
      <div className="text-center py-12">
        <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Projeto não encontrado</p>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/www/project/list")}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    );
  }

  const contributorNames = project.contributors.map((id) => {
    const user = allUsers.find((u) => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : "Desconhecido";
  });

  const stats = getDefectStats();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {project.name}
          </h1>
          <p className="text-gray-600 mt-1 dark:text-white">
            Gerenciamento de defeitos do projeto
          </p>
        </div>
        <div className="flex space-x-3">
          {/* <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button> */}
          {loggedUser.id == project.adminId && (
            <Button variant="outline" size="sm" onClick={handleOpenEditModal}>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/www/project/list")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 dark:text-white">
                {project.name}
              </CardTitle>
              <CardDescription className="text-base mb-4">
                {project.description}
              </CardDescription>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="dark:text-white">
                    Criado em{" "}
                    {new Date(project.createdAt || "").toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="dark:text-white">
                    {project.contributors.length} colaboradores
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
                <CardDescription>Total de Defeitos</CardDescription>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  {stats.total}
                </CardTitle>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Abertos</CardDescription>
                <CardTitle className="text-2xl text-red-600 dark:text-red-400">
                  {stats.open}
                </CardTitle>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <Bug className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Em Progresso</CardDescription>
                <CardTitle className="text-2xl text-yellow-600 dark:text-yellow-400">
                  {stats.inProgress}
                </CardTitle>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription>Resolvidos</CardDescription>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                  {stats.resolved}
                </CardTitle>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <ProjectEditModal
        show={showChangeModal}
        onClose={handleCloseEditModal}
        project={project}
        onProjectUpdated={handleProjectUpdated}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-300" />
            Colaboradores do Projeto
          </CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {contributorNames.map((name, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-8 h-8 bg-purple-400 dark:bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {name.charAt(0)}
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-100 truncate">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="flex items-center">
                <Bug className="w-5 h-5 mr-2 text-red-600" />
                Defeitos do Projeto
              </CardTitle>
              <CardDescription className="mt-1">
                {filteredDefects.length} de {bugs.length} defeitos encontrados
              </CardDescription>
            </div>
            <Button onClick={() => (window.location.href = "/www/bugs/create")}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Defeito
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar defeitos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os Status</option>
                <option value="Novo">Abertos</option>
                <option value="in-progress">Em Progresso</option>
                <option value="resolved">Resolvidos</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todas as Prioridades</option>
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="h-96">
          <div className="p-6 pt-0">
            {filteredDefects.length === 0 ? (
              <div className="text-center py-12">
                <Bug className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2 dark:text-white">
                  Nenhum defeito encontrado
                </h3>
                <p className="text-gray-500">
                  {searchTerm ||
                  selectedStatus !== "all" ||
                  selectedPriority !== "all"
                    ? "Tente ajustar os filtros de busca"
                    : "Este projeto ainda não possui defeitos cadastrados"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDefects.map((bug) => (
                  <div
                    key={bug.id}
                    className="border border-primary dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getPriorityColor(bug.severity)}`}
                          ></div>
                          <h3 className="font-semibold text-gray-800 truncate dark:text-white">
                            #{bug.id} - {bug.summary}
                          </h3>
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bug.status)}`}
                          >
                            {getStatusIcon(bug.status)}
                            <span className="capitalize">
                              {bug.status.replace("-", " ")}
                            </span>
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 dark:text-white">
                          {bug.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span className="dark:text-white">
                              Criado:{" "}
                              {new Date(
                                bug.createdDate || ""
                              ).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <span className="dark:text-white">
                              Prioridade: {bug.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          className="cursor-pointer hover:bg-muted transition"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDefect(bug.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default ProjectView;
