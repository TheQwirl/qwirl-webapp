"use client";
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BarChart3 } from "lucide-react";
import PrimaryQwirlRightSidebar from "../../_components/primary-qwirl-right-sidebar";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsightsOverviewTab } from "../../_components/insights-overview-tab";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import QwirlResponsesViewer from "@/components/qwirl/qwirl-response-viewer";
import { components } from "@/lib/api/v1-client-side";

type SortByOption = "wavelength" | "started_at";

const PrimaryQwirlInsightsPage = () => {
  const { polls } = useQwirlEditor();
  const { user } = authStore();
  const searchParams = useSearchParams();

  // Support both 'responder' and 'id' query parameters
  const responderIdRaw =
    searchParams.get("responder") || searchParams.get("id");

  const initialTab = responderIdRaw ? "details" : "overview";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedResponderId, setSelectedResponderId] = useState<
    number | undefined
  >(
    responderIdRaw && /^\d+$/.test(responderIdRaw)
      ? Number(responderIdRaw)
      : undefined
  );

  // Filter states
  const [sortBy, setSortBy] = useState<SortByOption>("started_at");

  // Update selected responder and tab when query param changes
  useEffect(() => {
    if (responderIdRaw && /^\d+$/.test(responderIdRaw)) {
      const responderId = Number(responderIdRaw);
      setSelectedResponderId(responderId);
      setActiveTab("details");
    } else {
      setSelectedResponderId(undefined);
    }
  }, [responderIdRaw]);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = $api.useInfiniteQuery(
    "get",
    "/qwirl-responses/qwirls/{qwirl_id}/responders",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
        query: {
          sort_by: sortBy as SortByOption,
          limit: 12,
          skip: 0,
        },
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
      initialPageParam: 0,
      pageParamName: "skip",
      getNextPageParam: (
        lastPage: components["schemas"]["QwirlRespondersResponse"],
        allPages: components["schemas"]["QwirlRespondersResponse"][]
      ) => {
        const currentCount = allPages.reduce(
          (sum, page) => sum + (page.responders?.length || 0),
          0
        );
        if (currentCount >= (lastPage.total_count || 0)) return undefined;
        return currentCount;
      },
    }
  );

  const responders = data?.pages.flatMap((page) => page.responders) ?? [];

  const handleResponderClick = (responderId: number) => {
    setSelectedResponderId(responderId);
    setActiveTab("details");
  };

  const handleSortChange = (newSort: SortByOption) => {
    setSortBy(newSort);
  };

  return (
    <>
      <PageLayout
        rightSidebar={
          <PrimaryQwirlRightSidebar isLoading={isLoading} polls={polls} />
        }
        backNavigation={{
          title: (
            <div className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 ">
              <BarChart3 className="h-4 lg:h-5 w-4 lg:w-5" />
              Insights
            </div>
          ),
          subtitle: "View insights for my qwirl",
          hideBackButton: true,
        }}
      >
        <div className="relative grid grid-cols-12 gap-5">
          <div className="overflow-hidden col-span-full lg:col-span-full px-4 pb-4 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <InsightsOverviewTab
                  responders={responders}
                  isLoading={isLoading}
                  isError={isError}
                  isFetchingNextPage={isFetchingNextPage}
                  hasNextPage={hasNextPage || false}
                  refetch={refetch}
                  fetchNextPage={fetchNextPage}
                  onResponderClick={handleResponderClick}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                />
              </TabsContent>
              <TabsContent value="details" className="mt-6">
                <QwirlResponsesViewer responder_id={selectedResponderId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PrimaryQwirlInsightsPage;
