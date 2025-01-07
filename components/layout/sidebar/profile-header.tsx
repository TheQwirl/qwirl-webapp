"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarHeader } from "@/components/ui/sidebar";

const ProfileHeader = () => (
  <SidebarHeader>
    <div className="flex items-center justify-center flex-col">
      <Avatar className="h-14 w-14 rounded-lg">
        <AvatarImage src={""} alt={"Something"} />
        <AvatarFallback className="rounded-lg">HZ</AvatarFallback>
      </Avatar>
      <div className="font-bold text-lg">Hassan Zaidi</div>
      <div className="text-muted-foreground text-xs">@hassanzaidi4</div>
    </div>
  </SidebarHeader>
);

export default ProfileHeader;
