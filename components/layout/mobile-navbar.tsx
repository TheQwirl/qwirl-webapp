"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/constants/data-sidebar";
import { cn } from "@/lib/utils";

// Flatten the menu structure to include all items (parents and children)
const flattenMenuItems = () => {
  const items: {
    title: string;
    icon: React.ElementType;
    url: string;
  }[] = [];

  MENU_ITEMS.forEach((item) => {
    if (item.type === "single") {
      items.push({
        title: item.title,
        icon: item.icon,
        url: item.url ?? "/",
      });
    } else if (item.type === "group" && item?.children) {
      // For groups, add the first child
      if (item.children.length > 0) {
        items.push({
          title: item.title,
          icon: item.icon,
          url: item?.children?.[0]?.url ?? "/",
        });
      }
    }
  });

  return items;
};

export function MobileNavBar() {
  const pathname = usePathname();
  const navItems = flattenMenuItems();

  // Limit to 5 items for the bottom bar (like Twitter)
  const visibleItems = navItems.slice(0, 5);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/60 border-t border-white md:hidden">
      <div className="flex justify-around items-center h-14">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center justify-center w-full h-full",
                isActive ? "text-primary" : "text-foreground"
              )}
              aria-label={item.title}
            >
              <Icon className="h-6 w-6" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
