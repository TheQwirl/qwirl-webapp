import {
  Edit,
  Settings,
  Users,
  // Library,
  Home,
  HeartPulseIcon,
  MessageCircleHeart,
} from "lucide-react";
import { QwirlLogoIcon } from "@/components/icons/qwirl-logo-icon";

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
        title: "Home",
        icon: Home,
        url: "/home",
        type: "single",
      },
      {
        title: "My Qwirl",
        icon: QwirlLogoIcon,
        type: "group",
        children: [
          {
            title: "Edit",
            url: "/qwirls/primary/edit",
            type: "single",
            icon: Edit,
          },
          {
            title: "Responses",
            url: "/qwirls/primary/responses",
            type: "single",
            icon: MessageCircleHeart,
          },
        ],
      },
      {
        title: "Connections",
        icon: HeartPulseIcon,
        url: "/connections",
        type: "single",
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        title: "Discover",
        icon: Users,
        url: "/discover",
        type: "single",
      },
      // {
      //   title: "Question Library",
      //   icon: Library,
      //   url: "/question-library",
      //   type: "single",
      // },
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
