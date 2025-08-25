export interface ManageContributorsRequest {
  projectId: string;
  contributorEmail: string;
  isAdding: boolean; // true for adding, false for removing
}