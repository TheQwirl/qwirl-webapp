import { Button } from "@/components/ui/button";
import { Share2, Users, Target, Eye, Copy, AlertCircle } from "lucide-react";
import { Pencil, Book } from "lucide-react";
import CollapsibleCard from "@/components/collapsible-card";
import React, { useState } from "react";
import { toast } from "sonner";
import { Qwirl } from "../../../../components/qwirl/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickActionsCardProps {
  isMinimumMet: boolean;
  qwirlUrl?: string;
  onPreview?: () => void;
  onShare?: () => void;
  onViewResponses?: () => void;
  minPollsRequired: number;
  onEdit?: () => void;
  onQuestionBank?: () => void;
}

const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  isMinimumMet,
  qwirlUrl = "qwirl.io/u/your-qwirl",
  onPreview,
  onShare,
  onViewResponses,
  minPollsRequired,
  onEdit,
  onQuestionBank,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(qwirlUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <CollapsibleCard
      title="Quick Actions"
      icon={<Target className="h-5 w-5" />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className="truncate text-xs bg-muted px-3 py-2 rounded-lg font-mono border border-border/30 flex-1 shadow-sm"
            title={qwirlUrl}
          >
            {qwirlUrl}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copy Qwirl URL"
                  // disabled={!isMinimumMet}
                  className={`transition-colors ${
                    copied
                      ? "bg-primary text-primary-foreground dark:bg-green-900"
                      : ""
                  }`}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? "Copied!" : "Copy link"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-4 justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onShare}
                  // disabled={!isMinimumMet}
                  aria-label="Share Qwirl"
                >
                  <Share2 className="h-6 w-6 mb-1" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Qwirl</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onViewResponses}
                  // disabled={!isMinimumMet}
                  aria-label="View Responses"
                >
                  <Users className="h-6 w-6 mb-1" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Responses</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onPreview}
                  // disabled={!isMinimumMet}
                  aria-label="Preview Qwirl"
                >
                  <Eye className="h-6 w-6 mb-1" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview Qwirl</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onEdit}
                  // disabled={!isMinimumMet}
                  aria-label="Edit Qwirl"
                >
                  <Pencil className="h-6 w-6 mb-1" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Qwirl</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onQuestionBank}
                  // disabled={!isMinimumMet}
                  aria-label="Go to Question Bank"
                >
                  <Book className="h-6 w-6 mb-1" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to Question Bank</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default QuickActionsCard;
