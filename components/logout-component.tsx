"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { authStore } from "@/stores/useAuthStore";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function LogoutComponent() {
  const { logout } = authStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
      <div
        onClick={handleLogout}
        className="w-full flex items-center gap-4 cursor-pointer group/btn "
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4 group-hover/btn:transform group-hover/btn:rotate-180 rotate-0 duration-300 transition-all" />
        Logout
      </div>
    </div>
  );
}
