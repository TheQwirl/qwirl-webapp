import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import CollapsibleCard from "@/components/collapsible-card";
import React from "react";
import { CONSTANTS } from "@/constants/qwirl-respond";

interface PollProgressCardProps {
  pollCount: number;
}

const PollProgressCard: React.FC<PollProgressCardProps> = ({ pollCount }) => {
  const isMinimumMet = pollCount >= CONSTANTS.MIN_QWIRL_POLLS;
  const progressPercentage = Math.min(
    (pollCount / CONSTANTS.MIN_QWIRL_POLLS) * 100,
    100
  );
  return (
    <CollapsibleCard
      title="Poll Progress"
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Polls</span>
          <Badge
            variant={isMinimumMet ? "default" : "secondary"}
            className="font-semibold"
          >
            {pollCount} / {CONSTANTS.MIN_QWIRL_POLLS}
          </Badge>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center gap-2 text-xs">
            {isMinimumMet ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">
                  Others can now respond to your Qwirl!
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-amber-700">
                  Add {CONSTANTS.MIN_QWIRL_POLLS - pollCount} more to enable
                  responses
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default PollProgressCard;
