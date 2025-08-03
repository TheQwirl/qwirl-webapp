import React from "react";
import { AlertCircleIcon } from "lucide-react";
interface SkipCounterProps {
  skippedCount: number;
  maxSkips: number;
}
export const SkipCounter = ({ skippedCount, maxSkips }: SkipCounterProps) => {
  const skipsUsed = Math.min(skippedCount, maxSkips);
  //   const skipsRemaining = maxSkips - skipsUsed;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium">Skips:</span>

      <div className="flex space-x-1 ">
        {Array.from({
          length: maxSkips,
        }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm transition-all ${
              i < skippedCount ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {skipsUsed >= maxSkips && (
        <AlertCircleIcon className="w-5 h-5 text-amber-500 animate-pulse" />
      )}
    </div>
  );
};
