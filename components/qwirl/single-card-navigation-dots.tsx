"use client";

import React from "react";

interface SingleCardNavigationDotsProps {
  polls: { id: number }[];
  currentIndex: number;
  setCurrentPollId: (id: number | null) => void;
}

export const SingleCardNavigationDots: React.FC<
  SingleCardNavigationDotsProps
> = ({ polls, currentIndex, setCurrentPollId }) => {
  const totalPolls = polls.length;

  if (totalPolls <= 10) {
    return (
      <div className="flex justify-center gap-2">
        {polls.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPollId(polls?.[index]?.id || null)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentIndex
                ? "bg-primary"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    );
  }

  const showStart = currentIndex <= 3;
  const showEnd = currentIndex >= totalPolls - 4;
  const showMiddle = !showStart && !showEnd;

  return (
    <div className="flex justify-center items-center gap-2">
      {(showStart || showMiddle) && (
        <>
          {Array.from({ length: showStart ? Math.min(5, totalPolls) : 2 }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPollId(polls?.[index]?.id || null)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            )
          )}
          {!showStart && <span className="text-gray-400 px-1">...</span>}
        </>
      )}

      {showMiddle && (
        <>
          {Array.from({ length: 3 }).map((_, index) => {
            const dotIndex = currentIndex - 1 + index;
            return (
              <button
                key={dotIndex}
                onClick={() => setCurrentPollId(polls?.[dotIndex]?.id || null)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  dotIndex === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            );
          })}
          <span className="text-gray-400 px-1">...</span>
        </>
      )}

      {(showEnd || showMiddle) && (
        <>
          {Array.from({
            length: showEnd ? Math.min(5, totalPolls) : 2,
          }).map((_, index) => {
            const dotIndex = showEnd
              ? totalPolls - Math.min(5, totalPolls) + index
              : totalPolls - 2 + index;
            return (
              <button
                key={dotIndex}
                onClick={() => setCurrentPollId(polls?.[dotIndex]?.id || null)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  dotIndex === currentIndex
                    ? "bg-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            );
          })}
        </>
      )}
    </div>
  );
};
