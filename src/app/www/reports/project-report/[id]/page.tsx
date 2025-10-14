import ProjectReportTemplate from "@/app/components/templates/report/ProjectReportTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ProjectCreatePage({ params }: PageProps) {
  const { id } = params;
  return (
    <ProtectedRoute>
      <ProjectReportTemplate projectId={id} />
    </ProtectedRoute>
  );
}
