"use client"

import { use } from "react";
import ProjectViewTemplate from "@/app/components/templates/project/ProjectViewTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectViewPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <ProjectViewTemplate projectId={id} />
    </ProtectedRoute>
  );
}