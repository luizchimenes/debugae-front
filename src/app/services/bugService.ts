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
  attachment?: string; // base64 ou URL
  createdBy: string; // id do usuário/admin
}

const BUGS_KEY = "bugs";

export const getAllBugs = (): Bug[] => {
  if (typeof window === "undefined") return [];
  const bugsJson = localStorage.getItem(BUGS_KEY);
  return bugsJson ? JSON.parse(bugsJson) : [];
};

export const saveBug = (bug: Omit<Bug, "id">): void => {
  const newBug: Bug = { ...bug, id: uuidv4() };
  const bugs = getAllBugs();
  bugs.push(newBug);
  localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
};

export const deleteBug = (id: string): void => {
  const bugs = getAllBugs().filter((bug) => bug.id !== id);
  localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
};

export const updateBug = (updatedBug: Bug): void => {
  const bugs = getAllBugs().map((bug) => (bug.id === updatedBug.id ? updatedBug : bug));
  localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
};

export const getBugById = (id: string): Bug | undefined => {
  return getAllBugs().find((bug) => bug.id === id);
};
