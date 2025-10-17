"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Sparkles, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CompactQuestionCardEditable,
  CompactQuestionCardEditableRef,
} from "@/components/qwirl/compact-question-card-editable";
import $api from "@/lib/api/client";
import { toast } from "sonner";
import { components } from "@/lib/api/v1-client-side";
import { QwirlPollData } from "@/components/qwirl/schema";
import Link from "next/link";

type Question = components["schemas"]["QuestionSearchResponse"];

interface QuestionSwipeStepProps {
  selectedCategories: string[];
}

export function QuestionSwipeStep({
  selectedCategories,
}: QuestionSwipeStepProps) {
  const isMobile = useIsMobile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [addedQuestions, setAddedQuestions] = useState<Question[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [currentQuestionData, setCurrentQuestionData] = useState<{
    question: string;
    answers: string[];
    selectedAnswer: string;
  } | null>(null);
  const constraintsRef = useRef(null);
  const questionCardRef = useRef<CompactQuestionCardEditableRef>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Fetch questions based on selected categories
  const { data: questionsData, isLoading } = $api.useQuery(
    "get",
    "/question-bank/search",
    {
      params: {
        query: {
          params: JSON.stringify({
            text: "",
            categories: selectedCategories,
            tags: [],
          }),
          limit: 50,
          skip: 0,
        },
      },
    }
  );

  const addPollMutation = $api.useMutation("post", "/qwirl/me/items", {
    onSuccess: () => {
      toast.success("Question added to your Qwirl!", {
        icon: <Sparkles className="h-4 w-4" />,
      });
    },
    onError: (error) => {
      console.error("Error adding question:", error);
      toast.error("Failed to add question");
    },
  });

  const questions = (questionsData as Question[]) || [];
  const currentQuestion = questions[currentQuestionIndex];
  const hasMoreQuestions = currentQuestionIndex < questions.length - 1;

  // Initialize current question data when question changes
  React.useEffect(() => {
    if (currentQuestion) {
      setCurrentQuestionData({
        question: currentQuestion.question_text,
        answers: [...currentQuestion.options],
        selectedAnswer: currentQuestion.options[0] || "",
      });
    }
  }, [currentQuestion]);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (!currentQuestion) return;

      setSwipeDirection(direction);

      if (direction === "right") {
        // Get the current data from the card ref
        const data = await questionCardRef.current?.submit();
        if (!data) return;

        // Add question to Qwirl using edited data
        try {
          await addPollMutation.mutateAsync({
            body: {
              items: [
                {
                  question_text: data.question_text,
                  options: data.options,
                  owner_answer: data.options[data.owner_answer_index] || "",
                },
              ],
            },
          });

          setAddedQuestions((prev) => [
            ...prev,
            {
              ...currentQuestion,
              question_text: data.question_text,
              options: data.options,
            },
          ]);
        } catch {
          // Error handled by mutation
          return;
        }
      }

      // Move to next question after a brief delay
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSwipeDirection(null);
        setCurrentQuestionData(null);
        x.set(0);
      }, 300);
    },
    [currentQuestion, addPollMutation, x]
  );

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      handleSwipe("right");
    } else if (info.offset.x < -threshold) {
      handleSwipe("left");
    } else {
      x.set(0);
    }
  };

  const getSwipeIndicator = () => {
    const currentX = x.get();

    if (currentX > 50) {
      return (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 font-semibold">
          <Heart className="h-4 w-4" />
          YAY
        </div>
      );
    }

    if (currentX < -50) {
      return (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 font-semibold">
          <X className="h-4 w-4" />
          NAY
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading questions...</p>
      </div>
    );
  }

  if (!hasMoreQuestions && currentQuestionIndex >= questions.length) {
    return (
      <div className="text-center py-12 space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Great job!</h3>
          <p className="text-muted-foreground">
            You&apos;ve reviewed all available questions.
            {addedQuestions.length > 0
              ? ` You&apos;ve added ${addedQuestions.length} question${
                  addedQuestions.length === 1 ? "" : "s"
                } to your Qwirl.`
              : " No worries! You can always add questions later using the methods below."}
          </p>
        </div>

        {/* Information about other ways to add questions */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-sm">
            More ways to build your Qwirl:
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-primary font-medium">•</span>
              <span>
                <strong>Question Bank:</strong> Browse and select multiple
                questions at once
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-medium">•</span>
              <span>
                <strong>Qwirl Editor:</strong> Add and customize questions one
                by one
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-medium">•</span>
              <span>
                <strong>Create Your Own:</strong> Write completely custom
                questions
              </span>
            </div>
          </div>
        </div>

        {addedQuestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Questions in your Qwirl:</h4>
            <div className="text-left space-y-2">
              {addedQuestions.slice(0, 3).map((question) => (
                <Badge
                  key={question.id}
                  variant="secondary"
                  className="block w-fit mx-auto"
                >
                  {question.question_text.slice(0, 50)}...
                </Badge>
              ))}
              {addedQuestions.length > 3 && (
                <Badge variant="outline">
                  +{addedQuestions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress and Stats */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {currentQuestionIndex + 1} of {questions.length}
          </Badge>
          <Badge
            variant={addedQuestions.length > 0 ? "default" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {addedQuestions.length} added
          </Badge>
        </div>
        {addedQuestions.length === 0 && (
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Don&apos;t see what you like? You can add more questions later from
            the{" "}
            <Link className="underline" href="/question-bank">
              Question Bank
            </Link>{" "}
            or{" "}
            <Link className="underline" href="/qwirls/primary/edit">
              create your own
            </Link>
            !
          </p>
        )}
      </div>

      {/* Question Card Area */}
      <div
        className="relative flex items-center justify-center py-4"
        ref={constraintsRef}
      >
        {currentQuestion && (
          <motion.div
            className="h-full w-full max-w-2xl px-4"
            drag={isMobile ? "x" : false}
            dragConstraints={constraintsRef}
            style={{ x, rotate, opacity }}
            onDragEnd={handleDragEnd}
            dragElastic={0.2}
            animate={
              swipeDirection
                ? {
                    x: swipeDirection === "right" ? 300 : -300,
                    opacity: 0,
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {getSwipeIndicator()}
              {currentQuestionData && (
                <CompactQuestionCardEditable
                  ref={questionCardRef}
                  question={currentQuestionData.question}
                  answers={currentQuestionData.answers}
                  selectedAnswer={currentQuestionData.selectedAnswer}
                  category={currentQuestion.category_name}
                  tags={currentQuestion.tags}
                />
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Desktop Controls */}
      {!isMobile && currentQuestion && (
        <div className="flex justify-center gap-6">
          <Button
            variant="destructive"
            icon={X}
            iconPlacement="left"
            onClick={() => handleSwipe("left")}
            size="lg"
            className="min-w-[120px]"
          >
            NAY
          </Button>

          <Button
            variant={"secondary"}
            icon={Heart}
            iconPlacement="left"
            onClick={() => handleSwipe("right")}
            loading={addPollMutation.isPending}
            size="lg"
            className="min-w-[120px]"
          >
            YAY
          </Button>
        </div>
      )}

      {/* Mobile Swipe Hint */}
      {isMobile && (
        <div className="text-center text-sm text-muted-foreground pt-2">
          <p>👆 Drag the card left or right</p>
        </div>
      )}
    </div>
  );
}
