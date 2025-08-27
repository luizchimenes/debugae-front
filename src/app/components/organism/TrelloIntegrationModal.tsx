"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bug } from "@/app/models/Bug";
import { Button, Input } from "../atoms";
import { Label } from "../atoms/LabelComponent";
import { KanbanSquare, X } from "lucide-react";
import {
  TrelloBoard,
  TrelloCard,
  TrelloService,
  TrelloWorkspace,
} from "@/app/services/trelloService";
import { toast } from "sonner";
import { LoadingOverlay } from "../atoms/LoadingPage";

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
  const [isVisible, setIsVisible] = useState(show);
  const [comment, setComment] = useState("");
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
      console.error(err);
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
        "Error fetching Trello workspaces."
      );
    }
  }, [show]);

  useEffect(() => {
    if (selectedWorkspace) {
      fetchData(
        () => TrelloService.getBoardsAsync(selectedWorkspace),
        setBoards,
        "Error fetching Trello boards."
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
        "Error fetching Trello user stories."
      );
    } else {
      setCards([]);
      setSelectedCard("");
    }
  }, [selectedBoard]);

  const handleCreateCard = async () => {
    if (!selectedWorkspace || !selectedBoard || !selectedCard) {
      toast.warning("Please fill all fields to continue.");
      return;
    }

    try {
      setLoading(true);
      await TrelloService.integrateWithTrelloWithCommentAsync(
        selectedCard,
        bug.defectId,
        comment
      );
      toast.success("Successfully integrated with Trello!");

      setSelectedBoard("");
      setSelectedCard("");
      setSelectedWorkspace("");
      setBoards([]);
      setCards([]);
      setComment("");
      setWorkspaces([]);

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to integrate with Trello.");
    } finally {
      setLoading(false);
    }
  };

  const isLoadingWorkspaces = loading && workspaces.length === 0;
  const isLoadingBoards = loading && boards.length === 0 && !!selectedWorkspace;
  const isLoadingCards = loading && cards.length === 0 && !!selectedBoard;

  if (!isVisible) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => onClose()}
    >
      {loading && (
        <LoadingOverlay
          title="Carregando..."
          subtitle="Carregando dados do trello, por favor aguarde."
          showDots={true}
        />
      )}
      <div
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <KanbanSquare className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Integrar user story com o Trello
            </h3>
          </div>
          <button
            onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Selecione uma workspace, board e user story para integrar o defeito com o Trello.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div>
            <Label htmlFor="workspace" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Workspace
            </Label>
            <select
              id="workspace"
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              disabled={isLoadingWorkspaces}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {isLoadingWorkspaces ? "Carregando workspaces..." : "Selecione uma workspace"}
              </option>
              {workspaces.length > 0
                ? workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {ws.displayName}
                    </option>
                  ))
                : !isLoadingWorkspaces && <option disabled>Nenhuma workspace encontrada</option>}
            </select>
          </div>

          <div>
            <Label htmlFor="board" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Board
            </Label>
            <select
              id="board"
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              disabled={!selectedWorkspace || isLoadingBoards}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {isLoadingBoards ? "Carregando boards..." : "Selecione um board"}
              </option>
              {boards.length > 0
                ? boards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))
                : !isLoadingBoards && <option disabled>No boards found</option>}
            </select>
          </div>

          <div>
            <Label htmlFor="card" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User Story
            </Label>
            <select
              id="card"
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              disabled={!selectedBoard || isLoadingCards}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>
                {isLoadingCards ? "Carregando user stories..." : "Selecione uma user story"}
              </option>
              {cards.length > 0
                ? cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || "(No description)"}
                    </option>
                  ))
                : !isLoadingCards && <option disabled>No user stories found</option>}
            </select>
          </div>
          
          <div>
             <Label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comentário
            </Label>
            <Input
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="w-full p-3"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={() => onClose()}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateCard}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            disabled={!selectedWorkspace || !selectedBoard || !selectedCard || loading}
          >
            Integrar com Trello
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrelloIntegrationModal;