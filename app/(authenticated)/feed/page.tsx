"use client";
import PageHeader from "@/components/layout/page-header";
import PostCreator from "@/components/posts/post-creator/post-creator";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
import { FiClock, FiUsers, FiTrendingUp } from "react-icons/fi";

import React from "react";

const Feed = () => {
  const isMobile = useIsMobile();
  const [tab, setTab] = React.useState<"recent" | "friends" | "popular">(
    "recent"
  );
  const handleTabChange = (tab: "recent" | "friends" | "popular") => {
    setTab(tab);
  };
  return (
    <div className="grid grid-cols-12 px-5 sm:mt-0 ">
      <div
        className={clsx(
          "col-span-full lg:col-span-8 flex flex-col h-full",
          isMobile ? "col-span-full " : ""
        )}
      >
        <PageHeader
          pageTitle="Feed"
          pageSubTitle="Check out the latest questions"
          extraContent={
            <div className="flex sm:flex-row flex-col items-center gap-y-1 gap-x-4">
              <button
                onClick={() => handleTabChange("recent")}
                className={clsx(
                  "text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 py-1 rounded",
                  tab === "recent" && "bg-gray-300 text-black"
                )}
              >
                <FiClock size={16} />
                <span className="hidden sm:inline">Recent</span>
              </button>

              <button
                onClick={() => handleTabChange("friends")}
                className={clsx(
                  "text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 py-1 rounded",
                  tab === "friends" && "bg-gray-300 text-black"
                )}
              >
                <FiUsers size={16} />
                <span className="hidden sm:inline">Friends</span>
              </button>

              <button
                onClick={() => handleTabChange("popular")}
                className={clsx(
                  "text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 py-1 rounded",
                  tab === "popular" && "bg-gray-300 text-black"
                )}
              >
                <FiTrendingUp size={16} />
                <span className="hidden sm:inline">Popular</span>
              </button>
            </div>
          }
        />
        <div className="pt-8">
          <PostCreator />
        </div>
        <div className="pt-4 pb-6">
          <div className="h-40 bg-green-200 p-6"></div>
          <div className="h-40 bg-green-200 p-6 mt-4"></div>
          <div className="h-40 bg-green-200 p-6 mt-4"></div>
          <div className="h-40 bg-green-200 p-6 mt-4"></div>
          <div className="h-40 bg-green-200 p-6 mt-4"></div>
          <div className="h-40 bg-green-200 p-6 mt-4"></div>
          <div className="h-40 bg-green-200 p-6 mt-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
