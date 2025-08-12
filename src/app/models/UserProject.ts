import { PapelContribuidor } from "../enums/PapelContribuidor";

export interface UserProject {
  projectId: string;
  projectName: string;
  projectDescription: string;
  totalContributors: number;
  userProjectRole: PapelContribuidor;
}