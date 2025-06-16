"use client";

import { useState } from "react";
import { Navigation } from "../molecules/Navigation";
import AvatarIcon from "../molecules/AvatarIcon";
import LogoIcon from "../molecules/LogoIcon";
import NotificationCard from "../atoms/NotificationComponent";
import { Menu, X } from "lucide-react";

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 md:p-6 lg:p-7 relative z-50">
        <div className="flex-shrink-0">
          <LogoIcon />
        </div>

        <div className="hidden lg:flex">
          <Navigation />
        </div>

        <div className="flex items-center space-x-2 md:space-x-3 ">
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg w-8 h-8 dark:bg-gray-800 bg-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <div className="flex items-center space-x-2 md:space-x-3">
            <NotificationCard />
            <AvatarIcon />
          </div>
        </div>
      </header>

      <div
        className={`lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out relative z-50 ${
          isMenuOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <div className="p-4">
          <Navigation />
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-opacity-25 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default DashboardHeader;
