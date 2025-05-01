import { ModeToggle } from "@atoms/theme-toggle";

const DashboardTemplate = () => {
  return (
    <div className="min-h-screen dark:bg-gray-900 flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

    </div>
  );
};

export default DashboardTemplate;
