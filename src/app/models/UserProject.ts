import { PapelContribuidor } from "../enums/PapelContribuidor";

export interface UserProjectContributors {
  colaboratorId: string;
  colaboratorName: string;
  colaboratorRole: string;
  colaboratorEmail: string;
}

export interface UserProject {
  projectId: string;
  projectName: string;
  projectDescription: string;
  totalContributors: number;
  userProjectRole: PapelContribuidor;
  colaborators: UserProjectContributors[];
}