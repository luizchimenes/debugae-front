// components/molecules/NotificationCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenuComponent";
import { AcaoRealizada } from "@/app/enums/AcaoRealizada";
import {
  DefeitoHistorico,
  DefeitoHistoricoService,
} from "@/app/services/logService";
import { BugService } from "@/app/services/bugService";
import { useAtom } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";

const NotificationCard = () => {
  const [notifications, setNotifications] = useState<
    (DefeitoHistorico & { bugSummary?: string })[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set()
  );

  const [user, ]= useAtom(userAtom);

  useEffect(() => {
    if (!user?.id) return;

    const readNotificationsJson = localStorage.getItem(
      `readNotifications_${user.id}`
    );
    const readNotificationsSet = readNotificationsJson
      ? new Set<string>(JSON.parse(readNotificationsJson) as string[])
      : new Set<string>();

    setReadNotifications(readNotificationsSet);

    const allHistorico = DefeitoHistoricoService.getAllHistorico();
    const allBugs = BugService.getAllBugs();

    const userNotifications = allHistorico
      .filter((log: DefeitoHistorico) => {
        if (log.realizadoPorUserId === user.id) return false;

        const bug = allBugs.find((b) => b.id === log.bugId);

        return bug && bug.contributorId === user.id;
      })
      .map((log: DefeitoHistorico) => {
        const bug = allBugs.find((b) => b.id === log.bugId);
        return {
          ...log,
          bugSummary: bug?.summary || "Bug não encontrado",
        };
      });

    userNotifications.sort(
      (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    );

    setNotifications(userNotifications);

    const unreadNotifications = userNotifications.filter(
      (notification) => !readNotificationsSet.has(notification.id)
    );
    setUnreadCount(unreadNotifications.length);
  }, []);

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

  const handleDropdownOpen = () => {
    if (!user?.id) return;

    const allNotificationIds = notifications.map((n) => n.id);
    const updatedReadNotifications = new Set([
      ...readNotifications,
      ...allNotificationIds,
    ]);

    setReadNotifications(updatedReadNotifications);
    setUnreadCount(0);

    localStorage.setItem(
      `readNotifications_${user.id}`,
      JSON.stringify([...updatedReadNotifications])
    );
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && handleDropdownOpen()}>
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
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
            Notificações
          </h3>
        </div>
        {notifications.length === 0 ? (
          <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma notificação encontrada
          </div>
        ) : (
          notifications.slice(0, 10).map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="px-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex flex-col space-y-1 w-full">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {getActionText(notification.acaoRealizada)}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                    {formatDate(notification.criadoEm)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 break-words">
                  {notification.bugSummary}
                </p>
                {notification.comentario && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic break-words">
                    "{notification.comentario}"
                  </p>
                )}
                {!readNotifications.has(notification.id) && (
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute right-2 top-1/2 transform -translate-y-1/2"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
        {notifications.length > 10 && (
          <div className="px-3 py-2 text-center border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{notifications.length - 10} notificações antigas
            </span>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCard;
