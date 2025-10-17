import React from "react";
import { CheckCircle, MessageSquare } from "lucide-react";

interface PollStatsProps {
  responseCount: number;
  commentCount: number;
}

/**
 * PollStats displays statistics about poll responses and comments
 */
const PollStats: React.FC<PollStatsProps> = ({
  responseCount,
  commentCount,
}) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1">
        <CheckCircle className="h-4 w-4 text-primary" />
        <span>{responseCount} responses</span>
      </div>

      <div className="flex items-center gap-1">
        <MessageSquare className="h-4 w-4 text-secondary" />
        <span>{commentCount} comments</span>
      </div>
    </div>
  );
};

export default PollStats;
