export interface DefectDuplicatesViewModel {
  defectId: string,
  projectId: string,
  assignedToUserId: string,
  summary: string,
  description: string,
  environment: string,
  severity: string,
  category: string,
  version: string,
  createdAt: string,
  status: string,
  score: number
}

export interface FindDefectDuplicatesResponse {
  duplicatesCount: number,
  defects: DefectDuplicatesViewModel[]
}