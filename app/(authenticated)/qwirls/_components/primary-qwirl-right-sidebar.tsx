"use client";
import PollProgressCard from "./poll-progress-card";
import QuickActionsCard from "./quick-actions-card";
import TipsGuideCard from "./tips-guide-card";
import QwirlStatusCard from "./qwirl-status-card";
import SidebarCoverPreviewCard from "./sidebar-cover-preview-card";
import QuestionMomentumCard from "./question-momentum-card";
import { QwirlItem } from "@/types/qwirl";
import React from "react";
import CollapsibleCard from "@/components/collapsible-card";
import { usePathname } from "next/navigation";
import QwirlStatsSummaryCard from "@/components/qwirl/qwirl-stats-summary-card";
import { authStore } from "@/stores/useAuthStore";

type PrimaryQwirlSidebarRoute =
  | "/qwirls/primary/edit"
  | "/qwirls/primary/insights";

const sidebarConfig: Record<PrimaryQwirlSidebarRoute, string[]> = {
  "/qwirls/primary/edit": ["QwirlStatusCard"],
  "/qwirls/primary/insights": ["QwirlStatsSummaryCard"],
};

const PrimaryQwirlRightSidebar = ({
  polls,
  isLoading,
}: {
  polls: QwirlItem[] | undefined;
  isLoading: boolean;
}) => {
  const { user } = authStore();

  const pollCount = polls?.length || 0;
  const pathname = usePathname();
  const cardsToShow = sidebarConfig[pathname as PrimaryQwirlSidebarRoute] || [];

  const componentMap: Record<string, React.ReactNode> = {
    QwirlStatusCard: (
      <QwirlStatusCard
        key="QwirlStatusCard"
        pollCount={pollCount}
        isLoading={isLoading}
        qwirlUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/qwirl/${user?.username}`}
      />
    ),
    SidebarCoverPreviewCard: (
      <SidebarCoverPreviewCard key="SidebarCoverPreviewCard" />
    ),
    PollProgressCard: (
      <PollProgressCard key="PollProgressCard" pollCount={pollCount} />
    ),
    QuickActionsCard: (
      <QuickActionsCard
        key="QuickActionsCard"
        qwirlUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/qwirl/${user?.username}`}
      />
    ),
    TipsGuideCard: <TipsGuideCard key="TipsGuideCard" />,
    QuestionMomentumCard: (
      <QuestionMomentumCard key="QuestionMomentumCard" polls={polls} />
    ),
    QwirlStatsSummaryCard: (
      <CollapsibleCard key="QwirlStatsSummaryCard" title="Qwirl Summary">
        <QwirlStatsSummaryCard />
      </CollapsibleCard>
    ),
  };

  return (
    <div className="hidden lg:block  lg:top-1 lg:col-span-3 py-7 pr-4">
      <div className="col-span-full max-h-fit lg:col-span-4 sticky top-4 flex flex-col gap-6">
        {cardsToShow.map((key) => componentMap[key])}
      </div>
    </div>
  );
};

export default PrimaryQwirlRightSidebar;
