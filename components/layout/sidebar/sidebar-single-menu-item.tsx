import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MenuItem } from "@/constants/data-sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarSingleMenuItem = ({ item }: { item: MenuItem }) => {
  const pathname = usePathname();

  if (!item.url) {
    console.warn(`SidebarSingleMenuItem: Missing URL for item "${item.title}"`);
    return null;
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        disabled={item.disabled}
        className="hover:text-white duration-300 transition-all"
        asChild
        isActive={pathname === item.url}
      >
        {item.disabled ? (
          <div className="flex items-center cursor-not-allowed opacity-50">
            <item.icon
              className="mr-2"
              style={{ width: "24px", height: "24px" }}
            />
            <span className="text-lg">{item.title}</span>
          </div>
        ) : (
          <Link href={item.url} className="flex items-center">
            <item.icon
              className="mr-2"
              style={{ width: "24px", height: "24px" }}
            />
            <span className="text-lg">{item.title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarSingleMenuItem;
