import ProjectListTemplate from "@/app/components/templates/project/table/ProjectListTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

const ProjectListPage = () => {
  return (
    <ProtectedRoute>
      <ProjectListTemplate />;
    </ProtectedRoute>
  );
};

export default ProjectListPage;
