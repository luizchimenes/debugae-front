import { Card, CardHeader, CardTitle } from "../../atoms";
import { CardDescription } from "../../atoms/CardComponent";
import BugCreateForm from "../../molecules/BugCreateForm";
import { ThemeToggle } from "../../molecules/ThemeToggle";
import DashboardHeader from "../../organism/DashboardHeader";

const BugCreateTemplate = () => {
  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex items-center justify-center py-8">
        <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
          <BugCreateForm />
        </Card>
      </main>
      <ThemeToggle />
    </div>
  );
};

export default BugCreateTemplate;
