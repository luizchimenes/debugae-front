"use client";

import BugReportTemplate from "@/app/components/templates/report/BugReportTemplate";
import ProjectReportTemplate from "@/app/components/templates/report/ProjectReportTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProjectCreatePage = ({ params }: PageProps) => {
  const { id } = use(params);
  
  return (
    <ProtectedRoute>
      <ProjectReportTemplate projectId={id}/>;
    </ProtectedRoute>
  );
};

export default ProjectCreatePage;
