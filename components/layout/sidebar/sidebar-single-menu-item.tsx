import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItem } from "@/constants/data-sidebar";
import { usePathname } from "next/navigation";

const SidebarSingleMenuItem = ({ item }: { item: MenuItem }) => {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="hover:text-white duration-300 transition-all"
        asChild
        isActive={pathname === item?.url}
      >
        <a href={item.url}>
          <item.icon
            className="mr-2"
            style={{ width: "24px", height: "24px" }}
          />
          <span className="text-lg">{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarSingleMenuItem;
