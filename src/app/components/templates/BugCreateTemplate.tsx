import { Card, CardHeader, CardTitle } from "../atoms";
import { CardDescription } from "../atoms/CardComponent";
import BugCreateForm from "../molecules/BugCreateForm";
import DashboardHeader from "../organism/DashboardHeader";

const BugCreateTemplate = () => {
  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen">
      <DashboardHeader />
      <main className="flex items-center justify-center py-12">
        <Card className="w-[1300px] p-8 dark:bg-gray-800 rounded-lg shadow-md border border-1 border-primary">
          <CardHeader>
            <CardTitle>Cadastrar novo defeito</CardTitle>
            <CardDescription>
              Preencha o formulário com as informações do defeito
            </CardDescription>
          </CardHeader>
          <BugCreateForm />
        </Card>
      </main>
    </div>
  );
};

export default BugCreateTemplate;
