"use client";

import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import React, { useCallback, useState, useMemo, memo } from "react";
import { Card, CardContent } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SingleCardNavigationDots } from "./single-card-navigation-dots";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import { UserAvatar } from "../user-avatar";
import { QwirlResponder } from "@/types/qwirl";
import SelectedResponderCard from "./qwirl-edit/selected-responder-card";
import UserBadge from "../user-badge";

const PollOption = memo(
  ({
    option,
    responders,
    isMyChoice,
  }: {
    option: string;
    responders: TRespondersArray;
    isMyChoice: boolean;
  }) => (
    <div
      className={clsx(
        "flex items-center justify-between flex-wrap text-foreground w-full p-3 rounded-xl z-10 border text-left transition-all duration-200",
        {
          "bg-accent": isMyChoice,
          "bg-background": !isMyChoice,
        }
      )}
    >
      <span className="text-gray-900 font-medium">{option}</span>
      <div className="flex items-center gap-2">
        {isMyChoice && (
          <Badge
            variant="outline"
            className="text-xs bg-background text-foreground rounded-full flex items-center gap-1"
          >
            <div className="rounded-full h-3 w-3 bg-primary" />
            You
          </Badge>
        )}
        {responders.map((responder) => (
          <UserBadge key={responder.user?.id} user={responder.user!} />
        ))}
      </div>
    </div>
  )
);

PollOption.displayName = "PollOption";

type TRespondersArray = Array<{
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
}>;

const ResponderStatus = memo(
  ({
    skippedResponders,
    notAnsweredResponders,
  }: {
    skippedResponders: TRespondersArray;
    notAnsweredResponders: TRespondersArray;
  }) => {
    if (!skippedResponders.length && !notAnsweredResponders.length) return null;

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

const SingleCardView = () => {
  const { qwirlQuery, handleReorder, handleDelete } = useQwirlEditor();
  const [showComments, setShowComments] = useState(false);
  const [selectedResponders, setSelectedResponders] = useState<
    QwirlResponder[] | null
  >(null);
  const [currentPollId, setCurrentPollId] = useState<number | null>(null);
  const { user } = authStore();

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
          // status: "completed",
        },
      },
    },
    {
      enabled: !!user?.primary_qwirl_id,
    }
  );

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

  // Memoized computations
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

  const polls = useMemo(
    () =>
      qwirlQuery?.data?.items
        ? [...qwirlQuery.data.items].sort((a, b) => a.position - b.position)
        : [],
    [qwirlQuery?.data?.items]
  );

  // Optimize array operations with Map
  const pollsById = useMemo(
    () => new Map(polls.map((poll) => [poll.id, poll])),
    [polls]
  );

  const currentIndex = useMemo(
    () =>
      currentPollId != null
        ? polls.findIndex((poll) => poll.id === currentPollId)
        : 0,
    [polls, currentPollId]
  );

  const currentPoll = pollsById.get(currentPollId || 0) || null;

  // Optimize options rendering
  const optionsWithResponders = useMemo(
    () =>
      currentPoll?.options.map((option) => {
        const respondersForOption = respondersWithAnswers.filter(
          (answer) => answer.responder_answer?.selected_answer === option
        );
        return { option, responders: respondersForOption };
      }) ?? [],
    [currentPoll?.options, respondersWithAnswers]
  );

  React.useEffect(() => {
    if (polls.length && currentPollId === null) {
      setCurrentPollId(polls?.[0]?.id || null);
    }
  }, [polls, currentPollId]);

  // Combined navigation handlers
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

  useKeyboardNavigation(
    {
      ArrowLeft: goToPrevious,
      ArrowRight: goToNext,
    },
    polls.length > 0
  );

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

  // Optimized responder management
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
    <>
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Filter by User:</span>
              <Select
                value={""}
                onValueChange={(value) => {
                  handleResponderToggle(Number(value));
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Responder" />
                </SelectTrigger>
                <SelectContent>
                  {qwirlRespondersQuery?.data?.responders.map((user) => (
                    <SelectItem
                      key={user.id}
                      value={user.id.toString()}
                      className="text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          image={user.avatar ?? ""}
                          name={user.name ?? undefined}
                          size="sm"
                          rounded={true}
                        />
                        <span>{user.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {user.status !== "completed"
                            ? "Incomplete"
                            : "Complete"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showComments ? "default" : "outline"}
                size="sm"
                disabled
                icon={MessageSquare}
                iconPlacement="left"
                onClick={() => setShowComments(!showComments)}
                className={
                  showComments ? "bg-purple-600 hover:bg-purple-700" : ""
                }
              >
                Comments ({0})
              </Button>
            </div>
          </div>
          {/* show selected responders */}
          {selectedResponders && (
            <div className="flex items-center gap-2 mt-4">
              {selectedResponders?.map((responder) => (
                <SelectedResponderCard
                  key={responder.id}
                  responder={responder}
                  onClose={() => removeResponder(responder.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white overflow-none">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                  className="bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Badge
                  variant="secondary"
                  className="bg-accent text-accent-foreground font-semibold whitespace-nowrap"
                >
                  Poll #{currentIndex + 1} of {polls?.length}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNext}
                  disabled={currentIndex === polls.length - 1}
                  className="bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleMoveUp}
                    disabled={currentIndex === 0}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Move Up
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleMoveDown}
                    disabled={currentIndex === polls.length - 1}
                  >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Move Down
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handlingDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Poll
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

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
                  {false && (
                    <div className="relative">
                      <Image
                        src={"/placeholder.svg"}
                        alt="Poll image"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-gray-700"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Image
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Question */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      {currentPoll.question_text}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {optionsWithResponders.map(
                      ({ option, responders }, optionIndex) => {
                        const isMyChoice = currentPoll?.owner_answer === option;
                        return (
                          <PollOption
                            key={optionIndex}
                            option={option}
                            responders={responders}
                            isMyChoice={isMyChoice}
                          />
                        );
                      }
                    )}
                  </div>

                  <ResponderStatus
                    skippedResponders={skippedResponders}
                    notAnsweredResponders={notAnsweredResponders}
                  />

                  {
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{currentPoll?.response_count} responses</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-secondary" />
                        <span>{0} comments</span>
                      </div>
                    </div>
                  }
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
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({0})
                </h3>
                {/* <div className="space-y-3 max-h-60 overflow-y-auto">
                  {currentPollComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <UserAvatar
                        name={comment.name}
                        image={comment.avatar}
                        size="sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">
                            {comment.userName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  ))}
                </div> */}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SingleCardView;
