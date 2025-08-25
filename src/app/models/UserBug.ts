
export interface UserBug {
  id: string;
  description: string;
  summary: string;
  status: string;
  defectPriority: string;
  expirationDate: Date;
  createdAt: Date
}