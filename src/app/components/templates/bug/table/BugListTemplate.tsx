"use client";

import { ThemeToggle } from "../../../molecules/ThemeToggle";
import DashboardHeader from "../../../organism/DashboardHeader";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/atoms";
import { BugDataTable } from "@/app/components/molecules/BugDataTable";
import { Bug, BugService } from "@/app/services/bugService";
import { AuthService } from "@/app/services/authService";

const BugListTemplate = () => {
  const [data, setData] = useState<Bug[]>([]);

  const loggedUser = AuthService.getLoggedUser()

  useEffect(() => {
    setData(BugService.getAllBugsByUser(loggedUser.id));
  }, []);

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
