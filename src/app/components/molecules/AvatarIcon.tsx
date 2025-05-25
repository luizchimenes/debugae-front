"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/AvatarComponent";

const AvatarIcon = () => {
  return (
    <div className="flex items-center justify-between px-2 py-1 rounded-lg border w-full max-w-[160px] bg-white dark:bg-gray-800 text-sm">
      <div className="text-right mr-2 leading-tight">
        <p className="font-medium text-gray-900 dark:text-white">Luiz Gustavo</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Desenvolvedor</p>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_N9NNYyEY-JbGlgfCDksR-cohP8w7AmMpQ&s" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default AvatarIcon;
