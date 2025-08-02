"use client";

import { useQwirlEditor } from "@/hooks/qwirl/useQwirlEditor";
import React, { useCallback, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MoreHorizontal,
  Trash2,
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

const SingleCardView = () => {
  const { qwirlQuery, handleReorder, handleDelete } = useQwirlEditor();
  const [currentIndex, setCurrentIndex] = useState(0);
  const polls = React.useMemo(
    () =>
      qwirlQuery?.data?.items?.sort((a, b) => a.position - b.position) || [],
    [qwirlQuery?.data?.items]
  );
  const currentPoll = qwirlQuery?.data?.items?.[currentIndex];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min((polls?.length ?? 0) - 1, prev + 1));
  }, [polls?.length]);

  useKeyboardNavigation(
    {
      ArrowLeft: goToPrevious,
      ArrowRight: goToNext,
    },
    polls.length > 0
  );

  const handlingDelete = useCallback(() => {
    if (currentPoll) {
      handleDelete(currentPoll?.id);
      if (currentIndex >= polls.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }
    }
  }, [currentPoll, handleDelete, currentIndex, polls.length]);

  const movePoll = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newPolls = [...polls];
      const [movedPoll] = newPolls.splice(fromIndex, 1);
      if (movedPoll) newPolls.splice(toIndex, 0, movedPoll);
      handleReorder(newPolls);
    },
    [handleReorder, polls]
  );

  const handleMoveUp = useCallback(() => {
    if (currentIndex > 0) {
      movePoll(currentIndex, currentIndex - 1);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, movePoll]);

  const handleMoveDown = useCallback(() => {
    if (currentIndex < polls.length - 1) {
      movePoll(currentIndex, currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, movePoll, polls.length]);

  const renderNavigationDots = () => {
    const totalPolls = polls.length;

    if (totalPolls <= 10) {
      return (
        <div className="flex justify-center gap-2">
          {polls.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      );
    } else {
      // Show condensed version for more than 10 polls
      const showStart = currentIndex <= 3;
      const showEnd = currentIndex >= totalPolls - 4;
      const showMiddle = !showStart && !showEnd;

      return (
        <div className="flex justify-center items-center gap-2">
          {/* First few dots */}
          {(showStart || showMiddle) && (
            <>
              {Array.from({
                length: showStart ? Math.min(5, totalPolls) : 2,
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex
                      ? "bg-primary"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
              {!showStart && <span className="text-gray-400 px-1">...</span>}
            </>
          )}

          {/* Middle dots */}
          {showMiddle && (
            <>
              {Array.from({ length: 3 }).map((_, index) => {
                const dotIndex = currentIndex - 1 + index;
                return (
                  <button
                    key={dotIndex}
                    onClick={() => setCurrentIndex(dotIndex)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      dotIndex === currentIndex
                        ? "bg-purple-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                );
              })}
              <span className="text-gray-400 px-1">...</span>
            </>
          )}

          {/* Last few dots */}
          {(showEnd || showMiddle) && (
            <>
              {Array.from({
                length: showEnd ? Math.min(5, totalPolls) : 2,
              }).map((_, index) => {
                const dotIndex = showEnd
                  ? totalPolls - (showEnd ? Math.min(5, totalPolls) : 2) + index
                  : totalPolls - 2 + index;
                return (
                  <button
                    key={dotIndex}
                    onClick={() => setCurrentIndex(dotIndex)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      dotIndex === currentIndex
                        ? "bg-purple-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                );
              })}
            </>
          )}
        </div>
      );
    }
  };

  if (polls?.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Dots - STATIC */}
          <div className="pt-4">{renderNavigationDots()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleCardView;
