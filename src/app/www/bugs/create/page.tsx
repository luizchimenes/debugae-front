import BugCreateTemplate from "@/app/components/templates/bug/BugCreateTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

const BugCreatePage = () => {
  return (
    <ProtectedRoute>
      <BugCreateTemplate />;
    </ProtectedRoute>
  );
};

export default BugCreatePage;
