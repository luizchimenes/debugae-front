"use client";

import { ThemeToggle } from "../../../molecules/ThemeToggle";
import DashboardHeader from "../../../organism/DashboardHeader";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/atoms";
import { BugDataTable } from "@/app/components/molecules/BugDataTable";
import { BugService } from "@/app/services/bugService";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import { UserBug } from "@/app/models/UserBug";
import { StatusDefeito } from "@/app/enums/StatusDefeito";

const BugListTemplate = () => {
  const [data, setData] = useState<UserBug[]>([]);

  const loggedUser = useAtomValue(userAtom);

  const getStatusText = (status: string): string => {
    switch (status) {
      case StatusDefeito.RESOLVIDO:
        return "Resolvido";
      case StatusDefeito.INVALIDO:
        return "Inválido";
      case StatusDefeito.REABERTO:
        return "Reaberto";
      case StatusDefeito.EM_RESOLUCAO:
        return "Em Resolução";
      case StatusDefeito.AGUARDANDO_USUARIO:
        return "Aguardando Usuário";
      default:
        return "Novo";
    }
  }

  useEffect(() => {
    const fetchBugs = async () => {
      const data = await BugService.getAllBugsByUserAsync()
      data.map((bug) => {
        bug.status = getStatusText(bug.status);
      })
      setData(data);
    }

    fetchBugs();

  }, [loggedUser]);

  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex items-center justify-center py-8">
        <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
          <BugDataTable columns={columns} data={data} />
        </Card>
      </main>
      <ThemeToggle />
    </div>
  );
};

export default BugListTemplate;
