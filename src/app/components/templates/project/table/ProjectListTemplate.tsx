"use client";

import { ThemeToggle } from "../../../molecules/ThemeToggle";
import DashboardHeader from "../../../organism/DashboardHeader";
import { ProjectDataTable } from "../../../molecules/ProjectDataTable";
import { columns, Project } from "./columns";
import { ProjectService } from "@/app/services/projectService";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/atoms";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";

const ProjectListTemplate = () => {
  const [data, setData] = useState<Project[]>([]);

  const loggedUser = useAtomValue(userAtom);

  useEffect(() => {
    if (loggedUser && loggedUser.id) {
      setData(ProjectService.getAllProjectsByUser(loggedUser.id));
    }
  }, [loggedUser]);

  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex items-center justify-center py-8">
        <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
          <ProjectDataTable columns={columns} data={data} />
        </Card>
      </main>
      <ThemeToggle />
    </div>
  );
};

export default ProjectListTemplate;
