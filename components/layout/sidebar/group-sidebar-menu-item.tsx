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

type GroupSidebarMenuItemProps = {
  item: MenuItem;
};

const GroupSidebarMenuItem = ({ item }: GroupSidebarMenuItemProps) => {
  const pathname = usePathname();

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
            className="group/collapsible hover:bg-sidebar-accent hover:text-sidebar-accent-foreground duration-300 transition-all relative data-[active=true]:bg-transparent"
            isActive={activeUrls.includes(pathname)}
            tooltip=""
          >
            {/* Active indicator bar for parent when any child is active */}
            {isAnyChildActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
            )}
            <item.icon
              style={{ width: "20px", height: "20px" }}
              className="mr-2"
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

              const isSubItemActive = pathname === subItem.url;

              return (
                <SidebarMenuSubItem
                  className="mt-1.5 relative"
                  key={subItem.title}
                >
                  <SidebarMenuSubButton
                    isActive={isSubItemActive}
                    asChild
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground duration-300 transition-all data-[active=true]:bg-transparent"
                  >
                    <Link href={subItem.url}>
                      {/* Active indicator bar for subitem */}
                      {isSubItemActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
                      )}
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
