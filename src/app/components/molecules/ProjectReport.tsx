"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/app/components/atoms';
import { ProjectService } from '@/app/services/projectService';
import { ProjectReportResponse } from '@/app/models/responses/projectReportResponse';
import { format } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/components/atoms/ChartComponent';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart,
  Pie,
} from 'recharts';
import { toast } from 'sonner';

export interface ProjectReportProps {
  projectId: string;
}

const ProjectReport = (props: ProjectReportProps) => {
  const [reportData, setReportData] = useState<ProjectReportResponse | null>(null);
  const [initialDate, setInitialDate] = useState<string | null>(null);
  const [finalDate, setFinalDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatPercent = (value?: number) =>
    typeof value === 'number' && isFinite(value)
      ? (value > 1 ? value : value * 100).toFixed(1)
      : '0.0';

  const formatFixed = (value?: number) =>
    typeof value === 'number' && isFinite(value) ? value.toFixed(1) : '0.0';

  const primary = '#8B5CF6';
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#1f2937';
  const gridColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(148,163,184,0.25)';
  const statusColors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#6366F1', '#8B5CF6'];

  useEffect(() => {
    // Carrega os dados iniciais do relatório ao montar ou quando o projeto mudar
    fetchReportData();
  }, [props.projectId]);

  const fetchReportData = async () => {
    try {
      // Validação do período somente quando o filtro for aplicado manualmente
      if (initialDate && finalDate && new Date(initialDate) > new Date(finalDate)) {
        toast.error('Período inválido: data inicial é maior que a final');
        return;
      }
      setIsLoading(true);
      console.log('Fetching report data with params:', { initialDate, finalDate });
      const data = await ProjectService.fetchProjectReportDataAsync(
        props.projectId,
        initialDate,
        finalDate
      );
      // Helpers to translate/normalize labels and shapes returned by backend
      const translateCategory = (c: string) => {
        const map: Record<string, string> = {
          Functional: 'Funcional',
          Interface: 'Interface',
          Performance: 'Performance',
          Improvement: 'Melhoria',
        };
        return map[c] || c;
      };

      const translateStatus = (s: string) => {
        const key = (s || '').toLowerCase().replace(/\s+/g, '');
        const map: Record<string, string> = {
          new: 'Novo',
          inresolution: 'Em Resolução',
          inprogress: 'Em Resolução',
          resolved: 'Resolvido',
          invalid: 'Inválido',
          reopened: 'Reaberto',
          waitingforuser: 'Aguardando Usuário',
        };
        return map[key] || s;
      };

      const translateSeverity = (s: string) => {
        const key = (s || '').toLowerCase();
        const map: Record<string, string> = {
          veryhigh: 'Muito Alta',
          high: 'Alta',
          medium: 'Média',
          low: 'Baixa',
          verylow: 'Muito Baixa',
          p1: 'Muito Alta',
          p2: 'Alta',
          p3: 'Média',
          p4: 'Baixa',
          p5: 'Muito Baixa',
        };
        return map[key] || s;
      };

      const normalized: ProjectReportResponse = {
        ...data,
        // Fallback para novo nome do backend e cálculo correto do índice (% já pode vir pronto)
        averageResolutionTime:
          // @ts-ignore backend alternative
          (data as any).averageResolutionTime ?? (data as any).defectResolutionAverageTimeInDays ?? 0,
        resolutionIndex: typeof data.resolutionIndex === 'number' ? data.resolutionIndex : 0,
        categoryData: (data.categoryData as any[] | undefined)?.map((c: any) => ({
          name: translateCategory(c.name ?? c.category ?? ''),
          value: c.value ?? c.count ?? 0,
        })) || [],
        severityData: (data.severityData as any[] | undefined)?.map((s: any) => ({
          name: translateSeverity(s.name ?? s.severity ?? s.level ?? ''),
          value: s.value ?? s.count ?? 0,
        })) || [],
        statusData: (data.statusData as any[] | undefined)?.map((s: any) => ({
          name: translateStatus(s.name ?? s.status ?? ''),
          value: s.value ?? s.count ?? 0,
        })) || [],
        timelineData: (data.timelineData as any[] | undefined)?.map((t: any) => ({
          date: t.date ?? t.day ?? t.key ?? '',
          totalDefects: t.totalDefects ?? t.count ?? t.total ?? t.value ?? 0,
        })) || [],
        defectByVersion: (data.defectByVersion as any[] | undefined)?.map((v: any) => ({
          name: v.name ?? v.version ?? v.key ?? '',
          value: v.value ?? v.count ?? v.total ?? 0,
        })) || [],
        metrics: data.metrics,
      };

      setReportData(normalized);
      console.log('reportData', normalized);
    } catch (error) {
      toast.error('Erro ao carregar dados do relatório')
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatório do Projeto</h2>
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <input
              type="date"
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setInitialDate(e.target.value)}
              value={initialDate || ''}
            />
            <span>até</span>
            <input
              type="date"
              className="border rounded p-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={(e) => setFinalDate(e.target.value)}
              value={finalDate || ''}
            />
          </div>
          <button
              onClick={fetchReportData}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h11M3 6h18M3 14h18M3 18h11" />
                </svg>
              )}
              Filtrar
            </button>
          <button
            onClick={async () => {
              try {
                setIsDownloading(true);
                const blob = await ProjectService.downloadAttachmentAsync(props.projectId);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio-projeto-${format(new Date(), 'dd-MM-yyyy')}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
              } catch (error) {
                console.error('Erro ao fazer download do relatório:', error);
              } finally {
                setIsDownloading(false);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            Baixar PDF
          </button>
        </div>
      </div>
      
      {reportData && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-500">Total de Defeitos</h3>
            <p className="text-2xl font-bold">{reportData.metrics.total}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-500">Novos</h3>
            <p className="text-2xl font-bold">{reportData.metrics.new}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-500">Em Resolução</h3>
            <p className="text-2xl font-bold">{reportData.metrics.inProgress}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-gray-500">Resolvidos</h3>
            <p className="text-2xl font-bold">{reportData.metrics.resolved}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Defeitos por Status</h3>
            <div className="h-[300px]">
              <ChartContainer config={{ bugs: { label: 'Defeitos', color: primary } }} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={reportData.statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                    >
                      {reportData.statusData.map((_, index) => (
                        <Cell key={`cell-status-${index}`} fill={statusColors[index % statusColors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            {/* Legenda separada */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {reportData.statusData.map((item, index) => (
                <div key={`legend-status-${index}`} className="flex items-center space-x-2">
                  <span
                    className="inline-block w-3 h-3 rounded-sm"
                    style={{ backgroundColor: statusColors[index % statusColors.length] }}
                  />
                  <span className="text-gray-700 dark:text-gray-200">
                    {item.name}: <span className="font-semibold">{item.value}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Defeitos por Severidade</h3>
            <div className="h-[300px]">
              <ChartContainer config={{ bugs: { label: 'Defeitos', color: primary } }} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.severityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: textColor }} />
                    <YAxis tick={{ fill: textColor }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill={primary} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Defeitos por Categoria</h3>
            <div className="h-[300px]">
              <ChartContainer config={{ bugs: { label: 'Defeitos', color: primary } }} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: textColor }} />
                    <YAxis tick={{ fill: textColor }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Quantidade" fill={primary} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Evolução de Defeitos (últimos 7 dias)</h3>
            <div className="h-[300px]">
              <ChartContainer config={{ bugs: { label: 'Defeitos', color: primary } }} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.timelineData?.map(d => ({ date: format(new Date(d.date), 'dd/MM'), totalDefects: d.totalDefects }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fill: textColor }} />
                    <YAxis tick={{ fill: textColor }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="totalDefects" name="Defeitos" stroke={primary} fill={primary} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-4 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Defeitos por Versão</h3>
            <div className="h-[300px]">
              <ChartContainer config={{ bugs: { label: 'Defeitos', color: primary } }} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.defectByVersion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: textColor }} />
                    <YAxis tick={{ fill: textColor }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" name="Quantidade" fill={primary} radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-4 col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Índice de Resolução</h3>
                <p className="text-3xl font-bold text-primary">
                  {formatPercent(reportData.resolutionIndex)}%
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Tempo Médio de Resolução</h3>
                <p className="text-3xl font-bold text-primary">
                  {formatFixed(reportData.averageResolutionTime)} dias
                </p>
              </div>
            </div>
          </Card>
        </div>
        {/* close inner grid above, now close the wrapper */}
      </div>
      )}
    </div>
  );
};

export default ProjectReport;