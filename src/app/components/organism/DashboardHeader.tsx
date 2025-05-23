import { ThemeToggle } from "../molecules/ThemeToggle";
import { Navigation } from "../molecules/Navigation";
import AvatarIcon from "../molecules/AvatarIcon";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between p-5">
      <AvatarIcon />
      <Navigation />
      <ThemeToggle />
    </header>
  );
};

export default DashboardHeader;
