import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";

const SidebarSingleMenuItem = ({
  item,
}: {
  item: { title: string; url?: string; icon: IconType };
}) => {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname === item?.url}>
        <a href={item.url}>
          <item.icon
            className="mr-2"
            style={{ width: "20px", height: "20px" }}
          />
          <span className="text-base">{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarSingleMenuItem;
