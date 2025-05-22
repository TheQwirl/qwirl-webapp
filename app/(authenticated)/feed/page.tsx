"use client";
import PageHeader from "@/components/layout/page-header";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleTabChange("recent")}
                className={clsx(
                  "cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 rounded",
                  tab === "recent" && "bg-gray-300 text-black"
                )}
              >
                Recent
              </button>
              <button
                onClick={() => handleTabChange("friends")}
                className={clsx(
                  "cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 rounded",
                  tab === "friends" && "bg-gray-300 text-black"
                )}
              >
                Friends
              </button>
              <button
                onClick={() => handleTabChange("popular")}
                className={clsx(
                  "cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 rounded",
                  tab === "popular" && "bg-gray-300 text-black"
                )}
              >
                Popular
              </button>
            </div>
          }
        />
        <div className="py-8">
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
