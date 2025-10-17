import { BarChart3, Edit, MessageSquare, Settings, Users, HelpCircle, Waves } from "lucide-react";

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  url?: string; // Made optional for group items
  type: "single" | "group";
  children?: MenuItem[];
  disabled?: boolean;
  section?: string; // For section dividers
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

// Menu items organized by sections
export const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Your Space",
    items: [
      {
        title: "My Qwirl",
        icon: Waves,
        type: "group",
        children: [
          {
            title: "Edit",
            url: "/qwirls/primary/edit",
            type: "single",
            icon: Edit,
          },
          {
            title: "Insights",
            url: "/qwirls/primary/analytics",
            type: "single",
            icon: BarChart3,
          },
          {
            title: "Responses",
            url: "/qwirls/primary/responses",
            type: "single",
            icon: MessageSquare,
          },
        ],
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        title: "Community",
        icon: Users,
        url: "/community",
        type: "single",
      },
      {
        title: "Question Bank",
        icon: HelpCircle,
        url: "/question-bank",
        type: "single",
      },
      {
        title: "Settings",
        icon: Settings,
        url: "/settings",
        type: "single",
      },
    ],
  },
];

// Legacy flat array for backward compatibility (if needed)
export const MENU_ITEMS = MENU_SECTIONS.flatMap(
  (section) => section.items
) as MenuItem[];
