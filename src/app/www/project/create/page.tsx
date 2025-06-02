import ProjectCreateTemplate from "@/app/components/templates/project/ProjectCreateTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

const ProjectCreatePage = () => {
  return (
    <ProtectedRoute>
      <ProjectCreateTemplate />;
    </ProtectedRoute>
  );
};

export default ProjectCreatePage;
