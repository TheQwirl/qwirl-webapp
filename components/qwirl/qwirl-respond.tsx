import $api from "@/lib/api/client";
import { components } from "@/lib/api/v1-client-side";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { OtherUser } from "../profile/types";
import ProgressBar from "../progress-bar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { SkipCounter } from "./skip-counter";
import { getFirstName } from "@/lib/utils";
import WavelengthProgress from "../wavelength-progress-animated";

type QwirlResponseItem = {
  user_response: {
    selected_answer: string | null;
    comment: string | null;
  } | null;
  option_statistics: Record<string, number>;
} & components["schemas"]["QwirlItemDetail"];

type Qwirl = {
  items: QwirlResponseItem[];
} & components["schemas"]["QwirlBase"];

const MAX_SKIPS = 5;
const MIN_QWIRL_POLLS = 5;

const QwirlRespond = ({ user }: { user: OtherUser | undefined }) => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => [
      "get",
      "/qwirl/users/{username}/qwirl",
      {
        params: {
          path: {
            username: user?.username,
          },
        },
        enabled: true,
      },
    ],
    [user?.username]
  );
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isPositionSet, setIsPositionSet] = useState(false);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [skippedQuestionsIds, setSkippedQuestionsIds] = useState<number[]>([]);

  const userQwirlQuery = $api.useQuery("get", "/qwirl/users/{username}/qwirl", {
    params: {
      path: {
        username: user?.username ?? "",
      },
    },
    enabled: !!user?.id,
  });

  const userQwirl = userQwirlQuery.data;
  const polls = useMemo(() => {
    return userQwirl?.items?.sort((a, b) => a.position - b.position) ?? [];
  }, [userQwirl?.items]);

  const currentPoll = useMemo(() => {
    return polls.find((p) => p.position === currentPosition);
  }, [polls, currentPosition]);

  useEffect(() => {
    if (polls.length > 0 && !isPositionSet) {
      const firstUnansweredPoll = polls.find(
        (p) => !p.user_response?.selected_answer
      );

      if (userQwirl?.session_status === "completed") {
        setCurrentPosition(polls.length);
      } else if (firstUnansweredPoll) {
        setCurrentPosition(firstUnansweredPoll.position);
      }

      setIsPositionSet(true);
    }
  }, [polls, isPositionSet, userQwirl?.session_status]);

  useEffect(() => {
    setUserAnswer(currentPoll?.user_response?.selected_answer ?? null);
  }, [currentPoll]);

  const startQwirlSessionMutation = $api.useMutation(
    "post",
    "/qwirl-responses/qwirls/{qwirl_id}/sessions/start"
  );
  const finishQwirlSessionMutation = $api.useMutation(
    "post",
    "/qwirl-responses/sessions/{session_id}/finish"
  );
  const submitAnswerMutation = $api.useMutation(
    "post",
    "/qwirl-responses/sessions/{session_id}/responses",
    {
      onMutate: async (variables) => {
        const qwirl_item_id = variables.body.qwirl_item_id;
        await queryClient.cancelQueries({ queryKey });
        const previousData = queryClient.getQueryData(queryKey);
        if (!previousData) return { previousData };
        queryClient.setQueryData<Qwirl>(queryKey, (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((item) => {
              if (item.id === qwirl_item_id) {
                const currentStats = item.option_statistics ?? {};
                const currentOptionCount = variables.body.selected_answer
                  ? currentStats[variables.body.selected_answer]
                  : 0;
                const newOptionStats = {
                  ...currentStats,
                  [String(variables.body.selected_answer)]:
                    (currentOptionCount ?? 0) + 1,
                };

                const newResponseCount = (item.response_count ?? 0) + 1;
                return {
                  ...item,
                  owner_answer: variables.body.selected_answer,
                  response_count: newResponseCount,
                  option_statistics: newOptionStats,
                  user_response: {
                    ...item.user_response,
                    selected_answer: variables.body.selected_answer,
                    comment: variables.body.comment,
                  },
                } as QwirlResponseItem;
              }
              return item;
            }),
          };
        });

        return { previousData };
      },
    }
  );

  const handleSessionStart = () => {
    return startQwirlSessionMutation.mutateAsync(
      {
        params: {
          path: {
            qwirl_id: userQwirl?.id ?? 0,
          },
        },
      },
      {
        onSuccess: () => {
          userQwirlQuery.refetch();
        },
        onError: () => {
          toast.error(
            "An error occurred while starting the session. Please (refresh page) try again.",
            {
              id: "start-session",
            }
          );
        },
      }
    );
  };

  const handleSubmitAnswer = (selected_answer: string) => {
    const qwirlItemId = currentPoll?.id ?? 0;
    return submitAnswerMutation.mutateAsync(
      {
        params: {
          path: {
            session_id: userQwirlQuery.data?.session_id ?? 0,
          },
        },
        body: {
          qwirl_item_id: currentPoll?.id ?? 0,
          selected_answer,
        },
      },
      {
        onSuccess: (response) => {
          queryClient.setQueryData<Qwirl>(queryKey, (oldData) => {
            if (!oldData || !oldData.items) return oldData;

            const newItems = oldData.items.map((item: QwirlResponseItem) => {
              if (item.id === qwirlItemId) {
                const currentStats = item.option_statistics ?? {};
                const currentOptionCount = response.selected_answer
                  ? currentStats[response.selected_answer]
                  : 0;
                const newOptionStats = {
                  ...currentStats,
                  [String(response.selected_answer)]:
                    (currentOptionCount ?? 0) + 1,
                };

                const newResponseCount = (item.response_count ?? 0) + 1;
                return {
                  ...item,
                  owner_answer: response.owner_answer,
                  response_count: newResponseCount,
                  option_statistics: newOptionStats,
                  user_response: {
                    ...item.user_response,
                    selected_answer: response.selected_answer,
                    comment: response.comment,
                  },
                } as QwirlResponseItem;
              }
              return item;
            });

            return { ...oldData, items: newItems };
          });
        },
        onError: () => {
          toast.error("An error occurred while submitting your answer.", {
            id: "submit-answer",
          });
          setUserAnswer(null);
        },
        onSettled: () => {
          queryClient.invalidateQueries({ queryKey });
        },
      }
    );
  };

  const handleVote = async (selected_answer: string) => {
    setUserAnswer(selected_answer);

    if (userQwirl?.session_status !== "in_progress") {
      await handleSessionStart();
    }

    await handleSubmitAnswer(selected_answer);

    const isLastPoll = currentPoll?.position === userQwirl?.items?.length;
    if (isLastPoll) {
      if (skippedQuestionsIds.length < MAX_SKIPS) {
        await handleEndSession();
      }
      // The UI will update to a "completed" state after the session finishes
      // and data is refetched.
    }
  };

  const handleEndSession = async () => {
    toast.loading("Getting Wavelength...", {
      id: "wavelength-update",
    });
    await finishQwirlSessionMutation.mutateAsync(
      {
        params: {
          path: {
            session_id: userQwirlQuery.data?.session_id ?? 0,
          },
        },
      },
      {
        onSuccess: (data) => {
          const newValue = data?.wavelength_score ?? 0;
          const currentValue = user?.relationship?.wavelength ?? 0;
          toast.custom(
            (t) => (
              <WavelengthProgress
                currentValue={currentValue}
                newValue={newValue}
                maxValue={100}
                title="Wavelength updated!"
                subtitle=""
                onAnimationComplete={() => {
                  setTimeout(() => toast.dismiss(t), 1000);
                }}
              />
            ),
            {
              duration: 4000,
              id: "wavelength-update",
            }
          );
          userQwirlQuery.refetch();
        },
      }
    );
  };

  const handleNextSkipOrFinish = () => {
    if (currentPosition >= polls.length) return;

    // Logic for skipping
    if (!userAnswer) {
      setSkippedQuestionsIds((prev) => [...prev, currentPoll?.id ?? 0]);
    }

    // Move to the next position
    setCurrentPosition((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPosition <= 1) return;

    const previousPoll = polls.find((p) => p.position === currentPosition - 1);
    if (previousPoll && skippedQuestionsIds.includes(previousPoll.id)) {
      setSkippedQuestionsIds((prev) =>
        prev.filter((id) => id !== previousPoll.id)
      );
    }
    setCurrentPosition((prev) => prev - 1);
  };

  const getButtonText = () => {
    if (currentPoll?.position === userQwirl?.items?.length) {
      if (!!userAnswer) {
        return "Get Wavelength";
      }
      return skippedQuestionsIds.length < MAX_SKIPS
        ? "Finish"
        : "Finish (Too many skips)";
    }
    if (userAnswer) {
      return "Next";
    } else {
      return skippedQuestionsIds.length < MAX_SKIPS
        ? "Skip"
        : "Skip (Too many skips)";
    }
  };

  return (
    <div className={clsx("rounded-2xl border-2 p-4  relative ")}>
      {userQwirlQuery.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500/20 backdrop-blur-[1px] z-10 rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {!userQwirlQuery.isLoading && polls?.length < MIN_QWIRL_POLLS ? (
        <div className="flex flex-col items-center justify-center h-full">
          <MessageSquare className="text-8xl text-gray-500 animate-in" />
          <h1 className="text-2xl font-bold text-gray-800 mt-6">
            Incomplete Qwirl
          </h1>
          <p className="text-gray-600">
            The user is still figuring out their Qwirl. Maybe check out their{" "}
            <span className="">posts</span> until then.
          </p>
        </div>
      ) : (
        <>
          <div className="absolute top-0 left-0 inset-x-0 flex  justify-between">
            {userAnswer && (
              <div className="flex items-center justify-center py-1 px-2 rounded-tl-xl rounded-br-2xl bg-primary text-primary-foreground text-xs ">
                {submitAnswerMutation?.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  "Answered"
                )}
              </div>
            )}
            <div className="flex items-center gap-3 flex-grow flex-1 flex-shrink-0 px-4 pt-1">
              <ProgressBar
                className="border border-primary rounded-full w-full"
                value={currentPoll?.position}
                max={polls?.length ?? 100}
                customColors={{
                  fill: "hsl(var(--primary))",
                }}
              />
              <div className="rounded-full bg-primary text-primary-foreground p-2 text-xs">
                <span>
                  {currentPoll?.position}/{polls?.length}
                </span>
              </div>
            </div>
            {userQwirl?.session_status === "in_progress" && (
              <div className="flex items-center justify-center rounded-bl-xl rounded-tr-2xl border-l-2 border-b-2 border-primary px-3 py-2">
                <SkipCounter
                  maxSkips={MAX_SKIPS}
                  skippedCount={skippedQuestionsIds.length}
                />
              </div>
            )}
          </div>
          <div className="py-4 px-4 mt-4">
            <AnimatePresence mode="wait">
              {currentPoll && (
                <motion.div
                  key={currentPoll?.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6 pt-2"
                >
                  {/* Image */}
                  {false && (
                    <div className="relative">
                      <Image
                        src={"/placeholder.svg"}
                        alt="Question image"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Question */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                      {currentPoll?.question_text}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentPoll?.options.map((option, index) => {
                      const isSelected = userAnswer === option;
                      const isOwnerChoice =
                        option === currentPoll?.owner_answer;
                      const optionStats = {
                        count: currentPoll?.option_statistics?.[option] ?? 0,
                        percentage: currentPoll?.option_statistics?.[option]
                          ? currentPoll?.response_count
                            ? ((currentPoll?.option_statistics?.[option] ?? 0) /
                                currentPoll?.response_count) *
                              100
                            : 0
                          : 0,
                      };
                      console.log(
                        optionStats,
                        "Option Stats",
                        currentPoll?.option_statistics,
                        currentPoll?.response_count
                      );
                      return (
                        <motion.div
                          key={index}
                          whileHover={!userAnswer ? { scale: 1.02 } : {}}
                          whileTap={!userAnswer ? { scale: 0.98 } : {}}
                          className="flex items-center gap-4 relative z-10"
                        >
                          {/* <div className="w-full h-full absolute">
                            {isSelected && !(isOwnerChoice && userAnswer) && (
                              <div className="absolute -inset-2 rounded-lg -z-10 bg-gradient-to-r bg-primary opacity-75 blur" />
                            )}
                            {isOwnerChoice && userAnswer && !isSelected && (
                              <div className="absolute -inset-2 rounded-lg -z-10 bg-gradient-to-r bg-secondary opacity-75 blur" />
                            )}
                            {isOwnerChoice && userAnswer && isSelected && (
                              <div className="absolute -inset-2 rounded-lg -z-10 bg-gradient-to-r bg-accent opacity-75 blur" />
                            )}
                          </div> */}

                          <button
                            onClick={() => handleVote(option)}
                            disabled={!!userAnswer}
                            className={clsx(
                              "bg-background text-foreground relative w-full p-3 rounded-xl z-10 border text-left transition-all duration-200",
                              {
                                "shadow-lg":
                                  isSelected || (isOwnerChoice && userAnswer),
                                "hover:shadow-md cursor-pointer": !userAnswer,
                              }
                            )}
                          >
                            <motion.div
                              className="h-full absolute inset-0  bg-accent/40 rounded-l-xl transition-all duration-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${optionStats.percentage}%` }}
                              style={{
                                borderTopRightRadius:
                                  optionStats.percentage === 100
                                    ? "0.75rem"
                                    : "0.5rem",
                                borderBottomRightRadius:
                                  optionStats.percentage === 100
                                    ? "0.75rem"
                                    : "0.5rem",
                              }}
                              transition={{
                                delay: 0.2 + index * 0.1,
                                duration: 0.5,
                                ease: "easeInOut",
                                bounce: 0.5,
                              }}
                            />

                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-900 font-medium">
                                  {option}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <div className="flex gap-2 z-10">
                                  {isSelected && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-background text-foreground  rounded-full flex items-center gap-1"
                                    >
                                      <div className="rounded-full h-3 w-3 bg-primary" />
                                      You
                                    </Badge>
                                  )}
                                  {isOwnerChoice && userAnswer && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-background text-foreground rounded-full flex items-center gap-1"
                                    >
                                      <div className="rounded-full h-3 w-3 bg-secondary" />
                                      {getFirstName(user?.name) ?? user?.name}
                                    </Badge>
                                  )}
                                </div>
                                {userAnswer && (
                                  <div className="flex items-center gap-2 text-sm font-medium">
                                    {/* <span className="text-gray-600">
                                    {optionStats?.count}
                                  </span> */}
                                    <span className="">
                                      {optionStats?.percentage?.toFixed(1)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Comment Section */}
                  {userAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-3 pt-4 border-t border-gray-200"
                    >
                      {!showCommentBox ? (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={MessageSquare}
                          disabled
                          iconPlacement="left"
                          onClick={() => {
                            setShowCommentBox(true);
                            setComment("");
                          }}
                          className="h-8 text-xs"
                        >
                          {/* {currentAnswer?.comment
                            ? "Edit that Something"
                            : } */}
                          Say Something
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <Label
                            htmlFor="comment"
                            className="text-xs font-medium"
                          >
                            Add a comment (optional)
                          </Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your thoughts..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[60px] resize-none text-sm"
                            maxLength={500}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {comment.length}/500
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCommentBox(false)}
                                className="h-7 text-xs"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {}}
                                className="bg-purple-600 hover:bg-purple-700 h-7 text-xs"
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* {currentAnswer?.comment && !showCommentBox && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {currentAnswer.comment}
                          </p>
                        </div>
                      )} */}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button
              icon={ChevronLeft}
              iconPlacement="left"
              onClick={handlePrevious}
              disabled={currentPoll?.position === 1}
              variant={"outline"}
              size={"sm"}
            >
              Previous
            </Button>
            <Button
              className=""
              icon={ChevronRight}
              loading={finishQwirlSessionMutation.isPending}
              iconPlacement="right"
              onClick={handleNextSkipOrFinish}
              variant={"outline"}
              disabled={currentPoll?.position === polls?.length}
              size={"sm"}
            >
              {getButtonText()}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default QwirlRespond;
