// app/services/defeitoHistoricoService.ts

import { v4 as uuidv4 } from "uuid";
import { Bug } from "../models/Bug";
import { AcaoRealizada } from "../enums/AcaoRealizada";

export interface DefeitoHistorico {
  id: string;
  bugId: string; 
  criadoEm: Date;
  acaoRealizada: AcaoRealizada;
  dadosAntigos?: Partial<Bug>; 
  dadosNovos?: Partial<Bug>;
  realizadoPorUserId: string; 
  comentario?: string; 
}

const DEFEITO_HISTORICO_KEY = "defeitoHistorico";

export const DefeitoHistoricoService = {
  getAllHistorico: (): DefeitoHistorico[] => {
    if (typeof window === "undefined") return [];
    const historicoJson = localStorage.getItem(DEFEITO_HISTORICO_KEY);
    const historico: DefeitoHistorico[] = historicoJson ? JSON.parse(historicoJson) : [];
    return historico.map(entry => ({
      ...entry,
      criadoEm: new Date(entry.criadoEm),
    }));
  },

  getByBugId: (bugId: string | undefined): DefeitoHistorico[] => {
    if (typeof window === "undefined") return [];
    const historico = DefeitoHistoricoService.getAllHistorico();
    return historico.filter((entry) => entry.bugId === bugId).sort((a, b) => {
        return new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime();
    });
  },

  salvarHistorico: (
    bugId: string,
    acao: AcaoRealizada,
    realizadoPorUserId: string,
    dadosAntigos?: Partial<Bug>,
    dadosNovos?: Partial<Bug>,
    comentario?: string 
  ): DefeitoHistorico => {
    const now = new Date();
    const newEntry: DefeitoHistorico = {
      id: uuidv4(),
      bugId,
      criadoEm: now,
      acaoRealizada: acao,
      dadosAntigos: dadosAntigos || {},
      dadosNovos: dadosNovos || {},
      realizadoPorUserId,
      comentario, 
    };

    const historico = DefeitoHistoricoService.getAllHistorico();
    historico.push(newEntry);
    localStorage.setItem(DEFEITO_HISTORICO_KEY, JSON.stringify(historico));
    return newEntry;
  },

};