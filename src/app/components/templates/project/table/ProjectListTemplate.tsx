"use client";

import { ThemeToggle } from "../../../molecules/ThemeToggle";
import DashboardHeader from "../../../organism/DashboardHeader";
import { DataTable } from "../../../molecules/ProjectDataTable";
import { columns } from "./columns";
import { Project, ProjectService } from "@/app/services/projectService";
import { useEffect, useState } from "react";
import { Card } from "@/app/components/atoms";

const ProjectListTemplate = () => {
  const [data, setData] = useState<Project[]>([]);

  useEffect(() => {
    setData(ProjectService.getAllProjects());
  }, []);

  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
        <DataTable columns={columns} data={data} />
      </Card>
      <ThemeToggle />
    </div>
  );
};

export default ProjectListTemplate;
