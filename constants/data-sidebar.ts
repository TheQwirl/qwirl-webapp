import { FaRegNewspaper } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuBadgeInfo } from "react-icons/lu";
import { PiSealQuestionFill } from "react-icons/pi";
import { RiUserCommunityFill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { TbMessageQuestion } from "react-icons/tb";

export // Menu items array
const MENU_ITEMS = [
  {
    title: "Feed",
    icon: FaRegNewspaper,
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
    type: "group",
    children: [
      {
        title: "Qwirl Details",
        icon: LuBadgeInfo,
        url: "/qwirls/primary/details",
      },
      {
        title: "Qwirl Editor",
        icon: TbEdit,
        url: "/qwirls/primary/editor",
      },
    ],
  },
  {
    title: "Community",
    icon: RiUserCommunityFill,
    url: "/community",
    type: "single",
  },
  {
    title: "Question Bank",
    icon: TbMessageQuestion,
    url: "/question-bank",
    type: "single",
  },

  {
    title: "Settings",
    icon: IoSettingsOutline,
    url: "/settings",
    type: "single",
  },
];
