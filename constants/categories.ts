import {
  Utensils,
  Sparkles,
  Leaf,
  User,
  Brain,
  Film,
  Users,
  Trophy,
  Cpu,
  Plane,
} from "lucide-react";

export const categoryMeta = {
  "Food and Beverages": {
    bg: "#FFF1E6", // pastel peach
    fg: "#9A3412",
    icon: Utensils,
  },
  "Future and Imagination": {
    bg: "#EEF2FF", // pastel indigo
    fg: "#3730A3",
    icon: Sparkles,
  },
  "Nature and Environment": {
    bg: "#ECFDF5", // pastel green
    fg: "#065F46",
    icon: Leaf,
  },
  "Personal Preferences": {
    bg: "#FDF2F8", // pastel pink
    fg: "#9D174D",
    icon: User,
  },
  "Philosophy and Soul": {
    bg: "#F5F3FF", // pastel violet
    fg: "#5B21B6",
    icon: Brain,
  },
  "Pop Culture and Entertainment": {
    bg: "#FFF7ED", // pastel orange
    fg: "#9A3412",
    icon: Film,
  },
  "Relationships and Social Life": {
    bg: "#F0FDF4", // pastel mint
    fg: "#166534",
    icon: Users,
  },
  "Sports and Games": {
    bg: "#EFF6FF", // pastel blue
    fg: "#1D4ED8",
    icon: Trophy,
  },
  "Technology and Trends": {
    bg: "#F8FAFC", // pastel gray
    fg: "#334155",
    icon: Cpu,
  },
  "Travel and Exploration": {
    bg: "#ECFEFF", // pastel cyan
    fg: "#155E75",
    icon: Plane,
  },
} as const;

export const CATEGORY_LIST = Object.keys(categoryMeta);
export type Category = keyof typeof categoryMeta;
