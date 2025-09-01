import ProgressBar from "@/components/progress-bar";
import { SkipCounter } from "../skip-counter";
import { CONSTANTS } from "@/constants/qwirl-respond";
import { Loader2 } from "lucide-react";
import { QwirlItem } from "../types";

interface HeaderProps {
  isAnsweredCurrent: boolean;
  isSkippedCurrent: boolean;
  isSubmitAnswerMutationPending: boolean;
  currentPoll: QwirlItem | null | undefined;
  pollsLength: number;
  isReviewMode: boolean;
  skippedCount: number;
}

const Header = ({
  isAnsweredCurrent,
  isSkippedCurrent,
  isSubmitAnswerMutationPending,
  currentPoll,
  pollsLength,
  isReviewMode,
  skippedCount,
}: HeaderProps) => (
  <div className="absolute top-0 left-0 inset-x-0 flex justify-between">
    {(isAnsweredCurrent || isSkippedCurrent) && (
      <div className="flex items-center justify-center py-1 px-2 rounded-tl-xl rounded-br-2xl bg-primary text-primary-foreground text-xs">
        {isSubmitAnswerMutationPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2">Saving...</span>
          </div>
        ) : isAnsweredCurrent ? (
          "Answered"
        ) : (
          "Skipped"
        )}
      </div>
    )}

    <div className="flex items-center gap-3 flex-grow px-4 pt-1">
      <ProgressBar
        className="border border-primary rounded-full w-full"
        value={currentPoll?.position}
        max={pollsLength || 100}
        customColors={{ fill: "hsl(var(--primary))" }}
      />
      <div className="rounded-full bg-primary text-primary-foreground p-2 text-xs">
        <span>
          {currentPoll?.position}/{pollsLength}
        </span>
      </div>
    </div>

    {!isReviewMode && (
      <div className="flex items-center justify-center rounded-bl-xl rounded-tr-2xl border-l-2 border-b-2 border-primary px-3 py-2">
        <SkipCounter
          maxSkips={CONSTANTS.MAX_SKIPS}
          skippedCount={skippedCount}
        />
      </div>
    )}
  </div>
);

export default Header;
