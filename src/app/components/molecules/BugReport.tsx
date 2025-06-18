"use client";

import React, { useState, useEffect } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/atoms/ChartComponent";
import {
  Bug,
  Filter,
  Download,
  Search,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  Calendar1,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  Pie,
} from "recharts";
import { Button, Card, CardHeader, CardTitle, Input } from "../atoms";
import { CardContent, CardDescription } from "../atoms/CardComponent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BugService, Bug as BugModel } from "@/app/services/bugService";
import { AuthService } from "@/app/services/authService";
import { StatusDefeito } from "@/app/enums/StatusDefeito";
import { format } from "date-fns";

const BugReport = () => {
  const [bugs, setBugs] = useState<BugModel[] | undefined>();
  const [loading, setLoading] = useState(false);
  const loggedUser = AuthService.getLoggedUser();
  const [timelineData, setTimelineData] = useState<any>();

  useEffect(() => {
    fetchAll();
  }, [loggedUser?.id]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      if (!loggedUser?.id) return;

      const bugData: BugModel[] = await BugService.getAllBugsByUser(
        loggedUser.id
      );
      setBugs(bugData);

      const grouped: Record<string, number> = {};

      bugData.forEach((bug) => {
        const dateKey = format(new Date(bug.createdDate), "dd/MM");
        grouped[dateKey] = (grouped[dateKey] || 0) + 1;
      });

      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return format(date, "dd/MM");
      });

      const timelineData = last7Days.map((date) => ({
        date,
        bugs: grouped[date] || 0,
      }));

      console.log(timelineData);
      setTimelineData(timelineData);
    } catch (error) {
      console.error("Erro ao carregar defeitos", error);
    } finally {
      setLoading(false);
    }
  };

  const statusData = [
    {
      name: "Novo",
      value: bugs?.filter((bug) => bug.status === StatusDefeito.NOVO).length,
      color: "#3B82F6",
    },
    {
      name: "Em Resolução",
      value: bugs?.filter((bug) => bug.status === StatusDefeito.EM_RESOLUCAO)
        .length,
      color: "#F59E0B",
    },
    {
      name: "Resolvido",
      value: bugs?.filter((bug) => bug.status === StatusDefeito.RESOLVIDO)
        .length,
      color: "#10B981",
    },
    {
      name: "Inválido",
      value: bugs?.filter((bug) => bug.status === StatusDefeito.INVALIDO)
        .length,
      color: "#EF4444",
    },
    {
      name: "Reaberto",
      value: bugs?.filter((bug) => bug.status === StatusDefeito.REABERTO)
        .length,
      color: "#F59E0B",
    },
    {
      name: "Aguardando",
      value: bugs?.filter(
        (bug) => bug.status === StatusDefeito.AGUARDANDO_USUARIO
      ).length,
      color: "#6366F1",
    },
  ];

  const severityData = [
    {
      name: "Muito Alta",
      value: bugs?.filter((bug) => bug.severity == "1").length,
      color: "#EF4444",
    },
    {
      name: "Alta",
      value: bugs?.filter((bug) => bug.severity === "2").length,
      color: "#F59E0B",
    },
    {
      name: "Média",
      value: bugs?.filter((bug) => bug.severity === "3").length,
      color: "#F59E0B",
    },
    {
      name: "Baixa",
      value: bugs?.filter((bug) => bug.severity === "4").length,
      color: "#3B82F6",
    },
    {
      name: "Muito Baixa",
      value: bugs?.filter((bug) => bug.severity === "5").length,
      color: "#3B82F6",
    },
  ];

  const categoryData = [
    {
      name: "Funcional",
      value: bugs?.filter((bug) => bug.category == "Funcional").length || 0,
    },
    {
      name: "Interface",
      value: bugs?.filter((bug) => bug.category == "Interface").length || 0,
    },
    {
      name: "Performance",
      value: bugs?.filter((bug) => bug.category == "Performance").length || 0,
    },
    {
      name: "Melhoria",
      value: bugs?.filter((bug) => bug.category == "Melhoria").length || 0,
    },
  ];

  const metrics = {
    total: bugs?.length,
    novo: bugs?.filter((bug) => bug.status === StatusDefeito.NOVO).length,
    emResolucao: bugs?.filter(
      (bug) => bug.status === StatusDefeito.EM_RESOLUCAO
    ).length,
    resolvido: bugs?.filter((bug) => bug.status === StatusDefeito.RESOLVIDO)
      .length,
    alta: bugs?.filter((bug) => bug.severity === "ALTA").length,
  };

  const exportToPDF = async () => {
    const input = document.getElementById("bug-report");

    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("relatorio-defeitos.pdf");
  };

  const chartConfig = {
    bugs: {
      label: "Defeitos",
      color: "#8B5CF6",
    },
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Relatório de Defeitos
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Visualize e analise os defeitos atribuídos ao seu usuário
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
            <Calendar1 className="w-4 h-4 mr-2" />
            Filtrar Data
          </Button>
          {/* <Button variant="outline" size="sm" onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.total}
                </p>
              </div>
              <Bug className="w-6 h-6 text-purple-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Novos
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {metrics.novo}
                </p>
              </div>
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Em Resolução
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {metrics.emResolucao}
                </p>
              </div>
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Resolvidos
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.resolvido}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardHeader>
        </Card>

        <Card className="border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alta Prioridade
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.alta}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </CardHeader>
        </Card>
      </div>

      <div id="bug-report" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <PieChartIcon className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Defeitos por Status
            </CardTitle>
            <CardDescription>
              Distribuição atual dos defeitos por status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Defeitos por Severidade
            </CardTitle>
            <CardDescription>
              Classificação dos defeitos por nível de severidade
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Tendência de Criação
            </CardTitle>
            <CardDescription>
              Defeitos criados nos últimos 7 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="bugs"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center dark:text-white">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
              Defeitos por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição dos defeitos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BugReport;
