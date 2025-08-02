"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { FiClock, FiTrendingUp } from "react-icons/fi";
import clsx from "clsx";
import { useTransition } from "react";
import { FeedTab } from "./type";

interface FeedTabsProps {
  activeTab: FeedTab;
}

const FeedTabs = ({ activeTab }: FeedTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tabs = [
    { key: "recent" as const, label: "Recent", icon: FiClock },
    { key: "explore" as const, label: "Popular", icon: FiTrendingUp },
  ];

  const handleTabChange = (tab: FeedTab) => {
    const params = new URLSearchParams(searchParams);

    if (tab === "recent") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }

    const newUrl = params.toString() ? `/feed?${params.toString()}` : "/feed";

    startTransition(() => {
      router.push(newUrl);
    });
  };

  return (
    <div className="flex sm:flex-row flex-col items-center gap-y-1 gap-x-4">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => handleTabChange(key)}
          disabled={isPending}
          className={clsx(
            "text-xs flex items-center gap-1 cursor-pointer hover:bg-gray-300 hover:text-black duration-300 transition-all px-2 py-1 rounded disabled:opacity-50",
            activeTab === key && "bg-gray-300 text-black",
            isPending && "cursor-wait"
          )}
          aria-pressed={activeTab === key}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
          {isPending && activeTab !== key && (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin ml-1" />
          )}
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
