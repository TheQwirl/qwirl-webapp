"use client";
import React from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { BarChart3 } from "lucide-react";
import PrimaryQwirlRightSidebar from "../../_components/primary-qwirl-right-sidebar";
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { useSearchParams } from "next/navigation";
import QwirlResponsesViewer from "@/components/qwirl/qwirl-response-viewer";

const PrimaryQwirlAnalyticsPage = () => {
  const {
    polls,
    setShowAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    showAddDialog,
  } = useQwirlEditor();
  const searchParams = useSearchParams();
  const responderIdRaw = searchParams.get("responder");
  let responderId: number | undefined = undefined;
  if (responderIdRaw && /^\d+$/.test(responderIdRaw)) {
    responderId = Number(responderIdRaw);
  }
  return (
    <>
      <PageLayout
        rightSidebar={<PrimaryQwirlRightSidebar polls={polls} />}
        backNavigation={{
          title: (
            <div className="text-base lg:text-lg whitespace-nowrap font-semibold flex items-center gap-2 ">
              <BarChart3 className="h-4 lg:h-5 w-4 lg:w-5" />
              Analytics
            </div>
          ),
          subtitle: "View analytics for your primary qwirl",
          hideBackButton: true,
        }}
      >
        <div className="relative grid grid-cols-12 gap-5 ">
          <div className="overflow-hidden col-span-full lg:col-span-full px-4 pb-4 space-y-4">
            <QwirlResponsesViewer responder_id={responderId} />
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default PrimaryQwirlAnalyticsPage;
