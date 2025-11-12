import { QwirlWithSession, QwirlItem } from "@/types/qwirl";
import { useEffect, useMemo, useState } from "react";

export const useSessionState = (
  polls: QwirlItem[],
  data: QwirlWithSession | undefined
) => {
  const [currentPosition, setCurrentPosition] = useState<number>(1);
  const [initialized, setInitialized] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [isAnsweringNew, setIsAnsweringNew] = useState<boolean>(false);

  // Derived values
  const lastRespondedPosition = useMemo(() => {
    const respondedPositions = polls
      .filter((poll) => poll.user_response != null)
      .map((poll) => poll.position);
    return respondedPositions.length ? Math.max(...respondedPositions) : 0;
  }, [polls]);

  const firstNewPosition = lastRespondedPosition + 1;

  const newCount = useMemo(
    () => polls.filter((poll) => poll.position > lastRespondedPosition).length,
    [polls, lastRespondedPosition]
  );

  const isCompleted = useMemo(() => {
    const serverStatus = (data?.session_status ?? "").toLowerCase();
    const byCount = (data?.completed_response_count ?? 0) >= polls.length;
    return serverStatus === "completed" || byCount;
  }, [data?.session_status, data?.completed_response_count, polls.length]);

  const currentPoll = useMemo(
    () => polls.find((poll) => poll.position === currentPosition),
    [polls, currentPosition]
  );

  // Derive skipped IDs from query data (polls with null selected_answer)
  const skippedIds = useMemo(() => {
    return new Set(
      polls
        .filter(
          (poll) =>
            poll.user_response !== undefined &&
            poll.user_response !== null &&
            poll.user_response.selected_answer === null
        )
        .map((poll) => poll.id)
    );
  }, [polls]);

  // Initialize state from server data on mount or when polls change
  useEffect(() => {
    if (!initialized && polls.length > 0) {
      // Find first unanswered/unskipped position
      const firstUnanswered = polls.find(
        (poll) =>
          poll.user_response === undefined || poll.user_response === null
      );

      // If all answered, go to last position, otherwise go to first unanswered
      const startPosition = firstUnanswered
        ? firstUnanswered.position
        : Math.min(lastRespondedPosition + 1, polls.length);

      setCurrentPosition(startPosition);
      setInitialized(true);
    }
  }, [polls, initialized, lastRespondedPosition]);

  return {
    currentPosition,
    setCurrentPosition,
    initialized,
    setInitialized,
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
  };
};
