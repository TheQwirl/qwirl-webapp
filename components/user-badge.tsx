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
    <div className="rounded-full text-xs border flex items-center gap-1 bg-card text-card-foreground">
      <UserAvatar
        name={user.name ?? ""}
        image={user.avatar ?? ""}
        size={"xs"}
      />
      {/* Limit the name width and truncate long names; show full name on hover with title */}
      <div
        className="py-1 pr-2 max-w-[50px] truncate"
        title={user.name ?? ""}
        aria-label={user.name ?? ""}
      >
        {user.name}
      </div>
    </div>
  );
};

export default UserBadge;
