export interface GetProjectDetailsResponseColaborator {
  colaboratorId: string;
  colaboratorName: string;
  colaboratorRole: string;
  colaboratorEmail: string;
}

export interface GetProjectDetailsResponseDefect {
  id: string;
  description: string;
  summary: string;
  status: string;
  defectPriority: string;
  expirationDate: string;
  createdAt: string;
} 

export interface GetProjectDetailsResponse {
  projectId: string;
  projectName: string;
  projectDescription: string;
  createdAt: string;
  totalColaborators: number;
  totalDefects: number;
  totalOpen: number;
  totalClosed: number;
  totalResolved: number;
  totalInvalid: number;
  totalReopened: number;
  totalWaitingForUser: number;
  colaborators: GetProjectDetailsResponseColaborator[];
  defects: GetProjectDetailsResponseDefect[];
}