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
    contributorEmail: string;
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
  relatedDefects: RelatedDefect[];
  history: {
    action: string;
    updatedField: string | null;
    oldValue: string | null;
    newValue: string | null;
    contributor: string;
    createdAt: string;
  }[];
  trelloUserStories: TrelloUserStory[];
  logStackTrace: string;
  tags: string[];
  projectId: string;
}

export interface TrelloUserStory {
  defectId: string;
  desc: string;
  name: string;
  shortUrl: string;
}

export interface RelatedDefect {
  category: string;
  createdAt: string;
  id: string;
  status: string;
  summary: string;
  defectPriority: string;
  description: string;
  expirationDate: string;
  project: relatedDefectProject;
}

export interface relatedDefectProject {
  projectId: string;
  projectName: string;
  createdAt: string;
  projectDescription: string;
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
