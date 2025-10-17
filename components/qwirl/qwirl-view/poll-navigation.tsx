import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";

interface PollNavigationProps {
  currentIndex: number;
  totalPolls: number;
  onPrevious: () => void;
  onNext: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

/**
 * PollNavigation component handles navigation between polls and poll management actions
 */
const PollNavigation: React.FC<PollNavigationProps> = ({
  currentIndex,
  totalPolls,
  onPrevious,
  onNext,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="bg-white"
          aria-label="Previous poll"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Badge
          variant="secondary"
          className="bg-accent text-accent-foreground font-semibold whitespace-nowrap"
        >
          Poll #{currentIndex + 1} of {totalPolls}
        </Badge>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentIndex === totalPolls - 1}
          className="bg-white"
          aria-label="Next poll"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white" aria-label="Poll actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onMoveUp} disabled={!canMoveUp}>
            <ArrowUp className="h-4 w-4 mr-2" />
            Move Up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onMoveDown} disabled={!canMoveDown}>
            <ArrowDown className="h-4 w-4 mr-2" />
            Move Down
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Poll
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PollNavigation;
