import { getFirstName } from "@/lib/utils";
import { motion } from "framer-motion";
import PollOption from "@/components/qwirl/poll-option";

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
  // isAnsweredCurrent,
  isSkippedCurrent,
  userName,
}: OptionsListProps) => {
  return (
    <div className="space-y-3">
      {options.map((option: string, index: number) => {
        const isSelected = userAnswer === option;
        const isOwnerChoice = isReviewMode ? option === ownerAnswer : false;
        const count = optionStatistics?.counts?.[option] ?? 0;
        const total = responseCount ?? 0;
        const percentage = total > 0 && count > 0 ? (count / total) * 100 : 0;

        const shouldRenderResults = Boolean(userAnswer);
        const shouldRenderDisplay = isSkippedCurrent && !shouldRenderResults;
        const shouldRenderInteractive =
          !shouldRenderResults && !shouldRenderDisplay;
        return (
          <motion.div
            key={`${option}-${index}`}
            whileHover={shouldRenderInteractive ? { scale: 1.02 } : {}}
            whileTap={shouldRenderInteractive ? { scale: 0.98 } : {}}
            className="flex items-center gap-4 relative z-10"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {shouldRenderResults ? (
              <PollOption
                option={option}
                optionNumber={index + 1}
                variant="results"
                isMyChoice={isSelected}
                isOwnerChoice={isOwnerChoice}
                responders={[]}
                percentage={percentage}
                userName={getFirstName(userName) ?? userName ?? undefined}
                className="w-full"
              />
            ) : shouldRenderDisplay ? (
              <PollOption
                option={option}
                optionNumber={index + 1}
                variant="display"
                className="w-full"
              />
            ) : (
              <PollOption
                option={option}
                optionNumber={index + 1}
                variant="interactive"
                onSelect={() => onVote(option)}
                userName={getFirstName(userName) ?? userName ?? undefined}
                className="w-full"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default OptionsList;
