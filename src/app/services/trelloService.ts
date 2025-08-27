import api from "../config/axiosConfig";

export interface TrelloWorkspace {
  id: string;
  displayName: string;
}

export interface TrelloBoard {
  id: string;
  name: string;
}

export interface TrelloCard {
  id: string;
  desc: string;
  name: string;
  shortUrl: string;
}

export const TrelloService = {
  getAllWorkspacesAsync: async (): Promise<TrelloWorkspace[]> => {
    const response = await api.get("/trello/workspaces");

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data as TrelloWorkspace[];
  },

  getBoardsAsync: async (workspaceId: string): Promise<TrelloBoard[]> => {
    const response = await api.get(`/trello/boards/${workspaceId}`);

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data as TrelloBoard[];
  },

  getCardsAsync: async (boardId: string): Promise<TrelloCard[]> => {
    const response = await api.get(`/trello/cards/${boardId}`);

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data as TrelloCard[];
  },

  integrateWithTrelloWithCommentAsync: async(cardId: string, defectId: string, comment: string): Promise<void> => {
    const response = await api.post(`/trello/cards/${cardId}/defects/${defectId}/comments/${comment}` );

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
  }
}