import { v4 as uuidv4 } from "uuid";

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

const BUGS_KEY = "bugs";
export const BugService = {
    getAllBugs: (): Bug[] => {
      if (typeof window === "undefined") return [];
      const bugsJson = localStorage.getItem(BUGS_KEY);
      return bugsJson ? JSON.parse(bugsJson) : [];
    },

    getAllBugsByUser: (id: String): Bug[] => {
      if (typeof window === "undefined") return [];
      const bugsJson = BugService.getAllBugs().filter((bug) => bug.contributorId === id);
      return bugsJson ? bugsJson : [];
    },

    saveBug: (bug: Omit<Bug, "id">): void => {
      const newBug: Bug = { ...bug, id: uuidv4() };
      const bugs = BugService.getAllBugs();
      bugs.push(newBug);
      localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
    },

    deleteBug: (id: string): void => {
      const bugs = BugService.getAllBugs().filter((bug) => bug.id !== id);
      localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
    },

    updateBug: (updatedBug: Bug): void => {
      const bugs = BugService.getAllBugs().map((bug) => (bug.id === updatedBug.id ? updatedBug : bug));
      localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
    },

    getBugById:  (id: string): Bug | undefined => {
      return BugService.getAllBugs().find((bug) => bug.id === id);
    }
}

