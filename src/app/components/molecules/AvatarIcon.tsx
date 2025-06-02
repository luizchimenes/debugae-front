"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/AvatarComponent";
import { AuthService } from "@/app/services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../atoms/DropdownMenuComponent";

const AvatarIcon = () => {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    position?: string;
  } | null>(null);

  useEffect(() => {
    const loggedUser = AuthService.getLoggedUser();
    setUser(loggedUser);
  }, []);

  const getInitials = () => {
    if (!user) return "??";
    return (
      (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
    ).toUpperCase();
  };

  const handleLogout = () => {
    AuthService.logout();
    window.location.href = "/www/login";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-between px-2 py-1 rounded-lg border bg-white dark:bg-gray-800 text-sm cursor-pointer min-w-[160px] max-w-xs w-fit">
          <div className="text-right mr-2 leading-tight max-w-[180px]">
            <p className="font-medium text-gray-900 dark:text-white text-left truncate whitespace-nowrap">
              {user ? `${user.firstName} ${user.lastName}` : "Usuário"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-left truncate whitespace-nowrap">
              {user?.position || "Cargo indefinido"}
            </p>
          </div>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_N9NNYyEY-JbGlgfCDksR-cohP8w7AmMpQ&s" />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[9999]">
        <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarIcon;
