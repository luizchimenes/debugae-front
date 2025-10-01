// components/molecules/NotificationCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Check, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenuComponent";
import { AcaoRealizada } from "@/app/enums/AcaoRealizada";
import { useAtom } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import { LoadingOverlay } from "./LoadingPage";
import { NotificationService } from "@/app/services/notificationService";
import { toast } from "sonner";

export interface Notication {
  id: string;
  contributorId: string;
  contributor: any;
  content: string;
  isRead: boolean;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface GetUserNotificationsResponse {
  notifications: Notication[];
}

const NotificationCard = () => {
  const [notifications, setNotifications] = useState<GetUserNotificationsResponse>();
  const [loading, setIsloading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, ]= useAtom(userAtom);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const fetchNotifications = async () => {
      const notifications = await NotificationService.getCurrentUserNotificationsAsync();
      notifications.notifications.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      const unreadCount = notifications.notifications.filter(n => !n.isRead).length;
      setUnreadCount(unreadCount);
      setNotifications(notifications);
    };

    setIsloading(true);
    fetchNotifications()
      .catch(() => toast.error("Erro ao carregar notificações"))
      .finally(() => setIsloading(false));
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    setLoadingIds((ids) => [...ids, notificationId]);
    await NotificationService.markAsReadAsync(notificationId);
    try {
      setNotifications((prev) =>
        prev
          ? {
              ...prev,
              notifications: prev.notifications.map((n) =>
                n.id === notificationId ? { ...n, isRead: true } : n
              ),
            }
          : prev
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Erro ao marcar notificação como lida");
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== notificationId));
    }
  };

  const getActionText = (acao?: AcaoRealizada): string => {
    const actionMap: Record<AcaoRealizada, string> = {
      [AcaoRealizada.CRIACAO]: "Defeito criado",
      [AcaoRealizada.EXCLUSAO]: "Defeito excluído",
      [AcaoRealizada.ATUALIZACAO_STATUS]: "Status alterado",
      [AcaoRealizada.COMENTARIO_ADICIONADO]: "Comentário adicionado",
      [AcaoRealizada.FECHAMENTO]: "Defeito fechado",
      [AcaoRealizada.REABERTURA]: "Defeito reaberto",
    };

    if (!acao) return "Ação realizada";

    return actionMap[acao] ?? "Ação realizada";
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffHours < 24) {
      return `${diffHours}h atrás`;
    } else if (diffDays < 7) {
      return `${diffDays}d atrás`;
    } else {
      return date.toLocaleDateString("pt-BR");
    }
  };

  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] md:min-w-[18px] h-[16px] md:h-[18px] bg-red-500 text-white text-xs font-medium rounded-full px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 md:w-80 max-h-80 md:max-h-96 overflow-y-auto z-[9999]"
      >
        {notifications?.notifications.length === 0 ? (
          <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma notificação encontrada
          </div>
        ) : (
          notifications?.notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`px-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 relative ${!notification.isRead ? 'bg-red-50 dark:bg-gray-800' : ''}`}
            >
              <div className="flex flex-col space-y-1 w-full">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    Notificação
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatDate(new Date(notification.createdAt))}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 break-words">
                  {notification.content}
                </p>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"></div>
                )}
                {!notification.isRead && (
                  <button
                    className="mt-2 self-end px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center gap-2"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await markAsRead(notification.id);
                    }}
                    disabled={loadingIds.includes(notification.id)}
                  >
                    {loadingIds.includes(notification.id) ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                )}
                {notification.isRead && (
                  <div className="mt-2 self-end px-2 py-1 text-xs bg-green-600 text-white rounded flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" />
                    Lida
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        {notifications?.notifications && notifications.notifications.length > 10 && (
          <div className="px-3 py-2 text-center border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{notifications.notifications.length - 10} notificações antigas
            </span>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCard;
