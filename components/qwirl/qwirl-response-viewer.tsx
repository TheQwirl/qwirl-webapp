"use client";

import React, { useCallback, useState, useMemo, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Users } from "lucide-react";

// Hooks
import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";

// API & State
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";

// UI Components
import { Card, CardContent } from "../ui/card";
import UserBadge from "../user-badge";

// Feature Components
import ResponderSelector from "./qwirl-view/responder-selector";
import PollNavigation from "./qwirl-view/poll-navigation";
import PollQuestion from "./qwirl-view/poll-question";
import PollOptionsDistribution from "./qwirl-view/poll-options-distribution";
import PollStats from "./qwirl-view/poll-stats";
import QwirlComments from "./qwirl-comments";
import { SingleCardNavigationDots } from "./single-card-navigation-dots";

// Types
import { QwirlResponder } from "@/types/qwirl";
import SelectedResponderCard from "./qwirl-edit/selected-responder-card";

/**
 * Type definitions for responder answer data
 */
type ResponderAnswer = {
  user:
    | {
        name: string | null;
        username: string | null;
        id: number | null;
        avatar: string | null;
      }
    | null
    | undefined;
  responder_answer:
    | {
        id: number;
        selected_answer: string | null;
        qwirl_item_id: number;
        comment: string | null;
        owner_answer?: string | null;
        session_id?: number | null;
      }
    | undefined;
};

type RespondersArray = ResponderAnswer[];

/**
 * ResponderStatus component shows which users skipped or haven't answered yet
 */
