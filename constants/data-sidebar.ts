import { FaRegNewspaper } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { LuBadgeInfo } from "react-icons/lu";
import { PiSealQuestionFill } from "react-icons/pi";
import { RiUserCommunityFill } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";

export // Menu items array
const MENU_ITEMS = [
  {
    title: "Feed",
    icon: FaRegNewspaper,
    url: "#",
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
        url: "#",
      },
      {
        title: "Qwirl Editor",
        icon: TbEdit,
        url: "#",
      },
    ],
  },
  {
    title: "Community",
    icon: RiUserCommunityFill,
    url: "#",
    type: "single",
  },
  {
    title: "Profile",
    icon: FaCircleUser,
    url: "#",
    type: "single",
  },
  {
    title: "Settings",
    icon: IoSettingsOutline,
    url: "#",
    type: "single",
  },
];
