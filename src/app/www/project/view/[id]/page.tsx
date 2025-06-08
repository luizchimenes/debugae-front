"use client"

import ProjectViewTemplate from "@/app/components/templates/project/ProjectViewTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProjectViewPage({ params }: PageProps) {
  const { id } = params;

  return (
    <ProtectedRoute>
      <ProjectViewTemplate projectId={id} />;
    </ProtectedRoute>
  );
}
