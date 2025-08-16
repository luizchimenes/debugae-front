import { DefectCategory } from "@/app/enums/DefectCategory";
import { DefectEnvironment } from "@/app/enums/DefectEnvironment";
import { DefectSeverity } from "@/app/enums/DefectSeverity";

export default interface FindDuplicatedDefectRequest {
  projectId: string,
  summary: string;
  description: string;
  environment: DefectEnvironment,
  severity: DefectSeverity,
  category: DefectCategory,
  version: string
}