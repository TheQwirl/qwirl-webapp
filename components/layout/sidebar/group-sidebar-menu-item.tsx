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
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";

type GroupSidebarMenuItemProps = {
  item: {
    title: string;
    icon: IconType;
    children?: {
      title: string;
      url: string;
      icon: IconType;
    }[];
  };
};

const GroupSidebarMenuItem = ({ item }: GroupSidebarMenuItemProps) => {
  const pathname = usePathname();
  return (
    <Collapsible asChild defaultOpen={true} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={item?.children
              ?.map((subItem) => subItem.url)
              .includes(pathname)}
            tooltip=""
          >
            <item.icon
              style={{ width: "20px", height: "20px" }}
              className="mr-2"
            />
            <span className="text-base">{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((subItem) => (
              <SidebarMenuSubItem className="mt-2" key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={pathname === subItem.url}
                  asChild
                >
                  <a href={subItem.url}>
                    <subItem.icon
                      className="mr-2"
                      style={{ width: "20px", height: "20px" }}
                    />
                    <span className="text-base">{subItem.title}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default GroupSidebarMenuItem;
