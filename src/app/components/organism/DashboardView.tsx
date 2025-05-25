import { Card, CardHeader, CardTitle } from "../atoms";
import { CardDescription } from "../atoms/CardComponent";
import DashboardBugView from "../molecules/DashboardBugView";
import DashboardProjectView from "../molecules/DashboardProjectView";

const DashboardView = () => {
  return (
    <main className="flex items-center justify-center py-12">
      <Card className="w-full max-w-[1350px] mx-auto p-5 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
        <CardHeader>
          <CardTitle>Dashboard Inicial</CardTitle>
          <hr />
          <CardDescription>Visualize as informações e atividades mais recentes do seu usuário</CardDescription>
        </CardHeader>
        <div className="flex flex-row space-x-6 w-full">
          <DashboardProjectView />
          <DashboardBugView />
        </div>
      </Card>
    </main>
  );
};

export default DashboardView;
