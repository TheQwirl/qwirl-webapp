"use client";

import React, { useMemo } from "react";

interface SingleCardNavigationDotsProps {
  polls: { id: number }[];
  currentIndex: number;
  setCurrentPollId: (id: number | null) => void;
}

export const SingleCardNavigationDots: React.FC<
  SingleCardNavigationDotsProps
> = ({ polls, currentIndex, setCurrentPollId }) => {
  const totalPolls = polls.length;

  // Memoize the navigation dots structure for better performance
  const navigationStructure = useMemo(() => {
    if (totalPolls === 0) return { type: "empty" };
    if (totalPolls <= 10) return { type: "simple" };

    const showStart = currentIndex <= 3;
    const showEnd = currentIndex >= totalPolls - 4;
    const showMiddle = !showStart && !showEnd;

    return {
      type: "complex",
      showStart,
      showEnd,
      showMiddle,
    };
  }, [totalPolls, currentIndex]);

  if (navigationStructure.type === "empty") {
    return null;
  }

  // Simple case: show all dots
  if (navigationStructure.type === "simple") {
    return (
      <div className="flex justify-center gap-2">
        {polls.map((poll, index) => (
          <button
            key={poll.id}
            onClick={() => setCurrentPollId(poll.id)}
            className={`w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center text-sm font-medium ${
              index === currentIndex
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label={`Go to poll ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  }

  // Complex case: show dots with ellipsis
  const { showStart, showEnd, showMiddle } = navigationStructure;
  const dots = [];

  // Start dots (first few dots)
  if (showStart) {
    // Show first 5 dots when at the beginning
    for (let i = 0; i < Math.min(5, totalPolls); i++) {
      dots.push(
        <button
          key={polls?.[i]?.id}
          onClick={() => setCurrentPollId(polls?.[i]?.id ?? null)}
          className={`w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center text-sm font-medium ${
            i === currentIndex
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          aria-label={`Go to poll ${i + 1}`}
        >
          {i + 1}
        </button>
      );
    }

    // Add ellipsis if there are more dots after
    if (totalPolls > 5) {
      dots.push(
        <span key="ellipsis-end" className="text-gray-400 px-1">
          ...
        </span>
      );

      // Add last dot
      const lastIndex = totalPolls - 1;
      dots.push(
        <button
          key={polls?.[lastIndex]?.id}
          onClick={() => setCurrentPollId(polls?.[lastIndex]?.id ?? null)}
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            lastIndex === currentIndex
              ? "bg-primary"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label={`Go to poll ${lastIndex + 1}`}
        />
      );
    }
  } else if (showMiddle) {
    // Show first dot
    dots.push(
      <button
        key={polls?.[0]?.id}
        onClick={() => setCurrentPollId(polls?.[0]?.id ?? null)}
        className={`w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center text-sm font-medium ${
          0 === currentIndex
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        aria-label="Go to poll 1"
      >
        1
      </button>
    );

    // Add start ellipsis
    dots.push(
      <span key="ellipsis-start" className="text-gray-400 px-1">
        ...
      </span>
    );

    // Show current and adjacent dots (prev, current, next)
    for (let i = currentIndex - 1; i <= currentIndex + 1; i++) {
      if (i >= 0 && i < totalPolls) {
        dots.push(
          <button
            key={polls?.[i]?.id}
            onClick={() => setCurrentPollId(polls?.[i]?.id ?? null)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              i === currentIndex
                ? "bg-primary"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to poll ${i + 1}`}
          />
        );
      }
    }

    // Add end ellipsis
    dots.push(
      <span key="ellipsis-end" className="text-gray-400 px-1">
        ...
      </span>
    );

    // Show last dot
    const lastIndex = totalPolls - 1;
    dots.push(
      <button
        key={polls?.[lastIndex]?.id}
        onClick={() => setCurrentPollId(polls?.[lastIndex]?.id ?? null)}
        className={`w-8 h-8 rounded-full transition-colors duration-200 flex items-center justify-center text-sm font-medium ${
          lastIndex === currentIndex
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
        aria-label={`Go to poll ${lastIndex + 1}`}
      >
        {lastIndex + 1}
      </button>
    );
  } else if (showEnd) {
    // Show first dot
    dots.push(
      <button
        key={polls?.[0]?.id}
        onClick={() => setCurrentPollId(polls?.[0]?.id ?? null)}
        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
          0 === currentIndex ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"
        }`}
        aria-label="Go to poll 1"
      />
    );

    // Add ellipsis if there are dots before the end section
    if (totalPolls > 5) {
      dots.push(
        <span key="ellipsis-start" className="text-gray-400 px-1">
          ...
        </span>
      );
    }

    // Show last 5 dots when at the end
    const startIndex = Math.max(0, totalPolls - 5);
    for (let i = startIndex; i < totalPolls; i++) {
      // Skip if we already added this dot (avoid duplicate first dot)
      if (i === 0 && totalPolls > 5) continue;

      dots.push(
        <button
          key={polls?.[i]?.id}
          onClick={() => setCurrentPollId(polls?.[i]?.id ?? null)}
          className={`w-3 h-3 rounded-full transition-colors duration-200 ${
            i === currentIndex ? "bg-primary" : "bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label={`Go to poll ${i + 1}`}
        />
      );
    }
  }

  return <div className="flex justify-center items-center gap-2">{dots}</div>;
};
