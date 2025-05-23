"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../atoms/AvatarComponent";

const AvatarIcon = () => {
  return (
    <Avatar>
      <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_N9NNYyEY-JbGlgfCDksR-cohP8w7AmMpQ&s" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default AvatarIcon;
