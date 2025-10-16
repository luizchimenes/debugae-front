export interface Metrics {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
}

export interface DefectByStatus {
  name: string;
  value:  number;
}

export interface DefectBySeverity {
  name: string;
  value:  number;
}

export interface DefectByStatus {
  name: string;
  value:  number;
}

export interface DefectByCategory {
  name: string;
  value:  number;
}

export interface DefectByVersion {
  name: string;
  value:  number;
}

export interface DefectTimeline {
  date: string;
  totalDefects: number;
}

export interface ProjectReportResponse {
  metrics: Metrics;
  statusData: DefectByStatus[];
  severityData: DefectBySeverity[];
  categoryData: DefectByCategory[];
  timelineData: DefectTimeline[];
  resolutionIndex: number;
  defectByVersion: DefectByVersion[];
  averageResolutionTime: number;
  invalidDefectsPercentage: number;
}