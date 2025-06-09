import { v4 as uuidv4 } from "uuid";
import { DefeitoHistoricoService } from "./logService";
import { AuthService } from "./authService";
import { AcaoRealizada } from "../enums/AcaoRealizada";
import { StatusDefeito } from "../enums/StatusDefeito";

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
    const bugs: Bug[] = bugsJson ? JSON.parse(bugsJson) : [];
    return bugs.map((bug) => ({
      ...bug,
      createdDate: new Date(bug.createdDate),
      updatedDate: bug.updatedDate ? new Date(bug.updatedDate) : undefined,
    }));
  },

  getAllBugsByUser: (id: string): Bug[] => {
    if (typeof window === "undefined") return [];
    const bugsJson = BugService.getAllBugs().filter(
      (bug) => bug.contributorId === id
    );
    return bugsJson || [];
  },

  getAllBugsByProject: (id: string): Bug[] => {
    if (typeof window === "undefined") return [];
    const bugsJson = BugService.getAllBugs().filter(
      (bug) => bug.projectId === id
    );
    return bugsJson || [];
  },

  saveBug: (bug: Omit<Bug, "id">): Bug => {
    const newBug: Bug = { ...bug, id: uuidv4() };
    const bugs = BugService.getAllBugs();
    bugs.push(newBug);
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));

    const currentUser = AuthService.getLoggedUser();
    if (currentUser) {
      DefeitoHistoricoService.salvarHistorico(
        newBug.id,
        AcaoRealizada.CRIACAO,
        currentUser.id,
        {},
        {
          summary: newBug.summary,
          status: newBug.status,
          severity: newBug.severity,
        }
      );
    }
    return newBug;
  },

  deleteBug: (id: string): void => {
    const bugToDelete = BugService.getBugById(id);
    const bugs = BugService.getAllBugs().filter((bug) => bug.id !== id);
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));

    if (bugToDelete) {
      const currentUser = AuthService.getLoggedUser();
      if (currentUser) {
        DefeitoHistoricoService.salvarHistorico(
          bugToDelete.id,
          AcaoRealizada.EXCLUSAO,
          currentUser.id,
          { summary: bugToDelete.summary, status: bugToDelete.status },
          {}
        );
      }
    }
  },

  updateBug: (updatedBug: Bug): void => {
    const oldBug = BugService.getBugById(updatedBug.id);
    if (!oldBug) {
      console.warn(
        `Bug com ID ${updatedBug.id} não encontrado para atualização.`
      );
      return;
    }
    updatedBug.updatedDate = new Date();

    const currentUser = AuthService.getLoggedUser();
    if (!currentUser) {
      console.warn(
        "Nenhum usuário logado. Não é possível registrar histórico."
      );
    }

    if (oldBug.status !== updatedBug.status) {
      if (currentUser) {
        let action: AcaoRealizada = AcaoRealizada.ATUALIZACAO_STATUS;

        if (
          updatedBug.status === StatusDefeito.RESOLVIDO &&
          oldBug.status !== StatusDefeito.RESOLVIDO
        ) {
          updatedBug.closedDate = new Date();
          action = AcaoRealizada.FECHAMENTO;
        } else if (
          updatedBug.status !== StatusDefeito.RESOLVIDO &&
          oldBug.status === StatusDefeito.RESOLVIDO
        ) {
          updatedBug.closedDate = undefined;
          action = AcaoRealizada.REABERTURA;
        } else {
          updatedBug.closedDate = oldBug.closedDate;
        }

        DefeitoHistoricoService.salvarHistorico(
          updatedBug.id,
          action,
          currentUser.id,
          { status: oldBug.status, closedDate: oldBug.closedDate },
          { status: updatedBug.status, closedDate: updatedBug.closedDate }
        );
      }
    } else {
      updatedBug.closedDate = oldBug.closedDate;
    }

    const bugs = BugService.getAllBugs().map((bug) =>
      bug.id === updatedBug.id ? updatedBug : bug
    );
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
  },

  getBugById: (id: string): Bug | undefined => {
    return BugService.getAllBugs().find((bug) => bug.id === id);
  },

  getProjectById: (id: string): Bug[] => {
    return BugService.getAllBugs().filter((bug) => bug.projectId === id);
  },
};
