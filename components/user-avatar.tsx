import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import clsx from "clsx";

interface UserAvatarProps {
  name: string;
  image: string;
  className?: string;
}

const UserAvatar = ({ name, image, className }: UserAvatarProps) => {
  return (
    <Avatar className={clsx("h-14 w-14 rounded-lg", className)}>
      <AvatarImage src={image} alt={"Something"} />
      <AvatarFallback className="rounded-lg uppercase">
        {name?.split(" ")?.[0]?.slice(0, 2) || name?.split(" ")?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
