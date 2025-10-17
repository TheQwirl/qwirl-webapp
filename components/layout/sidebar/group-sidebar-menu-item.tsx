import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { MenuItem } from "@/constants/data-sidebar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type GroupSidebarMenuItemProps = {
  item: MenuItem;
};

const GroupSidebarMenuItem = ({ item }: GroupSidebarMenuItemProps) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const activeUrls =
    item?.children
      ?.filter((subItem) => subItem.url)
      ?.map((subItem) => subItem.url) || [];

  // Check if any child is active to determine if should be open by default
  const isAnyChildActive = activeUrls.includes(pathname);

  return (
    <Collapsible
      asChild
      defaultOpen={isAnyChildActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className="group/collapsible hover:text-white duration-300 transition-all relative"
            isActive={activeUrls.includes(pathname)}
            tooltip=""
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <item.icon
              style={{ width: "20px", height: "20px" }}
              className={`mr-2 transition-transform duration-500 ${
                isHovered ? "animate-[wave_0.6s_ease-in-out]" : ""
              }`}
            />
            <span className="text-sm font-medium text-nowrap">
              {item.title}
            </span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 w-4 h-4" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((subItem) => {
              if (!subItem.url) {
                console.warn(
                  `GroupSidebarMenuItem: Missing URL for subItem "${subItem.title}"`
                );
                return null;
              }

              return (
                <SidebarMenuSubItem className="mt-1.5" key={subItem.title}>
                  <SidebarMenuSubButton
                    isActive={pathname === subItem.url}
                    asChild
                    className="hover:text-white duration-300 transition-all"
                  >
                    <Link href={subItem.url}>
                      <subItem.icon
                        className="mr-2"
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span className="text-sm">{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default GroupSidebarMenuItem;
