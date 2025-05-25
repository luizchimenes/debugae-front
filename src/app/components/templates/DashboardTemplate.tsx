import { ThemeToggle } from "../molecules/ThemeToggle";
import DashboardHeader from "../organism/DashboardHeader";
import DashboardView from "../organism/DashboardView";

const DashboardTemplate = () => {
  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen flex flex-col">
      <DashboardHeader />
      <DashboardView />
      <ThemeToggle />
    </div>
  );
};

export default DashboardTemplate;
