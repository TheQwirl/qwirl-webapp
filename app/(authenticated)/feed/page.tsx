"use client";
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
    <div className="grid grid-cols-12 max-h-screen mt-4 sm:mt-0 overflow-auto relative">
      <div
        className={clsx(
          "col-span-8 flex flex-col h-full",
          isMobile ? "col-span-full px-3" : "px-5"
        )}
      >
        <div className="py-6 bg-background sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Feed</h1>
              <p className="text-muted-foreground text-sm">
                Check out the latest questions
              </p>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
