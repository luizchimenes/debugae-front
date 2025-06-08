import { Navigation } from "../molecules/Navigation";
import AvatarIcon from "../molecules/AvatarIcon";
import LogoIcon from "../molecules/LogoIcon";
import NotificationCard from "../atoms/NotificationComponent";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between p-7">
      <LogoIcon />
      <Navigation />
      <div className="flex items-center space-x-3">
        <NotificationCard />
        <AvatarIcon />
      </div>
    </header>
  );
};

export default DashboardHeader;
