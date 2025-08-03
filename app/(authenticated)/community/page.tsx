"use client";

import PageHeader from "@/components/layout/page-header";
import { useIsMobile } from "@/hooks/use-mobile";
import clsx from "clsx";

const Community = () => {
  const isMobile = useIsMobile();
  return (
    <div className="grid grid-cols-12  sm:mt-0 gap-6">
      <div
        className={clsx(
          "col-span-full lg:col-span-8 flex flex-col h-full",
          isMobile ? "col-span-full " : ""
        )}
      >
        <PageHeader
          pageTitle="Qwirl Community"
          pageSubTitle="Explore and engage with the Qwirl community."
        />
      </div>
    </div>
  );
};

export default Community;