const ResponderStatus = memo(
  ({
    skippedResponders,
    notAnsweredResponders,
  }: {
    skippedResponders: RespondersArray;
    notAnsweredResponders: RespondersArray;
  }) => {
    if (!skippedResponders.length && !notAnsweredResponders.length) {
      return null;
    }

    return (
      <div className="space-y-2">
        {skippedResponders.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Skipped by:</span>
            {skippedResponders.map((responder) => (
              <UserBadge key={responder.user?.id} user={responder.user!} />
            ))}
          </div>
        )}

        {notAnsweredResponders.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Not answered yet:</span>
            {notAnsweredResponders.map((responder) => (
              <UserBadge key={responder.user?.id} user={responder.user!} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

ResponderStatus.displayName = "ResponderStatus";

/**
 * QwirlResponsesViewer Component
 *
 * A comprehensive viewer for analyzing qwirl poll responses and distributions.
 * Users can view overall answer statistics, select specific responders to compare
 * their answers, and read comments left on polls.
 *
 * @param {number | null} responder_id - Optional responder ID to pre-select from URL params
 *
 * Features:
 * - View poll response distributions and percentages
 * - Select multiple responders to see their individual answers
 * - Navigate between polls with keyboard shortcuts (Arrow keys)
 * - Reorder and delete polls
 * - View responder comments
 * - See which responders skipped or haven't answered yet
 */
interface QwirlResponsesViewerProps {
  responder_id?: number | null;
}

const QwirlResponsesViewer = ({ responder_id }: QwirlResponsesViewerProps) => {
  // Hooks
  const { qwirlQuery, handleReorder, handleDelete } = useQwirlEditor();
  const { user } = authStore();

  // Local state
  const [selectedResponders, setSelectedResponders] = useState<
    QwirlResponder[] | null
  >(null);
  const [currentPollId, setCurrentPollId] = useState<number | null>(null);

  // Fetch all responders who completed this qwirl
  const qwirlRespondersQuery = $api.useQuery(
    "get",
    "/qwirl-responses/qwirls/{qwirl_id}/responders",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
        query: {
          limit: 3,
          status: "completed",
        },
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );

  // Auto-select responder from URL parameter if provided
  React.useEffect(() => {
    if (!responder_id) return;

    const responder = qwirlRespondersQuery?.data?.responders.find(
      (r) => r.id === responder_id
    );

    if (responder) {
      setSelectedResponders((prev) => [
        responder,
        ...(prev || []).filter((r) => r.id !== responder_id),
      ]);
    }
  }, [responder_id, qwirlRespondersQuery?.data?.responders]);

  // Fetch detailed responses for selected responders
  const qwirlResponsesByUsersQuery = $api.useQuery(
    "get",
    "/qwirl-responses/responses/by-users",
    {
      params: {
        query: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
          user_ids: selectedResponders?.map((r) => r.id) ?? [],
          include_details: true,
        },
      },
    },
    {
      enabled: !!(
        !!user?.primary_qwirl_id &&
        selectedResponders &&
        selectedResponders?.length > 0
      ),
    }
  );

  // Compute responder answers for the current poll being viewed
  const responderAnswersForCurrentPoll = useMemo(
    () =>
      qwirlResponsesByUsersQuery?.data?.sessions?.map((s) => ({
        user: s?.responder,
        responder_answer: s?.responses?.find(
          (r) => r.qwirl_item_id === currentPollId
        ),
      })) ?? [],
    [qwirlResponsesByUsersQuery?.data?.sessions, currentPollId]
  );

  // Categorize responders by their answer status
  const { skippedResponders, notAnsweredResponders, respondersWithAnswers } =
    useMemo(() => {
      const skipped = responderAnswersForCurrentPoll.filter(
        (answer) => answer.responder_answer?.selected_answer === null
      );
      const notAnswered = responderAnswersForCurrentPoll.filter(
        (answer) => answer.responder_answer === undefined
      );
      const withAnswers = responderAnswersForCurrentPoll.filter(
        (answer) =>
          answer.responder_answer?.selected_answer !== null &&
          answer.responder_answer !== undefined
      );

      return {
        skippedResponders: skipped,
        notAnsweredResponders: notAnswered,
        respondersWithAnswers: withAnswers,
      };
    }, [responderAnswersForCurrentPoll]);

  // Get sorted polls from qwirl data
  const polls = useMemo(
    () =>
      qwirlQuery?.data?.items
        ? [...qwirlQuery.data.items].sort((a, b) => a.position - b.position)
        : [],
    [qwirlQuery?.data?.items]
  );

  // Create a map for O(1) poll lookups
  const pollsById = useMemo(
    () => new Map(polls.map((poll) => [poll.id, poll])),
    [polls]
  );

  // Get current poll data
  const currentIndex = useMemo(
    () =>
      currentPollId != null
        ? polls.findIndex((poll) => poll.id === currentPollId)
        : 0,
    [polls, currentPollId]
  );

  const currentPoll = pollsById.get(currentPollId || 0) || null;

  // Prepare poll options with responder data and statistics
  const optionsWithResponders = useMemo(
    () =>
      currentPoll?.options.map((option) => {
        const respondersForOption = respondersWithAnswers.filter(
          (answer) => answer.responder_answer?.selected_answer === option
        );
        const count = currentPoll?.option_statistics?.counts?.[option] ?? 0;
        const total = currentPoll?.option_statistics?.total_responses ?? 0;
        const percentage = total > 0 && count > 0 ? (count / total) * 100 : 0;

        // Transform responders to match expected format
        const formattedResponders = respondersForOption.map((r) => ({
          user: r.user
            ? {
                id: r.user.id?.toString() ?? "",
                name: r.user.name,
                username: r.user.username ?? "",
                avatar: r.user.avatar,
              }
            : null,
        }));

        return {
          option,
          responders: formattedResponders,
          percentage,
          totalResponses: total,
        };
      }) ?? [],
    [
      currentPoll?.options,
      respondersWithAnswers,
      currentPoll?.option_statistics?.counts,
      currentPoll?.option_statistics?.total_responses,
    ]
  );

  // Initialize with first poll when polls are loaded
  React.useEffect(() => {
    if (polls.length && currentPollId === null) {
      setCurrentPollId(polls?.[0]?.id || null);
    }
  }, [polls, currentPollId]);

  // Navigation handlers
  const navigateToPoll = useCallback((pollId: number) => {
    setCurrentPollId(pollId);
  }, []);

  const handleNavigation = useCallback(
    (direction: "prev" | "next") => {
      const index = polls.findIndex((p) => p.id === currentPollId);
      if (direction === "prev" && index > 0) {
        const prevPollId = polls?.[index - 1]?.id;
        if (typeof prevPollId === "number") {
          navigateToPoll(prevPollId);
        }
      } else if (direction === "next" && index < polls.length - 1) {
        const nextPollId = polls[index + 1]?.id;
        if (typeof nextPollId === "number") {
          navigateToPoll(nextPollId);
        }
      }
    },
    [polls, currentPollId, navigateToPoll]
  );

  const goToPrevious = useCallback(
    () => handleNavigation("prev"),
    [handleNavigation]
  );
  const goToNext = useCallback(
    () => handleNavigation("next"),
    [handleNavigation]
  );

  // Enable keyboard navigation (Arrow keys)
  useKeyboardNavigation(
    {
      ArrowLeft: goToPrevious,
      ArrowRight: goToNext,
    },
    polls.length > 0
  );

  // Poll management handlers
  const handlingDelete = useCallback(async () => {
    if (!currentPoll) return;

    const currentIndex = polls.findIndex((p) => p.id === currentPoll.id);

    await handleDelete(currentPoll.id);

    const remainingPolls = polls.filter((p) => p.id !== currentPoll.id);

    if (remainingPolls.length === 0) {
      setCurrentPollId(null);
    } else {
      if (currentIndex >= remainingPolls.length) {
        setCurrentPollId(remainingPolls[remainingPolls.length - 1]?.id || null);
      } else {
        setCurrentPollId(remainingPolls[currentIndex]?.id || null);
      }
    }
  }, [currentPoll, handleDelete, polls]);

  const handleMoveUp = useCallback(() => {
    if (currentIndex > 0) {
      const newPolls = [...polls];
      const [movedPoll] = newPolls.splice(currentIndex, 1);
      if (movedPoll) {
        newPolls.splice(currentIndex - 1, 0, movedPoll);
        handleReorder(newPolls);
        setCurrentPollId(movedPoll?.id);
      }
    }
  }, [currentIndex, polls, handleReorder]);

  const handleMoveDown = useCallback(() => {
    if (currentIndex < polls.length - 1) {
      const newPolls = [...polls];
      const [movedPoll] = newPolls.splice(currentIndex, 1);
      if (movedPoll) {
        newPolls.splice(currentIndex + 1, 0, movedPoll);
        handleReorder(newPolls);
        setCurrentPollId(movedPoll?.id);
      }
    }
  }, [currentIndex, polls, handleReorder]);

  // Responder selection handlers
  const handleResponderToggle = useCallback(
    (responderId: number) => {
      setSelectedResponders((prev) => {
        if (!prev) {
          const responder = qwirlRespondersQuery?.data?.responders.find(
            (r) => r.id === responderId
          );
          return responder ? [responder] : [];
        }

        const exists = prev.find((r) => r.id === responderId);
        if (exists) {
          return prev.filter((r) => r.id !== responderId);
        } else {
          const responder = qwirlRespondersQuery?.data?.responders.find(
            (r) => r.id === responderId
          );
          return responder ? [...prev, responder] : prev;
        }
      });
    },
    [qwirlRespondersQuery?.data?.responders]
  );

  const removeResponder = useCallback((responderId: number) => {
    setSelectedResponders((prev) =>
      prev ? prev.filter((r) => r.id !== responderId) : null
    );
  }, []);

  // Empty state: No polls exist yet
  if (polls?.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-white overflow-none">
        <CardContent className="p-12 text-center">
          <div className="text-gray-500">
            <ChevronLeft className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No polls yet</h3>
            <p>Add your first poll to get started with your Qwirl!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Show responses from:</span>
              <ResponderSelector
                responders={qwirlRespondersQuery?.data?.responders || []}
                onResponderToggle={handleResponderToggle}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {selectedResponders && selectedResponders.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedResponders.map((responder) => (
                  <SelectedResponderCard
                    key={responder.id}
                    responder={responder}
                    onClose={() => removeResponder(responder.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-none">
        <CardContent className="p-8">
          <div className="space-y-6">
            <PollNavigation
              currentIndex={currentIndex}
              totalPolls={polls.length}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handlingDelete}
              canMoveUp={currentIndex > 0}
              canMoveDown={currentIndex < polls.length - 1}
            />

            <AnimatePresence mode="wait">
              {currentPoll && (
                <motion.div
                  key={currentPoll.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  <PollQuestion questionText={currentPoll.question_text} />

                  <PollOptionsDistribution
                    options={optionsWithResponders}
                    ownerAnswer={currentPoll?.owner_answer ?? null}
                  />

                  <ResponderStatus
                    skippedResponders={skippedResponders}
                    notAnsweredResponders={notAnsweredResponders}
                  />

                  <PollStats
                    responseCount={
                      currentPoll?.option_statistics?.total_responses ?? 0
                    }
                    commentCount={0}
                  />

                  {user?.primary_qwirl_id && (
                    <QwirlComments
                      item_id={currentPoll.id}
                      qwirl_id={user?.primary_qwirl_id}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <SingleCardNavigationDots
                polls={polls}
                currentIndex={currentIndex}
                setCurrentPollId={setCurrentPollId}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QwirlResponsesViewer;
