import BugReportTemplate from "@/app/components/templates/report/BugReportTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

const ProjectCreatePage = () => {
  return (
    <ProtectedRoute>
      <BugReportTemplate />;
    </ProtectedRoute>
  );
};

export default ProjectCreatePage;
