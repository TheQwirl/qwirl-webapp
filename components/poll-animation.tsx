"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    question: "What's your favorite programming language?",
    options: [
      { text: "JavaScript", percentage: 40 },
      { text: "Python", percentage: 30 },
      { text: "Java", percentage: 20 },
      { text: "C++", percentage: 10 },
    ],
  },
  {
    question: "How often do you code?",
    options: [
      { text: "Daily", percentage: 60 },
      { text: "Weekly", percentage: 25 },
      { text: "Monthly", percentage: 10 },
      { text: "Rarely", percentage: 5 },
    ],
  },
  {
    question: "What's your preferred development environment?",
    options: [
      { text: "VS Code", percentage: 50 },
      { text: "IntelliJ IDEA", percentage: 20 },
      { text: "Sublime Text", percentage: 15 },
      { text: "Vim", percentage: 15 },
    ],
  },
  {
    question: "How do you learn new programming concepts?",
    options: [
      { text: "Online courses", percentage: 35 },
      { text: "Documentation", percentage: 25 },
      { text: "Books", percentage: 20 },
      { text: "YouTube tutorials", percentage: 20 },
    ],
  },
];

const PollAnimation: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentQuestionIndex(
          (prevIndex) => (prevIndex + 1) % pollQuestions.length
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setCurrentQuestionIndex(
          (prevIndex) =>
            (prevIndex - 1 + pollQuestions.length) % pollQuestions.length
        );
      } else if (event.key === "ArrowRight") {
        setCurrentQuestionIndex(
          (prevIndex) => (prevIndex + 1) % pollQuestions.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentQuestion = pollQuestions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center h-full gap-4 w-full">
      <div className="flex-grow">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => setIsAnimating(false)}
        >
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            className="w-full"
          >
            <h2 className="mb-6 text-2xl font- text-gray-800 w-full">
              {currentQuestion.question}
            </h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  //   h-16
                  className="relative h-12 border bg-white/50 rounded-lg w-full overflow-hidden"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${option.percentage}%` }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      duration: 0.5,
                      ease: "easeInOut",
                      bounce: 0.5,
                    }}
                  />
                  <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full px-4">
                    <span className="font-semibold text-gray-800">
                      {option.text}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {option.percentage}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() =>
              setCurrentQuestionIndex(
                (prevIndex) =>
                  (prevIndex - 1 + pollQuestions.length) % pollQuestions.length
              )
            }
            className="p-2 text-gray-800 bg-gray-400/60 rounded-full hover:text-gray-800 focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() =>
              setCurrentQuestionIndex(
                (prevIndex) => (prevIndex + 1) % pollQuestions.length
              )
            }
            className="p-2 text-gray-800 bg-gray-400/60 rounded-full hover:text-gray-800 focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollAnimation;
