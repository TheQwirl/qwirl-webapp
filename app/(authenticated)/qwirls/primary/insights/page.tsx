"use client";
import React, { useState } from "react";
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

const PrimaryQwirlInsightsPage = () => {
  const { polls } = useQwirlEditor();
  const { user } = authStore();
  const searchParams = useSearchParams();
  const responderIdRaw = searchParams.get("responder");

  // Determine initial tab based on responder query param
  const initialTab = responderIdRaw ? "details" : "overview";
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedResponderId, setSelectedResponderId] = useState<
    number | undefined
  >(
    responderIdRaw && /^\d+$/.test(responderIdRaw)
      ? Number(responderIdRaw)
      : undefined
  );

  const { data, isLoading, isError, refetch } = $api.useQuery(
    "get",
    "/qwirl-responses/qwirls/{qwirl_id}/responders",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
        query: {},
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );

  const handleResponderClick = (responderId: number) => {
    setSelectedResponderId(responderId);
    setActiveTab("details");
  };

  return (
    <>
      <PageLayout
        rightSidebar={<PrimaryQwirlRightSidebar polls={polls} />}
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
                  data={data}
                  isLoading={isLoading}
                  isError={isError}
                  refetch={refetch}
                  onResponderClick={handleResponderClick}
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
