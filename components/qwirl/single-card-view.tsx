"use client";

import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import React, { useCallback, useState } from "react";
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

const SingleCardView = () => {
  const { qwirlQuery, handleReorder, handleDelete } = useQwirlEditor();
  const [showComments, setShowComments] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPollId, setCurrentPollId] = useState<number | null>(null);

  const polls = React.useMemo(
    () =>
      qwirlQuery?.data?.items
        ? [...qwirlQuery.data.items].sort((a, b) => a.position - b.position)
        : [],
    [qwirlQuery?.data?.items]
  );
  const currentIndex =
    currentPollId != null
      ? polls.findIndex((poll) => poll.id === currentPollId)
      : 0;
  const currentPoll = polls?.[currentIndex] || null;

  React.useEffect(() => {
    if (polls.length && currentPollId === null) {
      setCurrentPollId(polls?.[0]?.id || null);
    }
  }, [polls, currentPollId]);

  const goToPrevious = () => {
    const index = polls.findIndex((p) => p.id === currentPollId);
    if (index > 0) {
      setCurrentPollId(polls?.[index - 1]?.id || null);
    }
  };

  const goToNext = () => {
    const index = polls.findIndex((p) => p.id === currentPollId);
    if (index < polls.length - 1) {
      setCurrentPollId(polls?.[index + 1]?.id || null);
    }
  };

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

  const handleMoveUp = () => {
    if (currentIndex > 0) {
      const newPolls = [...polls];
      const [movedPoll] = newPolls.splice(currentIndex, 1);
      if (movedPoll) {
        newPolls.splice(currentIndex - 1, 0, movedPoll);
        handleReorder(newPolls);
        setCurrentPollId(movedPoll?.id);
      }
    }
  };

  const handleMoveDown = () => {
    if (currentIndex < polls.length - 1) {
      const newPolls = [...polls];
      const [movedPoll] = newPolls.splice(currentIndex, 1);
      if (movedPoll) {
        newPolls.splice(currentIndex + 1, 0, movedPoll);
        handleReorder(newPolls);
        setCurrentPollId(movedPoll?.id);
      }
    }
  };

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
                value={selectedUserId || "all"}
                onValueChange={(value) =>
                  setSelectedUserId(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {/* {[].map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          image={user.avatar ?? ""}
                          name={user.name ?? undefined}
                          size="sm"
                          rounded={true}
                        />
                        <span>{user.name}</span>
                        {!user.isCompleted && (
                          <Badge variant="outline" className="text-xs">
                            Incomplete
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))} */}
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
                    {currentPoll?.options.map((option, optionIndex) => {
                      const isMyChoice = currentPoll?.owner_answer === option;
                      return (
                        <div
                          key={optionIndex}
                          className={clsx(
                            " flex items-center justify-between flex-wrap text-foreground w-full p-3 rounded-xl z-10 border text-left transition-all duration-200",
                            {
                              "bg-accent": isMyChoice,
                              "bg-background": !isMyChoice,
                            }
                          )}
                        >
                          <span className="text-gray-900 font-medium">
                            {option}
                          </span>
                          {isMyChoice && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-background text-foreground  rounded-full flex items-center gap-1"
                            >
                              <div className="rounded-full h-3 w-3 bg-primary" />
                              You
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{0} responses</span>
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
