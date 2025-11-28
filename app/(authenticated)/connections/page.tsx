"use client";

import React, { useState } from "react";

import { PageLayout } from "@/components/layout/page-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InSyncTab from "./_components/in-sync-tab";
import TheyReachedOutTab from "./_components/they-reached-out-tab";
import YouReachedOutTab from "./_components/you-reached-out-tab";
import { ArrowDownRight, ArrowUpRight, HeartPulse } from "lucide-react";

const WavelengthsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("in-sync");
  return (
    <PageLayout
      rightSidebar={null}
      backNavigation={{
        title: "Connections",
        subtitle: "Who you reached, who reached you, and who's in sync.",
        hideBackButton: true,
      }}
    >
      <div className="relative grid grid-cols-12 gap-5 h-full">
        <div className="overflow-hidden col-span-full lg:col-span-full px-1 sm:px-4 pb-4 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col gap-6"
          >
            <TabsList className="flex sm:grid w-full sm:grid-cols-3">
              <TabsTrigger value="in-sync" className="text-xs sm:text-sm">
                <HeartPulse className="mr-2 h-4 w-4 hidden sm:inline" />
                In Sync
              </TabsTrigger>
              <TabsTrigger
                value="they-reached-out"
                className="text-xs sm:text-sm"
              >
                <ArrowDownRight className="mr-2 h-4 w-4 hidden sm:inline" />
                They Reached Out
              </TabsTrigger>
              <TabsTrigger
                value="you-reached-out"
                className="text-xs sm:text-sm"
              >
                <ArrowUpRight className="mr-2 h-4 w-4 hidden sm:inline" />
                You Reached Out
              </TabsTrigger>
            </TabsList>
            <TabsContent value="in-sync" className="flex-1">
              <InSyncTab />
            </TabsContent>
            <TabsContent value="they-reached-out" className="flex-1">
              <TheyReachedOutTab />
            </TabsContent>
            <TabsContent value="you-reached-out" className="flex-1">
              <YouReachedOutTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default WavelengthsPage;
