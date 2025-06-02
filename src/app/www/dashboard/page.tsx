import DashboardTemplate from "@templates/DashboardTemplate";
import ProtectedRoute from "@/app/utils/ProtectedRoute";

const LoginPage = () => {
  return (
    <ProtectedRoute>
      <DashboardTemplate />;
    </ProtectedRoute>
  );
};

export default LoginPage;
