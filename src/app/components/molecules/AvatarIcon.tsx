"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../atoms/AvatarComponent";
import { AuthService } from "@/app/services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenuComponent";
import { useAtom } from "jotai";
import { userAtom } from "@/app/stores/atoms/userAtom";
import React from "react";
import { LoadingOverlay } from "../atoms/LoadingPage";

const AvatarIcon = () => {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = React.useState(false);

  const getInitials = () => {
    if (!user) return "??";
    return (
      (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
    ).toUpperCase();
  };

  const handleLogout = async () => {
    setLoading(true);
    await AuthService.logout();
    setUser(null);
    setLoading(false);
    window.location.href = "/www/login";
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between p-1 md:px-2 md:py-1 rounded-lg border bg-white dark:bg-gray-800 text-sm cursor-pointer">
          <div className="hidden sm:block text-right mr-2 leading-tight max-w-[120px] md:max-w-[180px]">
            <p className="font-medium text-gray-900 dark:text-white text-left truncate whitespace-nowrap text-xs md:text-sm">
              {user ? `${user.firstName} ${user.lastName}` : "Usuário"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left truncate whitespace-nowrap">
              {user?.position || "Cargo indefinido"}
            </p>
          </div>

          <Avatar className="h-7 w-7 md:h-8 md:w-8 shrink-0">
            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_N9NNYyEY-JbGlgfCDksR-cohP8w7AmMpQ&s" />
            <AvatarFallback className="text-xs md:text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[9999] w-40 md:w-48">
        <div className="sm:hidden px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white text-sm">
            {user ? `${user.firstName} ${user.lastName}` : "Usuário"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.position || "Cargo indefinido"}
          </p>
        </div>
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarIcon;
