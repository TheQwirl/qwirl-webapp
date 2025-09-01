import { Badge } from "@/components/ui/badge";
import { getFirstName } from "@/lib/utils";
import clsx from "clsx";
import { motion } from "framer-motion";

interface OptionsListProps {
  options: string[];
  userAnswer: string | null;
  ownerAnswer: string | null | undefined;
  optionStatistics:
    | {
        counts?: {
          [key: string]: number;
        };
        total_responses: number;
      }
    | undefined;
  responseCount: number;
  onVote: (option: string) => void;
  isReviewMode: boolean;
  isAnsweredCurrent: boolean;
  isSkippedCurrent: boolean;
  userName: string | null;
}

const OptionsList = ({
  options,
  userAnswer,
  ownerAnswer,
  optionStatistics,
  responseCount,
  onVote,
  isReviewMode,
  isAnsweredCurrent,
  isSkippedCurrent,
  userName,
}: OptionsListProps) => (
  <div className="space-y-3">
    {options.map((option: string, index: number) => {
      const isSelected = userAnswer === option;
      const isOwnerChoice = option === ownerAnswer;
      const count = optionStatistics?.counts?.[option] ?? 0;
      const total = responseCount ?? 0;
      const percentage = total > 0 && count > 0 ? (count / total) * 100 : 0;

      return (
        <motion.div
          key={`${option}-${index}`}
          whileHover={!isReviewMode && !userAnswer ? { scale: 1.02 } : {}}
          whileTap={!isReviewMode && !userAnswer ? { scale: 0.98 } : {}}
          className="flex items-center gap-4 relative z-10"
        >
          <button
            onClick={() => onVote(option)}
            disabled={isReviewMode || isAnsweredCurrent || isSkippedCurrent}
            className={clsx(
              "bg-background text-foreground relative w-full p-3 rounded-xl z-10 border text-left transition-all duration-200",
              {
                "shadow-lg":
                  userAnswer === option ||
                  (isAnsweredCurrent && option === ownerAnswer),
                "hover:shadow-md cursor-pointer":
                  !isReviewMode && !isAnsweredCurrent && !isSkippedCurrent,
                "opacity-60 cursor-not-allowed":
                  isAnsweredCurrent || isSkippedCurrent || isReviewMode,
              }
            )}
          >
            <motion.div
              className="h-full absolute inset-0 bg-accent/40 rounded-l-xl transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              style={{
                borderTopRightRadius: percentage === 100 ? "0.75rem" : "0.5rem",
                borderBottomRightRadius:
                  percentage === 100 ? "0.75rem" : "0.5rem",
              }}
              transition={{
                delay: 0.12 + index * 0.06,
                duration: 0.4,
                ease: "easeInOut",
              }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">{option}</span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <div className="flex gap-2 z-10">
                  {isSelected && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-background rounded-full flex items-center gap-1"
                    >
                      <div className="rounded-full h-3 w-3 bg-primary" />
                      You
                    </Badge>
                  )}
                  {isOwnerChoice && !!userAnswer && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-background rounded-full flex items-center gap-1"
                    >
                      <div className="rounded-full h-3 w-3 bg-secondary" />
                      {getFirstName(userName) ?? userName}
                    </Badge>
                  )}
                </div>
                {!!userAnswer && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        </motion.div>
      );
    })}
  </div>
);

export default OptionsList;
