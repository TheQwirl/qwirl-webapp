import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { Qwirl } from "../types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PollOption from "../poll-option";
import WavelengthIndicator from "@/components/wavelength-indicator";

interface CompletedPanelProps {
  data: Qwirl | undefined;
  newCount: number;
  wavelength: number;
  userName: string | null;
  onStartReview: () => void;
  onStartAnsweringNew: () => void;
}

const CompletedPanel = ({
  data,
  newCount,
  wavelength,
  userName,
  onStartReview,
  onStartAnsweringNew,
}: CompletedPanelProps) => {
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const answeredPolls =
    data?.items?.filter((item) => item.user_response?.selected_answer) ?? [];

  return (
    <div className="max-h-screen py-6">
      <div className="rounded-2xl max-h-[90vh] border-2 p-6 bg-card text-card-foreground space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              You&apos;ve completed {userName ? `${userName}'s` : "this"} Qwirl!
            </h3>
            <p className="text-sm text-muted-foreground">
              See how aligned you are
            </p>
          </div>
        </div>

        {/* Wavelength Display */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Your Wavelength with {userName ?? "them"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <WavelengthIndicator
                wavelength={wavelength}
                userName={userName ?? ""}
              />
            </div>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {wavelength >= 80
                ? "You're highly aligned! You think very similarly."
                : wavelength >= 60
                ? "Pretty good sync! You share many perspectives."
                : wavelength >= 40
                ? "Some common ground, but different views on key things."
                : "Quite different perspectives — that's what makes it interesting!"}
            </p>
          </div>
        </div>

        {/* Stats */}
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
            <strong>{newCount}</strong> new question{newCount > 1 ? "s" : ""}{" "}
            added since you last responded.
          </div>
        )}

        {/* Show/Hide Questions Summary Toggle */}
        {answeredPolls.length > 0 && (
          <div className="border-t pt-4">
            <Button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              variant="outline"
              className="w-full"
              icon={showAllQuestions ? ChevronUp : ChevronDown}
              iconPlacement="right"
            >
              {showAllQuestions ? "Hide" : "View"} All Answers
            </Button>

            {showAllQuestions && (
              <div className="mt-4 space-y-4 max-h-[200px] overflow-y-auto">
                {answeredPolls.map((poll, index) => (
                  <div
                    key={poll.id}
                    className="border rounded-xl p-4 bg-muted/20 space-y-3"
                  >
                    {/* Question */}
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">
                        Q{index + 1}
                      </Badge>
                      <h4 className="font-semibold text-sm">
                        {poll.question_text}
                      </h4>
                    </div>

                    {/* Options with comparison */}
                    <div className="space-y-2">
                      {poll.options.map((option, optIndex) => {
                        const isUserAnswer =
                          poll.user_response?.selected_answer === option;
                        const isOwnerAnswer = poll.owner_answer === option;
                        const showBothBadge = isUserAnswer && isOwnerAnswer;

                        return (
                          <div
                            key={optIndex}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg border transition-colors",
                              showBothBadge &&
                                "bg-primary/10 border-primary/40 font-medium",
                              isUserAnswer &&
                                !isOwnerAnswer &&
                                "bg-blue-50 border-blue-200",
                              isOwnerAnswer &&
                                !isUserAnswer &&
                                "bg-amber-50 border-amber-200"
                            )}
                          >
                            <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                              {optIndex + 1}
                            </div>
                            <span className="flex-1 text-sm">{option}</span>
                            <div className="flex gap-1">
                              {showBothBadge ? (
                                <Badge
                                  variant="default"
                                  className="text-xs px-2 py-0"
                                >
                                  Both 🎯
                                </Badge>
                              ) : (
                                <>
                                  {isUserAnswer && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-2 py-0"
                                    >
                                      You
                                    </Badge>
                                  )}
                                  {isOwnerAnswer && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-2 py-0"
                                    >
                                      Them
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Comment if exists */}
                    {poll.user_response?.comment && (
                      <div className="bg-background/50 p-3 rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">
                          Your comment:
                        </p>
                        <p className="text-sm italic">
                          &quot;{poll.user_response.comment}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
    </div>
  );
};

export default CompletedPanel;
