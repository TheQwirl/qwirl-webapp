import { Qwirl, QwirlItem } from "@/types/qwirl";
import { useMemo, useState } from "react";

export const useSessionState = (
  polls: QwirlItem[],
  data: Qwirl | undefined
) => {
  const [currentPosition, setCurrentPosition] = useState<number>(1);
  const [initialized, setInitialized] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [skippedIds, setSkippedIds] = useState<Set<number>>(new Set());
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

  return {
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
  };
};
