import React from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { QwirlItem } from "@/components/qwirl/types";
import { OtherUser } from "@/components/profile/types";
import { CONSTANTS } from "@/constants/qwirl-respond";
import Header from "@/components/qwirl/qwirl-respond/header";
import QuestionHeader from "@/components/qwirl/qwirl-respond/question-header";
import OptionsList from "@/components/qwirl/qwirl-respond/options-list";
import CommentsSection from "@/components/qwirl/qwirl-respond/comment-section";
import Footer from "@/components/qwirl/qwirl-respond/footer";

interface QwirlInteractiveProps {
  currentPoll: QwirlItem | undefined;
  pollsLength: number;
  user: OtherUser;
  // State
  isAnsweredCurrent: boolean;
  isSkippedCurrent: boolean;
  isReviewMode: boolean;
  currentPosition: number;
  userAnswer: string | null;
  skippedCount: number;
  prevNavigable: number | null;
  // Comment state
  existingComment: string | null;
  showCommentBox: boolean;
  isEditingComment: boolean;
  commentDraft: string;
  // Mutation states
  isSubmitAnswerPending: boolean;
  isSaveCommentPending: boolean;
  isFinishSessionPending: boolean;
  // Handlers
  handleVote: (selectedAnswer: string) => void;
  handlePrevious: () => void;
  handlePrimaryCta: () => void;
  handleOpenCommentBox: () => void;
  handleCancelComment: () => void;
  handleSaveComment: () => void;
  onCommentDraftChange: (value: string) => void;
  getPrimaryCtaText: () => string;
}

const QwirlInteractive: React.FC<QwirlInteractiveProps> = ({
  currentPoll,
  pollsLength,
  user,
  isAnsweredCurrent,
  isSkippedCurrent,
  isReviewMode,
  currentPosition,
  userAnswer,
  skippedCount,
  prevNavigable,
  existingComment,
  showCommentBox,
  isEditingComment,
  commentDraft,
  isSubmitAnswerPending,
  isSaveCommentPending,
  isFinishSessionPending,
  handleVote,
  handlePrevious,
  handlePrimaryCta,
  handleOpenCommentBox,
  handleCancelComment,
  handleSaveComment,
  onCommentDraftChange,
  getPrimaryCtaText,
}) => {
  if (!currentPoll) {
    return null;
  }

  const isLastPoll = currentPoll.position === pollsLength;

  return (
    <div
      className={clsx(
        "rounded-2xl border border-primary p-4 relative bg-card text-card-foreground"
      )}
    >
      <Header
        isAnsweredCurrent={isAnsweredCurrent}
        isSkippedCurrent={isSkippedCurrent}
        isSubmitAnswerMutationPending={isSubmitAnswerPending}
        currentPoll={currentPoll}
        pollsLength={pollsLength}
        isReviewMode={isReviewMode}
        skippedCount={skippedCount}
      />

      <div className="py-4 px-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPoll.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{
              duration: CONSTANTS.ANIMATION_DURATION,
              ease: "easeInOut",
            }}
            className="space-y-6 pt-2"
          >
            <QuestionHeader
              questionText={currentPoll.question_text}
              isReviewMode={isReviewMode}
            />

            <OptionsList
              options={currentPoll.options}
              userAnswer={userAnswer}
              ownerAnswer={currentPoll.owner_answer}
              optionStatistics={currentPoll.option_statistics}
              responseCount={currentPoll.response_count}
              onVote={handleVote}
              isReviewMode={isReviewMode}
              isAnsweredCurrent={isAnsweredCurrent}
              isSkippedCurrent={isSkippedCurrent}
              userName={user.name}
            />

            <CommentsSection
              existingComment={existingComment}
              showCommentBox={showCommentBox}
              isEditingComment={isEditingComment}
              commentDraft={commentDraft}
              isReviewMode={isReviewMode}
              saveMutationPending={isSaveCommentPending}
              onOpenCommentBox={handleOpenCommentBox}
              onCancelComment={handleCancelComment}
              onSaveComment={handleSaveComment}
              onCommentDraftChange={onCommentDraftChange}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer
        onPrevious={handlePrevious}
        onPrimaryCta={handlePrimaryCta}
        prevNavigable={prevNavigable}
        currentPosition={currentPosition}
        primaryCtaText={getPrimaryCtaText()}
        finishLoading={isFinishSessionPending}
        isLastPoll={isLastPoll}
      />
    </div>
  );
};

export default QwirlInteractive;
