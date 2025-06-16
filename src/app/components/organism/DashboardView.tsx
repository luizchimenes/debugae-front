import { Card, CardHeader, CardTitle } from "../atoms";
import { CardDescription } from "../atoms/CardComponent";
import DashboardBugView from "../molecules/DashboardBugView";
import DashboardProjectView from "../molecules/DashboardProjectView";

const DashboardView = () => {
  return (
    <main className="flex items-center justify-center py-12">
      <Card className="w-full max-w-[1350px] mx-auto p-5 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
        <CardHeader>
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              Menu Inicial
            </h4>
            <p className="text-gray-600 mt-1 dark:text-white">
              Dashboard inicial do sistema
            </p>
          </div>
          <hr />
          <CardDescription>
            Visualize as informações e atividades mais recentes do seu usuário
          </CardDescription>
        </CardHeader>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DashboardProjectView />
          <DashboardBugView />
        </div>
      </Card>
    </main>
  );
};

export default DashboardView;
