import { Card, CardHeader, CardTitle } from "../atoms";
import { CardDescription } from "../atoms/CardComponent";
import ProjectCreateForm from "../molecules/ProjectCreateForm";
import DashboardHeader from "../organism/DashboardHeader";

const ProjectCreateTemplate = () => {
  return (
    <div className="bg-primary dark:bg-gray-900 min-h-screen">
      <DashboardHeader />
      <main className="flex items-center justify-center py-12">
        <Card className="w-[1300px] p-8 dark:bg-gray-800 rounded-lg shadow-md border border-1 border-primary">
          <CardHeader>
            <CardTitle>Cadastrar novo projeto</CardTitle>
            <CardDescription>
              Preencha o formulário com as informações do Projeto
            </CardDescription>
          </CardHeader>
          <ProjectCreateForm />
        </Card>
      </main>
    </div>
  );
};

export default ProjectCreateTemplate;
