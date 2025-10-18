"use client";
import PollProgressCard from "./poll-progress-card";
import VisibilityToggleCard from "./visibility-toggle-card";
import QuickActionsCard from "./quick-actions-card";
import TipsGuideCard from "./tips-guide-card";
import QwirlStatusCard from "./qwirl-status-card";
import { QwirlItem } from "@/types/qwirl";
import React from "react";
import CollapsibleCard from "@/components/collapsible-card";
import { usePathname } from "next/navigation";
import EditableQwirlCover from "@/components/qwirl/editable-qwirl-cover";
import QwirlStatsSummaryCard from "@/components/qwirl/qwirl-stats-summary-card";
import { authStore } from "@/stores/useAuthStore";

const minPollsRequired = 15;

type PrimaryQwirlSidebarRoute =
  | "/qwirls/primary/edit"
  | "/qwirls/primary/insights";

const sidebarConfig: Record<PrimaryQwirlSidebarRoute, string[]> = {
  "/qwirls/primary/edit": ["QwirlStatusCard"],
  "/qwirls/primary/insights": ["QwirlStatsSummaryCard"],
};

const PrimaryQwirlRightSidebar = ({
  polls,
}: {
  polls: QwirlItem[] | undefined;
}) => {
  const { user } = authStore();

  const pollCount = polls?.length || 0;
  const isMinimumMet = pollCount >= minPollsRequired;

  const pathname = usePathname();
  const cardsToShow = sidebarConfig[pathname as PrimaryQwirlSidebarRoute] || [];

  const componentMap: Record<string, React.ReactNode> = {
    QwirlStatusCard: (
      <QwirlStatusCard
        pollCount={pollCount}
        minPollsRequired={minPollsRequired}
        qwirlUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/qwirl/${user?.username}`}
      />
    ),
    EditableQwirlCover: (
      <CollapsibleCard className="" defaultOpen={false} title="Qwirl Cover">
        <EditableQwirlCover />
      </CollapsibleCard>
    ),
    PollProgressCard: (
      <PollProgressCard
        pollCount={pollCount}
        minPollsRequired={minPollsRequired}
      />
    ),
    VisibilityToggleCard: (
      <VisibilityToggleCard minPollsRequired={minPollsRequired} />
    ),
    QuickActionsCard: (
      <QuickActionsCard
        isMinimumMet={isMinimumMet}
        minPollsRequired={minPollsRequired}
        qwirlUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/qwirl/${user?.username}`}
      />
    ),
    TipsGuideCard: <TipsGuideCard />,
    QwirlStatsSummaryCard: (
      <CollapsibleCard title="Qwirl Summary">
        <QwirlStatsSummaryCard showTitle={false} orientation="vertical" />
      </CollapsibleCard>
    ),
  };

  return (
    <div className="hidden lg:block  lg:top-1 lg:col-span-3 py-7">
      <div className="col-span-full max-h-fit lg:col-span-4  lg:top-4 flex flex-col gap-6">
        {cardsToShow.map((key) => componentMap[key])}
      </div>
    </div>
  );
};

export default PrimaryQwirlRightSidebar;
