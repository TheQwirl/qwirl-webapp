import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Qwirl } from "../types";

interface CompletedPanelProps {
  data: Qwirl | undefined;
  newCount: number;
  onStartReview: () => void;
  onStartAnsweringNew: () => void;
}

const CompletedPanel = ({
  data,
  newCount,
  onStartReview,
  onStartAnsweringNew,
}: CompletedPanelProps) => (
  <div className="rounded-2xl border-2 p-6 bg-card text-card-foreground space-y-4">
    <div className="flex items-center gap-3">
      <div className="rounded-full bg-green-100 p-3">
        <Check className="text-green-700" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">You completed this Qwirl</h3>
        <p className="text-sm text-muted-foreground">
          Nice work — you finished all questions that were present when you last
          responded.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-3 text-center">
      <div>
        <div className="text-xs text-muted-foreground">Answered</div>
        <div className="font-medium">{data?.answered_count ?? 0}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Skipped</div>
        <div className="font-medium">{data?.skipped_count ?? 0}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Unanswered</div>
        <div className="font-medium">{data?.unanswered_count ?? 0}</div>
      </div>
    </div>

    {newCount > 0 && (
      <div className="bg-muted p-3 rounded-md text-sm">
        <strong>{newCount}</strong> new question{newCount > 1 ? "s" : ""} have
        been added since you last responded.
      </div>
    )}

    <div className="flex gap-3">
      <Button onClick={onStartReview} variant="outline">
        Review your responses
      </Button>
      {newCount > 0 && (
        <Button onClick={onStartAnsweringNew}>
          Answer {newCount} new question{newCount > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  </div>
);

export default CompletedPanel;
