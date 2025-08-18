import React from "react";
import { UserAvatar } from "./user-avatar";

interface UserBadgeProps {
  user: {
    name: string | undefined | null;
    avatar: string | null;
  };
}

const UserBadge: React.FC<UserBadgeProps> = ({ user }) => {
  return (
    <div className="rounded-full text-xs border flex items-center gap-1 bg-card text-card-foreground ">
      <UserAvatar
        name={user.name ?? ""}
        image={user.avatar ?? ""}
        size={"xs"}
      />
      <div className="py-1 pr-2">{user.name}</div>
    </div>
  );
};

export default UserBadge;
