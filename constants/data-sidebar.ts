import { FaCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { PiSealQuestionFill } from "react-icons/pi";
import { RiUserCommunityFill } from "react-icons/ri";
import { TbMessageQuestion } from "react-icons/tb";
import { GoHomeFill } from "react-icons/go";

export interface MenuItem {
  title: string;
  icon: React.ElementType;
  url: string;
  type: "single" | "group";
  children?: MenuItem[];
  disabled?: boolean;
}

export // Menu items array
const MENU_ITEMS = [
  {
    title: "Home",
    icon: GoHomeFill,
    url: "/feed",
    type: "single",
  },
  {
    title: "Profile",
    icon: FaCircleUser,
    url: "/profile",
    type: "single",
  },
  {
    title: "My Qwirl",
    icon: PiSealQuestionFill,
    url: "/qwirls/primary",
    type: "single",
  },
  {
    title: "Community",
    icon: RiUserCommunityFill,
    url: "/community",
    type: "single",
    disabled: true,
  },
  {
    title: "Question Bank",
    icon: TbMessageQuestion,
    url: "/question-bank",
    type: "single",
    disabled: true,
  },

  {
    title: "Settings",
    icon: IoSettingsOutline,
    url: "/settings",
    type: "single",
    disabled: true,
  },
] as MenuItem[];
