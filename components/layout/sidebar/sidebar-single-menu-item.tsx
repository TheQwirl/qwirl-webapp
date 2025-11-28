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

  const isActive = pathname === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        disabled={item.disabled}
        className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground duration-300 transition-all relative data-[active=true]:bg-transparent"
        asChild
        isActive={isActive}
      >
        {item.disabled ? (
          <div className="flex items-center cursor-not-allowed opacity-50">
            {/* Active indicator bar */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
            )}
            <item.icon className="mr-2" size={20} />
            <span className="text-sm font-medium">{item.title}</span>
          </div>
        ) : (
          <Link href={item.url} className="flex items-center">
            {/* Active indicator bar */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-primary" />
            )}
            <item.icon className="mr-2" size={20} />
            <span className="text-sm font-medium">{item.title}</span>
          </Link>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarSingleMenuItem;
