import { Card } from "../atoms";
import { ThemeToggle } from "../molecules/ThemeToggle";
import About from "../organism/About";
import DashboardHeader from "../organism/DashboardHeader";

const AboutTemplate = () => {
  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex items-center justify-center py-8">
        <Card className="w-full max-w-[1350px] mx-auto p-8 dark:bg-gray-800 rounded-lg shadow-md border border-primary">
          <About />
        </Card>
      </main>
      <ThemeToggle />
    </div>
  );
};

export default AboutTemplate;
