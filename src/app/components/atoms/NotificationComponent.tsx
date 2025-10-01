// components/molecules/NotificationCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, ExternalLinkIcon, Eye, Link, Mail } from "lucide-react";
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
import { redirect, useRouter } from "next/navigation";

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
  const GUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

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

  const router = useRouter();
  
  const handleRedirect = async (path: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      router.push(path);
    } catch (err) {
      console.error("Erro ao redirecionar:", err);
      toast.error("Erro ao redirecionar", {
        description: "Ocorreu um problema ao navegar. Tente novamente.",
      });
    }
  };

  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  function extractFirstGuid(text: string): string | null {
    const m = text.match(GUID_REGEX);
    return m ? m[0] : null;
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
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 break-words">
                  {notification.content}
                </p>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"></div>
                )}
                <div className="flex gap-1 mt-1 ml-auto w-fit">
                  <button
                    onClick={() =>
                      handleRedirect(`/www/bugs/view/${extractFirstGuid(notification.content)}`)
                    }
                    className="w-7 h-7 border border-gray-300 rounded-md hover:bg-gray-100 transition flex items-center justify-center"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                  </button>
                  {!notification.isRead ? (
                    <button
                      className="w-7 h-7 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center justify-center"
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
                  ) : (
                    <div className="w-7 h-7 bg-green-600 text-white rounded-md flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
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
