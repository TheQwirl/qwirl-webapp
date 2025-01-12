import React from "react";
import { LogOut } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LogoutComponentProps {
  username: string;
  email: string;
  avatarUrl?: string;
  onLogout: () => void;
}

export function LogoutComponent({
  //   username,
  //   email,
  //   avatarUrl,
  onLogout,
}: LogoutComponentProps) {
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
      {/* <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
        </div>
      </div> */}
      <div
        onClick={onLogout}
        className="w-full flex items-center gap-4 cursor-pointer group/btn "
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4 group-hover/btn:transform group-hover/btn:rotate-180 rotate-0 duration-300 transition-all" />
        Logout
      </div>
    </div>
  );
}
