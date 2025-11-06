"use client";
import React from "react";
import { useQwirlLogic } from "@/hooks/qwirl-response/useQwirlLogic";
import QwirlStateRenderer from "./qwirl-respond/qwirl-state-renderer";
import QwirlInteractive from "./qwirl-respond/qwirl-interactive";
import { components } from "@/lib/api/v1-client-side";

interface QwirlRespondProps {
  user: components["schemas"]["UserProfileResponse"] | undefined;
}

const QwirlRespond: React.FC<QwirlRespondProps> = ({ user }) => {
  const {
    // Data
    data,
    polls,
    currentPoll,
    user: userData,
    qwirlCoverData,

    // UI State
    showInteractive,

    // State
    isAnsweredCurrent,
    isSkippedCurrent,
    isCompleted,
    isReviewMode,
    isAnsweringNew,
    currentPosition,
    userAnswer,
    skippedIds,
    newCount,
    unansweredCount,
    prevNavigable,

    // Comment state
    existingComment,
    showCommentBox,
    isEditingComment,
    commentDraft,
    setCommentDraft,

    // Query state
    isLoading,
    isCoverLoading,

    // Mutation states
    isSubmitAnswerPending,
    isSaveCommentPending,
    isFinishSessionPending,

    // Handlers
    handleVote,
    handlePrevious,
    handlePrimaryCta,
    handleOpenCommentBox,
    handleCancelComment,
    handleSaveComment,
    handleShowInteractive,
    handleNotifyMe,
    startReview,
    startAnsweringNew,
    getPrimaryCtaText,
  } = useQwirlLogic({ user });

  return (
    <QwirlStateRenderer
      user={userData}
      data={data}
      pollsLength={polls.length}
      newCount={newCount}
      unansweredCount={unansweredCount}
      qwirlCoverData={qwirlCoverData}
      isLoading={isLoading}
      isCoverLoading={isCoverLoading}
      isCompleted={isCompleted}
      isReviewMode={isReviewMode}
      isAnsweringNew={isAnsweringNew}
      showInteractive={showInteractive}
      startReview={startReview}
      startAnsweringNew={startAnsweringNew}
      handleShowInteractive={handleShowInteractive}
      handleNotifyMe={handleNotifyMe}
    >
      <QwirlInteractive
        currentPoll={currentPoll}
        pollsLength={polls.length}
        user={userData!}
        isAnsweredCurrent={isAnsweredCurrent}
        isSkippedCurrent={isSkippedCurrent}
        isReviewMode={isReviewMode}
        currentPosition={currentPosition}
        userAnswer={userAnswer}
        skippedCount={skippedIds.size}
        prevNavigable={prevNavigable}
        existingComment={existingComment}
        showCommentBox={showCommentBox}
        isEditingComment={isEditingComment}
        commentDraft={commentDraft}
        isSubmitAnswerPending={isSubmitAnswerPending}
        isSaveCommentPending={isSaveCommentPending}
        isFinishSessionPending={isFinishSessionPending}
        handleVote={handleVote}
        handlePrevious={handlePrevious}
        handlePrimaryCta={handlePrimaryCta}
        handleOpenCommentBox={handleOpenCommentBox}
        handleCancelComment={handleCancelComment}
        handleSaveComment={handleSaveComment}
        onCommentDraftChange={setCommentDraft}
        getPrimaryCtaText={getPrimaryCtaText}
      />
    </QwirlStateRenderer>
  );
};

export default QwirlRespond;
