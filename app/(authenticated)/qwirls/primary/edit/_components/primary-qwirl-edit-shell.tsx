"use client";

import React, { useMemo } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { PageLayout } from "@/components/layout/page-layout";
import { Badge } from "@/components/ui/badge";
import AddPollDialog from "@/components/qwirl/add-poll-dialog";
import { LibrarySlideOver } from "@/components/question-bank/library-slide-over";
import {
  PrimaryQwirlEditProvider,
  usePrimaryQwirlEdit,
} from "./primary-qwirl-edit-context";
import { STEP_DEFINITION_MAP, StepKey } from "./step-config";
import PrimaryQwirlRightSidebar from "../../../_components/primary-qwirl-right-sidebar";

const OVERVIEW_TITLE = "Build primary qwirl";
const OVERVIEW_SUBTITLE = "Shape the qwirl that feels most like you";

export const PrimaryQwirlEditShell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PrimaryQwirlEditProvider>
      <PrimaryQwirlEditScaffold>{children}</PrimaryQwirlEditScaffold>
    </PrimaryQwirlEditProvider>
  );
};

const PrimaryQwirlEditScaffold = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();
  const {
    qwirlQuery,
    polls,
    stepCards,
    pollCountLabel,
    setShowAddDialog,
    showAddDialog,
    addPollToQwirlMutation,
    handleAddPoll,
    showLibrary,
    setShowLibrary,
    handleAddPollFromLibrary,
  } = usePrimaryQwirlEdit();

  const activeStepKey = segment as StepKey | null;
  const stepCardMap = useMemo(
    () =>
      stepCards.reduce((acc, card) => {
        acc[card.key] = card;
        return acc;
      }, {} as Record<StepKey, (typeof stepCards)[number]>),
    [stepCards]
  );

  const backNavTitle = activeStepKey
    ? `${STEP_DEFINITION_MAP[activeStepKey].stepLabel} · ${STEP_DEFINITION_MAP[activeStepKey].title}`
    : OVERVIEW_TITLE;
  const backNavSubtitle = activeStepKey
    ? STEP_DEFINITION_MAP[activeStepKey].description
    : OVERVIEW_SUBTITLE;

  const badgeLabel = activeStepKey
    ? activeStepKey === "questions"
      ? pollCountLabel
      : stepCardMap[activeStepKey]?.statusLabel ?? ""
    : pollCountLabel;

  const backNavBadge = badgeLabel ? (
    <Badge
      variant="outline"
      className="rounded-full px-3 py-1 text-xs font-medium"
    >
      {badgeLabel}
    </Badge>
  ) : undefined;

  return (
    <>
      <PageLayout
        rightSidebar={
          <PrimaryQwirlRightSidebar
            isLoading={qwirlQuery.isLoading}
            polls={polls}
            cardsToShow={["QwirlStatusCard", "TipsGuideCard"]}
          />
        }
        backNavigation={{
          title: backNavTitle,
          subtitle: backNavSubtitle,
          hideBackButton: !activeStepKey,
          customBackAction: activeStepKey
            ? () => router.push("/qwirls/primary/edit")
            : undefined,
          rightContent: backNavBadge,
        }}
        parentDivClassName="!p-0"
      >
        <div className="relative grid grid-cols-12 gap-5">
          <div className="col-span-full">{children}</div>
        </div>
      </PageLayout>

      <AddPollDialog
        isModalOpen={showAddDialog}
        setIsModalOpen={setShowAddDialog}
        handleAddPoll={handleAddPoll}
        isSubmitting={addPollToQwirlMutation.isPending}
      />

      <LibrarySlideOver
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onAddPoll={handleAddPollFromLibrary}
      />
    </>
  );
};
