import ProjectReportTemplate from "@/app/components/templates/report/ProjectReportTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

export default async function ProjectCreatePage(props: any) {
  const maybeParams = props?.params;
  const params = maybeParams && typeof maybeParams.then === 'function' ? await maybeParams : maybeParams;
  const id = params?.id as string;
  return (
    <ProtectedRoute>
      <ProjectReportTemplate projectId={id} />
    </ProtectedRoute>
  );
}
