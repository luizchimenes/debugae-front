export interface Bug {
  defectId: string;
  defectDescription: string;
  defectSummary: string;
  createdAt: Date;
  createdByUser: string;
  defectSeverity: string;
  defectStatus: string;
  expirationDate: Date;
  defectCategory: string;
  responsibleContributor: {
    contributorId: string;
    contributorName: string;
  };
  details: {
    defectDescription: string;
    defectEnvironment: string;
    actualBehaviour: string;
    expectedBehaviour: string;
    projectName: string;
    responsibleName: string;
  };
  comments: any[];
  attachment?: {
    fileName: string;
    fileType: string;
    uploadedAt: Date;
    uploadedBy: string;
  };
  relatedDefects: any[];
  history: {
    action: string;
    updatedField: string | null;
    oldValue: string | null;
    newValue: string | null;
    contributor: string;
    createdAt: Date;
  }[];
  trelloUserStories: any[];
  logStackTrace: string;
}


export interface BugOld {
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
