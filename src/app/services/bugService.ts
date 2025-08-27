import { v4 as uuidv4 } from "uuid";
import { DefeitoHistoricoService } from "./logService";
import { AuthService } from "./authService";
import { AcaoRealizada } from "../enums/AcaoRealizada";
import { StatusDefeito } from "../enums/StatusDefeito";
import { Bug, BugOld } from "../models/Bug";
import FindDuplicatedDefectRequest from "../models/requests/findDuplicatesDefectsRequest";
import api from "../config/axiosConfig";
import { FindDefectDuplicatesResponse } from "../models/responses/getDefectDuplicatedResponse";
import { CreateDefectResponse } from "../models/responses/createDefectResponse";
import { UserBug } from "../models/UserBug";
import User from "../models/User";

const BUGS_KEY = "bugs";

export const BugService = {
  getAllBugs: (): BugOld[] => {
    if (typeof window === "undefined") return [];
    const bugsJson = localStorage.getItem(BUGS_KEY);
    const bugs: BugOld[] = bugsJson ? JSON.parse(bugsJson) : [];
    return bugs.map((bug) => ({
      ...bug,
      createdDate: new Date(bug.createdDate),
      updatedDate: bug.updatedDate ? new Date(bug.updatedDate) : undefined,
    }));
  },

  getAllBugsByUser: (id: string): BugOld[] => {
    if (typeof window === "undefined") return [];
    const bugsJson = BugService.getAllBugs().filter(
      (bug) => bug.contributorId === id
    );
    return bugsJson || [];
  },

  getAllBugsByUserAsync: async() : Promise<UserBug[]> => {
    const response = await api.get("/defects/getAllDefectsFromUser");

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data.data as UserBug[];
  },

  getAllBugsByProject: (id: string): BugOld[] => {
    if (typeof window === "undefined") return [];
    const bugsJson = BugService.getAllBugs().filter(
      (bug) => bug.projectId === id
    );
    return bugsJson || [];
  },

  saveBug: async (bug: Omit<BugOld, "id">): Promise<BugOld> => {
    const newBug: BugOld = { ...bug, id: uuidv4() };
    const bugs = BugService.getAllBugs();
    bugs.push(newBug);
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));

    const currentUser = await AuthService.getLoggedUser();
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

  deleteBug: async (id: string): Promise<void> => {
    const bugToDelete = BugService.getBugById(id);
    const bugs = BugService.getAllBugs().filter((bug) => bug.id !== id);
    localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));

    if (bugToDelete) {
      const currentUser = await AuthService.getLoggedUser();
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

  // updateBug: async (updatedBug: Bug): Promise<void> => {
  //   const oldBug = BugService.getBugById(updatedBug.defectId);
  //   if (!oldBug) {
  //     console.warn(
  //       `Bug com ID ${updatedBug.defectId} não encontrado para atualização.`
  //     );
  //     return;
  //   }
  //   updatedBug.updatedDate = new Date();
  // updateBug: async (updatedBug: Bug): Promise<void> => {
  //   const oldBug = BugService.getBugById(updatedBug.id);
  //   if (!oldBug) {
  //     console.warn(
  //       `Bug com ID ${updatedBug.defectId} não encontrado para atualização.`
  //     );
  //     return;
  //   }
  //   updatedBug.updatedDate = new Date();

  //   const currentUser = await AuthService.getLoggedUser();
  //   if (!currentUser) {
  //     console.warn(
  //       "Nenhum usuário logado. Não é possível registrar histórico."
  //     );
  //   }
  //   const currentUser = await AuthService.getLoggedUser();
  //   if (!currentUser) {
  //     console.warn(
  //       "Nenhum usuário logado. Não é possível registrar histórico."
  //     );
  //   }

  //   if (oldBug.status !== updatedBug.status) {
  //     if (currentUser) {
  //       let action: AcaoRealizada = AcaoRealizada.ATUALIZACAO_STATUS;
  //   if (oldBug.status !== updatedBug.status) {
  //     if (currentUser) {
  //       let action: AcaoRealizada = AcaoRealizada.ATUALIZACAO_STATUS;

  //       if (
  //         updatedBug.status === StatusDefeito.RESOLVIDO &&
  //         oldBug.status !== StatusDefeito.RESOLVIDO
  //       ) {
  //         updatedBug.closedDate = new Date();
  //         action = AcaoRealizada.FECHAMENTO;
  //       } else if (
  //         updatedBug.status !== StatusDefeito.RESOLVIDO &&
  //         oldBug.status === StatusDefeito.RESOLVIDO
  //       ) {
  //         updatedBug.closedDate = undefined;
  //         action = AcaoRealizada.REABERTURA;
  //       } else {
  //         updatedBug.closedDate = oldBug.closedDate;
  //       }
  //       if (
  //         updatedBug.status === StatusDefeito.RESOLVIDO &&
  //         oldBug.status !== StatusDefeito.RESOLVIDO
  //       ) {
  //         updatedBug.closedDate = new Date();
  //         action = AcaoRealizada.FECHAMENTO;
  //       } else if (
  //         updatedBug.status !== StatusDefeito.RESOLVIDO &&
  //         oldBug.status === StatusDefeito.RESOLVIDO
  //       ) {
  //         updatedBug.closedDate = undefined;
  //         action = AcaoRealizada.REABERTURA;
  //       } else {
  //         updatedBug.closedDate = oldBug.closedDate;
  //       }

  //       DefeitoHistoricoService.salvarHistorico(
  //         updatedBug.id,
  //         action,
  //         currentUser.id,
  //         { status: oldBug.status, closedDate: oldBug.closedDate },
  //         { status: updatedBug.status, closedDate: updatedBug.closedDate }
  //       );
  //     }
  //   } else {
  //     updatedBug.closedDate = oldBug.closedDate;
  //   }
  //       DefeitoHistoricoService.salvarHistorico(
  //         updatedBug.id,
  //         action,
  //         currentUser.id,
  //         { status: oldBug.status, closedDate: oldBug.closedDate },
  //         { status: updatedBug.status, closedDate: updatedBug.closedDate }
  //       );
  //     }
  //   } else {
  //     updatedBug.closedDate = oldBug.closedDate;
  //   }

  //   const bugs = BugService.getAllBugs().map((bug) =>
  //     bug.id === updatedBug.id ? updatedBug : bug
  //   );
  //   localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
  // },
  //   const bugs = BugService.getAllBugs().map((bug) =>
  //     bug.id === updatedBug.id ? updatedBug : bug
  //   );
  //   localStorage.setItem(BUGS_KEY, JSON.stringify(bugs));
  // },

  getBugById: (id: string): BugOld | undefined => {
    return BugService.getAllBugs().find((bug) => bug.id === id);
  },

  getBugByIdAsync: async (id: string): Promise<Bug> => {
    const response = await api.get(`/defects/defectDetails?defectId=${id}`);

    console.log(response)

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data.defectData as Bug;
  },


  getDefectDuplicatesAsync: async (request: FindDuplicatedDefectRequest): Promise<FindDefectDuplicatesResponse> => {
    const response = await api.post('/defects/findDuplicates', request);

    return response.data as FindDefectDuplicatesResponse;
  },

  createDefectAsync: async (formData: FormData): Promise<CreateDefectResponse> => {
    const response = await api.post('/defects/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data as CreateDefectResponse;
  } 
};
