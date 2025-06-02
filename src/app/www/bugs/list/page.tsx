import BugListTemplate from "@/app/components/templates/bug/table/BugListTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

const BugListPage = () => {
  return (
    <ProtectedRoute>
      <BugListTemplate />;
    </ProtectedRoute>
  );
};

export default BugListPage;
