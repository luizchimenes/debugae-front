"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/atoms/CardComponent";
import { Button } from "../atoms";
import { AuthService } from "@/app/services/authService";
import { Bug, BugService } from "@/app/services/bugService";
import { useEffect, useState } from "react";
import {
  Bug as BugIcon,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Tag,
  Plus,
  Eye,
  ArrowRight,
} from "lucide-react";
import { ScrollArea } from "../atoms/ScrollAreaComponent";
import { UtilService } from "@/app/services/utilService";
import { LoadingOverlay } from "../atoms/LoadingPage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DashboardBugView = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loggedUser = AuthService.getLoggedUser();

  const router = useRouter();

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const data = BugService.getAllBugsByUser(loggedUser.id);
        setBugs(data || []);
      } catch (error) {
        console.error("Erro ao carregar defeitos:", error);
        setBugs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBugs();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200",
      "in-progress":
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
      resolved:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200"
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
      open: <BugIcon className="w-4 h-4" />,
      "in-progress": <Clock className="w-4 h-4" />,
      resolved: <CheckCircle className="w-4 h-4" />,
    };
    return (
      icons[status as keyof typeof icons] || <BugIcon className="w-4 h-4" />
    );
  };

  const handleRedirect = async (path: string) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 50));
      router.push(path);
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast.error("Erro ao redirecionar", {
        description: "Ocorreu um problema ao navegar. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  const isExpiringSoon = (expiredDate: string) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiredDate: string) => {
    const today = new Date();
    const expiry = new Date(expiredDate);
    return expiry < today;
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <BugIcon className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
              Meus Defeitos
            </CardTitle>
            <CardDescription className="mt-1">
              {bugs.length}{" "}
              {bugs.length === 1 ? "defeito atribuído" : "defeitos atribuídos"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="bg-primary text-white" onClick={() => handleRedirect("/www/bugs/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="h-80">
        <div className="p-6 pt-0">
          {bugs.length === 0 ? (
            <div className="text-center py-12">
              <BugIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Nenhum defeito encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Você não possui defeitos atribuídos no momento
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Reportar Defeito
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bugs.map((bug) => (
                <div
                  key={bug.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getPriorityColor(bug.severity)}`}
                        ></div>
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                          #{bug.summary}
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

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Criado:{" "}
                            {new Date(bug.createdDate || "").toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{bug.severity}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm">
                        {isExpired(UtilService.formatDate(bug.expiredDate)) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Expirado
                          </span>
                        ) : isExpiringSoon(
                            UtilService.formatDate(bug.expiredDate)
                          ) ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Expira em breve
                          </span>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            Expira em:{" "}
                            {new Date(bug.expiredDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRedirect("/www/bugs/view/" + bug.id)}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
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

      {bugs.length > 0 && (
        <div className="px-6 pb-6">
          <Button
            variant="outline"
            className="w-full bg-primary text-white"
            onClick={() => handleRedirect("/www/bugs/list")}
          >
            Ver Todos os Defeitos
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </Card>
  );
};

export default DashboardBugView;
