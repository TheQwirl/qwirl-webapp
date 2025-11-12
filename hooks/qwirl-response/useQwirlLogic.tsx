import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { CONSTANTS } from "@/constants/qwirl-respond";
import { useQwirlSession } from "./useQwirlSession";
import {
  useSubmitAnswer,
  useSaveComment,
  useFinishSession,
} from "./useQwirlMutations";
import { useSessionState } from "./useSessionState";
import { useCommentState } from "./useCommentState";
import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";

interface UseQwirlLogicProps {
  user: components["schemas"]["UserProfileResponse"] | undefined;
}

export function useQwirlLogic({ user }: UseQwirlLogicProps) {
  const { queryKey, userQwirlQuery } = useQwirlSession(user);
  const data = userQwirlQuery.data;

  // Get qwirl cover data
  const qwirlCover = $api.useQuery("get", "/qwirl/{qwirl_id}/cover", {
    params: { path: { qwirl_id: user?.primary_qwirl_id ?? 0 } },
    enabled: !!user?.primary_qwirl_id,
  });

  // State to control whether to show cover or interactive
  const [showInteractive, setShowInteractive] = React.useState(false);

  // Get sorted polls
  const polls = React.useMemo(
    () => data?.items?.slice()?.sort((a, b) => a.position - b.position) ?? [],
    [data?.items]
  );

  // Initialize state management hooks
  const sessionState = useSessionState(polls, data);
  const {
    currentPosition,
    setCurrentPosition,
    skippedIds,
    isReviewMode,
    setIsReviewMode,
    isAnsweringNew,
    setIsAnsweringNew,
    lastRespondedPosition,
    firstNewPosition,
    newCount,
    isCompleted,
    currentPoll,
  } = sessionState;

  // Comment state
  const existingComment = currentPoll?.user_response?.comment ?? null;
  const commentState = useCommentState(existingComment);
  const {
    commentDraft,
    setCommentDraft,
    isEditingComment,
    setIsEditingComment,
    showCommentBox,
    setShowCommentBox,
  } = commentState;

  // API mutations
  const submitAnswerMutation = useSubmitAnswer(queryKey);
  const saveCommentMutation = useSaveComment(queryKey);
  const finishQwirlSession = useFinishSession();

  // Derived state - get userAnswer from query cache (set by optimistic update)
  const userAnswer = currentPoll?.user_response?.selected_answer ?? null;

  const isAnsweredCurrent = userAnswer !== null && userAnswer !== undefined;

  const isSkippedCurrent = Boolean(
    !isAnsweredCurrent &&
      (skippedIds.has(currentPoll?.id ?? -1) ||
        currentPoll?.user_response?.selected_answer === null)
  );

  // Handlers
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

    await finishQwirlSession.mutateAsync(
      { params: { path: { session_id: sessionId } } },
      {
        onSuccess: () => {
          // Refetch to get updated wavelength in the query data
          userQwirlQuery.refetch();
        },
      }
    );
  }, [finishQwirlSession, data?.session_id, userQwirlQuery]);

  const handleVote = useCallback(
    async (selectedAnswer: string) => {
      if (isReviewMode || userAnswer) return;

      // Optimistic update will set user_response.selected_answer in query cache
      await handleSubmitAnswer(selectedAnswer);
    },
    [isReviewMode, userAnswer, handleSubmitAnswer]
  );

  const handleSkip = useCallback(async () => {
    if (isReviewMode || !currentPoll?.id) return;

    // Submit null answer - optimistic update will add to query cache
    await handleSubmitAnswer(null);

    const isLastPoll = currentPoll.position === polls.length;
    if (isLastPoll) {
      // Check current skipped count (will include the one we just skipped via optimistic update)
      if (skippedIds.size < CONSTANTS.MAX_SKIPS) {
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
      return currentPosition === polls.length ? "Done" : "Next";
    }

    const isLastPoll = currentPoll?.position === polls.length;

    if (isLastPoll) {
      if (userAnswer) return "See Results";
      return skippedIds.size < CONSTANTS.MAX_SKIPS
        ? "Finish"
        : "Can't finish (too many skips)";
    }

    if (userAnswer || skippedIds.has(currentPoll?.id ?? -1)) {
      return "Next";
    }

    return skippedIds.size < CONSTANTS.MAX_SKIPS
      ? "Skip this one"
      : "Can't skip (limit reached)";
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

  const handleShowInteractive = useCallback(() => {
    setShowInteractive(true);
  }, []);

  const handleNotifyMe = useCallback(() => {
    toast.success("You'll be notified when this Qwirl is complete!", {
      duration: 3000,
    });
  }, []);

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

    setIsEditingComment(false);
    setShowCommentBox(false);
  }, [
    currentPoll?.id,
    commentDraft,
    saveCommentMutation,
    isReviewMode,
    userQwirlQuery?.data?.session_id,
    setIsEditingComment,
    setShowCommentBox,
  ]);

  const prevNavigable = isReviewMode
    ? currentPosition > 1
      ? currentPosition - 1
      : null
    : findPrevNavigablePosition(currentPosition);

  // Calculate truly unanswered questions (not answered AND not skipped)
  const unansweredCount = useMemo(() => {
    return polls.filter((poll) => {
      const hasResponse =
        poll.user_response !== undefined && poll.user_response !== null;
      const isSkipped =
        hasResponse && poll.user_response!.selected_answer === null;
      const isAnswered =
        hasResponse && poll.user_response!.selected_answer !== null;
      return !isAnswered && !isSkipped;
    }).length;
  }, [polls]);

  return {
    // Data
    data,
    polls,
    currentPoll,
    user,
    qwirlCoverData: qwirlCover.data,

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
    isLoading: userQwirlQuery.isLoading,
    isCoverLoading: qwirlCover.isLoading,

    // Mutation states
    isSubmitAnswerPending: submitAnswerMutation.isPending,
    isSaveCommentPending: saveCommentMutation.isPending,
    isFinishSessionPending: finishQwirlSession.isPending,

    // Handlers
    handleVote,
    handleSkip,
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
  };
}
