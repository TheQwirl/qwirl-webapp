import $api from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { OtherUser } from "../profile/types";
import WavelengthProgress from "../wavelength-progress-animated";
import InCompleteQwirl from "./incomplete-qwirl";
import { useQwirlSession } from "@/hooks/qwirl-response/useQwirlSession";
import { useSessionState } from "@/hooks/qwirl-response/useSessionState";
import { useCommentState } from "@/hooks/qwirl-response/useCommentState";
import { Qwirl } from "./types";
import { CONSTANTS, TOAST_IDS } from "@/constants/qwirl-respond";
import QwirlRespondLoading from "./qwirl-respond-loading";
import CompletedPanel from "./qwirl-respond/completed-panel";
import Header from "./qwirl-respond/header";
import QuestionHeader from "./qwirl-respond/question-header";
import OptionsList from "./qwirl-respond/options-list";
import CommentsSection from "./qwirl-respond/comment-section";
import Footer from "./qwirl-respond/footer";
import { QwirlItemOptionStatistics } from "@/types/qwirl";

interface QwirlRespondProps {
  user: OtherUser | undefined;
}

const QwirlRespond = ({ user }: QwirlRespondProps) => {
  const queryClient = useQueryClient();
  const { queryKey, userQwirlQuery } = useQwirlSession(user);

  const data = userQwirlQuery.data;
  const polls = useMemo(
    () => data?.items?.slice()?.sort((a, b) => a.position - b.position) ?? [],
    [data?.items]
  );

  const {
    currentPosition,
    setCurrentPosition,
    initialized,
    setInitialized,
    userAnswer,
    setUserAnswer,
    skippedIds,
    setSkippedIds,
    isReviewMode,
    setIsReviewMode,
    isAnsweringNew,
    setIsAnsweringNew,
    lastRespondedPosition,
    firstNewPosition,
    newCount,
    isCompleted,
    currentPoll,
  } = useSessionState(polls, data);

  const existingComment = currentPoll?.user_response?.comment ?? null;

  const {
    commentDraft,
    setCommentDraft,
    isEditingComment,
    setIsEditingComment,
    showCommentBox,
    setShowCommentBox,
  } = useCommentState(existingComment);

  const isAnsweredCurrent = Boolean(
    currentPoll?.user_response?.selected_answer ?? userAnswer
  );

  const isSkippedCurrent = Boolean(
    !isAnsweredCurrent &&
      (skippedIds.has(currentPoll?.id ?? -1) ||
        currentPoll?.user_response?.selected_answer === null)
  );

  useEffect(() => {
    if (!polls.length || initialized) return;

    const firstUnansweredIndex = polls.findIndex((poll) =>
      poll.user_response ? !poll.user_response.selected_answer : true
    );

    if ((data?.session_status ?? "").toLowerCase() === "completed") {
      setCurrentPosition(1);
    } else if (firstUnansweredIndex !== -1) {
      setCurrentPosition(polls[firstUnansweredIndex]?.position ?? 1);
    } else {
      setCurrentPosition(1);
    }

    setInitialized(true);
  }, [
    polls,
    data?.session_status,
    initialized,
    setCurrentPosition,
    setInitialized,
  ]);

  useEffect(() => {
    setUserAnswer(currentPoll?.user_response?.selected_answer ?? null);
  }, [
    currentPoll?.user_response?.selected_answer,
    currentPoll?.id,
    setUserAnswer,
  ]);

  useEffect(() => {
    if (!polls.length) return;

    const initialSkipped = new Set<number>();
    polls.forEach((poll) => {
      if (poll.user_response && poll.user_response.selected_answer === null) {
        initialSkipped.add(poll.id);
      }
    });
    setSkippedIds(initialSkipped);
  }, [polls, setSkippedIds]);

  const finishQwirlSession = $api.useMutation(
    "post",
    "/qwirl-responses/sessions/{session_id}/finish"
  );

  const submitAnswerMutation = $api.useMutation(
    "post",
    "/qwirl-responses/sessions/{session_id}/responses",
    {
      onMutate: async (variables) => {
        const { qwirl_item_id, selected_answer } = variables.body;

        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<Qwirl>(queryKey);

        if (previousData) {
          queryClient.setQueryData<Qwirl>(queryKey, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              items: oldData.items?.map((item) => {
                if (item.id !== qwirl_item_id) return item;

                const nextResponseCount = (item.response_count ?? 0) + 1;
                const nextStats = updateOptionStatistics(
                  item.option_statistics,
                  selected_answer ?? null
                );

                return {
                  ...item,
                  response_count: nextResponseCount,
                  option_statistics: nextStats,
                  user_response: {
                    selected_answer: selected_answer ?? null,
                    comment: item.user_response?.comment ?? null,
                  },
                };
              }),
              answered_count:
                (oldData.answered_count ?? 0) +
                (selected_answer !== null ? 1 : 0),
              skipped_count:
                (oldData.skipped_count ?? 0) +
                (selected_answer === null ? 1 : 0),
              unanswered_count: Math.max(
                0,
                (oldData.unanswered_count ?? 0) - 1
              ),
            };
          });
        }

        return { previousData };
      },
      onError: (error, variables, context) => {
        const ctx = context as { previousData: Qwirl | undefined } | undefined;

        if (ctx?.previousData) {
          queryClient.setQueryData<Qwirl>(queryKey, ctx.previousData);
        }

        toast.error("An error occurred while submitting your response.", {
          id: TOAST_IDS.SUBMIT_ANSWER,
        });
        setUserAnswer(null);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }
  );

  const saveCommentMutation = $api.useMutation(
    "patch",
    "/qwirl-responses/sessions/{session_id}/items/{qwirl_item_id}/comment",
    {
      onMutate: async (variables) => {
        const { qwirl_item_id } = variables.params.path;
        const newComment = variables.body.comment ?? "";

        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData<Qwirl>(queryKey);

        if (previousData) {
          queryClient.setQueryData<Qwirl>(queryKey, (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              items: oldData.items?.map((item) => {
                if (item.id !== qwirl_item_id) return item;

                return {
                  ...item,
                  user_response: {
                    ...(item.user_response ?? {
                      selected_answer: null,
                      comment: null,
                    }),
                    comment: newComment,
                  },
                };
              }),
            };
          });
        }

        return { previousData };
      },
      onError: (error, variables, context) => {
        const ctx = context as { previousData: Qwirl | undefined } | undefined;
        if (ctx?.previousData) {
          queryClient.setQueryData<Qwirl>(queryKey, ctx.previousData);
        }
        toast.error("Couldn't save your comment. Please try again.");
      },
      onSuccess: () => {
        setIsEditingComment(false);
        setShowCommentBox(false);
        toast.success("Comment saved.");
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    }
  );

  const handleSubmitAnswer = useCallback(
    async (selectedAnswer: string | null) => {
      const pollId = currentPoll?.id;
      if (!pollId) return;

      await submitAnswerMutation.mutateAsync({
        params: { path: { session_id: 0 } },
        body: { qwirl_item_id: pollId, selected_answer: selectedAnswer },
      });
    },
    [currentPoll?.id, submitAnswerMutation]
  );

  const handleEndSession = useCallback(async () => {
    const sessionId = data?.session_id ?? 0;
    toast.loading("Getting Wavelength...", { id: TOAST_IDS.WAVELENGTH_UPDATE });

    await finishQwirlSession.mutateAsync(
      { params: { path: { session_id: sessionId } } },
      {
        onSuccess: (response) => {
          const newValue = response?.wavelength_score ?? 0;
          const currentValue = user?.relationship?.wavelength ?? 0;

          toast.custom(
            (toastId) => (
              <WavelengthProgress
                currentValue={currentValue}
                newValue={newValue}
                maxValue={100}
                title="Wavelength updated!"
                subtitle=""
                onAnimationComplete={() =>
                  setTimeout(() => toast.dismiss(toastId), 1000)
                }
              />
            ),
            { duration: 4000, id: TOAST_IDS.WAVELENGTH_UPDATE }
          );
          userQwirlQuery.refetch();
        },
      }
    );
  }, [
    finishQwirlSession,
    data?.session_id,
    user?.relationship?.wavelength,
    userQwirlQuery,
  ]);

  const handleVote = useCallback(
    async (selectedAnswer: string) => {
      if (isReviewMode || userAnswer) return;

      setUserAnswer(selectedAnswer);
      await handleSubmitAnswer(selectedAnswer);
    },
    [isReviewMode, userAnswer, handleSubmitAnswer, setUserAnswer]
  );

  const handleSkip = useCallback(async () => {
    if (isReviewMode || !currentPoll?.id) return;

    setSkippedIds((previous) => new Set(previous).add(currentPoll.id));
    await handleSubmitAnswer(null);

    const isLastPoll = currentPoll.position === polls.length;
    if (isLastPoll) {
      if (skippedIds.size + 1 < CONSTANTS.MAX_SKIPS) {
        await handleEndSession();
      }
    } else {
      setCurrentPosition((position) => position + 1);
    }
  }, [
    isReviewMode,
    currentPoll?.id,
    currentPoll?.position,
    handleSubmitAnswer,
    polls.length,
    skippedIds.size,
    handleEndSession,
    setSkippedIds,
    setCurrentPosition,
  ]);

  const findPrevNavigablePosition = useCallback(
    (position: number) => {
      for (let p = position - 1; p >= 1; p--) {
        const poll = polls.find((item) => item.position === p);
        if (poll) return p;
      }
      return null;
    },
    [polls]
  );

  const findPrevPositionReview = useCallback(
    (position: number) => (position > 1 ? position - 1 : null),
    []
  );

  const handlePrevious = useCallback(() => {
    const prevPosition = isReviewMode
      ? findPrevPositionReview(currentPosition)
      : findPrevNavigablePosition(currentPosition);

    if (prevPosition) {
      setCurrentPosition(prevPosition);
    }
  }, [
    isReviewMode,
    currentPosition,
    findPrevNavigablePosition,
    findPrevPositionReview,
    setCurrentPosition,
  ]);

  const getPrimaryCtaText = useCallback(() => {
    if (isReviewMode) {
      return currentPosition === polls.length ? "Done reviewing" : "Next";
    }

    const isLastPoll = currentPoll?.position === polls.length;

    if (isLastPoll) {
      if (userAnswer) return "Get Wavelength";
      return skippedIds.size < CONSTANTS.MAX_SKIPS
        ? "Finish"
        : "Finish (Too many skips)";
    }

    if (userAnswer || skippedIds.has(currentPoll?.id ?? -1)) {
      return "Next";
    }

    return skippedIds.size < CONSTANTS.MAX_SKIPS
      ? "Skip"
      : "Skip (Too many skips)";
  }, [
    isReviewMode,
    currentPoll?.position,
    currentPoll?.id,
    polls.length,
    userAnswer,
    skippedIds,
    currentPosition,
  ]);

  const handlePrimaryCta = useCallback(async () => {
    if (isReviewMode) {
      if (currentPosition === polls.length) {
        setIsReviewMode(false);
        setCurrentPosition(Math.min(polls.length, lastRespondedPosition || 1));
        return;
      }
      setCurrentPosition((position) => position + 1);
      return;
    }

    if (userAnswer || skippedIds.has(currentPoll?.id ?? -1)) {
      const isLastPoll = currentPoll?.position === polls.length;
      if (isLastPoll) {
        if (skippedIds.size < CONSTANTS.MAX_SKIPS) {
          await handleEndSession();
        }
        return;
      }
      setCurrentPosition((position) => position + 1);
      return;
    }

    await handleSkip();
  }, [
    isReviewMode,
    userAnswer,
    skippedIds,
    currentPoll?.id,
    currentPoll?.position,
    handleSkip,
    currentPosition,
    polls.length,
    lastRespondedPosition,
    handleEndSession,
    setIsReviewMode,
    setCurrentPosition,
  ]);

  const startReview = useCallback(() => {
    setIsReviewMode(true);
    setIsAnsweringNew(false);
    setCurrentPosition(1);
  }, [setIsReviewMode, setIsAnsweringNew, setCurrentPosition]);

  const startAnsweringNew = useCallback(() => {
    if (firstNewPosition <= polls.length) {
      setIsAnsweringNew(true);
      setIsReviewMode(false);
      setCurrentPosition(firstNewPosition);
    } else {
      toast("There are no new questions to answer.");
    }
  }, [
    firstNewPosition,
    polls.length,
    setIsAnsweringNew,
    setIsReviewMode,
    setCurrentPosition,
  ]);

  const handleOpenCommentBox = useCallback(() => {
    if (isReviewMode) return;

    if (existingComment) {
      setIsEditingComment(true);
      setCommentDraft(existingComment);
    } else {
      setShowCommentBox(true);
      setIsEditingComment(true);
      setCommentDraft("");
    }
  }, [
    existingComment,
    isReviewMode,
    setIsEditingComment,
    setCommentDraft,
    setShowCommentBox,
  ]);

  const handleCancelComment = useCallback(() => {
    setIsEditingComment(false);
    setShowCommentBox(false);
    setCommentDraft(existingComment ?? "");
  }, [
    existingComment,
    setIsEditingComment,
    setShowCommentBox,
    setCommentDraft,
  ]);

  const handleSaveComment = useCallback(async () => {
    if (isReviewMode || !currentPoll?.id) return;

    const trimmedComment = commentDraft.trim();
    if (!trimmedComment.length) {
      toast.message("Comment cannot be empty.");
      return;
    }

    await saveCommentMutation.mutateAsync({
      params: {
        path: {
          session_id: userQwirlQuery?.data?.session_id ?? 0,
          qwirl_item_id: currentPoll.id,
        },
      },
      body: { comment: trimmedComment },
    });
  }, [
    currentPoll?.id,
    commentDraft,
    saveCommentMutation,
    isReviewMode,
    userQwirlQuery?.data?.session_id,
  ]);

  const prevNavigable = isReviewMode
    ? currentPosition > 1
      ? currentPosition - 1
      : null
    : findPrevNavigablePosition(currentPosition);

  if (userQwirlQuery.isLoading || !user) {
    return <QwirlRespondLoading />;
  }

  const isIncompleteQwirl =
    !userQwirlQuery.isLoading && polls.length < CONSTANTS.MIN_QWIRL_POLLS;

  if (isIncompleteQwirl) {
    return (
      <InCompleteQwirl
        ownerName={user.name ?? ""}
        ownerUsername={user.username ?? ""}
        ownerAvatar={user.avatar ?? ""}
        pollCount={polls.length}
        onNotifyWhenReady={() => {
          toast("You will be notified when the Qwirl is ready!", {
            duration: 3000,
            id: TOAST_IDS.NOTIFY_READY,
          });
        }}
      />
    );
  }

  if (isCompleted && !isReviewMode && !isAnsweringNew) {
    return (
      <div className="space-y-4">
        <CompletedPanel
          data={data}
          newCount={newCount}
          onStartReview={startReview}
          onStartAnsweringNew={startAnsweringNew}
        />
      </div>
    );
  }

  // Main UI render
  return (
    <div
      className={clsx(
        "rounded-2xl border-2 p-4 relative bg-card text-card-foreground"
      )}
    >
      <Header
        isAnsweredCurrent={isAnsweredCurrent}
        isSkippedCurrent={isSkippedCurrent}
        isSubmitAnswerMutationPending={submitAnswerMutation.isPending}
        currentPoll={currentPoll}
        pollsLength={polls.length}
        isReviewMode={isReviewMode}
        skippedCount={skippedIds.size}
      />

      <div className="py-4 px-4 mt-4">
        <AnimatePresence mode="wait">
          {currentPoll && (
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
                saveMutationPending={saveCommentMutation.isPending}
                onOpenCommentBox={handleOpenCommentBox}
                onCancelComment={handleCancelComment}
                onSaveComment={handleSaveComment}
                onCommentDraftChange={setCommentDraft}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer
        onPrevious={handlePrevious}
        onPrimaryCta={handlePrimaryCta}
        prevNavigable={prevNavigable}
        currentPosition={currentPosition}
        primaryCtaText={getPrimaryCtaText()}
        finishLoading={finishQwirlSession?.isPending}
        isLastPoll={currentPoll?.position === polls.length}
      />
    </div>
  );
};

const updateOptionStatistics = (
  currentStats: QwirlItemOptionStatistics | undefined,
  selectedAnswer: string | null
) => {
  let nextStats = currentStats ?? { counts: {}, total_responses: 0 };

  if (selectedAnswer !== null) {
    nextStats = {
      ...nextStats,
      counts: {
        ...(nextStats?.counts ?? {}),
        [selectedAnswer]: (nextStats?.counts?.[selectedAnswer] ?? 0) + 1,
      },
      total_responses: nextStats.total_responses + 1,
    };
  }

  return nextStats;
};

export default QwirlRespond;
