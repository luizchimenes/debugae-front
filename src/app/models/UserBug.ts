import { DefectCategory } from "../enums/DefectCategory";
import { ProjectBug } from "./ProjectBug";

export interface UserBug {
  id: string;
  description: string;
  summary: string;
  status: string;
  defectPriority: string;
  expirationDate: Date;
  createdAt: Date;
  category: string;
  project: ProjectBug;
}