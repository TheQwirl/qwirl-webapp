"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";
import { UserAvatar } from "./user-avatar";

export interface PollOption {
  text: string;
  percentage: number;
}

export interface PollQuestion {
  question: string;
  options: PollOption[];
}

const pollQuestions: PollQuestion[] = [
  {
    question: "Is morality objective or subjective?",
    // ["Objective", "Subjective", "Both", "Neither / it's complicated"]
    options: [
      { text: "Objective", percentage: 45 },
      { text: "Subjective", percentage: 35 },
      { text: "Both", percentage: 15 },
      { text: "Neither / it's complicated", percentage: 5 },
    ],
  },
  {
    question: "Pineapple on pizza?",
    // ["Always", "Sometimes", "Never", "Haven't tried"]
    options: [
      { text: "Always", percentage: 30 },
      { text: "Sometimes", percentage: 40 },
      { text: "Never", percentage: 25 },
      { text: "Haven't tried", percentage: 5 },
    ],
  },
  {
    question: "Best time to be creative?",
    options: [
      { text: "Dawn", percentage: 10 },
      { text: "Afternoon", percentage: 30 },
      { text: "Late night", percentage: 40 },
      { text: "Whenever it strikes", percentage: 20 },
    ],
  },
];

const pollColors = [
  "bg-primary/70",
  "bg-accent/70",
  "bg-secondary-foreground/60",
  "bg-muted-foreground/60",
];

const PollAnimation: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const questionContainerRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | "auto">("auto");

  // Set a min-height for the question container to avoid layout shifts
  useEffect(() => {
    if (questionContainerRef.current) {
      let maxHeight = 0;
      // Temporarily render all questions to find the max height
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.visibility = "hidden";
      tempContainer.style.width = `${questionContainerRef.current.offsetWidth}px`;
      document.body.appendChild(tempContainer);

      pollQuestions.forEach((q) => {
        const p = document.createElement("h2");
        p.className =
          "mb-6 text-2xl sm:text-3xl font-bold text-foreground text-center"; // Match classes
        p.innerText = q.question;
        tempContainer.appendChild(p);
        if (p.offsetHeight > maxHeight) {
          maxHeight = p.offsetHeight;
        }
        tempContainer.removeChild(p);
      });

      document.body.removeChild(tempContainer);
      setMinHeight(maxHeight);
    }
  }, []);

  const changeQuestion = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + newDirection;
      if (newIndex < 0) return pollQuestions.length - 1;
      if (newIndex >= pollQuestions.length) return 0;
      return newIndex;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      changeQuestion(1);
    }, 4000); // Increased interval for better viewing

    return () => clearInterval(interval);
  }, []);

  const currentQuestion = pollQuestions[currentQuestionIndex];

  const variants = {
    enter: (direction: number) => ({
      opacity: 0,
      y: direction > 0 ? 30 : -30,
      scale: 0.95,
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: (direction: number) => ({
      opacity: 0,
      y: direction < 0 ? 30 : -30,
      scale: 0.95,
    }),
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl rounded-3xl overflow-hidden bg-card/80 backdrop-blur-md border">
      <CardHeader className="flex-row items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <UserAvatar
            name="Humma Habib"
            image="https://avatar.iran.liara.run/public/girl?username=hummahabib55"
            ringed
          />
          <div>
            <p className="font-semibold text-foreground">Humma Habbib</p>
            <p className="text-xs text-muted-foreground">@hummahabib55</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col justify-center h-full w-full relative">
          <div
            className="relative"
            style={{
              minHeight:
                typeof minHeight === "number" && minHeight > 0
                  ? minHeight + 24
                  : "auto",
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentQuestionIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="w-full absolute top-0 left-0"
              >
                <h2
                  ref={questionContainerRef}
                  className="mb-6 text-xl sm:text-2xl font-bold text-foreground text-center"
                >
                  {currentQuestion?.question}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-3 mt-4">
            {currentQuestion?.options.map((option, index) => (
              <motion.div
                key={`${currentQuestionIndex}-${index}`}
                className="relative h-11 bg-muted/50 rounded-lg w-full overflow-hidden group"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
              >
                <motion.div
                  className={cn(
                    "absolute top-0 left-0 h-full",
                    pollColors[index % pollColors.length]
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${option.percentage}%` }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full px-4">
                  <span className="font-medium text-sm text-foreground">
                    {option.text}
                  </span>
                  <span className="font-semibold text-xs text-foreground/80">
                    {option.percentage}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex text-muted-foreground justify-center gap-4 mt-6">
            <button
              onClick={() => changeQuestion(-1)}
              className="p-2 rounded-full hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => changeQuestion(1)}
              className="p-2 rounded-full hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PollAnimation;
