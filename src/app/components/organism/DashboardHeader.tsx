import { Navigation } from "../molecules/Navigation";
import AvatarIcon from "../molecules/AvatarIcon";
import { Poppins } from "next/font/google";
import LogoIcon from "../molecules/LogoIcon";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between p-7">
      <LogoIcon />
      <Navigation />
      <AvatarIcon />
    </header>
  );
};

export default DashboardHeader;
