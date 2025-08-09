
export interface Bug {
  id: string;
  projectId: string;
  summary: string;
  description: string;
  environment: string;
  severity: string;
  version: string;
  category: string;
  currentBehavior: string;
  expectedBehavior: string;
  stackTrace: string;
  status: string;
  attachment?: string;
  createdDate: Date;
  expiredDate: Date;
  closedDate?: Date;
  updatedDate?: Date;
  createdBy: string;
  contributorId: string;
}
