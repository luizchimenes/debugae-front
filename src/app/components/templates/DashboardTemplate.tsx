import { ThemeToggle } from "../molecules/ThemeToggle";
import DashboardHeader from "../organism/DashboardHeader";

const DashboardTemplate = () => {
  return (
    <div className="bg-gradient-main dark:bg-gradient-main min-h-screen">
      <DashboardHeader />
      <ThemeToggle />
    </div>
  );
};

export default DashboardTemplate;
