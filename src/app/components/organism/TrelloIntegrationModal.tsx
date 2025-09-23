"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bug } from "@/app/models/Bug";
import { toast } from "sonner";
import { LoadingOverlay } from "../atoms/LoadingPage";
import {
  TrelloBoard,
  TrelloCard,
  TrelloService,
  TrelloWorkspace,
} from "@/app/services/trelloService";
import { KanbanSquare, X } from "lucide-react";

interface TrelloIntegrationModalProps {
  show: boolean;
  onClose: () => void;
  bug: Bug;
}

const TrelloIntegrationModal = ({ show, onClose, bug }: TrelloIntegrationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<TrelloWorkspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [boards, setBoards] = useState<TrelloBoard[]>([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [cards, setCards] = useState<TrelloCard[]>([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [comment, setComment] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const fetchData = async <T,>(
    fetchFn: () => Promise<T>,
    setter: (data: T) => void,
    errorMessage: string
  ) => {
    try {
      setLoading(true);
      const response = await fetchFn();
      setter(response);
    } catch (err) {
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchData(
        () => TrelloService.getAllWorkspacesAsync(),
        setWorkspaces,
        "Erro ao buscar workspaces do Trello."
      );
    }
  }, [show]);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchData(
        () => TrelloService.getBoardsAsync(selectedWorkspace),
        setBoards,
        "Erro ao buscar boards do Trello."
      );
    } else {
      setBoards([]);
      setSelectedBoard("");
    }
  }, [selectedWorkspace]);

  useEffect(() => {
    if (selectedBoard) {
      fetchData(
        () => TrelloService.getCardsAsync(selectedBoard),
        setCards,
        "Erro ao buscar user stories do Trello."
      );
    } else {
      setCards([]);
      setSelectedCard("");
    }
  }, [selectedBoard]);

  const handleCreateCard = async () => {
    if (!selectedWorkspace || !selectedBoard || !selectedCard) {
      toast.warning("Preencha todos os campos para continuar.");
      return;
    }

    try {
      setLoading(true);
      await TrelloService.integrateWithTrelloWithCommentAsync(
        selectedCard,
        bug.defectId,
        comment
      );
      toast.success("Integração com o Trello realizada com sucesso!");

      setSelectedBoard("");
      setSelectedCard("");
      setSelectedWorkspace("");
      setBoards([]);
      setCards([]);
      setComment("");
      setWorkspaces([]);

      onClose();
    } catch {
      toast.error("Erro ao integrar com o Trello.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {loading && (
        <LoadingOverlay
          title="Carregando..."
          subtitle="Carregando dados do Trello, por favor aguarde."
          showDots
        />
      )}
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Integrar user story com o Trello
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Selecione uma workspace, board e user story para integrar o defeito{" "}
          <span className="font-medium text-gray-900 dark:text-gray-200">#{bug.defectId}</span>.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="workspace"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Workspace
            </label>
            <select
              id="workspace"
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              disabled={loading}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loading ? "Carregando workspaces..." : "Selecione uma workspace"}
              </option>
              {workspaces.length > 0 ? (
                workspaces.map((ws) => (
                  <option key={ws.id} value={ws.id}>
                    {ws.displayName}
                  </option>
                ))
              ) : (
                <option disabled>Nenhuma workspace encontrada</option>
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="board"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Board
            </label>
            <select
              id="board"
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              disabled={!selectedWorkspace || loading}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loading ? "Carregando boards..." : "Selecione um board"}
              </option>
              {boards.length > 0 ? (
                boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))
              ) : (
                <option disabled>Nenhum board encontrado</option>
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="card"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              User Story
            </label>
            <select
              id="card"
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              disabled={!selectedBoard || loading}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {loading ? "Carregando user stories..." : "Selecione uma user story"}
              </option>
              {cards.length > 0 ? (
                cards.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || "(Sem descrição)"}
                  </option>
                ))
              ) : (
                <option disabled>Nenhuma user story encontrada</option>
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Comentário
            </label>
            <input
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateCard}
            disabled={!selectedWorkspace || !selectedBoard || !selectedCard || loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Integrar com Trello
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrelloIntegrationModal;
