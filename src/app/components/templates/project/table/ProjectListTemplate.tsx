"use client";

import { ThemeToggle } from "../../../molecules/ThemeToggle";
import DashboardHeader from "../../../organism/DashboardHeader";
import { ProjectDataTable } from "../../../molecules/ProjectDataTable";
import { columns } from "./columns";
import { ProjectService } from "@/app/services/projectService";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/atoms";
import { useAtomValue } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import { GetCurrentUsersProject } from "@/app/models/responses/getCurrentUserProjectsResponse";
import { toast } from "sonner";

const ProjectListTemplate = () => {
  const [data, setData] = useState<GetCurrentUsersProject>({items: [], pageSize: 10, page: 1, totalCount: 0});
  const loggedUser = useAtomValue(userAtom);

  useEffect(() => {
    const fetchUserProjects = async () => {
      if (loggedUser && loggedUser.id) {
        try {
          const projects = await ProjectService.getAllProjectsByUserAsync({ page: 1, pageSize: 10 });
          const data: GetCurrentUsersProject = projects;
          setData(data);
        } catch (error) {
          toast.error("Erro ao buscar projetos do usuário.");
        }
      }
    }
    fetchUserProjects();
  }, [loggedUser]);

  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex items-center justify-center py-8">
        <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
          <ProjectDataTable columns={columns} data={data.items}/>
        </Card>
      </main>
      <ThemeToggle />
    </div>
  );
};

export default ProjectListTemplate;
